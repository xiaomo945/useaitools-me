const fs = require('fs');
const path = require('path');

// Scan only, no changes
function scanDuplicates() {
  console.log('🔍 Scanning for duplicate images...\n');
  
  const blogPostsDir = path.join(__dirname, '..', 'data', 'blog-posts');
  const imageUrlMap = new Map();
  const logLines = [];
  let totalDuplicatesFound = 0;

  if (!fs.existsSync(blogPostsDir)) {
    console.log('⚠️  blog-posts directory not found');
    return;
  }

  const files = fs.readdirSync(blogPostsDir).filter(f => f.endsWith('.json'));
  console.log(`📝 Scanning ${files.length} articles...`);

  files.forEach((fileName) => {
    const filePath = path.join(blogPostsDir, fileName);
    let article;
    try {
      article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.log(`   ❌ Failed to parse ${fileName}`);
      return;
    }

    if (!article.images || !Array.isArray(article.images)) return;

    article.images.forEach((img) => {
      if (!img.url) return;
      if (!imageUrlMap.has(img.url)) {
        imageUrlMap.set(img.url, []);
      }
      imageUrlMap.get(img.url).push({
        articleId: article.id,
        articleTitle: article.title,
        articleFile: fileName,
        position: img.position || 'unknown'
      });
    });
  });

  console.log(`🔍 Found ${imageUrlMap.size} unique image URLs`);

  const duplicateGroups = [];
  for (const [url, occurrences] of imageUrlMap) {
    if (occurrences.length > 1) {
      duplicateGroups.push({ url, occurrences });
      totalDuplicatesFound += occurrences.length - 1;
    }
  }

  logLines.push('# Scan for Duplicate Images');
  logLines.push(`- Time: ${new Date().toISOString()}`);
  logLines.push(`- Total unique URLs: ${imageUrlMap.size}`);
  logLines.push(`- Total duplicates: ${totalDuplicatesFound}`);
  logLines.push(`- Duplicate groups: ${duplicateGroups.length}\n`);

  for (const group of duplicateGroups) {
    logLines.push(`## URL: ${group.url}`);
    logLines.push(`- Occurrences: ${group.occurrences.length}`);
    for (const occ of group.occurrences) {
      logLines.push(`  - Article: ${occ.articleId} (${occ.articleTitle}) - ${occ.position}`);
    }
    logLines.push('');
  }

  const tmpDir = path.join(__dirname, '..', '.tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  fs.writeFileSync(path.join(tmpDir, 'duplicate-scan-report.md'), logLines.join('\n'), 'utf8');

  if (duplicateGroups.length > 0) {
    console.log(`⚠️  Found ${duplicateGroups.length} groups, ${totalDuplicatesFound} duplicates`);
    console.log(`📄 Report saved to: .tmp/duplicate-scan-report.md`);
  } else {
    console.log('✅ No duplicates found!');
  }

  return duplicateGroups;
}

if (require.main === module) {
  scanDuplicates();
}

module.exports = { scanDuplicates };
