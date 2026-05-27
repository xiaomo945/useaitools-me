const fs = require('fs');
const path = require('path');

// 导入模块
const { generateImagePromptsForArticle } = require('./generate-image-prompts');
const { generateImagesForArticle } = require('./generate-images');

// 内容质量标准模板
const contentStandards = {
  introduction: '引言部分应建立用户痛点共鸣，说明文章价值',
  structure: '文章应有清晰的标题层级（H2/H3）',
  internalLinks: '每篇文章应包含2-3个内链',
  comparisonTable: '对比类文章应有对比表格',
  cta: '文章末尾应有明确的行动号召',
  images: '每篇文章应有3张配图（header/mid/cta）',
  wordCount: '目标字数：1000-1500字'
};

// 分类工具映射
const categoryTools = {
  Writing: ['ChatGPT', 'Jasper', 'Claude', 'Gemini', 'Writesonic', 'Rytr', 'Copy.ai', 'Grammarly'],
  Image: ['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Canva Magic Design', 'Adobe Firefly', 'Leonardo AI', 'Ideogram'],
  Video: ['Runway ML', 'Pika Labs', 'Sora', 'VEED.io', 'Synthesia', 'Pictory', 'D-ID'],
  Audio: ['ElevenLabs', 'Whisper', 'Suno AI', 'Soundraw', 'AIVA', 'Murf AI', 'Descript'],
  Code: ['GitHub Copilot', 'Cursor', 'Tabnine', 'Codium AI', 'Amazon CodeWhisperer', 'CodeLlama'],
  Productivity: ['Notion AI', 'Perplexity AI', 'Obsidian Copilot', 'ClickUp AI', 'Todoist AI', 'GrammarlyGO']
};

// 模板内容生成器
function generateArticleContent(article) {
  const { title, category, keywords } = article;
  const tools = categoryTools[category] || categoryTools['Productivity'];
  const featuredTools = tools.slice(0, 5);
  
  // 生成对比表格
  const comparisonTable = generateComparisonTable(featuredTools);
  
  // 生成工具介绍部分
  const toolFeatures = featuredTools.map(tool => {
    const features = getToolFeatures(tool);
    return `## ${tool}

${features.description}

**Key Features:**
- ${features.feature1}
- ${features.feature2}
- ${features.feature3}

**Pricing:** ${features.pricing}

**Best For:** ${features.bestFor}

[[link:/tools/${tool.toLowerCase().replace(/\s+/g, '-')}|Learn more about ${tool}]]`;
  }).join('\n\n');
  
  // 生成内链
  const internalLinks = generateInternalLinks(category);
  
  // 生成完整内容
  const content = `# ${title}

${generateIntroduction(keywords)}

${comparisonTable}

${toolFeatures}

## How to Choose the Right ${category} AI Tool

When selecting the best AI tool for your ${category.toLowerCase()} needs, consider these key factors:

1. **Your Skill Level**: Are you a beginner looking for simplicity, or an expert needing advanced features?
2. **Budget**: What's your monthly budget for AI tools?
3. **Specific Needs**: Do you need text generation, image creation, video editing, or something else?
4. **Integration**: Does the tool integrate with your existing workflow?
5. **Reviews**: What do other users say about the tool?

## Getting Started with AI Tools

Most AI tools offer free trials or freemium plans, so you can test them before committing. Here's how to get started:

1. **Identify your needs** - What specific problem are you trying to solve?
2. **Try 2-3 tools** - Sign up for free trials of your top choices
3. **Compare features** - Use our [[link:/compare|AI tools comparison]] page
4. **Start small** - Begin with simple tasks before moving to complex projects
5. **Learn continuously** - AI tools are evolving rapidly; stay updated!

---

${internalLinks}

${generateCTA(category)}
`;

  return content;
}

function generateIntroduction(keywords) {
  const intros = [
    `In today's fast-paced digital world, ${keywords[0] || 'AI tools'} have become essential for anyone looking to stay competitive. Whether you're a content creator, developer, or business owner, the right AI tools can significantly boost your productivity and creativity.`,
    `The rise of artificial intelligence has transformed how we work, create, and innovate. ${keywords[0] || 'AI tools'} are no longer just a luxury—they're a necessity for anyone looking to thrive in 2026.`,
    `Looking to level up your ${keywords[0] ? keywords[0].split(' ').slice(-1)[0] : 'workflow'}? ${keywords[0] || 'AI tools'} are here to help. In this comprehensive guide, we'll explore the best options available today.`,
    `Artificial intelligence is revolutionizing every industry, and ${keywords[0] || 'AI tools'} are at the forefront of this transformation. Discover how these tools can transform your ${keywords[0] ? keywords[0].split(' ').slice(-1)[0] : 'work'}.`
  ];
  
  return intros[Math.floor(Math.random() * intros.length)];
}

