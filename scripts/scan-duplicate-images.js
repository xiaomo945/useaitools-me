const fs = require('fs');
const path = require('path');

// Ensure tmp directory exists
const tmpDir = path.join(__dirname, '..', '.tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const blogPostsDir = path.join(__dirname, '..', 'data', 'blog-posts');
const reportPath = path.join(tmpDir, 'duplicate-images-report.md');

// Collect all images and their post IDs
const imageMap = new Map(); // {imageUrl: [postId]}
const allFiles = fs.readdirSync(blogPostsDir)
  .filter(file => file.endsWith('.json') && /^\d+\.json$/.test(file));

console.log(`📊 扫描 ${allFiles.length} 篇文章...`);

allFiles.forEach(file => {
  const filePath = path.join(blogPostsDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const post = JSON.parse(content);
    
    if (post.images && Array.isArray(post.images)) {
      post.images.forEach(image => {
        if (image.url) {
          if (!imageMap.has(image.url)) {
            imageMap.set(image.url, []);
          }
          imageMap.get(image.url).push(post.id);
        }
      });
    }
  } catch (err) {
    console.warn(`⚠️ 跳过文件 ${file}: ${err.message}`);
  }
});

// Find duplicates
const duplicates = [];
let totalDuplicateImages = 0;

imageMap.forEach((postIds, imageUrl) => {
  if (postIds.length > 1) {
    duplicates.push({
      url: imageUrl,
      count: postIds.length,
      postIds: postIds
    });
    totalDuplicateImages += (postIds.length - 1); // Count how many are duplicates (keep 1 original)
  }
});

// Generate report
let report = '# 重复图片扫描报告\n\n';
report += `扫描时间: ${new Date().toISOString()}\n`;
report += `扫描文章数: ${allFiles.length}\n`;
report += `唯一图片数: ${imageMap.size}\n`;
report += `重复图片数: ${duplicates.length}\n`;
report += `需替换的图片总数: ${totalDuplicateImages}\n\n`;

if (duplicates.length > 0) {
  report += '## 重复图片详情\n\n';
  
  duplicates.forEach((dupe, index) => {
    report += `### ${index + 1}. ${dupe.url}\n`;
    report += `- 引用次数: ${dupe.count}\n`;
    report += `- 引用文章ID: [${dupe.postIds.join(', ')}]\n`;
    report += '- 建议: 保留第一篇，替换其余\n\n';
  });
} else {
  report += '✅ 没有发现重复图片！所有图片都是唯一的。\n';
}

fs.writeFileSync(reportPath, report, 'utf8');
console.log(`✅ 扫描完成！报告已保存至: ${reportPath}`);
console.log(`📊 发现 ${duplicates.length} 张重复图片，需替换 ${totalDuplicateImages} 次`);

// Return the duplicates for programmatic use
module.exports = { duplicates, reportPath };
