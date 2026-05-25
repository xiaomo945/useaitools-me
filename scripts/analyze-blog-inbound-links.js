#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BLOG_FILE = path.join(__dirname, '..', 'data', 'blog-posts.json');

function analyzeInboundLinks() {
  let blogPosts;
  try {
    const data = fs.readFileSync(BLOG_FILE, 'utf8');
    blogPosts = JSON.parse(data);
  } catch (err) {
    console.error('❌ Failed to read blog-posts.json:', err.message);
    process.exit(1);
  }

  const linkPattern = /\[\[link:\/blog\/([^|\]]+)\|([^\]]+)\]\]/g;
  const inboundCounts = new Map();
  const blogSlugs = blogPosts.map(p => p.slug);

  // Initialize all slugs with 0
  blogSlugs.forEach(slug => inboundCounts.set(slug, 0));

  // Count inbound links
  blogPosts.forEach(post => {
    let match;
    while ((match = linkPattern.exec(post.content)) !== null) {
      const targetSlug = match[1];
      if (inboundCounts.has(targetSlug)) {
        inboundCounts.set(targetSlug, inboundCounts.get(targetSlug) + 1);
      }
    }
  });

  // Sort by inbound count ascending (find islands)
  const sortedPosts = [...blogPosts]
    .map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      date: p.date,
      category: p.category,
      inboundLinks: inboundCounts.get(p.slug) || 0
    }))
    .sort((a, b) => a.inboundLinks - b.inboundLinks);

  console.log('📊 Blog Inbound Link Analysis:');
  console.log('----------------------------------');
  
  const islands = sortedPosts.filter(p => p.inboundLinks <= 1);
  
  console.log(`\n🏝️  Found ${islands.length} island posts (≤ 1 inbound links):`);
  islands.forEach(p => {
    console.log(`   - [${p.inboundLinks} links] ${p.title} (${p.slug})`);
  });

  console.log(`\n📈 Most linked posts:`);
  const mostLinked = [...sortedPosts].reverse().slice(0, 10);
  mostLinked.forEach((p, i) => {
    console.log(`   ${i + 1}. [${p.inboundLinks} links] ${p.title}`);
  });

  // Write simple report
  const report = `# Blog Inbound Link Analysis
Generated: ${new Date().toISOString()}

## Island Posts (≤ 1 Inbound Links)
${islands.map(p => `- ${p.title} (${p.slug}): ${p.inboundLinks} links`).join('\n')}

## Most Linked Posts
${mostLinked.map((p, i) => `${i + 1}. ${p.title}: ${p.inboundLinks} links`).join('\n')}
`;
  fs.writeFileSync(path.join(__dirname, '..', '.tmp', 'blog-inbound-links.md'), report, 'utf8');
  console.log(`\n📄 Report saved to: .tmp/blog-inbound-links.md`);
}

analyzeInboundLinks();