function generateComparisonTable(tools) {
  const tableRows = tools.map(tool => {
    const features = getToolFeatures(tool);
    return `| ${tool} | ${features.pricing.split(' ')[0]} | ${features.rating}/5 | ${features.bestFor.split(' ')[0]} |`;
  }).join('\n');
  
  return `## Quick Comparison

| Tool | Price | Rating | Best For |
|------|-------|--------|----------|
${tableRows}

*Prices are approximate and subject to change. Ratings are based on user reviews.*`;
}

function getToolFeatures(toolName) {
  const features = {
    'ChatGPT': { description: 'OpenAI\'s flagship AI assistant, capable of understanding and generating human-like text for a wide range of tasks.', feature1: 'Advanced reasoning capabilities', feature2: 'Large knowledge base', feature3: 'Plugin ecosystem', pricing: 'Free + $20/month for Plus', rating: 4.8, bestFor: 'General purpose AI' },
    'Jasper': { description: 'A powerful AI writing tool specifically designed for content creators and marketers.', feature1: 'Long-form content generation', feature2: 'Brand voice customization', feature3: 'SEO optimization', pricing: '$29+/month', rating: 4.6, bestFor: 'Content marketing' },
    'Claude': { description: 'Anthropic\'s AI assistant known for its safety features and long context window.', feature1: '100K+ token context', feature2: 'Advanced reasoning', feature3: 'Safety-focused design', pricing: 'Free + $20/month', rating: 4.7, bestFor: 'Deep analysis' },
    'Gemini': { description: 'Google\'s AI assistant with strong multimodal capabilities.', feature1: 'Multimodal understanding', feature2: 'Google ecosystem integration', feature3: 'Advanced reasoning', pricing: 'Free + paid tiers', rating: 4.5, bestFor: 'Google users' },
    'Midjourney': { description: 'Leading AI image generator known for its artistic capabilities.', feature1: 'High-quality art generation', feature2: 'Advanced prompt controls', feature3: 'Large community', pricing: '$10+/month', rating: 4.9, bestFor: 'Artists and designers' },
    'DALL-E 3': { description: 'OpenAI\'s AI image generator with strong text understanding.', feature1: 'Text-to-image generation', feature2: 'Detailed prompts', feature3: 'Integration with ChatGPT', pricing: 'Pay-as-you-go', rating: 4.7, bestFor: 'Creative professionals' },
    'Stable Diffusion': { description: 'Open-source AI image generator with high customization.', feature1: 'Open-source', feature2: 'Highly customizable', feature3: 'Local installation', pricing: 'Free', rating: 4.6, bestFor: 'Tech-savvy users' },
    'Runway ML': { description: 'AI video editing tool with powerful generative capabilities.', feature1: 'AI video editing', feature2: 'Text-to-video', feature3: 'Generative fill', pricing: '$12+/month', rating: 4.5, bestFor: 'Video creators' },
    'VEED.io': { description: 'Online video editing tool with AI-powered features.', feature1: 'Auto-subtitles', feature2: 'Video transcription', feature3: 'Social media templates', pricing: 'Free + $12+/month', rating: 4.4, bestFor: 'Content creators' },
    'Synthesia': { description: 'AI video generation with digital avatars.', feature1: 'AI avatar videos', feature2: 'Text-to-video', feature3: 'Multilingual support', pricing: '$29+/month', rating: 4.6, bestFor: 'Faceless content' },
    'ElevenLabs': { description: 'Leading AI voice generation with realistic voices.', feature1: 'Human-like voices', feature2: 'Voice cloning', feature3: 'Multilingual support', pricing: 'Free + $5+/month', rating: 4.8, bestFor: 'Voiceovers' },
    'Murf AI': { description: 'AI text-to-speech with customizable voices.', feature1: 'Natural-sounding voices', feature2: 'Voice customization', feature3: 'Multiple languages', pricing: '$23+/month', rating: 4.5, bestFor: 'Audiobooks' },
    'GitHub Copilot': { description: 'AI pair programming tool integrated with IDEs.', feature1: 'Code completion', feature2: 'Natural language to code', feature3: 'Multi-language support', pricing: '$19/month', rating: 4.7, bestFor: 'Developers' },
    'Cursor': { description: 'AI-powered code editor with built-in AI assistance.', feature1: 'AI chat integration', feature2: 'Code generation', feature3: 'Real-time suggestions', pricing: 'Free + $20/month', rating: 4.6, bestFor: 'Developers' },
    'Notion AI': { description: 'AI-powered productivity tool integrated with Notion.', feature1: 'Note summarization', feature2: 'Content generation', feature3: 'Workspace integration', pricing: '$10+/month', rating: 4.4, bestFor: 'Productivity' },
    'Perplexity AI': { description: 'AI search engine with real-time information.', feature1: 'Real-time search', feature2: 'Citations', feature3: 'Multiple models', pricing: 'Free + $20/month', rating: 4.5, bestFor: 'Research' },
    'Rytr': { description: 'Affordable AI writing tool for content creation.', feature1: 'Budget-friendly', feature2: 'Multiple templates', feature3: 'SEO optimization', pricing: '$9+/month', rating: 4.3, bestFor: 'Budget users' },
    'Copy.ai': { description: 'AI writing tool focused on marketing copy.', feature1: 'Marketing templates', feature2: 'Brand voice', feature3: 'Team collaboration', pricing: '$49+/month', rating: 4.4, bestFor: 'Marketers' },
    'Grammarly': { description: 'AI-powered writing assistant for grammar and style.', feature1: 'Grammar checking', feature2: 'Style suggestions', feature3: 'Plagiarism detection', pricing: 'Free + $12/month', rating: 4.7, bestFor: 'Writers' },
    'Whisper': { description: 'OpenAI\'s speech-to-text model with high accuracy.', feature1: 'High accuracy', feature2: 'Multiple languages', feature3: 'Open-source', pricing: 'Free', rating: 4.8, bestFor: 'Transcription' },
    'Suno AI': { description: 'AI music generation tool for creating original music.', feature1: 'Music generation', feature2: 'Lyrics generation', feature3: 'Multiple genres', pricing: 'Free + $10+/month', rating: 4.5, bestFor: 'Musicians' },
    'Soundraw': { description: 'AI music generator for royalty-free music.', feature1: 'Royalty-free music', feature2: 'Customizable tracks', feature3: 'Commercial use', pricing: '$19+/month', rating: 4.3, bestFor: 'Content creators' },
    'AIVA': { description: 'AI composition tool for original music.', feature1: 'Classical composition', feature2: 'Multiple genres', feature3: 'Royalty-free', pricing: '$19+/month', rating: 4.4, bestFor: 'Composers' },
    'Descript': { description: 'AI-powered audio and video editing.', feature1: 'Text-based editing', feature2: 'AI transcription', feature3: 'Overdub', pricing: '$12+/month', rating: 4.6, bestFor: 'Podcasters' },
    'Tabnine': { description: 'AI code completion tool for IDEs.', feature1: 'Code completion', feature2: 'Multi-language', feature3: 'Team features', pricing: 'Free + $12/month', rating: 4.5, bestFor: 'Developers' },
    'Codium AI': { description: 'AI code review and test generation.', feature1: 'Code reviews', feature2: 'Test generation', feature3: 'Code analysis', pricing: 'Free + paid tiers', rating: 4.4, bestFor: 'Development teams' },
    'Amazon CodeWhisperer': { description: 'AWS AI code assistant.', feature1: 'Code completion', feature2: 'AWS integration', feature3: 'Security scanning', pricing: 'Free for individuals', rating: 4.3, bestFor: 'AWS users' },
    'Obsidian Copilot': { description: 'AI assistant for Obsidian note-taking.', feature1: 'Note summarization', feature2: 'Content generation', feature3: 'Knowledge graph', pricing: '$20/month', rating: 4.5, bestFor: 'Note-takers' },
    'ClickUp AI': { description: 'AI-powered project management.', feature1: 'Task management', feature2: 'AI writing', feature3: 'Workflow automation', pricing: 'Free + $19/month', rating: 4.4, bestFor: 'Teams' },
    'Todoist AI': { description: 'AI-powered task management.', feature1: 'Task organization', feature2: 'AI suggestions', feature3: 'Productivity tracking', pricing: 'Free + $8/month', rating: 4.5, bestFor: 'Individuals' },
    'GrammarlyGO': { description: 'Grammarly\'s AI writing assistant.', feature1: 'Contextual suggestions', feature2: 'Content generation', feature3: 'Email replies', pricing: '$15/month', rating: 4.6, bestFor: 'Professionals' },
    'Pika Labs': { description: 'AI video generation from text.', feature1: 'Text-to-video', feature2: 'Video editing', feature3: 'Stylized outputs', pricing: 'Free beta', rating: 4.7, bestFor: 'Creative video' },
    'Sora': { description: 'OpenAI\'s AI video generation.', feature1: 'Long videos', feature2: 'High quality', feature3: 'Text-to-video', pricing: 'Limited access', rating: 4.8, bestFor: 'Professional video' },
    'Adobe Firefly': { description: 'Adobe\'s AI image generation.', feature1: 'Creative Cloud integration', feature2: 'Ethical training', feature3: 'Brand consistency', pricing: 'Free + paid tiers', rating: 4.6, bestFor: 'Adobe users' },
    'Canva Magic Design': { description: 'AI-powered design in Canva.', feature1: 'Design templates', feature2: 'AI suggestions', feature3: 'Collaboration', pricing: 'Free + $12/month', rating: 4.5, bestFor: 'Non-designers' },
    'Leonardo AI': { description: 'AI image generation with style control.', feature1: 'Style consistency', feature2: 'AI Canvas', feature3: 'Model training', pricing: 'Free + $15/month', rating: 4.5, bestFor: 'Artists' },
    'Ideogram': { description: 'AI image generation with text support.', feature1: 'Text in images', feature2: 'Logo design', feature3: 'Consistent outputs', pricing: 'Free + $8/month', rating: 4.4, bestFor: 'Designers' },
    'Pictory': { description: 'AI video generation from text.', feature1: 'Text-to-video', feature2: 'Auto-subtitles', feature3: 'Templates', pricing: '$19+/month', rating: 4.4, bestFor: 'Content marketers' },
    'D-ID': { description: 'AI talking avatars.', feature1: 'Talking heads', feature2: 'Face animation', feature3: 'Video editing', pricing: '$29+/month', rating: 4.3, bestFor: 'Video creators' },
    'CodeLlama': { description: 'Meta\'s open-source code LLM.', feature1: 'Open-source', feature2: 'Code generation', feature3: 'Multiple languages', pricing: 'Free', rating: 4.4, bestFor: 'Developers' }
  };
  
  return features[toolName] || {
    description: `A powerful AI tool for ${toolName.toLowerCase()} tasks.`,
    feature1: 'AI-powered features',
    feature2: 'User-friendly interface',
    feature3: 'Multiple use cases',
    pricing: 'Free + paid tiers',
    rating: 4.5,
    bestFor: 'Various use cases'
  };
}

