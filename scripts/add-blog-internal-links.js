const fs = require('fs');
const path = require('path');

const BLOG_FILE = path.join(__dirname, '..', 'data', 'blog-posts.json');

async function run() {
  console.log('Loading blog posts...');
  const rawData = fs.readFileSync(BLOG_FILE, 'utf8');
  const blogPosts = JSON.parse(rawData);
  
  // Add links to island posts from other posts
  // Let's target "ai-content-creation-beginners-guide" (id=8, slug='ai-content-creation-beginners-guide')
  // Add a link in "top-10-ai-tools-for-small-business" (id=7)
  
  const post7 = blogPosts.find(p => p.id === 7);
  if (post7) {
    console.log('Adding link to ai-content-creation-beginners-guide in post 7...');
    post7.content = post7.content.replace(
      'Let\'s break down the **top 10 AI tools** that every small business owner needs to know about.',
      'Let\'s break down the **top 10 AI tools** that every small business owner needs to know about. If you\'re new to AI, start with our [[link:/blog/ai-content-creation-beginners-guide|complete beginner\'s guide]]!'
    );
  }
  
  // Add another link in "ai-vs-human-creative-writing" (id=9)
  const post9 = blogPosts.find(p => p.id === 9);
  if (post9) {
    console.log('Adding link to ai-content-creation-beginners-guide in post 9...');
    post9.content = post9.content.replace(
      'This question sparks passionate arguments on both sides.',
      'This question sparks passionate arguments on both sides. If you\'re new to AI content creation, check out our [[link:/blog/ai-content-creation-beginners-guide|beginner\'s guide]] first!'
    );
  }
  
  // Add link to "rytr-vs-jasper-vs-copyai" (id=1) in "best-free-ai-writing-tools-2026" (id=11)
  const post11 = blogPosts.find(p => p.id === 11);
  if (post11) {
    console.log('Adding link to rytr-vs-jasper-vs-copyai in post 11...');
    post11.content = post11.content.replace(
      'Let\'s explore the best options that won\'t cost you a single penny! 🎉',
      'Let\'s explore the best options that won\'t cost you a single penny! 🎉 If you want to compare paid tools too, check out our [[link:/blog/rytr-vs-jasper-vs-copyai|Rytr vs Jasper vs Copy.ai comparison]].'
    );
  }
  
  // Save changes
  console.log('Saving blog posts...');
  fs.writeFileSync(BLOG_FILE, JSON.stringify(blogPosts, null, 2));
  
  console.log('✅ Done! Added internal links to island posts.');
}

run().catch(console.error);
