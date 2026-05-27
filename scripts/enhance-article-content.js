const fs = require('fs');
const path = require('path');

// 加载文章数据
const postsPath = path.join(__dirname, '..', 'data', 'blog-posts.json');
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

// 联盟工具关键词
const affiliateTools = {
  Writing: ['Rytr', 'Grammarly', 'Copy.ai', 'Jasper', 'ChatGPT', 'Claude'],
  Video: ['VEED.io', 'Synthesia', 'Runway ML', 'Pictory', 'D-ID'],
  Productivity: ['Notion AI', 'ClickUp AI', 'Todoist AI', 'Perplexity AI', 'ChatGPT']
};

let updatedCount = 0;

// 遍历最近生成的10篇文章（ID 154-163）
const recentPosts = posts.filter(p => p.id >= 154 && p.id <= 163);

recentPosts.forEach(post => {
  const tools = affiliateTools[post.category] || affiliateTools['Productivity'];
  
  // 随机选择1-2个联盟工具
  const selectedTools = tools.slice(0, Math.floor(Math.random() * 2) + 1);
  
  // 在文章内容中检查是否已经提到这些工具
  selectedTools.forEach(tool => {
    if (!post.content.includes(tool)) {
      updatedCount++;
      console.log(`✅ 文章 ${post.id} (${post.category}): 标记 ${tool} 待植入`);
    }
  });
});

console.log(`\n🎉 联盟工具分析完成！`);
console.log(`   - 分析文章数: ${recentPosts.length}`);
console.log(`   - 待植入工具数: ${updatedCount}`);
console.log(`   💡 实际植入将在下次文章生成时自动完成`);
