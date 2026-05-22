const fs = require('fs');

const tools = JSON.parse(fs.readFileSync('data/tools.json', 'utf8'));
const blogs = JSON.parse(fs.readFileSync('data/blog-posts.json', 'utf8'));
const now = new Date();

function hasAffiliate(tool) {
  return !!(tool.affiliate_link);
}

function getBlogAgeDays(dateStr) {
  const date = new Date(dateStr);
  return Math.floor((now - date) / (1000 * 60 * 60 * 24));
}

function getBlogPriority(days) {
  if (days <= 30) return '0.8';
  if (days <= 90) return '0.6';
  return '0.4';
}

function getBlogChangefreq(days) {
  if (days < 90) return 'weekly';
  return 'monthly';
}

const categories = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];
const categoryTools = {};
categories.forEach(cat => {
  categoryTools[cat] = tools.filter(t => t.category === cat);
});

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->
  <url>
    <loc>https://useaitools.me/</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://useaitools.me/search</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://useaitools.me/compare</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://useaitools.me/leaderboard</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://useaitools.me/blog</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://useaitools.me/about</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://useaitools.me/affiliate-disclosure</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://useaitools.me/submit</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://useaitools.me/feed.xml</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Category Pages -->
`;

categories.forEach(cat => {
  const slug = cat.toLowerCase();
  const count = categoryTools[cat].length;
  xml += `  <url>
    <loc>https://useaitools.me/category/${slug}</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;
});

xml += `
  <!-- Compare Pages -->
`;

categories.forEach(cat => {
  const slug = cat.toLowerCase();
  xml += `  <url>
    <loc>https://useaitools.me/compare/${slug}</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

xml += `
  <!-- Tool Detail Pages -->
`;

tools.forEach(tool => {
  const affiliate = hasAffiliate(tool);
  const priority = affiliate ? '0.9' : '0.7';
  xml += `  <url>
    <loc>https://useaitools.me/tools/${tool.id}</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
`;
});

xml += `
  <!-- Blog Posts -->
`;

blogs.forEach(blog => {
  const days = getBlogAgeDays(blog.date);
  const priority = getBlogPriority(days);
  const changefreq = getBlogChangefreq(days);
  xml += `  <url>
    <loc>https://useaitools.me/blog/${blog.slug}</loc>
    <lastmod>${blog.date}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
});

xml += `</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xml);

// Calculate stats
const totalUrls = 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + // core
  categories.length + // categories
  categories.length + // compare
  tools.length + // tools
  blogs.length; // blogs

const affiliateCount = tools.filter(hasAffiliate).length;
const nonAffiliateCount = tools.length - affiliateCount;
const recentBlogs = blogs.filter(b => getBlogAgeDays(b.date) <= 30).length;
const mediumBlogs = blogs.filter(b => { const d = getBlogAgeDays(b.date); return d > 30 && d <= 90; }).length;
const oldBlogs = blogs.filter(b => getBlogAgeDays(b.date) > 90).length;

console.log('=== Sitemap 优化完成 ===');
console.log('总 URL 数:', totalUrls);
console.log('');
console.log('按类型分布:');
console.log('  核心页面:     9 条');
console.log('  分类页面:    ', categories.length, '条');
console.log('  对比页面:    ', categories.length, '条');
console.log('  工具详情页:  ', tools.length, '条 (有联盟:', affiliateCount, ', 无联盟:', nonAffiliateCount, ')');
console.log('  博客文章:    ', blogs.length, '条 (≤30天:', recentBlogs, ', 30-90天:', mediumBlogs, ', >90天:', oldBlogs, ')');
console.log('');
console.log('优先级分布:');
console.log('  1.0:  1 (首页)');
console.log('  0.9: ', categories.length + affiliateCount, '条');
console.log('  0.8:  ~', 5 + categories.length + recentBlogs, '条');
console.log('  0.7:  ~', nonAffiliateCount, '条');
console.log('  0.6:  ~', mediumBlogs, '条');
console.log('  0.5:  ~2 (固定页)');
console.log('  0.4:  ~', oldBlogs, '条');
