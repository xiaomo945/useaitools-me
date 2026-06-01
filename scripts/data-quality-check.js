const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'data', 'blog-posts');
const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
const tmpDir = path.join(__dirname, '..', '.tmp');

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

// Article dedup
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.json'));
const titleMap = new Map();
const slugMap = new Map();
const duplicateArticles = [];

blogFiles.forEach(fileName => {
  try {
    const article = JSON.parse(fs.readFileSync(path.join(blogDir, fileName), 'utf-8'));
    const title = (article.title || '').trim().toLowerCase();
    const slug = (article.slug || '').trim().toLowerCase();
    
    if (titleMap.has(title)) {
      duplicateArticles.push({
        type: 'title',
        value: article.title,
        file1: titleMap.get(title),
        file2: fileName
      });
    } else {
      titleMap.set(title, fileName);
    }
    
    if (slugMap.has(slug)) {
      duplicateArticles.push({
        type: 'slug',
        value: slug,
        file1: slugMap.get(slug),
        file2: fileName
      });
    } else {
      slugMap.set(slug, fileName);
    }
  } catch (e) {}
});

// Fix duplicates by renaming slug
let fixedArticles = 0;
duplicateArticles.forEach(dup => {
  if (dup.type === 'slug') {
    const filePath = path.join(blogDir, dup.file2);
    try {
      const article = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const newSlug = article.slug + '-' + article.id;
      article.slug = newSlug;
      fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf-8');
      
      const oldPath = filePath;
      const newPath = path.join(blogDir, newSlug + '.json');
      if (oldPath !== newPath && !fs.existsSync(newPath)) {
        fs.renameSync(oldPath, newPath);
      }
      fixedArticles++;
    } catch (e) {}
  }
});

const articleReport = [
  '# Duplicate Articles Report',
  `- Total articles: ${blogFiles.length}`,
  `- Duplicate titles: ${duplicateArticles.filter(d => d.type === 'title').length}`,
  `- Duplicate slugs: ${duplicateArticles.filter(d => d.type === 'slug').length}`,
  `- Fixed slugs: ${fixedArticles}`,
  '',
  '## Details',
  ...duplicateArticles.map(d => `- ${d.type}: "${d.value}" in ${d.file1} and ${d.file2}`)
];
fs.writeFileSync(path.join(tmpDir, 'duplicate-articles-report.md'), articleReport.join('\n'), 'utf-8');

// Tool dedup
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));
const toolNameMap = new Map();
const toolUrlMap = new Map();
const duplicateTools = [];

tools.forEach((tool, index) => {
  const name = (tool.name || '').trim().toLowerCase();
  const url = (tool.url || '').trim().toLowerCase();
  
  if (toolNameMap.has(name)) {
    duplicateTools.push({
      type: 'name',
      value: tool.name,
      index1: toolNameMap.get(name),
      index2: index
    });
  } else {
    toolNameMap.set(name, index);
  }
  
  if (url && toolUrlMap.has(url)) {
    duplicateTools.push({
      type: 'url',
      value: tool.url,
      index1: toolUrlMap.get(url),
      index2: index
    });
  } else {
    toolUrlMap.set(url, index);
  }
});

// Remove duplicate tools (keep first occurrence)
let fixedTools = 0;
const indicesToRemove = new Set();
duplicateTools.forEach(dup => {
  if (dup.type === 'name') {
    indicesToRemove.add(dup.index2);
    fixedTools++;
  }
});

if (indicesToRemove.size > 0) {
  const cleanedTools = tools.filter((_, i) => !indicesToRemove.has(i));
  fs.writeFileSync(toolsPath, JSON.stringify(cleanedTools, null, 2), 'utf-8');
}

const toolReport = [
  '# Duplicate Tools Report',
  `- Total tools: ${tools.length}`,
  `- Duplicate names: ${duplicateTools.filter(d => d.type === 'name').length}`,
  `- Duplicate URLs: ${duplicateTools.filter(d => d.type === 'url').length}`,
  `- Removed duplicates: ${fixedTools}`,
  `- Final tool count: ${tools.length - fixedTools}`,
  '',
  '## Details',
  ...duplicateTools.map(d => `- ${d.type}: "${d.value}" at indices ${d.index1} and ${d.index2}`)
];
fs.writeFileSync(path.join(tmpDir, 'duplicate-tools-report.md'), toolReport.join('\n'), 'utf-8');

console.log('📊 Data Quality Report:');
console.log(`   Articles: ${blogFiles.length} total, ${duplicateArticles.filter(d => d.type === 'title').length} dup titles, ${duplicateArticles.filter(d => d.type === 'slug').length} dup slugs, ${fixedArticles} fixed`);
console.log(`   Tools: ${tools.length} total, ${duplicateTools.filter(d => d.type === 'name').length} dup names, ${fixedTools} removed`);
console.log(`   Final tools: ${tools.length - fixedTools}`);
