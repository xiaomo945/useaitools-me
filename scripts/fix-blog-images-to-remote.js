const fs = require('fs');
const path = require('path');

const postsDir = path.join(process.cwd(), 'data', 'blog-posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.json'));

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Map of known local blog-images that actually exist on disk
const validLocal = new Set([
  '/blog-images/blog-1-cta.png',
  '/blog-images/blog-1-cta.webp',
  '/blog-images/blog-1-header.png',
  '/blog-images/blog-1-header.webp',
  '/blog-images/blog-1-mid.png',
  '/blog-images/blog-1-mid.webp',
  '/blog-images/rytr-vs-jasper-vs-copyai-comparison-table.jpg',
  '/blog-images/rytr-vs-jasper-vs-copyai-cta.jpg',
  '/blog-images/rytr-vs-jasper-vs-copyai-header.jpg',
]);

// Curated remote Unsplash themes (royalty-free, stable host already allowed in next.config)
const themes = {
  Writing: [
    'photo-1455390582262-044cdead277a', // typewriter
    'photo-1484480974693-6ca0a78fb36b', // notebook
    'photo-1456324504439-367cee3b3c32', // writing desk
  ],
  Video: [
    'photo-1492691527719-9d1e07e534b4', // cinema clapper
    'photo-1478720568477-152d9b164e26', // film roll
    'photo-1485846234645-a62644f84728', // film camera
  ],
  Audio: [
    'photo-1511379938547-c1f69419868d', // concert
    'photo-1514320291840-2e0a9bf2a9ae', // headphones
    'photo-1470225620780-dba8ba36b745', // headphones studio
  ],
  Image: [
    'photo-1513364776144-60967b0f800f', // color palette
    'photo-1502945015378-0e284ca1a5be', // camera
    'photo-1542744094-3a31f272c490', // painting
  ],
  Code: [
    'photo-1555066931-4365d14bab8c', // laptop code
    'photo-1517694712202-14dd9538aa97', // laptop
    'photo-1461749280684-dccba630e2f6', // matrix code
  ],
  Productivity: [
    'photo-1507925921958-8a62f3d1a50d', // office coffee
    'photo-1484480974693-6ca0a78fb36b', // notebook calendar
    'photo-1454165804606-c3d57bc86b40', // planner
  ],
};

function pickPhoto(category, index, seed) {
  const list = themes[category] || themes.Productivity;
  const id = list[(seed + index) % list.length];
  return `https://images.unsplash.com/${id}?w=1200&h=630&fit=crop`;
}

function altText(category, position, title) {
  const posMap = { header: 'header banner', mid: 'section illustration', cta: 'call-to-action visual' };
  return `${title} ${posMap[position] || position} – ${category} category`;
}

let changed = 0;
const missingIds = [];

for (const file of files) {
  const filePath = path.join(postsDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const post = JSON.parse(raw);
  let dirty = false;

  if (!post.images || post.images.length === 0) {
    const category = (post.category && themes[post.category]) ? post.category : 'Productivity';
    const seed = typeof post.id === 'number' ? post.id : parseInt(slugify(post.slug).replace(/\D/g, '').slice(-4) || '0', 10) || 1;
    post.images = [
      {
        url: pickPhoto(category, 0, seed),
        alt: altText(category, 'header', post.title),
        caption: `Illustration for ${post.title}`,
        position: 'header',
      },
      {
        url: pickPhoto(category, 1, seed),
        alt: altText(category, 'mid', post.title),
        caption: 'Mid-article visual supporting key points',
        position: 'mid',
      },
      {
        url: pickPhoto(category, 2, seed),
        alt: altText(category, 'cta', post.title),
        caption: 'Call to action section image',
        position: 'cta',
      },
    ];
    dirty = true;
  } else {
    for (let i = 0; i < post.images.length; i++) {
      const img = post.images[i];
      if (!img.url) continue;
      // Replace missing local /blog-images/*.webp with stable remote Unsplash photo
      if (img.url.startsWith('/blog-images/') && !validLocal.has(img.url)) {
        const category = (post.category && themes[post.category]) ? post.category : 'Productivity';
        const seed = typeof post.id === 'number' ? post.id : 1;
        img.url = pickPhoto(category, i, seed);
        img.image_url = img.url;
        if (!img.alt) img.alt = altText(category, img.position || (i === 0 ? 'header' : i === 1 ? 'mid' : 'cta'), post.title);
        if (!img.caption) img.caption = `Visual for ${post.title}`;
        dirty = true;
        missingIds.push(post.id);
      }
    }
  }

  // Normalize author
  if (!post.author) {
    post.author = 'xiaomo';
    dirty = true;
  }
  // Normalize category invalid -> closest
  const valid = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];
  if (post.category && !valid.includes(post.category)) {
    post.category = 'Productivity';
    dirty = true;
  }

  if (dirty) {
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
    changed++;
  }
}

console.log(`Updated ${changed} blog posts with valid remote images / author / category`);
console.log(`Missing local blog images replaced for IDs: ${[...new Set(missingIds)].slice(0, 20).join(', ')}${missingIds.length > 20 ? '...' : ''}`);
