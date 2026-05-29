const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const DATA_DIR = path.join(__dirname, '..', 'data', 'blog-posts');
const GSC_SCRIPT = path.join(__dirname, 'auto-submit-gsc.py');

// 获取现有文章ID
function getExistingIds() {
  const ids = [];
  if (!fs.existsSync(DATA_DIR)) return ids;
  
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
      const data = JSON.parse(content);
      if (data.id) ids.push(data.id);
    } catch (e) {
      // 跳过无效文件
    }
  }
  return ids.sort((a, b) => a - b);
}

// 创建新文章
function createArticle(id, title, slug, category, content) {
  const date = new Date().toISOString().split('T')[0];
  const article = {
    id,
    title,
    slug,
    date,
    description: content.substring(0, 150) + "...",
    category,
    author: "Use AI Tools Team",
    reading_time: Math.ceil(content.length / 1500) + " min",
    featured: Math.random() > 0.5,
    images: [
      {
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        alt: title,
        position: "header"
      },
      {
        url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
        alt: title,
        position: "mid"
      },
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
        alt: title,
        position: "cta"
      }
    ],
    content
  };

  const filePath = path.join(DATA_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf-8');
  return slug;
}

// 主函数
async function main() {
  console.log("🚀 批量内容生产脚本启动...\n");

  const existingIds = getExistingIds();
  const nextId = existingIds.length > 0 ? existingIds[existingIds.length - 1] + 1 : 1;

  // 创建示例文章（在实际使用中，这里可以调用AI生成）
  const newSlugs = [];

  // 文章1
  newSlugs.push(createArticle(
    nextId,
    "Best AI Tools for Productivity in 2026",
    "best-ai-tools-productivity-2026",
    "Productivity",
    "<p>Discover the best AI tools for productivity in 2026. These tools will help you save time, automate tasks, and get more done in less time.</p>\n\n<h2>Why AI Productivity Tools Matter</h2>\n<p>AI is transforming how we work. From automating repetitive tasks to helping with decision-making, these tools are game-changers for productivity.</p>"
  ));

  // 文章2
  newSlugs.push(createArticle(
    nextId + 1,
    "AI Writing Tools Comparison: Rytr vs Jasper vs Copy.ai",
    "ai-writing-tools-comparison-2026",
    "Writing",
    "<p>Compare the best AI writing tools in 2026: Rytr, Jasper, and Copy.ai. Find out which one is best for your needs and budget.</p>\n\n<h2>Overview of AI Writing Tools</h2>\n<p>AI writing tools have become essential for content creators, marketers, and businesses. Let's compare the top options.</p>"
  ));

  // 文章3
  newSlugs.push(createArticle(
    nextId + 2,
    "How to Create AI Art for Free in 2026",
    "create-ai-art-free-2026",
    "Image",
    "<p>Learn how to create AI art for free in 2026. This guide covers the best free AI image generators and tips for getting great results.</p>\n\n<h2>Free AI Art Tools</h2>\n<p>You don't need to spend money to create amazing AI art. These free tools will help you get started with AI image generation.</p>"
  ));

  console.log(`✅ 成功创建 ${newSlugs.length} 篇新文章！`);
  console.log(`📝 新文章Slugs: ${newSlugs.join(', ')}`);

  // 等待几秒确保文件系统同步
  console.log("\n⏳ 等待文件系统同步...");
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 自动提交到GSC
  console.log("\n🚀 开始自动提交到GSC...");
  try {
    if (fs.existsSync(GSC_SCRIPT)) {
      const result = execSync(`python3 "${GSC_SCRIPT}" --days 1`, { encoding: 'utf8' });
      console.log(result);
    } else {
      console.log("⚠️ GSC脚本不存在，跳过自动提交");
      console.log("   首次使用请先设置Google Cloud认证");
    }
  } catch (e) {
    console.log("⚠️ GSC自动提交失败:", e.message);
    console.log("   请确保已设置credentials.json并安装依赖");
  }

  console.log("\n✅ 批量内容生产完成！");
}

main().catch(console.error);
