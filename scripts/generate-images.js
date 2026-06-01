const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// 确保输出目录存在
const ensureOutputDir = () => {
  const outputDir = path.join(__dirname, '..', 'public', 'blog-images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
};

// 使用 Pollinations.ai 生成单张图片
async function generateSingleImage(prompt, outputPath) {
  const encodedPrompt = encodeURIComponent(prompt);
  const apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&seed=${Date.now()}`;

  try {
    console.log(`   🔄 生成图片: ${outputPath}`);
    const response = await fetch(apiUrl, {
      method: 'GET',
      timeout: 30000,
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.buffer();
    
    // 验证图片大小（确保不是错误响应）
    if (buffer.length < 1024) {
      throw new Error('生成的图片太小，可能是错误响应');
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(`   ✅ 图片已保存: ${outputPath}`);
    return true;
  } catch (error) {
    console.log(`   ⚠️  Pollinations.ai 失败，跳过: ${error.message}`);
    return false;
  }
}

// 为单篇文章生成所有图片
async function generateImagesForArticle(article) {
  console.log(`\n📷 为文章生成图片: ${article.title}`);
  const outputDir = ensureOutputDir();
  
  const articleId = article.id;
  const category = article.category || 'Productivity';
  const title = article.title;
  
  // 生成图片提示词 - 添加 articleId, position and random seed for uniqueness
  const imagePrompts = (position) => {
    const randomSeed = Math.floor(Math.random() * 1000000);
    return {
      header: `clean tech illustration, emerald green accents, modern ${category} AI tools workspace, professional banner, 16:9 aspect ratio, minimalist design, white background, unique id ${articleId} position ${position} seed ${randomSeed}`,
      mid: `clean tech illustration, emerald green accents, team collaboration with ${category} AI tools, detailed, 16:9 aspect ratio, professional, modern office, unique id ${articleId} position ${position} seed ${randomSeed}`,
      cta: `clean tech illustration, emerald green accents, call to action scene, user engagement with ${category} AI tools, inviting and encouraging, 16:9 aspect ratio, unique id ${articleId} position ${position} seed ${randomSeed}`
    };
  };
  
  const images = [];
  const positions = ['header', 'mid', 'cta'];
  
  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    const fileName = `blog-${articleId}-${position}.jpg`;
    const outputPath = path.join(outputDir, fileName);
    const publicPath = `/blog-images/${fileName}`;
    
    // 获取当前位置的提示词
    const promptsForPosition = imagePrompts(position);
    // 尝试生成图片
    const success = await generateSingleImage(promptsForPosition[position], outputPath);
    
    images.push({
      url: success ? publicPath : 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop',
      image_url: success ? publicPath : 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop',
      alt: title,
      caption: `${category} AI tools`,
      position: position,
      prompt: promptsForPosition[position],
      generated: success
    });
  }
  
  // 更新文章的 images 字段
  article.images = images;
  
  console.log(`✅ 文章 ${articleId} 图片处理完成！`);
  return article;
}

// 批量处理多篇文章
async function processArticles(articles) {
  const results = [];
  
  for (const article of articles) {
    const updatedArticle = await generateImagesForArticle(article);
    results.push(updatedArticle);
  }
  
  return results;
}

// 主运行函数
async function run() {
  console.log('🚀 启动免费AI图片生成器...');
  console.log('🎨 使用 Pollinations.ai 免费API');
  
  // 加载文章数据
  const postsPath = path.join(__dirname, '..', 'data', 'blog-posts.json');
  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  
  // 获取最新10篇文章
  const latestArticles = posts.slice(-10);
  
  console.log(`\n📝 准备为 ${latestArticles.length} 篇文章生成图片...`);
  
  // 处理文章
  const updatedArticles = await processArticles(latestArticles);
  
  // 更新原文章数据
  for (let i = 0; i < updatedArticles.length; i++) {
    const originalIndex = posts.length - latestArticles.length + i;
    posts[originalIndex] = updatedArticles[i];
  }
  
  // 保存更新
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
  
  console.log(`\n🎉 图片生成完成！已更新 ${latestArticles.length} 篇文章的配图`);
}

// 导出模块
module.exports = {
  generateImagesForArticle,
  processArticles,
  run
};

// 如果直接运行
if (require.main === module) {
  run().catch(console.error);
}
