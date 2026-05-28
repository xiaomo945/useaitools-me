
const fs = require('fs');
const path = require('path');

// 读取现有工具数据
const toolsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tools.json'), 'utf8'));

// 获取下一个可用的文章ID
const blogPostsDir = path.join(__dirname, '../data/blog-posts');
const existingFiles = fs.readdirSync(blogPostsDir)
  .filter(file => file.endsWith('.json') && /^\d+\.json$/.test(file));
const existingIds = existingFiles.map(file => parseInt(file.replace('.json', ''), 10));
const nextId = Math.max(...existingIds, 0) + 1;

console.log(`📊 下一个可用文章ID: ${nextId}`);

// 生成文章内容的辅助函数
function generateArticleContent(title, tools, category) {
  return `# ${title}

In today's fast-paced digital world, having the right AI tools can make all the difference. Let's explore some of the best options available for ${category.toLowerCase()} in 2026.

If you're new to AI tools, be sure to check out our complete [[link:/category/${category}|${category} category]] to discover more amazing tools.

---

## Why This Matters
AI-powered ${category.toLowerCase()} tools are transforming how we work, create, and communicate. They save time, boost productivity, and unlock creative possibilities that were once out of reach for most people.

Whether you're a professional, student, entrepreneur, or hobbyist, there's an AI tool out there perfect for your needs.

---

## Top Tools for ${category}

${tools.map((tool, index) => `
### ${index + 1}. [[link:/tools/${tool.id}|${tool.name}]]
${tool.description}

**Key Features**:
- Professional-grade capabilities
- User-friendly interface
- Regular updates and improvements

**Why Choose It**: ${tool.name} stands out for its exceptional quality and reliability. It's trusted by thousands of users worldwide.

**Best For**: ${tool.best_for ? tool.best_for.join(', ') : 'Everyone'}

**Try ${tool.name}**: ${tool.affiliate_link || tool.url}
`).join('\n')}

---

## Comparison Table

| Tool | Pricing | Rating | Best For |
|------|---------|--------|----------|
${tools.map(tool => `| [[link:/tools/${tool.id}|${tool.name}]] | ${tool.pricing} | ${tool.rating || 4.5}★ | ${tool.best_for ? tool.best_for.join(', ') : 'Everyone'} |`).join('\n')}

---

## Decision Guide

- **Beginners**: Start with the most user-friendly option in our comparison
- **Professionals**: Choose the tool with the most advanced features
- **Teams**: Look for collaboration features and team-friendly pricing
- **Budget-conscious**: Check out the free tiers or most affordable plans

---

## Final Thoughts

All these tools are excellent choices, and the best one depends on your specific needs, budget, and preferences.

The good news is that most of them offer free trials or free tiers, so you can experiment without risk.

**Our Top Recommendation**: [[link:/tools/${tools[0].id}|${tools[0].name}]] — it offers the best overall balance of features, ease of use, and value.

---

## Ready to Get Started?

Don't wait any longer! Start exploring these tools today and see how they can transform your workflow.

**Quick Links**:
- Browse all [[link:/category/${category}|${category} tools]]
- Check out our [[link:/blog|blog]] for more AI guides and tips

---

*If you found this helpful, be sure to share it with others who might benefit from it!*
`;
}

