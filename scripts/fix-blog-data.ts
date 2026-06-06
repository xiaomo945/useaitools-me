#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'data/blog-posts');
const OUTPUT_DIR = path.join(process.cwd(), '.tmp');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 类型定义
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  category: string;
  author?: string;
  reading_time?: string;
  featured?: boolean;
  images?: any[];
  content: string;
}

// 步骤1: 扫描并读取所有文章
console.log('📖 步骤1: 扫描并读取所有博客文章...');
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.json'));
const posts: BlogPost[] = [];

files.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
    const post = JSON.parse(content);
    posts.push(post);
  } catch (e) {
    console.warn(`⚠️ 无法读取文件: ${file}`);
  }
});

console.log(`✅ 成功读取 ${posts.length} 篇文章`);

// 步骤2: 检查哪些文章内容不完整
console.log('\n🔍 步骤2: 检查文章内容完整性...');
const incompletePosts: BlogPost[] = [];
const reportLines: string[] = ['# 内容质量修复报告', '', `生成时间: ${new Date().toLocaleString()}`, ''];

posts.forEach(post => {
  const contentLength = post.content?.length || 0;
  if (contentLength < 1000) {
    incompletePosts.push(post);
    reportLines.push(`- [❌] ${post.title} (${contentLength} 字符)`);
  } else {
    reportLines.push(`- [✅] ${post.title} (${contentLength} 字符)`);
  }
});

console.log(`⚠️ 发现 ${incompletePosts.length} 篇内容不完整的文章`);

// 步骤3: 生成示例修复内容（模拟，后续会完善）
console.log('\n🛠️ 步骤3: 生成修复报告...');
reportLines.push('');
reportLines.push('## 统计');
reportLines.push(`- 总文章数: ${posts.length}`);
reportLines.push(`- 完整文章数: ${posts.length - incompletePosts.length}`);
reportLines.push(`- 需要修复数: ${incompletePosts.length}`);
reportLines.push('');
reportLines.push('## 修复策略');
reportLines.push('1. 优先修复有分类和明确主题的文章');
reportLines.push('2. 为文章生成1200-1500字的内容');
reportLines.push('3. 保留原有文章结构');

fs.writeFileSync(path.join(OUTPUT_DIR, 'content-quality-fix-report.md'), reportLines.join('\n'), 'utf-8');
console.log(`✅ 报告已保存到 .tmp/content-quality-fix-report.md`);

// 步骤4: 更新 blog-posts.ts 文件
console.log('\n📝 步骤4: 更新 blog-posts.ts 文件...');

// 按日期排序
const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const typescriptContent = `import type { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
${sortedPosts.map(post => JSON.stringify(post, null, 2)).join(',\n')}
];
`;

fs.writeFileSync(path.join(process.cwd(), 'data/blog-posts.ts'), typescriptContent, 'utf-8');
console.log(`✅ blog-posts.ts 已更新为包含 ${posts.length} 篇文章`);

console.log('\n🎉 完成所有步骤！');
