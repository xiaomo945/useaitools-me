#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 13 篇文章的配置
const articles = [
  {
    id: 765,
    filename: 'ai-tools-sales-automation-2026-765.json',
    title: 'AI Tools for Sales Automation in 2026',
    category: 'Productivity',
    theme: 'sales automation dashboard'
  },
  {
    id: 761,
    filename: 'best-ai-audio-tools-audiobooks-2026-761.json',
    title: 'Best AI Audio Tools for Audiobooks in 2026',
    category: 'Audio',
    theme: 'audiobook production studio'
  },
  {
    id: 769,
    filename: 'best-ai-audio-tools-podcast-production-2026-769.json',
    title: 'Best AI Audio Tools for Podcast Production in 2026',
    category: 'Audio',
    theme: 'podcast recording studio'
  },
  {
    id: 762,
    filename: 'best-ai-code-tools-mobile-apps-2026-762.json',
    title: 'Best AI Code Tools for Mobile Apps in 2026',
    category: 'Code',
    theme: 'mobile app development IDE'
  },
  {
    id: 757,
    filename: 'best-ai-image-generators-tshirt-design-2026-757.json',
    title: 'Best AI Image Generators for T-Shirt Design in 2026',
    category: 'Image',
    theme: 't-shirt design workspace'
  },
  {
    id: 768,
    filename: 'best-ai-image-generators-wall-art-2026-768.json',
    title: 'Best AI Image Generators for Wall Art in 2026',
    category: 'Image',
    theme: 'digital art gallery wall'
  },
  {
    id: 767,
    filename: 'best-ai-video-tools-youtube-shorts-2026-767.json',
    title: 'Best AI Video Tools for YouTube Shorts in 2026',
    category: 'Video',
    theme: 'short-form video editing'
  },
  {
    id: 771,
    filename: 'best-ai-writing-tools-newsletter-content-2026-771.json',
    title: 'Best AI Writing Tools for Newsletter Content in 2026',
    category: 'Writing',
    theme: 'newsletter content creation'
  },
  {
    id: 764,
    filename: 'best-free-ai-tools-entrepreneurs-2026-764.json',
    title: 'Best Free AI Tools for Entrepreneurs in 2026',
    category: 'Productivity',
    theme: 'startup workspace dashboard'
  },
  {
    id: 772,
    filename: 'elevenlabs-vs-murf-vs-play-ht-best-ai-voice-generator-2026-772.json',
    title: 'ElevenLabs vs Murf vs Play.ht: Best AI Voice Generator 2026',
    category: 'Audio',
    theme: 'AI voice synthesis interface'
  },
  {
    id: 759,
    filename: 'how-to-create-ai-generated-product-reviews-2026-759.json',
    title: 'How to Create AI-Generated Product Reviews in 2026',
    category: 'Productivity',
    theme: 'product review analytics dashboard'
  },
  {
    id: 773,
    filename: 'how-to-create-ai-generated-social-media-ads-2026-773.json',
    title: 'How to Create AI-Generated Social Media Ads in 2026',
    category: 'Productivity',
    theme: 'social media ads creation'
  },
  {
    id: 758,
    filename: 'veed-vs-capcut-vs-descript-best-ai-video-editor-2026-758.json',
    title: 'VEED.io vs CapCut vs Descript: Best AI Video Editor 2026',
    category: 'Video',
    theme: 'video editing timeline interface'
  }
];

