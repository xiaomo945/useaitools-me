
const fs = require('fs');
const path = require('path');

// Load tools from data/tools.json
function loadTools() {
  const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
  if (fs.existsSync(toolsPath)) {
    const data = fs.readFileSync(toolsPath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// Load blog posts from data/blog-posts directory
function loadBlogPosts() {
  const blogPostsDir = path.join(__dirname, '..', 'data', 'blog-posts');
  
  if (!fs.existsSync(blogPostsDir)) {
    return [];
  }

  const files = fs.readdirSync(blogPostsDir)
    .filter(file => file.endsWith('.json'));

  const posts = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(blogPostsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const post = JSON.parse(content);
      posts.push(post);
    } catch (error) {
      console.error(`⚠️ 无法加载博客文件: ${file}`, error);
    }
  }
  
  return posts;
}

// Generate sitemap XML
function generateSitemap() {
  const today = '2026-05-30';
  const tools = loadTools();
  const blogPosts = loadBlogPosts();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Fixed pages
  const fixedPages = [
    { url: 'https://useaitools.me', priority: 1.0 },
    { url: 'https://useaitools.me/blog', priority: 0.9 },
    { url: 'https://useaitools.me/compare', priority: 0.8 },
    { url: 'https://useaitools.me/category/writing', priority: 0.85 },
    { url: 'https://useaitools.me/category/image', priority: 0.85 },
    { url: 'https://useaitools.me/category/code', priority: 0.85 },
    { url: 'https://useaitools.me/category/audio', priority: 0.85 },
    { url: 'https://useaitools.me/category/video', priority: 0.85 },
    { url: 'https://useaitools.me/category/productivity', priority: 0.85 }
  ];
  
  fixedPages.forEach(page => {
    xml += `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Tool pages
  tools.forEach(tool => {
    xml += `  <url>
    <loc>https://useaitools.me/tools/${tool.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // Blog post pages
  blogPosts.forEach(post => {
    xml += `  <url>
    <loc>https://useaitools.me/blog/${post.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  xml += `</urlset>`;
  return xml;
}

// Write to public/sitemap.xml
const sitemapXml = generateSitemap();
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemapXml, 'utf8');
console.log('✅ Static sitemap generated successfully!');
