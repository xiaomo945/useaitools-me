const fs = require('fs');

// === Tool Data Quality ===
const tools = JSON.parse(fs.readFileSync('data/tools.json', 'utf8'));
const validCategories = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];
const validPricing = ['Free', 'Freemium', 'Paid'];

let toolIssues = [];
tools.forEach(t => {
  if (!t.name || t.name.trim() === '') {
    toolIssues.push({ id: t.id, issue: 'name 为空' });
  }
  if (!t.description || t.description.length < 50) {
    toolIssues.push({ id: t.id, name: t.name, issue: 'description 过短 (' + (t.description ? t.description.length : 0) + ' 字符)' });
  }
  if (!validCategories.includes(t.category)) {
    toolIssues.push({ id: t.id, name: t.name, issue: 'category 不在允许列表中: ' + t.category });
  }
  if (!t.url || !t.url.startsWith('http')) {
    toolIssues.push({ id: t.id, name: t.name, issue: 'url 格式无效: ' + t.url });
  }
  if (t.pricing && !validPricing.includes(t.pricing)) {
    toolIssues.push({ id: t.id, name: t.name, issue: 'pricing 不在允许列表中: ' + t.pricing });
  }
});

let toolReport = '# 📊 工具数据质量报告\n\nGenerated: 2026-05-22\n\n';
toolReport += '## 概览\n\n';
toolReport += '| 指标 | 数量 |\n|:---|:---|\n';
toolReport += '| 总工具数 | ' + tools.length + ' |\n';
toolReport += '| 发现问题 | ' + toolIssues.length + ' |\n\n';

if (toolIssues.length > 0) {
  toolReport += '## 问题清单\n\n';
  toolReport += '| ID | 工具名称 | 问题 |\n|:---|:---|:---|\n';
  toolIssues.forEach(i => {
    toolReport += '|' + i.id + '|' + (i.name || 'N/A') + '|' + i.issue + '|\n';
  });
} else {
  toolReport += '✅ 所有工具数据完整，无发现问题！\n';
}

fs.writeFileSync('.tmp/tool-data-quality-report.md', toolReport);

// === Blog Data Quality ===
const blogs = JSON.parse(fs.readFileSync('data/blog-posts.json', 'utf8'));
let blogIssues = [];
blogs.forEach(b => {
  if (!b.title || b.title.trim() === '') {
    blogIssues.push({ id: b.id, issue: 'title 为空' });
  }
  if (!b.slug || b.slug.trim() === '' || /[^\w\-\/]/.test(b.slug)) {
    blogIssues.push({ id: b.id, title: b.title, issue: 'slug 为空或包含非法字符: ' + b.slug });
  }
  if (!b.content || b.content.length < 500) {
    blogIssues.push({ id: b.id, title: b.title, issue: 'content 过短 (' + (b.content ? b.content.length : 0) + ' 字符)' });
  }
  if (!b.date || isNaN(Date.parse(b.date))) {
    blogIssues.push({ id: b.id, title: b.title, issue: 'date 格式无效: ' + b.date });
  }
});

let blogReport = '# 📊 博客数据质量报告\n\nGenerated: 2026-05-22\n\n';
blogReport += '## 概览\n\n';
blogReport += '| 指标 | 数量 |\n|:---|:---|\n';
blogReport += '| 总博客数 | ' + blogs.length + ' |\n';
blogReport += '| 发现问题 | ' + blogIssues.length + ' |\n\n';

if (blogIssues.length > 0) {
  blogReport += '## 问题清单\n\n';
  blogReport += '| ID | 标题 | 问题 |\n|:---|:---|:---|\n';
  blogIssues.forEach(i => {
    blogReport += '|' + i.id + '|' + (i.title || '').substring(0, 40) + '|' + i.issue + '|\n';
  });
} else {
  blogReport += '✅ 所有博客数据完整，无发现问题！\n';
}

fs.writeFileSync('.tmp/blog-data-quality-report.md', blogReport);

// === Dead Link Audit ===
const validToolIds = new Set(tools.map(t => t.id));
const validBlogSlugs = new Set(blogs.map(b => b.slug));

let deadLinks = [];
blogs.forEach(blog => {
  const content = blog.content || '';
  
  // Check [[link:/tools/XX|...]]
  const toolLinkRegex = /\[\[link:\/tools\/(\d+)\|/g;
  let match;
  while ((match = toolLinkRegex.exec(content)) !== null) {
    const id = parseInt(match[1]);
    if (!validToolIds.has(id)) {
      deadLinks.push({ type: 'tool', blogSlug: blog.slug, targetId: id, pattern: match[0] });
    }
  }
  
  // Check [[link:/blog/XXX|...]]
  const blogLinkRegex = /\[\[link:\/blog\/([^\|]+)\|/g;
  while ((match = blogLinkRegex.exec(content)) !== null) {
    const slug = match[1];
    if (!validBlogSlugs.has(slug)) {
      deadLinks.push({ type: 'blog', blogSlug: blog.slug, targetSlug: slug, pattern: match[0] });
    }
  }
});

let deadLinkReport = '# 🔗 死链审计报告\n\nGenerated: 2026-05-22\n\n';
deadLinkReport += '## 概览\n\n';
deadLinkReport += '| 指标 | 数量 |\n|:---|:---|\n';
deadLinkReport += '| 检查博客数 | ' + blogs.length + ' |\n';
deadLinkReport += '| 发现死链 | ' + deadLinks.length + ' |\n\n';

if (deadLinks.length > 0) {
  deadLinkReport += '## 死链清单\n\n';
  deadLinkReport += '| 来源博客 | 链接类型 | 目标 | 模式 |\n|:---|:---|:---|:---|\n';
  deadLinks.forEach(d => {
    if (d.type === 'tool') {
      deadLinkReport += '|' + d.blogSlug + '|工具|ID:' + d.targetId + '|' + d.pattern + '|\n';
    } else {
      deadLinkReport += '|' + d.blogSlug + '|博客|' + d.targetSlug + '|' + d.pattern + '|\n';
    }
  });
} else {
  deadLinkReport += '✅ 所有内链均有效，无死链！\n';
}

fs.writeFileSync('.tmp/dead-link-report.md', deadLinkReport);

// Output summary
console.log('=== 数据质量审计完成 ===');
console.log('工具问题:', toolIssues.length);
if (toolIssues.length > 0) {
  toolIssues.forEach(i => console.log('  ID:' + i.id + ' | ' + i.issue));
}
console.log('博客问题:', blogIssues.length);
if (blogIssues.length > 0) {
  blogIssues.forEach(i => console.log('  ID:' + i.id + ' | ' + i.issue));
}
console.log('死链:', deadLinks.length);
if (deadLinks.length > 0) {
  deadLinks.forEach(d => console.log('  ' + d.blogSlug + ' -> ' + (d.targetId || d.targetSlug)));
}
