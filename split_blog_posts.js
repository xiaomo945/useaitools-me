
const fs = require('fs');
const path = require('path');

// Read the original blog posts file
const rawData = fs.readFileSync(path.join(__dirname, 'data', 'blog-posts.json'), 'utf8');
const blogPosts = JSON.parse(rawData);

// Create the blog-posts directory
const outputDir = path.join(__dirname, 'data', 'blog-posts');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Total blog posts to split: ${blogPosts.length}`);

// Create index file (without content)
const index = blogPosts.map(post =&gt; ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  date: post.date,
  category: post.category,
  description: post.description
}));

fs.writeFileSync(
  path.join(__dirname, 'data', 'blog-index.json'),
  JSON.stringify(index, null, 2)
);
console.log('✅ Blog index file created');

// Create individual files for each post
blogPosts.forEach(post =&gt; {
  const filePath = path.join(outputDir, `${post.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
  console.log(`✅ Created post ${post.id}: ${post.title}`);
});

// Rename original file as backup
const originalPath = path.join(__dirname, 'data', 'blog-posts.json');
const backupPath = path.join(__dirname, 'data', 'blog-posts-backup.json');
fs.renameSync(originalPath, backupPath);
console.log(`✅ Original file backed up as blog-posts-backup.json`);

console.log('\n🎉 All tasks completed successfully!');
