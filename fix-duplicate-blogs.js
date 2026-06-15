const fs = require('fs');
const path = require('path');

const blogPostsDir = path.join(__dirname, 'data', 'blog-posts');
const reportPath = path.join(__dirname, 'duplicate-blog-report.json');

// 读取所有 JSON 文件
const files = fs.readdirSync(blogPostsDir).filter(f => f.endsWith('.json'));
const posts = [];

for (const file of files) {
  const filePath = path.join(blogPostsDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const post = JSON.parse(content);
    if (post.id && post.title && post.slug) {
      posts.push({ ...post, _file: file });
    }
  } catch (e) {
    console.error(`Error reading ${file}:`, e.message);
  }
}

console.log(`Total posts loaded: ${posts.length}`);

// 按标题分组
const titleMap = new Map();
for (const post of posts) {
  const title = post.title.trim();
  if (!titleMap.has(title)) {
    titleMap.set(title, []);
  }
  titleMap.get(title).push(post);
}

// 找出重复组（标题出现次数 > 1）
const duplicateGroups = [];
for (const [title, group] of titleMap.entries()) {
  if (group.length > 1) {
    // 按 ID 升序排序
    group.sort((a, b) => a.id - b.id);
    duplicateGroups.push({ title, posts: group });
  }
}

console.log(`Duplicate groups found: ${duplicateGroups.length}`);

// 为重复文章添加 canonical_slug
let updatedCount = 0;
const report = [];

for (const group of duplicateGroups) {
  const canonicalPost = group.posts[0]; // ID 最小的作为主文章
  const canonicalSlug = canonicalPost.slug;

  const groupReport = {
    title: group.title,
    canonical_id: canonicalPost.id,
    canonical_slug: canonicalSlug,
    duplicates: []
  };

  // 为其他重复文章添加 canonical_slug
  for (let i = 1; i < group.posts.length; i++) {
    const dup = group.posts[i];
    const filePath = path.join(blogPostsDir, dup._file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // 添加 canonical_slug 字段
    content.canonical_slug = canonicalSlug;

    // 写回文件
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    updatedCount++;

    groupReport.duplicates.push({
      id: dup.id,
      slug: dup.slug,
      canonical_slug: canonicalSlug
    });
  }

  report.push(groupReport);
}

console.log(`Updated ${updatedCount} files with canonical_slug`);

// 生成报告
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
console.log(`Report saved to: ${reportPath}`);

// 打印摘要
console.log('\n=== Duplicate Groups Summary ===');
for (const group of report) {
  console.log(`\nTitle: "${group.title}"`);
  console.log(`  Canonical: ID ${group.canonical_id}, slug "${group.canonical_slug}"`);
  console.log(`  Duplicates (${group.duplicates.length}):`);
  for (const dup of group.duplicates) {
    console.log(`    - ID ${dup.id}, slug "${dup.slug}" -> canonical: "${dup.canonical_slug}"`);
  }
}
