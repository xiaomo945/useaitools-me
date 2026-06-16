#!/usr/bin/env node

/**
 * Fix Broken Tool Links Script
 *
 * Scans blog posts for [[link:/tools/ID|Name]] patterns where the tool ID
 * doesn't exist in tools.json, and replaces them with category-appropriate
 * links like [[link:/category/writing|Name]].
 *
 * Usage: node scripts/fix-broken-tool-links.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const BLOG_DIR = path.join(__dirname, '..', 'data', 'blog-posts');

const TOOL_LINK_PATTERN = /\[\[link:\/tools\/(\d+)\|([^\]]+)\]\]/g;

const CATEGORY_SLUG_MAP = {
  Writing: 'writing',
  Image: 'image',
  Productivity: 'productivity',
  Code: 'code',
  Audio: 'audio',
  Video: 'video',
};

function main() {
  console.log('🔧 Fix Broken Tool Links\n');

  // 1. Read valid tool IDs
  let tools;
  try {
    tools = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
  } catch (err) {
    console.error('❌ Failed to read tools.json:', err.message);
    process.exit(1);
  }
  const validToolIds = new Set(tools.map((t) => t.id));
  console.log(`📋 Loaded ${validToolIds.size} valid tool IDs\n`);

  // 2. Read all blog post files
  let blogFiles;
  try {
    blogFiles = fs
      .readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith('.json'));
  } catch (err) {
    console.error('❌ Failed to read blog-posts directory:', err.message);
    process.exit(1);
  }
  console.log(`📄 Found ${blogFiles.length} blog post files\n`);

  // 3. Process each blog post
  let totalFixed = 0;
  const fixDetails = [];

  for (const file of blogFiles) {
    const filePath = path.join(BLOG_DIR, file);
    let post;
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      post = JSON.parse(raw);
    } catch (err) {
      console.error(`⚠️  Skipping ${file}: parse error — ${err.message}`);
      continue;
    }

    const content = post.content;
    if (!content) continue;

    const category = post.category;
    const categorySlug = CATEGORY_SLUG_MAP[category] || 'productivity';

    let modified = false;
    let fileFixCount = 0;

    // Replace broken tool links
    const newContent = content.replace(
      TOOL_LINK_PATTERN,
      (match, toolIdStr, toolName) => {
        const toolId = parseInt(toolIdStr, 10);
        if (!validToolIds.has(toolId)) {
          const replacement = `[[link:/category/${categorySlug}|${toolName}]]`;
          fixDetails.push({
            file,
            blogTitle: post.title || '(untitled)',
            category: category || '(none)',
            brokenLink: match,
            toolId,
            replacement,
          });
          fileFixCount++;
          modified = true;
          return replacement;
        }
        return match;
      }
    );

    if (modified) {
      post.content = newContent;
      try {
        fs.writeFileSync(filePath, JSON.stringify(post, null, 2) + '\n', 'utf8');
        totalFixed += fileFixCount;
        console.log(
          `  ✅ ${file}: fixed ${fileFixCount} broken link${fileFixCount > 1 ? 's' : ''}`
        );
      } catch (err) {
        console.error(`  ❌ ${file}: write error — ${err.message}`);
      }
    }
  }

  // 4. Print summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 Summary');
  console.log('═'.repeat(60));
  console.log(`  Blog posts scanned : ${blogFiles.length}`);
  console.log(`  Valid tool IDs     : ${validToolIds.size}`);
  console.log(`  Links fixed        : ${totalFixed}`);

  if (fixDetails.length > 0) {
    console.log('\n📝 Fix Details:\n');
    for (const d of fixDetails) {
      console.log(`  File    : ${d.file}`);
      console.log(`  Blog    : ${d.blogTitle}`);
      console.log(`  Category: ${d.category}`);
      console.log(`  Broken  : ${d.brokenLink} (ID ${d.toolId} not found)`);
      console.log(`  Fixed   : ${d.replacement}`);
      console.log('');
    }
  } else {
    console.log('\n✅ No broken tool links found!');
  }
}

main();