// Unsplash 图片 ID 映射（根据主题选择合适的图片）
const unsplashPhotos = {
  'sales automation dashboard': [
    'photo-1551288049-bebda4e38f71', // 数据分析仪表板
    'photo-1460925895917-afdab827c52f', // 笔记本电脑工作
    'photo-1553877522-43269d4ea984'  // 商务会议
  ],
  'audiobook production studio': [
    'photo-1590602847861-f357a9332bbc', // 录音棚麦克风
    'photo-1478737270239-2f02b77fc618', // 音频编辑
    'photo-1519682337058-a94d519337bc'  // 播客录制
  ],
  'podcast recording studio': [
    'photo-1590602847861-f357a9332bbc', // 录音棚
    'photo-1511671782779-c97d3d27a1d4', // 麦克风特写
    'photo-1478737270239-2f02b77fc618'  // 音频波形
  ],
  'mobile app development IDE': [
    'photo-1555066931-4365d14bab8c', // 代码屏幕
    'photo-1517694712202-14dd9538aa97', // 编程工作
    'photo-1461749280684-dccba630e2f6'  // 多屏开发
  ],
  't-shirt design workspace': [
    'photo-1523381210434-271e8be1f52b', // T恤设计
    'photo-1503342217505-b0a15ec3261c', // 服装设计
    'photo-1562157873-818bc0726f68'  // 创意工作
  ],
  'digital art gallery wall': [
    'photo-1513364776144-60967b0f800f', // 艺术画廊
    'photo-1578662996442-48f60103fc96', // 数字艺术
    'photo-1549490349-8643362247b5'  // 现代艺术墙
  ],
  'short-form video editing': [
    'photo-1574717024653-61fd2cf4d44d', // 视频编辑
    'photo-1492691527719-9d1e07e534b4', // 手机拍摄
    'photo-1536240478700-b869070f9279'  // 视频制作
  ],
  'newsletter content creation': [
    'photo-1499750310107-5fef28a66643', // 写作工作
    'photo-1455390582262-044cdead277a', // 笔记本电脑写作
    'photo-1486312338219-ce68d2c6f44d'  // 内容创作
  ],
  'startup workspace dashboard': [
    'photo-1522071820081-009f0129c71c', // 团队协作
    'photo-1519389950473-47ba0277781c', // 现代办公
    'photo-1553877522-43269d4ea984'  // 商务分析
  ],
  'AI voice synthesis interface': [
    'photo-1590602847861-f357a9332bbc', // 录音设备
    'photo-1511671782779-c97d3d27a1d4', // 麦克风
    'photo-1478737270239-2f02b77fc618'  // 音频处理
  ],
  'product review analytics dashboard': [
    'photo-1551288049-bebda4e38f71', // 数据分析
    'photo-1460925895917-afdab827c52f', // 屏幕工作
    'photo-1553877522-43269d4ea984'  // 商务仪表板
  ],
  'social media ads creation': [
    'photo-1432888498266-38ffec3eaf0a', // 社交媒体
    'photo-1498050108023-c5249f4df085', // 数字营销
    'photo-1460925895917-afdab827c52f'  // 工作屏幕
  ],
  'video editing timeline interface': [
    'photo-1574717024653-61fd2cf4d44d', // 视频编辑
    'photo-1478737270239-2f02b77fc618', // 音频波形
    'photo-1536240478700-b869070f9279'  // 视频制作
  ]
};

function generateImages(theme, title) {
  const photos = unsplashPhotos[theme] || unsplashPhotos['startup workspace dashboard'];
  
  return [
    {
      url: `https://images.unsplash.com/${photos[0]}?w=800&h=400&fit=crop`,
      alt: `${title} - Header`,
      caption: `${title}`,
      prompt: `${theme} dashboard interface with dark theme, professional UI, modern design, 8k, ultra detailed`
    },
    {
      url: `https://images.unsplash.com/${photos[1]}?w=800&h=400&fit=crop`,
      alt: `${title} - Workflow`,
      caption: `${title} workflow visualization`,
      prompt: `${theme} workflow visualization showing process, dark theme, cinematic lighting, vibrant colors`
    },
    {
      url: `https://images.unsplash.com/${photos[2]}?w=800&h=400&fit=crop`,
      alt: `${title} - Results`,
      caption: `${title} success metrics and results`,
      prompt: `${theme} success metrics and results, dark theme, professional photography, inspiring`
    }
  ];
}

function processArticle(article) {
  const filePath = path.join(__dirname, '..', 'data', 'blog-posts', article.filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${article.filename}`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    
    // 生成图片
    const images = generateImages(article.theme, article.title);
    
    // 更新 images 字段
    json.images = images;
    
    // 写回文件
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    
    console.log(`✅ ${article.title} (${article.id}) - 已添加 3 张图片`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${article.filename}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🚀 开始为 13 篇博客文章添加图片...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  articles.forEach(article => {
    if (processArticle(article)) {
      successCount++;
    } else {
      failCount++;
    }
  });
  
  console.log(`\n📊 处理完成:`);
  console.log(`   ✅ 成功: ${successCount}`);
  console.log(`   ❌ 失败: ${failCount}`);
  console.log(`   📝 总计: ${articles.length}`);
}

main();
