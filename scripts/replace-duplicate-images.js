'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔄 启动重复图片替换程序...');

// 读取扫描结果
const scanResult = require('./scan-duplicate-images.js');

const blogPostsDir = path.join(__dirname, '..', 'data', 'blog-posts');

// 生成唯一的图片URL（使用我们的API）
function generateUniqueImageUrl(articleId, position, category, title) {
  const hash = crypto.randomBytes(4).toString('hex');
  
  const prompt = `clean tech illustration, emerald green accents, ${category} AI tools, minimalist design, ${title}`;
  const encodedPrompt = encodeURIComponent(prompt);
  
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&seed=${Date.now()}-${hash}`;
}

// 处理重复图片
async function processDuplicates() {
  const { duplicates } = scanResult;
  
  if (!duplicates || duplicates.length === 0) {
    console.log('✅ 没有发现重复图片，无需替换！');
    return;
  }
  
  console.log(`📊 开始处理 ${duplicates.length} 组重复图片...`);
  
  // 统计替换次数
  let replaceCount = 0;
  
  duplicates.forEach((dupe) => {
    const originalUrl = dupe.url;
    const postIds = dupe.postIds;
    
    console.log(`\n🔄 处理图片: ${originalUrl}`);
    console.log(`   📝 引用次数: ${postIds.length}，将替换 ${postIds.length - 1} 个副本`);
    
    // 保留第一篇文章的图片，替换其余的
    postIds.slice(1).forEach((postId) => {
      const filePath = path.join(blogPostsDir, `${postId}.json`);
      
      try {
        if (fs.existsSync(filePath)) {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          
          if (content.images && Array.isArray(content.images)) {
            content.images = content.images.map((image, idx) => {
              if (image.url === originalUrl) {
                const positions = ['header', 'mid', 'cta'];
                const position = positions[idx] || 'mid';
                
                // 生成新的唯一图片URL
                const newUrl = generateUniqueImageUrl(
                  content.id, 
                  position, 
                  content.category || 'Productivity',
                  content.title
                );
                
                console.log(`   🆕 替换文章 ${postId} 的图片: ${originalUrl.substring(0, 40)}... -> ${newUrl.substring(0, 40)}...`);
                
                replaceCount++;
                
                return {
                  ...image,
                  url: newUrl,
                  image_url: newUrl,
                  prompt: `Unique image for article ${content.id} ${position}`,
                  generated: true
                };
              }
              return image;
            });
            
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
            console.log(`   ✅ 文章 ${postId} 更新成功！`);
          }
        }
      } catch (err) {
        console.error(`❌ 处理文章 ${postId} 时出错:`, err.message);
      }
    });
  });
  
  console.log(`\n🎉 替换完成！共替换了 ${replaceCount} 个重复图片！`);
  
  // 再次扫描验证
  console.log('\n🔍 再次扫描验证重复图片...');
  
  // 重新扫描
  const imageMap = new Map();
  const allFiles = fs.readdirSync(blogPostsDir)
    .filter(file => file.endsWith('.json') && /^\d+\.json$/.test(file));
  
  allFiles.forEach(file => {
    const filePath = path.join(blogPostsDir, file);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (content.images && Array.isArray(content.images)) {
        content.images.forEach(image => {
          if (image.url) {
            if (!imageMap.has(image.url)) {
              imageMap.set(image.url, []);
            }
            imageMap.get(image.url).push(content.id);
          }
        });
      }
    } catch (err) {
      // 忽略错误
    }
  });
  
  const remainingDuplicates = [];
  imageMap.forEach((postIds, url) => {
    if (postIds.length > 1) {
      remainingDuplicates.push({ url, postIds });
    }
  });
  
  if (remainingDuplicates.length === 0) {
    console.log('✅ 验证完成：没有发现重复图片！');
  } else {
    console.warn(`⚠️ 验证发现 ${remainingDuplicates.length} 张重复图片！`);
  }
}

// 执行
processDuplicates().catch(err => {
  console.error('❌ 执行出错:', err);
  process.exit(1);
});
