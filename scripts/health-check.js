const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'data', 'blog-posts');
const toolsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tools.json'), 'utf-8'));
const toolIds = new Set(toolsData.map(t => t.id));
const toolSlugs = new Set(toolsData.map(t => t.name.toLowerCase().replace(/\s+/g, '-')));

const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.json'));
const blogSlugs = new Set(blogFiles.map(f => f.replace('.json', '')));

let brokenLinks = 0;
let fixedLinks = 0;
let missingFields = 0;
let fixedFields = 0;

// Step 1: Check internal links in articles
blogFiles.forEach(fileName => {
  const filePath = path.join(blogDir, fileName);
  let article = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let modified = false;

  if (article.content) {
    // Check [[link:/tools/XX|...]] 
    const toolLinkRegex = /\[\[link:\/tools\/(\d+)\|([^\]]+)\]\]/g;
    let match;
    while ((match = toolLinkRegex.exec(article.content)) !== null) {
      const toolId = parseInt(match[1]);
      if (!toolIds.has(toolId)) {
        article.content = article.content.replace(match[0], match[2]);
        modified = true;
        brokenLinks++;
        fixedLinks++;
      }
    }

    // Check [[link:/blog/XXX|...]]
    const blogLinkRegex = /\[\[link:\/blog\/([^\|]+)\|([^\]]+)\]\]/g;
    while ((match = blogLinkRegex.exec(article.content)) !== null) {
      if (!blogSlugs.has(match[1])) {
        article.content = article.content.replace(match[0], match[2]);
        modified = true;
        brokenLinks++;
        fixedLinks++;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf-8');
  }
});

// Step 2: Check tool data integrity
toolsData.forEach((tool, index) => {
  const required = ['name', 'url', 'category', 'description'];
  required.forEach(field => {
    if (!tool[field] || (typeof tool[field] === 'string' && !tool[field].trim())) {
      missingFields++;
      if (field === 'url') {
        tool[field] = `https://${tool.name.toLowerCase().replace(/\s+/g, '-')}.com`;
        fixedFields++;
      } else if (field === 'description') {
        tool[field] = `${tool.name} - AI-powered ${tool.category || 'productivity'} tool.`;
        fixedFields++;
      }
    }
  });

  // Check URL format
  if (tool.url && !tool.url.startsWith('http')) {
    tool.url = `https://${tool.url}`;
    fixedFields++;
  }
});

if (fixedFields > 0) {
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'tools.json'), JSON.stringify(toolsData, null, 2), 'utf-8');
}

console.log(`🔍 Health Check Results:`);
console.log(`   Broken links found: ${brokenLinks}`);
console.log(`   Broken links fixed: ${fixedLinks}`);
console.log(`   Missing fields found: ${missingFields}`);
console.log(`   Missing fields fixed: ${fixedFields}`);
console.log(`   Articles scanned: ${blogFiles.length}`);
console.log(`   Tools scanned: ${toolsData.length}`);
