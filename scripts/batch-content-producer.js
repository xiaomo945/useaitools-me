const fs = require('fs');
const path = require('path');
const { generateImagesForArticle } = require('./generate-images');
const { checkArticleForDuplicates } = require('./deduplicate-images');

// 读取博客索引
const blogIndexPath = path.join(__dirname, '..', 'data', 'blog-index.json');
const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));

// 博客文章目录
const blogPostsDir = path.join(__dirname, '..', 'data', 'blog-posts');

// 计算下一个文章ID
const nextId = blogIndex.length > 0 ? Math.max(...blogIndex.map(post => post.id)) + 1 : 1;

// 新文章数据
const newArticles = [
  {
    id: nextId,
    title: "Best AI Tools for Students in 2026: Study Smarter Not Harder",
    slug: "best-ai-tools-students-2026",
    date: "2026-05-28",
    description: "Discover the best AI tools for students in 2026. From note-taking to essay writing, these tools will help you study smarter and achieve better grades.",
    category: "Productivity",
    author: "Use AI Tools Team",
    reading_time: "8 min",
    featured: true,
    images: [],
    content: "<p>Being a student today means juggling multiple responsibilities—classes, assignments, exams, and extracurriculars. AI tools can help you work smarter, not harder, saving you time while improving your academic performance.</p>\n\n<h2>Why Students Should Embrace AI Tools</h2>\n<p>AI is not about replacing your critical thinking—it's about freeing you from repetitive tasks so you can focus on what matters most: learning and understanding. From summarizing complex texts to helping with research, AI is your 24/7 study partner.</p>\n\n<h2>Top AI Tools for Students</h2>\n\n<h3>1. Notion AI - Your Smart Study Organizer</h3>\n<p>Notion AI transforms how you take notes, organize materials, and prepare for exams. It can summarize lectures, generate study guides, and even help you outline essays.</p>\n<p><strong>Best for:</strong> Note organization, study planning, and essay outlining</p>\n<p><a href=\"/tools/notion\" class=\"text-emerald-600 hover:underline\">Try Notion AI →</a></p>\n\n<h3>2. Rytr - Writing Assistant for Essays and Papers</h3>\n<p>Rytr helps you draft essays, research papers, and presentations quickly. It's perfect for overcoming writer's block and getting your first draft down fast.</p>\n<p><strong>Best for:</strong> Essay writing, research papers, and presentations</p>\n<p><a href=\"/tools/rytr\" class=\"text-emerald-600 hover:underline\">Try Rytr Free →</a></p>\n\n<h3>3. Grammarly - Polished Writing Every Time</h3>\n<p>Grammarly ensures your papers are free of grammar and spelling errors. Its AI-powered suggestions help you improve clarity and tone for better grades.</p>\n<p><strong>Best for:</strong> Proofreading, grammar checking, and writing improvement</p>\n<p><a href=\"/tools/grammarly\" class=\"text-emerald-600 hover:underline\">Try Grammarly →</a></p>\n\n<h3>4. ChatGPT - Your Personal Tutor</h3>\n<p>Use ChatGPT to explain complex concepts, walk through problems step-by-step, and get help with subjects you find challenging.</p>\n"
  }
];

// 处理每篇新文章
async function processNewArticles() {
  console.log('🚀 开始处理新文章...');

  for (const article of newArticles) {
    console.log(`\n📝 处理文章: ${article.title} (ID: ${article.id})`);

    // 第一步: 生成图片
    const updatedArticle = await generateImagesForArticle(article, 'Notion AI');

    // 第二步: 检查重复
    const hasDuplicates = await checkArticleForDuplicates(updatedArticle);
    if (hasDuplicates) {
      console.warn('⚠️ 文章内部有重复图片，重新生成...');
      // 如果有重复，再次生成
      await generateImagesForArticle(updatedArticle, 'Notion AI');
    }

    // 第三步: 保存文章文件
    const articlePath = path.join(blogPostsDir, `${article.slug}.json`);
    fs.writeFileSync(articlePath, JSON.stringify(updatedArticle, null, 2), 'utf8');
    console.log(`✅ 文章已保存: ${articlePath}`);

    // 第四步: 更新博客索引
    blogIndex.push({
      id: article.id,
      title: article.title,
      slug: article.slug,
      date: article.date,
      category: article.category,
      description: article.description,
      featured: article.featured,
      thumbnail: article.images && article.images[0] ? article.images[0].url : ''
    });
  }

  // 保存博客索引
  fs.writeFileSync(blogIndexPath, JSON.stringify(blogIndex, null, 2), 'utf8');
  console.log('\n✅ 博客索引已更新');
  console.log(`📊 共处理 ${newArticles.length} 篇新文章`);
}

processNewArticles().catch(console.error);
