import fs from 'fs';

const blogPosts = JSON.parse(fs.readFileSync('./data/blog-posts.json', 'utf-8'));
const tools = JSON.parse(fs.readFileSync('./data/tools.json', 'utf-8'));

console.log('博客文章数量:', blogPosts.length);
console.log('工具数量:', tools.length);