function generateInternalLinks(category) {
  const links = {
    Writing: [
      'Check out our [[link:/category/writing|Writing AI Tools]] category for more options',
      'Read our guide on [[link:/blog/best-ai-writing-tools-2026|Best AI Writing Tools]]',
      'Compare AI writing tools side by side [[link:/compare/writing|here]]'
    ],
    Image: [
      'Explore our [[link:/category/image|Image AI Tools]] category',
      'Learn how to choose the right AI image generator [[link:/blog/ai-image-tools-guide|here]]',
      'Compare the best AI art tools [[link:/compare/image|here]]'
    ],
    Video: [
      'Discover more [[link:/category/video|Video AI Tools]]',
      'Read our guide on [[link:/blog/ai-video-tools-2026|AI Video Tools]]',
      'Compare video editing tools [[link:/compare/video|here]]'
    ],
    Audio: [
      'Check out our [[link:/category/audio|Audio AI Tools]] category',
      'Learn about AI voice generation [[link:/blog/ai-voice-tools|here]]',
      'Compare audio tools [[link:/compare/audio|here]]'
    ],
    Code: [
      'Explore [[link:/category/code|Code AI Tools]]',
      'Read our guide on [[link:/blog/ai-code-tools|AI Code Assistants]]',
      'Compare coding tools [[link:/compare|here]]'
    ],
    Productivity: [
      'Discover [[link:/category/productivity|Productivity AI Tools]]',
      'Learn about AI productivity tools [[link:/blog/best-ai-productivity-tools-2026|here]]',
      'Compare productivity tools [[link:/compare|here]]'
    ]
  };
  
  return links[category] || links['Productivity'];
}

