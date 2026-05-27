const fs = require('fs');
const path = require('path');

const BLOG_FILE = path.join(__dirname, '..', 'data', 'blog-posts.json');

async function run() {
  console.log('🎯 Loading blog posts...');
  const rawData = fs.readFileSync(BLOG_FILE, 'utf8');
  const blogPosts = JSON.parse(rawData);
  
  // Today is 2026-05-27, so two weeks ago is 2026-05-13
  const twoWeeksAgo = new Date('2026-05-13');
  console.log(`📅 Finding articles added after ${twoWeeksAgo.toISOString().split('T')[0]}...`);
  
  // Find all recent articles (last two weeks)
  const recentArticles = blogPosts.filter(post => 
    new Date(post.date) >= twoWeeksAgo
  );
  
  console.log(`✅ Found ${recentArticles.length} recent articles:`);
  recentArticles.forEach(p => 
    console.log(`   - [${p.date}] ${p.title} (${p.slug})`)
  );
  
  // Calculate inbound links for all posts
  console.log('\n🔍 Analyzing inbound links...');
  const linkPattern = /\[\[link:\/blog\/([^|\]]+)\|([^\]]+)\]\]/g;
  const inboundCounts = new Map();
  blogPosts.forEach(p => inboundCounts.set(p.slug, 0));
  
  blogPosts.forEach(post => {
    let match;
    while ((match = linkPattern.exec(post.content)) !== null) {
      const targetSlug = match[1];
      if (inboundCounts.has(targetSlug)) {
        inboundCounts.set(targetSlug, inboundCounts.get(targetSlug) + 1);
      }
    }
  });
  
  // Find articles with 0 inbound links
  const islandArticles = recentArticles.filter(p => (inboundCounts.get(p.slug) || 0) === 0);
  console.log(`\n🏝️  Found ${islandArticles.length} island articles (0 inbound links):`);
  islandArticles.forEach(p => 
    console.log(`   - ${p.title} (${p.slug})`)
  );
  
  // Add internal links for each island article
  let linksAdded = 0;
  for (const islandArticle of islandArticles) {
    console.log(`\n🔗 Adding links to: ${islandArticle.title}`);
    
    // Find articles in the same category that are not the island article
    const sameCategoryPosts = blogPosts.filter(p => 
      p.id !== islandArticle.id && p.category === islandArticle.category
    );
    
    if (sameCategoryPosts.length === 0) {
      console.log(`   ⚠️ No posts found in the same category`);
      continue;
    }
    
    // Pick up to 3 random posts to add the link to
    const targetPosts = sameCategoryPosts
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    for (const targetPost of targetPosts) {
      // Find a good place to insert the link
      // We'll look for a natural stopping point or the end of an introductory paragraph
      const paragraphs = targetPost.content.split('\n\n');
      let linkInserted = false;
      
      // Try to insert in the first 3 paragraphs
      for (let i = 0; i < Math.min(3, paragraphs.length); i++) {
        const para = paragraphs[i];
        if (para.length > 50 && !para.includes('[[link:')) {
          // Add a natural transition sentence with the link
          const linkText = `\n\nFor more insights on this topic, check out our [[link:/blog/${islandArticle.slug}|${islandArticle.title}]]!`;
          paragraphs[i] = para + linkText;
          linkInserted = true;
          console.log(`   ✅ Added link in post: ${targetPost.title}`);
          linksAdded++;
          break;
        }
      }
      
      // If no good spot found, add at the end of the content
      if (!linkInserted) {
        targetPost.content += `\n\nFor more insights, check out our [[link:/blog/${islandArticle.slug}|${islandArticle.title}]]!`;
        console.log(`   ✅ Added link at end of post: ${targetPost.title}`);
        linksAdded++;
      }
    }
  }
  
  // Save the changes
  console.log(`\n💾 Saving changes to ${BLOG_FILE}...`);
  fs.writeFileSync(BLOG_FILE, JSON.stringify(blogPosts, null, 2));
  
  console.log(`\n🎊 Done! Added ${linksAdded} internal links to ${islandArticles.length} articles.`);
}

run().catch(console.error);
