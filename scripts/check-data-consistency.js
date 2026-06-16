#!/usr/bin/env node

/**
 * Data Consistency Check Script
 * 
 * This script checks consistency between:
 * - tools.json and blog posts references
 * - Category consistency
 * - Tool IDs referenced in blogs
 * 
 * Usage: node scripts/check-data-consistency.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const BLOG_FILE = path.join(__dirname, '..', 'data', 'blog-posts.json');
const REPORT_FILE = path.join(__dirname, '..', '.tmp', 'data-consistency-report.md');

// Valid categories
const VALID_CATEGORIES = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];

// Link patterns
const TOOL_LINK_PATTERN = /\[\[link:\/tools\/(\d+)\|([^\]]+)\]\]/g;
const BLOG_LINK_PATTERN = /\[\[link:\/blog\/([^|\]]+)\|/g;
const CATEGORY_LINK_PATTERN = /\[\[link:\/category\/([^|\]]+)\|/g;

function checkDataConsistency() {
  console.log('🔍 Starting Data Consistency Check...\n');
  
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
  
  console.log(`📊 Loaded ${tools.length} tools and ${blogPosts.length} blog posts\n`);
  
  // Build lookup maps
  const toolIds = new Set(tools.map(t => t.id));
  const toolNames = new Map(tools.map(t => [t.name.toLowerCase(), t]));
  const blogSlugs = new Set(blogPosts.map(p => p.slug));
  const categoryCounts = {};
  VALID_CATEGORIES.forEach(c => categoryCounts[c] = 0);
  tools.forEach(t => {
    if (VALID_CATEGORIES.includes(t.category)) {
      categoryCounts[t.category]++;
    }
  });
  
  // Issues tracking
  const issues = [];
  const warnings = [];
  const stats = {
    toolLinks: 0,
    blogLinks: 0,
    categoryLinks: 0,
    toolIdsFound: new Set(),
    referencedToolIds: new Set(),
    unreferencedTools: [],
    orphanToolIds: new Set()
  };
  
  // Check each blog post
  blogPosts.forEach(post => {
    const content = post.content;
    let match;
    
    // Check tool links
    while ((match = TOOL_LINK_PATTERN.exec(content)) !== null) {
      stats.toolLinks++;
      const toolId = parseInt(match[1]);
      const toolName = match[2];
      stats.referencedToolIds.add(toolId);
      
      if (!toolIds.has(toolId)) {
        issues.push({
          type: 'broken_tool_reference',
          blog: post.title,
          toolId,
          toolName,
          message: `Blog references tool ID ${toolId} (${toolName}) which doesn't exist in tools.json`
        });
      } else {
        stats.toolIdsFound.add(toolId);
        const tool = tools.find(t => t.id === toolId);
        if (tool && tool.name.toLowerCase() !== toolName.toLowerCase()) {
          warnings.push({
            type: 'tool_name_mismatch',
            blog: post.title,
            toolId,
            expected: tool.name,
            found: toolName,
            message: `Blog uses "${toolName}" but tool is named "${tool.name}"`
          });
        }
      }
    }
    
    // Check blog links
    while ((match = BLOG_LINK_PATTERN.exec(content)) !== null) {
      stats.blogLinks++;
      const linkedSlug = match[1];
      if (!blogSlugs.has(linkedSlug)) {
        issues.push({
          type: 'broken_blog_reference',
          blog: post.title,
          linkedSlug,
          message: `Blog links to "${linkedSlug}" which doesn't exist`
        });
      }
    }
    
    // Check category links
    while ((match = CATEGORY_LINK_PATTERN.exec(content)) !== null) {
      stats.categoryLinks++;
      const categorySlug = match[1].toLowerCase();
      const validSlug = VALID_CATEGORIES.find(c => c.toLowerCase() === categorySlug);
      if (!validSlug) {
        warnings.push({
          type: 'invalid_category_reference',
          blog: post.title,
          categorySlug,
          message: `Blog links to invalid category "${categorySlug}"`
        });
      }
    }
  });
  
  // Find unreferenced tools (tools not linked in any blog)
  tools.forEach(tool => {
    if (!stats.referencedToolIds.has(tool.id)) {
      stats.unreferencedTools.push(tool);
    }
  });
  
  // Find orphan tool IDs (referenced but not existing)
  stats.referencedToolIds.forEach(id => {
    if (!toolIds.has(id)) {
      stats.orphanToolIds.add(id);
    }
  });
  
  console.log('📈 Statistics:\n');
  console.log(`   - Tool links: ${stats.toolLinks}`);
  console.log(`   - Blog links: ${stats.blogLinks}`);
  console.log(`   - Category links: ${stats.categoryLinks}`);
  console.log(`   - Tools referenced in blogs: ${stats.referencedToolIds.size}`);
  console.log(`   - Unreferenced tools: ${stats.unreferencedTools.length}`);
  console.log('');
  
  // Generate report
  let report = `# Data Consistency Report

Generated: ${new Date().toISOString()}

## Summary

| Metric | Count |
|:---|---:|
| Total Tools | ${tools.length} |
| Total Blog Posts | ${blogPosts.length} |
| Tool Links | ${stats.toolLinks} |
| Blog Links | ${stats.blogLinks} |
| Category Links | ${stats.categoryLinks} |
| **Issues** | **${issues.length}** |
| **Warnings** | **${warnings.length}** |

## Category Distribution

| Category | Tool Count |
|:---|---:|
${Object.entries(categoryCounts).map(([cat, count]) => `| ${cat} | ${count} |`).join('\n')}

## Issues

`;
  
  if (issues.length === 0) {
    report += '\n✅ No issues found!\n';
  } else {
    const brokenToolRefs = issues.filter(i => i.type === 'broken_tool_reference');
    const brokenBlogRefs = issues.filter(i => i.type === 'broken_blog_reference');
    
    if (brokenToolRefs.length > 0) {
      report += `\n### ❌ Broken Tool References\n\n`;
      report += `| Blog Post | Tool ID | Tool Name |\n`;
      report += `|:---|:---:|:---|\n`;
      brokenToolRefs.forEach(i => {
        report += `| ${i.blog} | ${i.toolId} | ${i.toolName} |\n`;
      });
    }
    
    if (brokenBlogRefs.length > 0) {
      report += `\n### ❌ Broken Blog References\n\n`;
      report += `| Blog Post | Linked Slug |\n`;
      report += `|:---|:---|\n`;
      brokenBlogRefs.forEach(i => {
        report += `| ${i.blog} | \`${i.linkedSlug}\` |\n`;
      });
    }
  }
  
  report += `\n## Warnings\n\n`;
  
  if (warnings.length === 0) {
    report += '\n✅ No warnings!\n';
  } else {
    const nameMismatches = warnings.filter(w => w.type === 'tool_name_mismatch');
    const invalidCategories = warnings.filter(w => w.type === 'invalid_category_reference');
    
    if (nameMismatches.length > 0) {
      report += `\n### ⚠️ Tool Name Mismatches\n\n`;
      report += `| Blog Post | Tool ID | Expected | Found |\n`;
      report += `|:---|:---:|:---|:---|\n`;
      nameMismatches.forEach(w => {
        report += `| ${w.blog} | ${w.toolId} | ${w.expected} | ${w.found} |\n`;
      });
    }
    
    if (invalidCategories.length > 0) {
      report += `\n### ⚠️ Invalid Category References\n\n`;
      report += `| Blog Post | Category |\n`;
      report += `|:---|:---|\n`;
      invalidCategories.forEach(w => {
        report += `| ${w.blog} | \`${w.categorySlug}\` |\n`;
      });
    }
  }
  
  report += `\n## Tool Coverage Analysis\n\n`;
  report += `Tools referenced in blogs: ${stats.referencedToolIds.size}\n`;
  report += `Tools NOT referenced: ${stats.unreferencedTools.length}\n\n`;
  
  // Top unreferenced tools (those with ratings are most valuable)
  const ratedUnreferenced = stats.unreferencedTools
    .filter(t => t.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);
  
  if (ratedUnreferenced.length > 0) {
    report += `**High-value unreferenced tools (with ratings):**\n\n`;
    report += `| Tool ID | Name | Category | Rating |\n`;
    report += `|:---:|:---|:---:|:---:|\n`;
    ratedUnreferenced.forEach(t => {
      report += `| ${t.id} | ${t.name} | ${t.category} | ${t.rating || 'N/A'} |\n`;
    });
  }
  
  // Most referenced tools
  const toolRefCount = new Map();
  blogPosts.forEach(post => {
    let match;
    const regex = /\[\[link:\/tools\/(\d+)\|/g;
    while ((match = regex.exec(post.content)) !== null) {
      const id = parseInt(match[1]);
      toolRefCount.set(id, (toolRefCount.get(id) || 0) + 1);
    }
  });
  
  const topReferenced = [...toolRefCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  if (topReferenced.length > 0) {
    report += `\n**Most referenced tools:**\n\n`;
    report += `| Rank | Tool ID | Name | References |\n`;
    report += `|:---:|:---:|:---|:---:|\n`;
    topReferenced.forEach(([id, count], idx) => {
      const tool = tools.find(t => t.id === id);
      report += `| ${idx + 1} | ${id} | ${tool?.name || 'Unknown'} | ${count} |\n`;
    });
  }
  
  // Write report
  fs.writeFileSync(REPORT_FILE, report, 'utf8');
  
  // Console output
  console.log(`📄 Report saved to: ${REPORT_FILE}\n`);
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log('✅ All data is consistent!');
  } else {
    if (issues.length > 0) {
      console.log(`❌ Found ${issues.length} issue(s)`);
    }
    if (warnings.length > 0) {
      console.log(`⚠️ Found ${warnings.length} warning(s)`);
    }
  }
  
  process.exit(issues.length > 0 ? 1 : 0);
}

checkDataConsistency();
