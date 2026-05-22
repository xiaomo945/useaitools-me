const fs = require('fs');
const tools = JSON.parse(fs.readFileSync('data/tools.json', 'utf8'));
const blogs = JSON.parse(fs.readFileSync('data/blog-posts.json', 'utf8'));

// === Tool Exposure Audit ===
const toolRefs = {};
tools.forEach(t => { toolRefs[t.id] = { name: t.name, category: t.category, count: 0 }; });

blogs.forEach(blog => {
  const content = blog.content || '';
  tools.forEach(t => {
    const searchStr = '[[link:/tools/' + t.id + '|';
    let idx = content.indexOf(searchStr);
    while (idx !== -1) {
      toolRefs[t.id].count++;
      idx = content.indexOf(searchStr, idx + 1);
    }
  });
});

const sorted = Object.entries(toolRefs).sort((a, b) => a[1].count - b[1].count);
const unrefTools = sorted.filter(([, v]) => v.count === 0);

let report = '# 🔍 工具曝光度审计报告\n\n';
report += 'Generated: 2026-05-22\n\n';
report += '## 概览\n\n';
report += '| 指标 | 数量 |\n|:---|:---|\n';
report += '| 总工具数 | ' + tools.length + ' |\n';
report += '| 零引用工具 | ' + unrefTools.length + ' |\n';
report += '| 有引用工具 | ' + (tools.length - unrefTools.length) + ' |\n\n';

report += '## 被引用次数最少的 10 个工具\n\n';
report += '| ID | 工具名称 | 分类 | 引用次数 |\n|:---|:---|:---|:---:|\n';
sorted.slice(0, 10).forEach(([id, data]) => {
  report += '|' + id + '|' + data.name + '|' + data.category + '|' + data.count + '|\n';
});

report += '\n## 所有零引用工具\n\n';
report += '| ID | 工具名称 | 分类 |\n|:---|:---|:---|\n';
unrefTools.forEach(([id, data]) => {
  report += '|' + id + '|' + data.name + '|' + data.category + '|\n';
});

report += '\n## 建议\n\n';
report += '1. 在新博客文章中优先引用这些零曝光工具\n2. 在相关文章末尾添加"Related Tools"推荐\n3. 对高价值但零曝光的工具（如有联盟链接）给予特别关注\n';

fs.writeFileSync('.tmp/tool-exposure-audit.md', report);

// === Internal Link Audit ===
const blogLinkCounts = {};
blogs.forEach(b => { blogLinkCounts[b.slug] = { title: b.title, count: 0, category: b.category }; });

blogs.forEach(blog => {
  const content = blog.content || '';
  const regex = /\[\[link:\/blog\/([^|]+)\|/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const slug = match[1];
    if (blogLinkCounts[slug]) {
      blogLinkCounts[slug].count++;
    }
  }
});

const blogSorted = Object.entries(blogLinkCounts).sort((a, b) => a[1].count - b[1].count);
const orphanBlogs = blogSorted.filter(([, v]) => v.count === 0);

let blogReport = '# 🔗 博客内链孤岛审计报告\n\n';
blogReport += 'Generated: 2026-05-22\n\n';
blogReport += '## 概览\n\n';
blogReport += '| 指标 | 数量 |\n|:---|:---|\n';
blogReport += '| 总博客数 | ' + blogs.length + ' |\n';
blogReport += '| 零内链博客 | ' + orphanBlogs.length + ' |\n';
blogReport += '| 有内链博客 | ' + (blogs.length - orphanBlogs.length) + ' |\n\n';

blogReport += '## 被链次数最少的 5 篇文章\n\n';
blogReport += '| Slug | 标题 | 被链次数 |\n|:---|:---|:---:|\n';
blogSorted.slice(0, 5).forEach(([slug, data]) => {
  blogReport += '|' + slug + '|' + data.title.substring(0, 50) + '|' + data.count + '|\n';
});

blogReport += '\n## 所有零内链博客（孤岛文章）\n\n';
blogReport += '| Slug | 分类 | 标题 |\n|:---|:---|:---|\n';
orphanBlogs.forEach(([slug, data]) => {
  blogReport += '|' + slug + '|' + data.category + '|' + data.title.substring(0, 60) + '|\n';
});

blogReport += '\n## 建议\n\n';
blogReport += '1. 从相关文章中添加指向这些孤岛文章的内链\n2. 在博客列表页按分类展示所有文章\n3. 在相关文章末尾添加"Related Posts"推荐\n';

fs.writeFileSync('.tmp/internal-link-audit.md', blogReport);

console.log('=== 审计完成 ===');
console.log('工具曝光报告: .tmp/tool-exposure-audit.md');
console.log('内链孤岛报告: .tmp/internal-link-audit.md');
console.log('');
console.log('=== 工具曝光度 ===');
sorted.slice(0, 10).forEach(([id, data]) => {
  console.log('ID:' + id.padEnd(4) + data.name.padEnd(25) + data.category.padEnd(15) + '引用: ' + data.count);
});
console.log('');
console.log('=== 内链孤岛 ===');
console.log('零内链博客:', orphanBlogs.length, '篇');
blogSorted.slice(0, 5).forEach(([slug, data]) => {
  console.log(slug.padEnd(50) + '被链: ' + data.count);
});
