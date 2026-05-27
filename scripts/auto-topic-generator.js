const fs = require('fs');
const path = require('path');

// 内置长尾词库 (200+ 关键词)
const longTailKeywords = [
  // Writing
  'best ai writing tool for beginners',
  'ai writing assistant for bloggers',
  'ai content generator for seo',
  'best ai copywriting tool 2026',
  'ai writing tool for social media',
  'free ai writing tool for students',
  'ai writer for long form content',
  'best ai writing tool for technical writing',
  'ai content writer for marketing',
  'best ai article writer 2026',
  
  // Image
  'ai image generator for designers',
  'best ai art generator 2026',
  'ai image creator for social media',
  'free ai image generator online',
  'ai art generator for beginners',
  'best ai image tool for logo design',
  'ai image generator from text',
  'ai image editor for photos',
  'best ai image generator for product photos',
  'ai image tool for marketing',
  
  // Video
  'ai video generator from text',
  'best ai video editor 2026',
  'ai video tool for content creators',
  'free ai video generator online',
  'ai video generator for youtube',
  'best ai video tool for social media',
  'ai video editing software for beginners',
  'ai video generator for marketing',
  'best ai video tool for education',
  'ai video creator for faceless youtube',
  
  // Audio
  'ai voice generator for videos',
  'best ai text to speech 2026',
  'ai audio tool for podcasters',
  'ai voiceover generator online',
  'best ai audio editor 2026',
  'ai music generator for content',
  'ai audio tool for audiobooks',
  'best ai voice cloning tool',
  'ai audio generator for marketing',
  'free ai audio tool for beginners',
  
  // Code
  'ai code assistant for developers',
  'best ai code generator 2026',
  'ai code tool for python',
  'ai code editor for beginners',
  'best ai pair programming tool',
  'ai code reviewer online',
  'ai code generator for javascript',
  'best ai code tool for data science',
  'ai code assistant for vs code',
  'free ai code tool for students',
  
  // Productivity
  'ai productivity tool for work',
  'best ai assistant for productivity 2026',
  'ai tool for project management',
  'ai note taking tool for students',
  'best ai productivity tool for teams',
  'ai calendar assistant online',
  'ai task manager for productivity',
  'best ai meeting assistant 2026',
  'ai email assistant for work',
  'ai productivity tool for remote work',
  
  // Comparison
  'chatgpt vs claude vs gemini',
  'best ai writing tool comparison',
  'ai image generator comparison 2026',
  'free vs paid ai tools',
  'ai video tool comparison',
  'best ai productivity tool comparison',
  'ai code assistant comparison',
  'ai audio tool comparison',
  
  // How to
  'how to use ai writing tool',
  'how to create ai images',
  'how to make ai videos',
  'how to use ai for content creation',
  'how to start a youtube channel with ai',
  'how to use ai for productivity',
  'how to create audiobooks with ai',
  'how to use ai for coding',
  
  // For specific roles
  'ai tools for content creators',
  'ai tools for marketers',
  'ai tools for students',
  'ai tools for developers',
  'ai tools for small business',
  'ai tools for freelancers',
  'ai tools for educators',
  'ai tools for entrepreneurs',
  
  // Advanced
  'ai tools for content marketing',
  'ai tools for seo content',
  'ai tools for video editing',
  'ai tools for audio production',
  'ai tools for web development',
  'ai tools for data analysis',
  'ai tools for project management',
  'ai tools for customer service',
  
  // Latest trends
  'latest ai tools 2026',
  'new ai tools march 2026',
  'best ai tools for beginners 2026',
  'must have ai tools 2026',
  'ai tools that will change your workflow',
  'underrated ai tools 2026',
  'hidden gem ai tools',
  'free ai tools worth trying',
  
  // Use cases
  'ai tools for social media content',
  'ai tools for blog writing',
  'ai tools for video content',
  'ai tools for podcast production',
  'ai tools for graphic design',
  'ai tools for email marketing',
  'ai tools for content repurposing',
  'ai tools for workflow automation'
];

// 分类映射
const categories = {
  Writing: ['writing', 'copywriting', 'content', 'article', 'blog', 'seo'],
  Image: ['image', 'art', 'design', 'photo', 'graphic', 'logo'],
  Video: ['video', 'youtube', 'edit', 'content creator', 'faceless'],
  Audio: ['audio', 'voice', 'podcast', 'music', 'audiobook', 'speech'],
  Code: ['code', 'developer', 'programming', 'python', 'javascript'],
  Productivity: ['productivity', 'work', 'task', 'meeting', 'note', 'calendar']
};

// 模板类型
const templateTypes = [
  'Best AI Tools for [X] in 2026',
  '[Tool A] vs [Tool B] vs [Tool C]: Which is Best?',
  'How to Use AI for [X] in 2026',
  'AI Tools for [Role/Industry] in 2026',
  'The Ultimate Guide to [AI Category] Tools',
  'Free AI Tools That [Solve Problem]',
  'AI Tools That Will Boost Your [Metric]',
  '[Number] Best AI Tools for [Purpose]'
];

async function fetchRedditHotPosts() {
  try {
    const subreddits = ['artificial', 'aitools', 'machinelearning'];
    const posts = [];
    
    for (const subreddit of subreddits) {
      try {
        const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          data.data.children.forEach(child => {
            const title = child.data.title.toLowerCase();
            if (title.includes('ai') && !title.includes('discussion') && !title.includes('question')) {
              posts.push(title);
            }
          });
        }
      } catch (e) {
        console.log(`Failed to fetch r/${subreddit}: ${e.message}`);
      }
    }
    
    return posts.slice(0, 50);
  } catch (e) {
    console.log(`Reddit fetch failed, using fallback keywords: ${e.message}`);
    return [];
  }
}

