#!/usr/bin/env node
/**
 * Add author field to blog posts that are missing it
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'data', 'blog-posts');

function main() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.json'));
  let updated = 0;
  let skipped = 0;

  files.forEach(file => {
    const filePath = path.join(BLOG_DIR, file);
    const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!post.author) {
      post.author = 'Use AI Tools Team';
      fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf-8');
      updated++;
    } else {
      skipped++;
    }
  });

  console.log(`Updated ${updated} posts with author field. Skipped ${skipped} that already had author.`);
}

main();
