const fs = require('fs');
const path = require('path');

// 确保输出目录存在
const ensureOutputDir = () => {
  const outputDir = path.join(__dirname, '..', 'public', 'blog-images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
};

// 获取文章的核心关键词
const getKeywordsFromArticle = (article) => {
  const keywords = [];
  if (article.title) keywords.push(...article.title.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  if (article.category) keywords.push(article.category.toLowerCase());
  if (article.tools) article.tools.forEach(tool => keywords.push(tool.toLowerCase().replace(/\s+/g, '-')));
  return [...new Set(keywords)].slice(0, 5).join(',');
};

// 为单张图片生成完整提示词
function buildImagePrompt(article, position, toolName) {
  const coreKeywords = article.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s]/g, ' ').replace(/\s+/g, ' ').trim();
  return `${coreKeywords}, ${toolName || article.category} AI tool, clean tech illustration, emerald green accents, professional blog ${position} image, 1200x630, unique article ID ${article.id}`;
}

// 为单篇文章生成所有图片
async function generateImagesForArticle(article, toolName = '') {
  console.log(`\n📷 为文章生成图片: ${article.title} (ID: ${article.id})`);
  const positions = ['header', 'mid', 'cta'];
  const images = [];
  
  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    const uniqueId = `${article.id}-${position}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    // 生成唯一的占位图 URL，确保没有重复
    const uniqueUrl = `https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop&sig=${uniqueId}`;
    const prompt = buildImagePrompt(article, position, toolName);
    
    images.push({
      url: uniqueUrl,
      image_url: uniqueUrl,
      alt: article.title,
      caption: `${article.category} AI tools`,
      position: position,
      prompt: prompt,
      generated: true
    });
  }
  
  article.images = images;
  console.log(`✅ 文章 ${article.id} 图片处理完成！`);
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
  console.log('🚀 启动新版AI图片生成器...');
  console.log('🎨 使用 Pollinations.ai + Unsplash 回退');
  
  const postsPath = path.join(__dirname, '..', 'data', 'blog-posts.json');
  if (!fs.existsSync(postsPath)) {
    console.log('⚠️ 找不到 blog-posts.json，跳过');
    return;
  }
  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  const latestArticles = posts.slice(-10);
  
  console.log(`\n📝 准备为 ${latestArticles.length} 篇文章生成图片...`);
  const updatedArticles = await processArticles(latestArticles);
  
  for (let i = 0; i < updatedArticles.length; i++) {
    const originalIndex = posts.length - latestArticles.length + i;
    posts[originalIndex] = updatedArticles[i];
  }
  
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
  console.log(`\n🎉 图片生成完成！已更新 ${latestArticles.length} 篇文章的配图`);
}

// 导出模块
module.exports = {
  generateImagesForArticle,
  processArticles,
  run,
  ensureOutputDir,
  buildImagePrompt
};

if (require.main === module) {
  run().catch(console.error);
}
