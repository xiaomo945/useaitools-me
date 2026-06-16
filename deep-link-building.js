import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'useaitools.db');
const db = new Database(dbPath);

console.log('🔍 开始深度内链编织+联盟植入强化\n');

// ============ 步骤1：为最新文章补充内链 ============

// 获取最新10篇文章（ID 245-254）
const latestArticles = db.prepare(`
  SELECT id, title, slug, category FROM blog_posts WHERE id BETWEEN 245 AND 254 ORDER BY id
`).all();

console.log(`📝 最新10篇文章: ID 245-254`);

// 获取高价值核心文章
const highValueIds = [225, 226, 58, 62, 60];
const highValueArticles = db.prepare(`
  SELECT id, title, slug FROM blog_posts WHERE id IN (225, 226, 58, 62, 60)
`).all();

console.log(`⭐ 高价值文章: ${highValueArticles.map(a => `${a.id}: ${a.title.slice(0, 50)}`).join(', ')}`);

// 获取所有文章用于内链推荐
const allPosts = db.prepare(`
  SELECT id, title, slug, category FROM blog_posts ORDER BY id DESC
`).all();

// 检查每篇文章被引用次数
const insertLink = db.prepare(`
  INSERT OR IGNORE INTO blog_links (from_id, to_id, type)
  VALUES (@from_id, @to_id, @type)
`);

const updateContent = db.prepare(`
  UPDATE blog_posts SET content = @content WHERE id = @id
`);

let totalLinksAdded = 0;
let articlesUpdated = 0;

