const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'useaitools.db');

// 删除旧数据库（如果存在）
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  删除旧数据库');
}

const db = new Database(dbPath);

// 启用 WAL 模式以获得更好的性能
db.pragma('journal_mode = WAL');

console.log('📦 创建数据库表...');

// 创建 blog_posts 表
db.exec(`
  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    style TEXT DEFAULT '沉稳技术风',
    author TEXT DEFAULT '',
    reading_time INTEGER DEFAULT 5,
    featured INTEGER DEFAULT 0,
    content TEXT NOT NULL,
    images TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// 创建 tools 表
db.exec(`
  CREATE TABLE IF NOT EXISTS tools (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    description_en TEXT DEFAULT '',
    category TEXT NOT NULL,
    pricing TEXT DEFAULT '',
    url TEXT DEFAULT '',
    affiliate_link TEXT DEFAULT '',
    icon_url TEXT DEFAULT '',
    examples TEXT DEFAULT '[]',
    needs_vpn INTEGER DEFAULT 0,
    languages TEXT DEFAULT '["English"]',
    rating REAL DEFAULT 3.5,
    rating_count INTEGER DEFAULT 0,
    rating_breakdown TEXT DEFAULT '{}',
    last_updated TEXT DEFAULT '',
    skill_level TEXT DEFAULT 'beginner',
    best_for TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// 创建 blog_links 表
db.exec(`
  CREATE TABLE IF NOT EXISTS blog_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_id INTEGER NOT NULL,
    to_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_id, to_id, type)
  );
`);

// 创建索引
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
  CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
  CREATE INDEX IF NOT EXISTS idx_tools_name ON tools(name);
`);

console.log('✅ 数据库表创建完成');

// 迁移博客文章数据
console.log('\n📝 开始迁移博客文章...');

const blogIndexPath = path.join(__dirname, '..', 'data', 'blog-index.json');
const blogPostsDir = path.join(__dirname, '..', 'data', 'blog-posts');

const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));

const insertBlogPost = db.prepare(`
  INSERT OR REPLACE INTO blog_posts (id, title, slug, date, category, description, style, author, reading_time, featured, content, images)
  VALUES (@id, @title, @slug, @date, @category, @description, @style, @author, @reading_time, @featured, @content, @images)
`);

const insertBlogLink = db.prepare(`
  INSERT OR IGNORE INTO blog_links (from_id, to_id, type)
  VALUES (@from_id, @to_id, @type)
`);

let migratedCount = 0;
let linkCount = 0;

for (const post of blogIndex) {
  const postPath = path.join(blogPostsDir, `${post.id}.json`);
  if (fs.existsSync(postPath)) {
    const fullPost = JSON.parse(fs.readFileSync(postPath, 'utf8'));
    
    // 提取内链
    const content = fullPost.content || '';
    const linkRegex = /\[\[link:\/tools\/(\d+)\|([^\]]+)\]\]/g;
    const linkRegex2 = /\[\[link:\/blog\/([^|]+)\|([^\]]+)\]\]/g;
    const linkRegex3 = /\[\[link:\/category\/([^|]+)\|([^\]]+)\]\]/g;
    
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      insertBlogLink.run({
        from_id: post.id,
        to_id: parseInt(match[1]),
        type: 'tool'
      });
      linkCount++;
    }
    
    while ((match = linkRegex2.exec(content)) !== null) {
      insertBlogLink.run({
        from_id: post.id,
        to_id: match[1],
        type: 'blog'
      });
      linkCount++;
    }
    
    while ((match = linkRegex3.exec(content)) !== null) {
      insertBlogLink.run({
        from_id: post.id,
        to_id: 0,
        type: `category:${match[1]}`
      });
      linkCount++;
    }
    
    // 估算阅读时间（每分钟约200字）
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    
    insertBlogPost.run({
      id: fullPost.id,
      title: fullPost.title,
      slug: fullPost.slug,
      date: fullPost.date,
      category: fullPost.category,
      description: fullPost.description,
      style: fullPost.style || '沉稳技术风',
      author: fullPost.author || '',
      reading_time: fullPost.reading_time || readingTime,
      featured: fullPost.featured ? 1 : 0,
      content: fullPost.content || '',
      images: JSON.stringify(fullPost.images || [])
    });
    
    migratedCount++;
  }
}

console.log(`✅ 已迁移 ${migratedCount} 篇博客文章`);
console.log(`✅ 已提取 ${linkCount} 条内链关系`);

// 迁移工具数据
console.log('\n🔧 开始迁移工具数据...');

const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const insertTool = db.prepare(`
  INSERT OR REPLACE INTO tools (id, name, description, description_en, category, pricing, url, affiliate_link, icon_url, examples, needs_vpn, languages, rating, rating_count, rating_breakdown, last_updated, skill_level, best_for)
  VALUES (@id, @name, @description, @description_en, @category, @pricing, @url, @affiliate_link, @icon_url, @examples, @needs_vpn, @languages, @rating, @rating_count, @rating_breakdown, @last_updated, @skill_level, @best_for)
`);

let toolCount = 0;

for (const tool of tools) {
  try {
    insertTool.run({
      id: Number(tool.id),
      name: String(tool.name),
      description: String(tool.description || ''),
      description_en: String(tool.description_en || ''),
      category: String(tool.category),
      pricing: String(tool.pricing || ''),
      url: String(tool.url || ''),
      affiliate_link: String(tool.affiliate_link || ''),
      icon_url: String(tool.icon_url || ''),
      examples: JSON.stringify(tool.examples || []),
      needs_vpn: tool.needs_vpn ? 1 : 0,
      languages: JSON.stringify(tool.languages || ['English']),
      rating: Number(tool.rating) || 3.5,
      rating_count: Number(tool.rating_count) || 0,
      rating_breakdown: JSON.stringify(tool.rating_breakdown || {}),
      last_updated: String(tool.last_updated || ''),
      skill_level: String(tool.skill_level || 'beginner'),
      best_for: JSON.stringify(tool.best_for || [])
    });
    toolCount++;
  } catch (err) {
    console.error(`工具 #${tool.id} (${tool.name}) 迁移失败:`, err.message);
  }
}

console.log(`✅ 已迁移 ${toolCount} 个工具`);

// 输出统计信息
console.log('\n📊 数据库统计:');
const blogCount = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get();
const toolCountResult = db.prepare('SELECT COUNT(*) as count FROM tools').get();
const linkCountResult = db.prepare('SELECT COUNT(*) as count FROM blog_links').get();

console.log(`  博客文章: ${blogCount.count} 篇`);
console.log(`  工具: ${toolCountResult.count} 个`);
console.log(`  内链关系: ${linkCountResult.count} 条`);

db.close();
console.log('\n🎉 数据库迁移完成!');
console.log(`📁 数据库文件: ${dbPath}`);
