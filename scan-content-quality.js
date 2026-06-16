import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogPostsDir = path.join(__dirname, 'data', 'blog-posts');
const outputDir = path.join(__dirname, '.tmp');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const issuesReport = [];
const allFiles = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.json'));

console.log(`📖 开始扫描 ${allFiles.length} 篇文章...\n`);

allFiles.forEach(fileName => {
  const filePath = path.join(blogPostsDir, fileName);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const post = JSON.parse(content);
    
    if (!post.content || post.content.length < 1000) {
      const wordCount = (post.content || '').split(/\s+/).length;
      issuesReport.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        fileName,
        contentLength: (post.content || '').length,
        wordCount,
        category: post.category
      });
      console.log(`❌ ${fileName}: 内容过短 (${(post.content || '').length} 字符)`);
    } else {
      console.log(`✅ ${fileName}: 内容完整`);
    }
  } catch (error) {
    console.error(`⚠️ 读取 ${fileName} 失败: ${error.message}`);
    issuesReport.push({
      fileName,
      error: error.message
    });
  }
});

// 生成报告
let reportContent = '# 全站文章内容质量问题报告\n\n';
reportContent += `生成时间: ${new Date().toLocaleString()}\n\n`;
reportContent += `总文章数: ${allFiles.length}\n`;
reportContent += `问题文章数: ${issuesReport.length}\n\n`;

if (issuesReport.length > 0) {
  reportContent += '## 问题文章清单\n\n';
  reportContent += '| 文件 | 标题 | 内容长度 | 单词数 | 分类 |\n';
  reportContent += '|------|------|----------|--------|------|\n';
  
  issuesReport.forEach(issue => {
    if (issue.error) {
      reportContent += `| ${issue.fileName} | (错误) | - | - | - |\n`;
    } else {
      reportContent += `| ${issue.fileName} | ${issue.title} | ${issue.contentLength} | ${issue.wordCount} | ${issue.category} |\n`;
    }
  });
}

const reportPath = path.join(outputDir, 'content-quality-issues-report.md');
fs.writeFileSync(reportPath, reportContent);

console.log(`\n📊 报告已保存至: ${reportPath}`);
console.log(`✅ 扫描完成！发现 ${issuesReport.length} 篇问题文章`);
