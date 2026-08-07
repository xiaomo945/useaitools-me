const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const existing = new Set();
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else existing.add('/' + path.relative(publicDir, p).split(path.sep).join('/'));
  }
}
walk(publicDir);

const missing = [];
const placeholders = [];

function checkFile(p, ctx) {
  if (!p) return;
  if (p.startsWith('http://') || p.startsWith('https://')) return;
  if (p.includes('placehold.co')) { placeholders.push({ p, ctx }); return; }
  const norm = p.split('?')[0];
  if (!existing.has(norm)) missing.push({ path: norm, ctx });
}

// Tools
const tools = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'tools.json'), 'utf8'));
let missingExamples = 0;
for (const t of tools) {
  for (const ex of (t.examples || [])) {
    missingExamples++;
    checkFile(ex.image_url, `tool ${t.id} ${t.name} example`);
  }
  checkFile(t.icon_url, `tool ${t.id} ${t.name} icon`);
}

// Blog posts
const postsDir = path.join(process.cwd(), 'data', 'blog-posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.json'));
for (const file of files) {
  const post = JSON.parse(fs.readFileSync(path.join(postsDir, file), 'utf8'));
  for (const img of (post.images || [])) {
    checkFile(img.url, `blog ${post.id} ${post.slug}`);
  }
}

console.log('Existing public assets:', existing.size);
console.log('Tools:', tools.length, '| Examples:', missingExamples, ' | Placeholders:', placeholders.filter(x => x.ctx.includes('tool')).length);
console.log('Missing files:', missing.length);
for (const m of missing.slice(0, 30)) console.log('  MISS:', m.path, '::', m.ctx);
if (missing.length > 30) console.log(`  ... plus ${missing.length - 30} more`);
