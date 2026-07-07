const fs = require('fs');
const path = require('path');

const baseUrl = 'https://useaitools.me';
const today = new Date().toISOString().split('T')[0];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateToolSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function addUrl(loc, priority, changefreq) {
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

// Load tools
const toolsPath = path.join(process.cwd(), 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

// Load blog posts
const blogPostsDir = path.join(process.cwd(), 'data', 'blog-posts');
const blogFiles = fs.readdirSync(blogPostsDir).filter(f => f.endsWith('.json'));
const blogPosts = blogFiles.map(f => JSON.parse(fs.readFileSync(path.join(blogPostsDir, f), 'utf8')));

const categories = ['Image', 'Writing', 'Code', 'Video', 'Productivity', 'Audio'];

const staticPages = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/blog', priority: '0.9', changefreq: 'weekly' },
  { path: '/compare', priority: '0.8', changefreq: 'weekly' },
  { path: '/search', priority: '0.7', changefreq: 'daily' },
  { path: '/saved', priority: '0.5', changefreq: 'weekly' },
  { path: '/scenes', priority: '0.7', changefreq: 'weekly' },
  { path: '/workflows', priority: '0.5', changefreq: 'monthly' },
  { path: '/leaderboard', priority: '0.6', changefreq: 'weekly' },
  { path: '/deals', priority: '0.6', changefreq: 'weekly' },
  { path: '/submit', priority: '0.3', changefreq: 'monthly' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'monthly' },
];

const urls = [];

// Static pages
for (const page of staticPages) {
  urls.push(addUrl(`${baseUrl}${page.path}`, page.priority, page.changefreq));
}

// Category pages
for (const category of categories) {
  urls.push(addUrl(`${baseUrl}/category/${category.toLowerCase()}`, '0.85', 'weekly'));
}

// Tool pages (both slug and id routes)
for (const tool of tools) {
  const slug = generateToolSlug(tool.name);
  urls.push(addUrl(`${baseUrl}/tool/${slug}`, '0.8', 'weekly'));
  urls.push(addUrl(`${baseUrl}/tools/${tool.id}`, '0.8', 'weekly'));
}

// Blog posts
for (const post of blogPosts) {
  if (post.slug) {
    urls.push(addUrl(`${baseUrl}/blog/${post.slug}`, '0.6', 'monthly'));
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

console.log(`Sitemap generated: ${outputPath}`);
console.log(`Total URLs: ${urls.length}`);
console.log(`Tools: ${tools.length}, Blog posts: ${blogPosts.length}`);
