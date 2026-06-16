import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取现有数据
const blogPostsPath = path.join(__dirname, 'data', 'blog-posts.json');
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

// 创建目录
const blogPostsDir = path.join(__dirname, 'data', 'blog-posts');
if (!fs.existsSync(blogPostsDir)) {
  fs.mkdirSync(blogPostsDir, { recursive: true });
}

// 创建索引文件（只包含元数据）
const blogIndex = blogPosts.map(post => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  date: post.date,
  category: post.category,
  description: post.description,
  featured: post.featured || false,
  // 只保留第一张图片作为预览
  thumbnail: post.images && post.images.length > 0 ? post.images[0] : undefined
}));

// 写入索引文件
fs.writeFileSync(
  path.join(__dirname, 'data', 'blog-index.json'),
  JSON.stringify(blogIndex, null, 2),
  'utf8'
);

// 写入每个独立文章文件
blogPosts.forEach(post => {
  fs.writeFileSync(
    path.join(blogPostsDir, `${post.id}.json`),
    JSON.stringify(post, null, 2),
    'utf8'
  );
});

console.log(`✅ 成功拆分 ${blogPosts.length} 篇博客文章！`);
console.log(`✅ 创建索引文件: data/blog-index.json`);
console.log(`✅ 创建文章目录: data/blog-posts/`);
console.log(`✅ 文章文件: data/blog-posts/1.json - data/blog-posts/${blogPosts.length}.json`);