// 定义10篇新文章
const newArticles = [
  {
    title: "10 AI Tools That Will Change Your Workflow in 2026",
    slug: "10-ai-tools-change-workflow-2026",
    category: "Productivity",
    description: "Discover 10 AI tools that will completely transform how you work and boost your productivity in 2026.",
    style: "沉稳技术风",
    toolsSelector: (tools) => tools.filter(t => t.category === 'Productivity' && t.rating >= 4.3).slice(0, 5)
  },
  {
    title: "The Ultimate Guide to AI Video Creation for Beginners",
    slug: "ultimate-guide-ai-video-creation-beginners-2026",
    category: "Video",
    description: "Complete beginner's guide to creating amazing videos with AI tools in 2026. No prior experience needed!",
    style: "活泼可爱风",
    toolsSelector: (tools) => tools.filter(t => t.category === 'Video' && t.rating >= 4.2).slice(0, 5)
  },
  {
    title: "How to Write Blog Posts 3x Faster with AI Writing Tools",
    slug: "write-blog-posts-3x-faster-ai-writing-2026",
    category: "Writing",
    description: "Learn how to use AI writing tools to create high-quality blog content 3x faster than traditional methods.",
    style: "极客效率风",
    toolsSelector: (tools) => {
      const rytr = tools.find(t => t.name === 'Rytr');
      const writingTools = tools.filter(t => t.category === 'Writing' && t.rating >= 4.3 && (!rytr || t.id !== rytr.id)).slice(0, 4);
      return rytr ? [rytr, ...writingTools] : writingTools;
    }
  },
  {
    title: "AI Image Generation: From Idea to Masterpiece in Minutes",
    slug: "ai-image-generation-idea-to-masterpiece-2026",
    category: "Image",
    description: "Step-by-step guide to creating stunning AI-generated images from simple text prompts in 2026.",
    style: "故事驱动风",
    toolsSelector: (tools) => tools.filter(t => t.category === 'Image' && t.rating >= 4.3).slice(0, 5)
  },
  {
    title: "The Best Free AI Tools You Need to Try Right Now",
    slug: "best-free-ai-tools-need-to-try-2026",
    category: "Productivity",
    description: "A curated list of the best free AI tools available in 2026. No credit card required!",
    style: "新闻快讯风",
    toolsSelector: (tools) => {
      const freeTools = tools.filter(t => t.pricing && t.pricing.toLowerCase().includes('free') && t.rating >= 4.0).slice(0, 5);
      return freeTools.length > 0 ? freeTools : tools.slice(0, 5);
    }
  },
  {
    title: "AI for Students: Tools to Help You Study Smarter, Not Harder",
    slug: "ai-for-students-study-smarter-2026",
    category: "Productivity",
    description: "Essential AI tools for students to improve study efficiency, understand complex topics, and write better papers.",
    style: "女性视角风",
    toolsSelector: (tools) => {
      const writing = tools.filter(t => t.category === 'Writing' && t.rating >= 4.2).slice(0, 3);
      const productivity = tools.filter(t => t.category === 'Productivity' && t.rating >= 4.2).slice(0, 2);
      return [...writing, ...productivity].slice(0, 5);
    }
  },
  {
    title: "AI Audio Tools: Create Professional Podcasts in Record Time",
    slug: "ai-audio-tools-professional-podcasts-2026",
    category: "Audio",
    description: "Everything you need to know about creating professional podcasts with AI tools in 2026.",
    style: "沉稳技术风",
    toolsSelector: (tools) => tools.filter(t => t.category === 'Audio' && t.rating >= 4.2).slice(0, 5)
  },
  {
    title: "The Future of Coding: AI Tools Every Developer Should Know",
    slug: "future-of-coding-ai-tools-developers-2026",
    category: "Code",
    description: "Discover the AI coding tools that are revolutionizing software development in 2026.",
    style: "极客效率风",
    toolsSelector: (tools) => tools.filter(t => t.category === 'Code' && t.rating >= 4.3).slice(0, 5)
  },
  {
    title: "AI Tools for Small Business: Grow Your Business on Autopilot",
    slug: "ai-tools-small-business-grow-2026",
    category: "Productivity",
    description: "AI tools that can help small businesses automate tasks, save time, and grow faster.",
    style: "活泼可爱风",
    toolsSelector: (tools) => {
      const productivity = tools.filter(t => t.category === 'Productivity' && t.rating >= 4.2).slice(0, 3);
      const writing = tools.filter(t => t.category === 'Writing' && t.rating >= 4.2).slice(0, 2);
      return [...productivity, ...writing].slice(0, 5);
    }
  },
  {
    title: "How to Start Using AI Tools: A Complete Beginner's Guide",
    slug: "how-to-start-using-ai-tools-beginners-guide-2026",
    category: "Productivity",
    description: "The complete beginner's guide to getting started with AI tools in 2026. No technical knowledge needed!",
    style: "故事驱动风",
    toolsSelector: (tools) => tools.filter(t => t.skill_level === 'beginner' && t.rating >= 4.3).slice(0, 5)
  }
];

// 生成并保存新文章
let currentId = nextId;
newArticles.forEach((article, index) => {
  const selectedTools = article.toolsSelector(toolsData);
  if (selectedTools.length === 0) {
    console.warn(`⚠️ 文章 "${article.title}" 没有找到工具，跳过`);
    return;
  }
  
  const post = {
    id: currentId,
    title: article.title,
    slug: article.slug,
    date: "2026-05-28",
    description: article.description,
    style: article.style,
    images: [
      {
        url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop",
        alt: article.title,
        caption: `${article.title} - Use AI Tools`
      }
    ],
    content: generateArticleContent(article.title, selectedTools, article.category),
    category: article.category
  };
  
  const filePath = path.join(blogPostsDir, `${currentId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf8');
  
  console.log(`✅ 已生成文章 ${index + 1}/${newArticles.length}: ${article.title} (ID: ${currentId})`);
  currentId++;
});

console.log(`\n🎉 完成！已生成 ${newArticles.length} 篇新文章`);
console.log(`📂 文章目录: ${blogPostsDir}`);