function getCategoryFromKeywords(keywords) {
  for (const [category, terms] of Object.entries(categories)) {
    if (terms.some(term => keywords.some(k => k.includes(term)))) {
      return category;
    }
  }
  return 'Productivity';
}

function generateTopics(tools, keywordSource) {
  const topics = [];
  const usedKeywords = new Set();
  
  // 从工具名提取关键词
  const toolKeywords = tools.map(t => t.name.toLowerCase()).filter(Boolean);
  
  for (let i = 0; i < 10; i++) {
    // 随机选择模板
    const template = templateTypes[Math.floor(Math.random() * templateTypes.length)];
    
    // 随机选择关键词
    const allKeywords = [...keywordSource, ...toolKeywords];
    const availableKeywords = allKeywords.filter(k => !usedKeywords.has(k));
    
    if (availableKeywords.length === 0) break;
    
    const mainKeyword = availableKeywords[Math.floor(Math.random() * availableKeywords.length)];
    usedKeywords.add(mainKeyword);
    
    // 提取主题词
    let topic = mainKeyword;
    if (mainKeyword.includes('ai ')) {
      topic = mainKeyword.split('ai ')[1] || mainKeyword;
    }
    if (topic.includes(' for ')) {
      topic = topic.split(' for ')[1] || topic;
    }
    
    // 生成标题
    let title = template;
    title = title.replace('[X]', topic.charAt(0).toUpperCase() + topic.slice(1));
    title = title.replace('[Tool A]', tools[Math.floor(Math.random() * tools.length)].name);
    title = title.replace('[Tool B]', tools[Math.floor(Math.random() * tools.length)].name);
    title = title.replace('[Tool C]', tools[Math.floor(Math.random() * tools.length)].name);
    title = title.replace('[Role/Industry]', ['Content Creators', 'Marketers', 'Developers', 'Students', 'Small Business Owners'][Math.floor(Math.random() * 5)]);
    title = title.replace('[AI Category]', ['AI Writing', 'AI Image', 'AI Video', 'AI Audio', 'AI Productivity'][Math.floor(Math.random() * 5)]);
    title = title.replace('[Solve Problem]', ['Boost Your Productivity', 'Save Time', 'Improve Content Quality', 'Increase Revenue'][Math.floor(Math.random() * 4)]);
    title = title.replace('[Metric]', ['Productivity', 'Content Output', 'Revenue', 'Efficiency'][Math.floor(Math.random() * 4)]);
    title = title.replace('[Purpose]', ['Content Creation', 'Productivity', 'Coding', 'Marketing'][Math.floor(Math.random() * 4)]);
    title = title.replace('[Number]', ['5', '7', '10', '15'][Math.floor(Math.random() * 4)]);
    
    // 如果标题还包含占位符，使用默认值
    title = title.replace('[X]', 'Content Creation');
    title = title.replace('[Number]', '10');
    
    const category = getCategoryFromKeywords([mainKeyword]);
    
    topics.push({
      title: title.charAt(0).toUpperCase() + title.slice(1),
      keywords: [mainKeyword],
      category,
      template: template.split('[')[0].trim()
    });
  }
  
  return topics;
}

async function run() {
  console.log('🎯 启动自动化选题引擎...');
  
  // 加载工具数据
  const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
  const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
  console.log(`📚 加载了 ${tools.length} 个工具`);
  
  // 尝试从Reddit获取热门帖子
  console.log('🔍 尝试从Reddit获取热门话题...');
  let keywords = await fetchRedditHotPosts();
  
  // 如果失败，使用内置词库
  if (keywords.length === 0) {
    console.log('⚠️ Reddit获取失败，使用内置长尾词库');
    keywords = [...longTailKeywords];
  }
  
  console.log(`📊 使用 ${keywords.length} 个关键词`);
  
  // 生成选题
  const topics = generateTopics(tools, keywords);
  
  console.log('\n✨ 生成的选题列表：');
  topics.forEach((topic, index) => {
    console.log(`${index + 1}. ${topic.title}`);
    console.log(`   - 关键词: ${topic.keywords.join(', ')}`);
    console.log(`   - 分类: ${topic.category}`);
    console.log(`   - 模板: ${topic.template}`);
    console.log('');
  });
  
  // 输出到文件
  const outputPath = path.join(__dirname, '..', '.tmp', 'auto-topics-batch.md');
  const outputContent = `# 自动生成选题列表 - ${new Date().toISOString().split('T')[0]}

## 生成统计
- 关键词来源: ${keywords.length > 50 ? 'Reddit热门' : '内置词库'}
- 生成选题数: ${topics.length}
- 生成时间: ${new Date().toLocaleString('zh-CN')}

## 选题详情

${topics.map((topic, index) => `### ${index + 1}. ${topic.title}

- **关键词**: ${topic.keywords.join(', ')}
- **分类**: ${topic.category}
- **模板类型**: ${topic.template}
- **目标字数**: 1000-1500字
- **预计时长**: 30-45分钟

#### 写作要点
1. 引言：建立用户痛点共鸣
2. 主体：详细介绍工具/方法
3. 对比：与同类工具对比
4. 结论：给出明确建议
5. CTA：引导用户尝试

#### 内链建议
- 链接到同分类工具详情页
- 引用相关对比文章
- 链接到首页工具列表

`).join('\n')}`;
  
  fs.writeFileSync(outputPath, outputContent);
  console.log(`💾 选题已保存到 ${outputPath}`);
}

module.exports = {
  generateTopics,
  longTailKeywords,
  run
};

run().catch(console.error);