function generateCTA(category) {
  return `## Ready to Get Started?

Ready to transform your ${category.toLowerCase()} workflow with AI? Start exploring our complete [[link:/category/${category.toLowerCase()}|${category} AI tools category]] for detailed reviews and comparisons.

Don't forget to check out our [[link:/blog|blog]] for more tips, guides, and updates on the latest AI tools!

[[link:/submit|Submit your favorite AI tool]] to our directory and help others discover great tools!`;
}

async function run() {
  console.log('🚀 启动批量内容生产器...');
  
  // 加载现有文章数据
  const postsPath = path.join(__dirname, '..', 'data', 'blog-posts.json');
  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  
  // 获取下一个ID
  const maxId = Math.max(...posts.map(p => p.id));
  
  // 运行选题生成器
  console.log('\n📝 第一步：生成选题...');
  const { generateTopics, longTailKeywords } = require('./auto-topic-generator');
  const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
  const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
  
  // 使用内置关键词生成选题（跳过Reddit获取以加快速度）
  const topics = generateTopics(tools, longTailKeywords).slice(0, 10);
  
  console.log(`\n✨ 生成了 ${topics.length} 个选题`);
  
  // 生成文章
  console.log('\n📄 第二步：生成文章内容...');
  const newArticles = [];
  
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const articleId = maxId + i + 1;
    const slug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    
    console.log(`\n${i + 1}. ${topic.title}`);
    
    const article = {
      id: articleId,
      title: topic.title,
      slug,
      date: new Date().toISOString().split('T')[0],
      description: topic.keywords[0] || topic.title,
      style: '批量生成',
      category: topic.category,
      content: generateArticleContent(topic),
      keywords: topic.keywords,
      images: []
    };
    
    // 生成配图提示词
    console.log('   🎨 生成配图提示词...');
    article.images = generateImagePromptsForArticle(article);
    
    // 尝试生成实际图片
    console.log('   🖼️  尝试生成实际图片...');
    try {
      article = await generateImagesForArticle(article);
      console.log(`   ✅ 图片生成成功！`);
    } catch (error) {
      console.log(`   ⚠️  图片生成失败，使用默认图片: ${error.message}`);
    }
    
    newArticles.push(article);
    console.log(`   ✅ 文章 ${articleId} 生成完成`);
  }
  
  // 保存文章
  console.log('\n💾 第三步：保存文章...');
  posts.push(...newArticles);
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
  console.log(`   ✅ 保存了 ${newArticles.length} 篇文章到 blog-posts.json`);
  
  // 更新选题文件
  const topicsOutputPath = path.join(__dirname, '..', '.tmp', 'auto-topics-batch.md');
  const topicsContent = `# 自动生成选题列表 - ${new Date().toISOString().split('T')[0]}

## 生成统计
- 关键词来源: 内置词库
- 生成选题数: ${topics.length}
- 生成文章数: ${newArticles.length}
- 生成时间: ${new Date().toLocaleString('zh-CN')}

## 选题详情

${topics.map((topic, index) => `### ${index + 1}. ${topic.title}

- **关键词**: ${topic.keywords.join(', ')}
- **分类**: ${topic.category}
- **状态**: ✅ 已生成文章
- **文章ID**: ${maxId + index + 1}

`).join('\n')}`;
  
  fs.writeFileSync(topicsOutputPath, topicsContent);
  console.log(`   ✅ 选题列表已保存到 ${topicsOutputPath}`);
  
  console.log(`\n🎉 批量内容生产完成！`);
  console.log(`   - 新增文章数: ${newArticles.length}`);
  console.log(`   - 文章ID范围: ${maxId + 1} - ${maxId + newArticles.length}`);
  console.log(`   - 总文章数: ${posts.length}`);
  
  return newArticles;
}

// 如果直接运行此脚本
if (require.main === module) {
  run().catch(console.error);
}

module.exports = { run, generateArticleContent };
