const fs = require('fs');
const path = require('path');

// Load scan results
const { duplicates } = require('./scan-duplicate-images.js');

const blogPostsDir = path.join(__dirname, '..', 'data', 'blog-posts');

// Generate random hash
function generateRandomHash(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

// Generate a new unique image URL based on article ID
function generateNewUniqueImageUrl(articleId, baseUrl) {
  // List of unique stock photos to use
  const baseImages = [
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1487014679447-ebefba5ddcab?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=400&fit=crop'
  ];
  
  // Pick a random base image that's different from original
  let randomBase = baseImages.filter(u => u !== baseUrl)[Math.floor(Math.random() * (baseImages.length - 1))];
  
  // Generate a unique variation
  const hash = generateRandomHash(12);
  return `${randomBase}&article=${articleId}&hash=${hash}`;
}

console.log(`🔧 开始替换 ${duplicates.length} 个重复图片...\n`);

let totalReplaced = 0;

// Process each duplicate image
duplicates.forEach(dupe => {
  const originalUrl = dupe.url;
  const postIds = dupe.postIds;
  
  console.log(`📸 处理图片: ${originalUrl}`);
  console.log(`   引用次数: ${postIds.length} (保留第一个，替换其余 ${postIds.length - 1} 个`);
  
  // Keep first post, replace rest
  for (let i = 1; i < postIds.length; i++) {
    const postId = postIds[i];
    const filePath = path.join(blogPostsDir, `${postId}.json`);
    
    if (!fs.existsSync(filePath)) continue;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const post = JSON.parse(content);
      
      if (post.images && Array.isArray(post.images)) {
        let replaced = false;
        
        post.images = post.images.map(img => {
          if (img.url === originalUrl) {
            const newUrl = generateNewUniqueImageUrl(postId, originalUrl);
            replaced = true;
            console.log(`   ✓ 替换文章 ${postId}: ${originalUrl} -> ${newUrl}`);
            return { ...img, url: newUrl };
          }
          return img;
        });
        
        if (replaced) {
          fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf8');
          totalReplaced++;
        }
      }
    } catch (err) {
      console.warn(`⚠️  处理文章 ${postId} 失败: ${err.message}`);
    }
  }
});

console.log(`\n✅ 替换完成！共替换了 ${totalReplaced} 张图片`);
