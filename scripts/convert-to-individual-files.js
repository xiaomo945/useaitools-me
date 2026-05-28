
const fs = require('fs');
const path = require('path');

// 读取现有数据
const blogPosts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blog-posts.json'), 'utf8'));
const blogIndex = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blog-index.json'), 'utf8'));

const blogPostsDir = path.join(__dirname, '../data/blog-posts');

// 确保目录存在
if (!fs.existsSync(blogPostsDir)) {
  fs.mkdirSync(blogPostsDir, { recursive: true });
}

console.log(`✅ 找到 ${blogPosts.length} 篇文章`);

// 将每篇文章保存为独立文件
blogPosts.forEach(post => {
  const filePath = path.join(blogPostsDir, `${post.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf8');
  console.log(`✅ 已保存: ${filePath}`);
});

// 为安全起见，先备份旧文件再删除
const backupDir = path.join(__dirname, '../data/backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

console.log('📦 备份旧文件...');
fs.copyFileSync(
  path.join(__dirname, '../data/blog-posts.json'),
  path.join(backupDir, 'blog-posts.backup.json')
);
fs.copyFileSync(
  path.join(__dirname, '../data/blog-index.json'),
  path.join(backupDir, 'blog-index.backup.json')
);

console.log('🗑️ 删除旧的合并文件...');
fs.unlinkSync(path.join(__dirname, '../data/blog-posts.json'));
fs.unlinkSync(path.join(__dirname, '../data/blog-index.json'));

console.log('🎉 完成！');
console.log(`📂 文章现在保存为独立文件在: ${blogPostsDir}`);
console.log(`📁 旧文件已备份到: ${backupDir}`);
