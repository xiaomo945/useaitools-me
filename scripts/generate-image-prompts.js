const fs = require('fs');
const path = require('path');

// 风格词库
const styleWords = [
  'clean tech illustration',
  'modern flat design',
  'minimalist tech',
  'sleek digital art',
  'professional tech illustration',
  'futuristic design',
  'clean vector art',
  'modern infographic style'
];

// 配色词库
const colorWords = [
  'emerald green accents',
  'teal and cyan accents',
  'green gradient accents',
  'emerald and teal palette',
  'fresh green color scheme'
];

// 主题场景词库
const sceneWords = {
  Writing: [
    'AI writing assistant interface',
    'content creation workspace',
    'digital document editing',
    'creative writing environment',
    'blog content generation'
  ],
  Image: [
    'AI image generation process',
    'creative design workspace',
    'digital art creation',
    'visual content generation',
    'graphic design tools'
  ],
  Video: [
    'video editing timeline',
    'AI video generation',
    'content creation studio',
    'video production workspace',
    'YouTube channel setup'
  ],
  Audio: [
    'audio wave visualization',
    'podcast production studio',
    'AI voice generation',
    'music production workspace',
    'sound recording interface'
  ],
  Code: [
    'developer coding workspace',
    'AI code assistant',
    'programming environment',
    'software development',
    'code editor interface'
  ],
  Productivity: [
    'workflow automation dashboard',
    'AI productivity assistant',
    'task management interface',
    'business productivity tools',
    'remote work workspace'
  ]
};

function generatePrompt(title, category, position) {
  const style = styleWords[Math.floor(Math.random() * styleWords.length)];
  const color = colorWords[Math.floor(Math.random() * colorWords.length)];
  const sceneOptions = sceneWords[category] || sceneWords['Productivity'];
  const scene = sceneOptions[Math.floor(Math.random() * sceneOptions.length)];
  
  // 根据位置调整提示词
  let prompt = '';
  if (position === 'header') {
    prompt = `${style}, ${color}, ${scene}, professional banner, 16:9 aspect ratio, 4K, high quality, clean background, modern tech aesthetic`;
  } else if (position === 'mid') {
    prompt = `${style}, ${color}, ${scene}, detailed illustration, step-by-step process, 16:9 aspect ratio, 4K, instructional style`;
  } else if (position === 'cta') {
    prompt = `${style}, ${color}, ${scene}, call to action scene, user engagement, 16:9 aspect ratio, 4K, inviting and encouraging mood`;
  }
  
  return {
    prompt,
    position,
    aspect_ratio: '16:9',
    resolution: '4K'
  };
}

function generateImagePromptsForArticle(article) {
  const { title, category } = article;
  
  const images = [
    {
      url: `https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop`,
      alt: title,
      caption: `AI tools for ${category.toLowerCase()}`,
      position: 'header',
      image_url: `https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop`,
      prompt: generatePrompt(title, category, 'header').prompt
    },
    {
      url: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop`,
      alt: `AI ${category.toLowerCase()} workflow`,
      caption: `Streamline your ${category.toLowerCase()} workflow`,
      position: 'mid',
      image_url: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop`,
      prompt: generatePrompt(title, category, 'mid').prompt
    },
    {
      url: `https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop`,
      alt: `Start using ${category.toLowerCase()} AI tools`,
      caption: `Get started with AI today`,
      position: 'cta',
      image_url: `https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop`,
      prompt: generatePrompt(title, category, 'cta').prompt
    }
  ];
  
  return images;
}

async function generateImageWithDalle(prompt, outputPath) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('⚠️ OPENAI_API_KEY not set, skipping image generation');
    return null;
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024'
      })
    });
    
    const data = await response.json();
    
    if (data.data && data.data[0] && data.data[0].url) {
      const imageUrl = data.data[0].url;
      
      // Download and save the image
      const imageResponse = await fetch(imageUrl);
      const blob = await imageResponse.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());
      
      fs.writeFileSync(outputPath, buffer);
      console.log(`🖼️  Image saved to ${outputPath}`);
      
      return imageUrl;
    }
    
    return null;
  } catch (error) {
    console.log(`❌ Failed to generate image: ${error.message}`);
    return null;
  }
}

async function processArticles(articles, outputDir) {
  console.log(`📸 Processing ${articles.length} articles...`);
  
  for (const article of articles) {
    console.log(`\nProcessing: ${article.title}`);
    
    const images = generateImagePromptsForArticle(article);
    
    for (const image of images) {
      console.log(`  - ${image.position}: ${image.prompt}`);
      
      // 如果有API Key，尝试生成图片
      if (process.env.OPENAI_API_KEY) {
        const fileName = `${article.slug}-${image.position}.png`;
        const filePath = path.join(outputDir, fileName);
        
        const generatedUrl = await generateImageWithDalle(image.prompt, filePath);
        if (generatedUrl) {
          image.url = generatedUrl;
          image.image_url = generatedUrl;
        }
      }
    }
    
    article.images = images;
    article.imagePromptsGenerated = true;
  }
  
  return articles;
}

// CLI 运行入口
async function run() {
  console.log('🎨 启动AI配图生成器...');
  
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // 生成示例提示词
    const sampleArticle = {
      title: 'Best AI Writing Tools for Content Creators',
      category: 'Writing'
    };
    
    console.log('\n📝 示例配图提示词：');
    const prompts = generateImagePromptsForArticle(sampleArticle);
    prompts.forEach(p => {
      console.log(`\n${p.position.toUpperCase()}:`);
      console.log(`  Prompt: ${p.prompt}`);
      console.log(`  URL: ${p.url}`);
    });
    
    return;
  }
  
  // 如果提供了文章文件路径，处理文章
  const articlesPath = args[0];
  if (fs.existsSync(articlesPath)) {
    const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    
    // 创建输出目录
    const outputDir = path.join(__dirname, '..', 'public', 'blog-images');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const processedArticles = await processArticles(articles, outputDir);
    
    // 保存处理后的文章
    const outputPath = articlesPath.replace('.json', '-with-images.json');
    fs.writeFileSync(outputPath, JSON.stringify(processedArticles, null, 2));
    console.log(`\n💾 处理后的文章已保存到 ${outputPath}`);
  }
}

module.exports = {
  generateImagePromptsForArticle,
  generatePrompt
};

// 如果直接运行此脚本
if (require.main === module) {
  run().catch(console.error);
}
