#!/usr/bin/env node

/**
 * Internal Link Health Check Script
 * 
 * This script validates all internal links in blog posts.
 * It checks:
 * - Tool links point to existing tool IDs
 * - Blog links point to existing blog slugs
 * - Category links use valid category names
 * 
 * Usage: node scripts/check-internal-links.js
 */

const fs = require('fs');
const path = require('path');

const TOOLS_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const BLOG_FILE = path.join(__dirname, '..', 'data', 'blog-posts.json');
const REPORT_FILE = path.join(__dirname, '..', '.tmp', 'internal-link-health-report.md');

// Valid categories
const VALID_CATEGORIES = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];

// Link patterns
const TOOL_LINK_PATTERN = /\[\[link:\/tools\/(\d+)\|([^\]]+)\]\]/g;
const BLOG_LINK_PATTERN = /\[\[link:\/blog\/([^|\]]+)\|([^\]]+)\]\]/g;
const CATEGORY_LINK_PATTERN = /\[\[link:\/category\/([^|\]]+)\|([^\]]+)\]\]/g;

function checkInternalLinks() {
  console.log('🔍 Starting Internal Link Health Check...\n');
  
  // Read data files
  let tools, blogPosts;
  try {
    const toolsData = fs.readFileSync(TOOLS_FILE, 'utf8');
    tools = JSON.parse(toolsData);
    
    const blogData = fs.readFileSync(BLOG_FILE, 'utf8');
    blogPosts = JSON.parse(blogData);
  } catch (err) {
    console.error('❌ Failed to read data files:', err.message);
    process.exit(1);
  }
  
  // Build lookup maps
  const toolIds = new Set(tools.map(t => t.id));
  const toolNames = new Map(tools.map(t => [t.name.toLowerCase(), t.id]));
  const blogSlugs = new Set(blogPosts.map(p => p.slug));
  
  console.log(`📊 Loaded ${tools.length} tools and ${blogPosts.length} blog posts\n`);
  
  // Check each blog post for link issues
  const issues = [];
  let totalToolLinks = 0;
  let totalBlogLinks = 0;
  let totalCategoryLinks = 0;
  
  blogPosts.forEach(post => {
    const content = post.content;
    const blogTitle = post.title;
    const blogSlug = post.slug;
    
    // Check tool links
    let match;
    const foundToolIds = new Set();
    while ((match = TOOL_LINK_PATTERN.exec(content)) !== null) {
      totalToolLinks++;
      const toolId = parseInt(match[1]);
      if (!toolIds.has(toolId)) {
        issues.push({
          type: 'broken_tool_link',
          blog: blogTitle,
          blogSlug,
          link: match[0],
          toolId,
          message: `Tool ID ${toolId} not found in tools.json`
        });
      } else {
        foundToolIds.add(toolId);
      }
    }
    
    // Check blog links
    while ((match = BLOG_LINK_PATTERN.exec(content)) !== null) {
      totalBlogLinks++;
      const linkedSlug = match[1];
      if (!blogSlugs.has(linkedSlug)) {
        issues.push({
          type: 'broken_blog_link',
          blog: blogTitle,
          blogSlug,
          link: match[0],
          linkedSlug,
          message: `Blog slug "${linkedSlug}" not found in blog-posts.json`
        });
      }
    }
    
    // Check category links
    while ((match = CATEGORY_LINK_PATTERN.exec(content)) !== null) {
      totalCategoryLinks++;
      const categorySlug = match[1].toLowerCase();
      if (!VALID_CATEGORIES.map(c => c.toLowerCase()).includes(categorySlug)) {
        issues.push({
          type: 'invalid_category_link',
          blog: blogTitle,
          blogSlug,
          link: match[0],
          categorySlug,
          message: `Invalid category "${categorySlug}"`
        });
      }
    }
  });
  
  console.log(`📈 Link Statistics:\n`);
  console.log(`   - Tool links found: ${totalToolLinks}`);
  console.log(`   - Blog links found: ${totalBlogLinks}`);
  console.log(`   - Category links found: ${totalCategoryLinks}`);
  console.log(`   - Issues found: ${issues.length}\n`);
  
  // Generate report
  let report = `# Internal Link Health Report

Generated: ${new Date().toISOString()}

## Summary

| Metric | Count |
|:---|---:|
| Blog Posts Checked | ${blogPosts.length} |
| Tools in Database | ${tools.length} |
| Tool Links | ${totalToolLinks} |
| Blog Links | ${totalBlogLinks} |
| Category Links | ${totalCategoryLinks} |
| **Issues Found** | **${issues.length}** |

## Valid Categories

${VALID_CATEGORIES.map(c => `- ${c}`).join('\n')}

`;
  
  // Group issues by type
  const issuesByType = {
    broken_tool_link: issues.filter(i => i.type === 'broken_tool_link'),
    broken_blog_link: issues.filter(i => i.type === 'broken_blog_link'),
    invalid_category_link: issues.filter(i => i.type === 'invalid_category_link')
  };
  
  if (issuesByType.broken_tool_link.length > 0) {
    report += `\n## ❌ Broken Tool Links\n\n`;
    report += `| Blog Post | Tool ID | Issue |\n`;
    report += `|:---|:---:|:---|\n`;
    issuesByType.broken_tool_link.forEach(i => {
      report += `| ${i.blog} | ${i.toolId} | ${i.message} |\n`;
    });
  }
  
  if (issuesByType.broken_blog_link.length > 0) {
    report += `\n## ❌ Broken Blog Links\n\n`;
    report += `| Blog Post | Linked Slug | Issue |\n`;
    report += `|:---|:---|:---|\n`;
    issuesByType.broken_blog_link.forEach(i => {
      report += `| ${i.blog} | \`${i.linkedSlug}\` | ${i.message} |\n`;
    });
  }
  
  if (issuesByType.invalid_category_link.length > 0) {
    report += `\n## ⚠️ Invalid Category Links\n\n`;
    report += `| Blog Post | Category | Issue |\n`;
    report += `|:---|:---|:---|\n`;
    issuesByType.invalid_category_link.forEach(i => {
      report += `| ${i.blog} | \`${i.categorySlug}\` | ${i.message} |\n`;
    });
  }
  
  // Tool coverage analysis
  const toolReferenceCount = new Map();
  blogPosts.forEach(post => {
    let match;
    const regex = /\[\[link:\/tools\/(\d+)\|/g;
    while ((match = regex.exec(post.content)) !== null) {
      const toolId = parseInt(match[1]);
      toolReferenceCount.set(toolId, (toolReferenceCount.get(toolId) || 0) + 1);
    }
  });
  
  // Find tools not referenced in any blog
  const unreferencedTools = tools.filter(t => !toolReferenceCount.has(t.id));
  
  report += `\n## 📊 Tool Reference Analysis\n\n`;
  report += `Tools referenced in blogs: ${tools.length - unreferencedTools.length}\n`;
  report += `Tools NOT referenced: ${unreferencedTools.length}\n\n`;
  
  if (unreferencedTools.length > 0 && unreferencedTools.length <= 20) {
    report += `Unreferenced tools:\n\n`;
    report += `| Tool ID | Name | Category |\n`;
    report += `|:---:|:---|:---|\n`;
    unreferencedTools.forEach(t => {
      report += `| ${t.id} | ${t.name} | ${t.category} |\n`;
    });
  } else if (unreferencedTools.length > 20) {
    report += `Too many unreferenced tools to list (${unreferencedTools.length}).\n`;
  }
  
  // Most referenced tools
  const sortedToolRefs = [...toolReferenceCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  if (sortedToolRefs.length > 0) {
    report += `\n## 🏆 Most Referenced Tools\n\n`;
    report += `| Rank | Tool ID | Name | References |\n`;
    report += `|:---:|:---:|:---|:---:|\n`;
    sortedToolRefs.forEach(([toolId, count], index) => {
      const tool = tools.find(t => t.id === toolId);
      report += `| ${index + 1} | ${toolId} | ${tool?.name || 'Unknown'} | ${count} |\n`;
    });
  }
  
  // Write report
  fs.writeFileSync(REPORT_FILE, report, 'utf8');
  
  // Console output
  console.log(`📄 Report saved to: ${REPORT_FILE}\n`);
  
  if (issues.length === 0) {
    console.log('✅ All internal links are valid!');
  } else {
    console.log(`❌ Found ${issues.length} link issues:`);
    if (issuesByType.broken_tool_link.length > 0) {
      console.log(`   - ${issuesByType.broken_tool_link.length} broken tool links`);
    }
    if (issuesByType.broken_blog_link.length > 0) {
      console.log(`   - ${issuesByType.broken_blog_link.length} broken blog links`);
    }
    if (issuesByType.invalid_category_link.length > 0) {
      console.log(`   - ${issuesByType.invalid_category_link.length} invalid category links`);
    }
  }
  
  process.exit(issues.length > 0 ? 1 : 0);
}

checkInternalLinks();