// 为每篇最新文章添加内链
latestArticles.forEach(article => {
  const currentContent = db.prepare('SELECT content FROM blog_posts WHERE id = ?').get(article.id).content;
  
  // 获取指向该文章的内链数
  const linkCount = db.prepare('SELECT COUNT(*) as count FROM blog_links WHERE to_id = ?').get(article.id);
  console.log(`  ${article.id}: ${article.title.slice(0, 50)}... - 被引用 ${linkCount.count} 次`);
  
  let newContent = currentContent;
  let linksAdded = 0;
  
  // 添加指向高价值文章的内链
  highValueArticles.forEach(hv => {
    if (!newContent.includes(`[[link:/blog/${hv.slug}|`)) {
      newContent = newContent.replace(/\n---\n## Final Thoughts\n/, `\n---\n**Related Reading:** [[link:/blog/${hv.slug}|${hv.title}]]\n\n## Final Thoughts\n`);
      insertLink.run({ from_id: article.id, to_id: hv.slug, type: 'blog' });
      linksAdded++;
      totalLinksAdded++;
    }
  });
  
  // 如果引用次数少，从同分类添加更多内链
  if (linkCount.count < 3) {
    const sameCategory = allPosts.filter(p => p.category === article.category && p.id !== article.id && p.id >= 235).slice(0, 3);
    sameCategory.forEach(sc => {
      if (!newContent.includes(`[[link:/blog/${sc.slug}|`)) {
        newContent = newContent.replace(/\n---\n## Final Thoughts\n/, `\n---\n**More ${article.category} Tools:** [[link:/blog/${sc.slug}|${sc.title}]]\n\n## Final Thoughts\n`);
        insertLink.run({ from_id: article.id, to_id: sc.slug, type: 'blog' });
        linksAdded++;
        totalLinksAdded++;
      }
    });
  }
  
  if (linksAdded > 0) {
    updateContent.run({ id: article.id, content: newContent });
    articlesUpdated++;
    console.log(`    ✅ 添加 ${linksAdded} 个内链`);
  }
});

console.log(`\n✅ 内链编织完成: 更新 ${articlesUpdated} 篇文章，添加 ${totalLinksAdded} 条内链`);

// ============ 步骤2：联盟链接深度植入 ============

// Writing分类文章联盟植入
const writingPosts = db.prepare(`
  SELECT id, title, content FROM blog_posts WHERE category = 'Writing'
`).all();

let writingUpdated = 0;
writingPosts.forEach(post => {
  if (!post.content.includes('AFFILIATE_RYTR') && !post.content.includes('Try Rytr')) {
    const affiliateCta = `\n\n---\n\n## Ready to Write Faster?\n\n🚀 Try [Rytr Free](https://rytr.me) and create content 10x faster. Join 1M+ marketers and creators who trust Rytr for AI-powered writing.\n\n**Start your free trial today and see the difference.**\n`;
    
    // 在Final Thoughts之后添加
    let newContent = post.content;
    if (newContent.includes('## Final Thoughts')) {
      newContent = newContent.replace(/(## Final Thoughts[\s\S]*?)$/m, `$1${affiliateCta}`);
    } else {
      newContent += affiliateCta;
    }
    
    updateContent.run({ id: post.id, content: newContent });
    writingUpdated++;
    console.log(`📝 Writing文章植入Rytr: ${post.title.slice(0, 50)}...`);
  }
});

console.log(`✅ Writing分类联盟植入: ${writingUpdated} 篇`);

// Video分类文章联盟植入
const videoPosts = db.prepare(`
  SELECT id, title, content FROM blog_posts WHERE category = 'Video'
`).all();

let videoUpdated = 0;
videoPosts.forEach(post => {
  if (!post.content.includes('AFFILIATE_VEED') && !post.content.includes('Try VEED')) {
    const affiliateCta = `\n\n---\n\n## Need Professional Video Editing?\n\n🎬 Try [VEED.io Free](https://veed.io) for AI-powered video editing with auto-subtitles, screen recording, and more. Trusted by 30M+ users.\n\n**Create stunning videos in minutes, no experience needed.**\n`;
    
    let newContent = post.content;
    if (newContent.includes('## Final Thoughts')) {
      newContent = newContent.replace(/(## Final Thoughts[\s\S]*?)$/m, `$1${affiliateCta}`);
    } else {
      newContent += affiliateCta;
    }
    
    updateContent.run({ id: post.id, content: newContent });
    videoUpdated++;
    console.log(`🎬 Video文章植入VEED: ${post.title.slice(0, 50)}...`);
  }
});

console.log(`✅ Video分类联盟植入: ${videoUpdated} 篇`);

// Productivity分类文章联盟植入
const productivityPosts = db.prepare(`
  SELECT id, title, content FROM blog_posts WHERE category = 'Productivity'
`).all();

let productivityUpdated = 0;
productivityPosts.forEach(post => {
  if (!post.content.includes('AFFILIATE_NOTION') && !post.content.includes('Notion AI') && !post.content.includes('Boost your workflow')) {
    const affiliateCta = `\n\n---\n\n## Boost Your Workflow?\n\n💡 Organize, plan, and automate with [Notion AI](https://notion.so). The all-in-one workspace for notes, docs, and team collaboration.\n\n**Get started free and transform your productivity.**\n`;
    
    let newContent = post.content;
    if (newContent.includes('## Final Thoughts')) {
      newContent = newContent.replace(/(## Final Thoughts[\s\S]*?)$/m, `$1${affiliateCta}`);
    } else {
      newContent += affiliateCta;
    }
    
    updateContent.run({ id: post.id, content: newContent });
    productivityUpdated++;
    console.log(`⚡ Productivity文章植入推荐: ${post.title.slice(0, 50)}...`);
  }
});

console.log(`✅ Productivity分类联盟植入: ${productivityUpdated} 篇`);

// 输出统计
const totalPosts = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get();
const totalLinks = db.prepare('SELECT COUNT(*) as count FROM blog_links').get();

console.log(`\n📊 最终统计:`);
console.log(`  文章总数: ${totalPosts.count}`);
console.log(`  内链总数: ${totalLinks.count}`);
console.log(`  Writing联盟植入: ${writingUpdated} 篇`);
console.log(`  Video联盟植入: ${videoUpdated} 篇`);
console.log(`  Productivity联盟植入: ${productivityUpdated} 篇`);

db.close();
console.log('\n🎉 深度内链编织+联盟植入强化完成!');
