#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Read data
const tools = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tools.json'), 'utf8'));
const blogPosts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blog-posts.json'), 'utf8'));

// Build valid sets
const validToolIds = new Set(tools.map(t => t.id));
const validBlogSlugs = new Set(blogPosts.map(p => p.slug));

// Check all blog posts for dead links
const deadLinks = [];
const warnings = [];

blogPosts.forEach(post => {
  const content = post.content || '';
  
  // Check [[link:/tools/XX|...]] format
  const toolLinkRegex = /\[\[link:\/tools\/(\d+)[\]|]/g;
  let match;
  while ((match = toolLinkRegex.exec(content)) !== null) {
    const toolId = parseInt(match[1]);
    if (!validToolIds.has(toolId)) {
      deadLinks.push({
        post: post.slug,
        type: 'tool_link',
        reference: `/tools/${toolId}`,
        toolId: toolId,
      });
    }
  }
  
  // Check [[link:/blog/XXX|...]] format
  const blogLinkRegex = /\[\[link:\/blog\/([\w-]+)[\]|]/g;
  while ((match = blogLinkRegex.exec(content)) !== null) {
    const slug = match[1];
    if (!validBlogSlugs.has(slug)) {
      deadLinks.push({
        post: post.slug,
        type: 'blog_link',
        reference: `/blog/${slug}`,
        slug: slug,
      });
    }
  }
  
  // Check [[link:/category/XXX|...]] format
  const categoryLinkRegex = /\[\[link:\/category\/([\w]+)[\]|]/g;
  while ((match = categoryLinkRegex.exec(content)) !== null) {
    const category = match[1];
    const validCategories = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];
    if (!validCategories.includes(category)) {
      warnings.push({
        post: post.slug,
        type: 'category_link',
        reference: `/category/${category}`,
        message: `Category "${category}" may not exist`,
      });
    }
  }
});

// Check for duplicate tool IDs
const idCount = {};
tools.forEach(t => {
  idCount[t.id] = (idCount[t.id] || 0) + 1;
});
const duplicateIds = Object.entries(idCount).filter(([id, count]) => count > 1);

// Check for tools with empty descriptions
const emptyDescription = tools.filter(t => !t.description_en || t.description_en.trim() === '');

// Check for tools with missing fields
const missingFields = tools.filter(t => !t.category || !t.pricing || !t.url);

// Generate report
const report = `# Data Integrity Report

Generated: ${new Date().toISOString().split('T')[0]}

## Summary

- **Total Tools**: ${tools.length}
- **Total Blog Posts**: ${blogPosts.length}
- **Dead Links Found**: ${deadLinks.length}
- **Warnings**: ${warnings.length}

---

## Dead Links in Blog Posts (${deadLinks.length})

${deadLinks.length === 0 ? '✅ No dead links found!' : deadLinks.map(link => `- ❌ [${link.type}] Post: **${link.post}** → ${link.reference}${link.toolId ? ` (Tool ID ${link.toolId} not in tools.json)` : ''}${link.slug ? ` (Blog slug "${link.slug}" not found)` : ''}`).join('\n')}

---

## Warnings (${warnings.length})

${warnings.length === 0 ? '✅ No warnings!' : warnings.map(w => `- ⚠️ [${w.type}] Post: **${w.post}** → ${w.reference}: ${w.message}`).join('\n')}

---

## Duplicate Tool IDs

${duplicateIds.length === 0 ? '✅ No duplicate tool IDs!' : duplicateIds.map(([id, count]) => `- ❌ Tool ID **${id}** appears ${count} times`).join('\n')}

---

## Tools With Empty Descriptions

${emptyDescription.length === 0 ? '✅ All tools have descriptions!' : emptyDescription.map(t => `- ⚠️ Tool #${t.id} (${t.name}): missing description_en`).join('\n')}

---

## Tools With Missing Fields

${missingFields.length === 0 ? '✅ All tools have required fields!' : missingFields.map(t => `- ❌ Tool #${t.id} (${t.name}): missing ${[!t.category && 'category', !t.pricing && 'pricing', !t.url && 'url'].filter(Boolean).join(', ')}`).join('\n')}

---

## Valid Tool IDs

${Array.from(validToolIds).sort((a, b) => a - b).join(', ')}

---

## Valid Blog Slugs

${Array.from(validBlogSlugs).sort().join(', ')}
`;

// Ensure .tmp directory exists
const tmpDir = path.join(__dirname, '.tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

fs.writeFileSync(path.join(tmpDir, 'data-integrity-report.md'), report);

console.log(report);

if (deadLinks.length > 0) {
  console.error(`\n❌ Found ${deadLinks.length} dead links in blog posts!`);
  process.exit(1);
} else {
  console.log('\n✅ All blog post links are valid!');
}
