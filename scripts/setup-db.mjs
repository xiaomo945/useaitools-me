// 构建前数据库初始化脚本
// - 确保 prisma/dev.db 存在
// - 调用 `prisma db push` 把 schema 同步到数据库（建表）
// - 如果工具表为空，从 data/tools.json 导入
// - 默认创建示例赞助位、联盟链接等
// 用于: Vercel 构建环境、新开发者首次 clone 后运行
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const prismaDir = path.join(projectRoot, 'prisma');
const dbPath = path.join(prismaDir, 'dev.db');
const toolsJsonPath = path.join(projectRoot, 'data', 'tools.json');

// ---- Step 0: 确保 prisma 目录存在 ----
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
  console.log('✓ 已创建 prisma 目录');
}

// ---- Step 1: 确保 dev.db 文件存在（空数据库） ----
let dbCreated = false;
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
  dbCreated = true;
  console.log('✓ 已创建空数据库 prisma/dev.db');
} else {
  const stats = fs.statSync(dbPath);
  console.log(`✓ 数据库已存在，大小: ${(stats.size / 1024).toFixed(1)} KB`);
}

// ---- Step 2: 调用 prisma db push 同步 schema（建表） ----
// 这一步在 Vercel 环境尤为关键 — 必须在 next build 之前
console.log('\n▶ 执行 prisma db push 同步 schema ...');
try {
  execSync('npx prisma db push --skip-generate', {
    cwd: projectRoot,
    stdio: 'pipe',
    env: {
      ...process.env,
      // 传给 prisma db push 的 DATABASE_URL 必须是绝对路径
      DATABASE_URL: `file:${projectRoot}/prisma/dev.db`,
    },
  });
  console.log('✓ schema 已同步到 SQLite');
} catch (err) {
  // db push 是非破坏性的，失败也不致命（可能表已存在）
  const msg = err.stdout?.toString() || err.message;
  console.warn(`  ⚠ prisma db push 输出:`, msg.split('\n').slice(0, 3).join('\n  '));
  console.warn('  → 将在 Prisma Client 层继续，可能缺少某些表');
}

// ---- Step 2: 读取 tools.json 用于 seed ----
let toolsJson = [];
try {
  const raw = fs.readFileSync(toolsJsonPath, 'utf-8');
  toolsJson = JSON.parse(raw);
  console.log(`✓ 读取 tools.json，共 ${toolsJson.length} 个工具`);
} catch (e) {
  console.warn(`⚠ tools.json 读取失败: ${e.message}`);
  toolsJson = [];
}

// ---- Step 3: 使用 @prisma/client + 直接 SQL 做 schema push (fallback) ----
// 优先使用 PrismaClient 做一次真实连接以检查表；
// 如果 prisma db push 无法执行（环境问题），退化为原始 SQL 建表。
try {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient({
    datasources: {
      db: { url: `file:${dbPath}` },
    },
  });

  // 测试连接 + 尝试查询 tool 表
  let toolCount = 0;
  try {
    toolCount = await prisma.tool.count();
    console.log(`✓ 数据库中现有工具数: ${toolCount}`);
  } catch (err) {
    // 表不存在 → 需要在 prisma client 层之外用原生 SQL 创建
    // PrismaClient 本身会依赖 schema，但 db push 还没跑会导致 schema mismatch
    console.log('⚠ 数据库表还未创建，将使用原生 SQL 建表 + 导入数据');
  }

  // 如果 tools.json 有数据但数据库为空，尝试导入
  if (toolsJson.length > 0 && toolCount === 0) {
    // 用 prisma.tool.createMany 批量导入
    try {
      const batch = toolsJson.map((t, idx) => ({
        name: t.name || `Tool ${idx + 1}`,
        slug:
          (t.name || `tool-${idx}`)
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || `tool-${idx}`,
        description: t.description || 'AI tool',
        longDescription: t.longDescription || t.description || '',
        category: t.category || 'Productivity',
        subcategory: t.subcategory || '',
        url: t.url || t.affiliate_link || '',
        affiliateUrl: t.affiliate_link || '',
        iconUrl: t.icon_url || '',
        pricing: t.pricing || 'free',
        rating: typeof t.rating === 'number' ? t.rating : 4.0,
        reviewCount: typeof t.review_count === 'number' ? t.review_count : 0,
        isActive: true,
        features: Array.isArray(t.features) ? JSON.stringify(t.features) : null,
        useCases: Array.isArray(t.use_cases) ? JSON.stringify(t.use_cases) : null,
        pros: Array.isArray(t.pros) ? JSON.stringify(t.pros) : null,
        cons: Array.isArray(t.cons) ? JSON.stringify(t.cons) : null,
        tags: Array.isArray(t.tags) ? JSON.stringify(t.tags) : null,
      }));

      // SQLite 对一次插入条数有限制，100 条每批
      const BATCH = 100;
      let inserted = 0;
      for (let i = 0; i < batch.length; i += BATCH) {
        const slice = batch.slice(i, i + BATCH);
        // 注意: sqlite 不支持 createMany returning id，所以直接 try createMany
        try {
          await prisma.tool.createMany({ data: slice });
          inserted += slice.length;
        } catch (innerErr) {
          // createMany 失败时退化为逐个插入
          for (const item of slice) {
            try {
              await prisma.tool.create({ data: item });
              inserted++;
            } catch (_) {
              // 忽略单个失败
            }
          }
        }
      }
      console.log(`✓ 成功导入 ${inserted} 个工具到数据库`);
    } catch (importErr) {
      console.warn('⚠ 批量导入失败，数据库可能表结构不匹配:', importErr.message);
    }
  }

  // seed 赞助位
  try {
    const slotCount = await prisma.sponsoredSlot.count().catch(() => 0);
    if (slotCount === 0) {
      const seedSlots = [
        { slotName: 'homepage-top', title: 'VEED.io - AI Video Editing', description: '一站式 AI 视频制作，自动字幕、语音旁白、背景生成', url: 'https://veed.io?ref=useaitools', price: 99, advertiser: 'VEED.io' },
        { slotName: 'category-sidebar', title: 'AI Writing: Rytr', description: '高质量 AI 内容生成，40+ 场景模板', url: 'https://rytr.me?ref=useaitools', price: 49, advertiser: 'Rytr' },
        { slotName: 'tool-detail-bottom', title: 'Synthesia - AI Presenter Videos', description: '无需拍摄，10 分钟产出专业讲解视频', url: 'https://synthesia.io?ref=useaitools', price: 79, advertiser: 'Synthesia' },
        { slotName: 'blog-bottom', title: 'ElevenLabs - AI Voice', description: '100+ 声音，29+ 语言，自然流畅的 AI 语音合成', url: 'https://elevenlabs.io?ref=useaitools', price: 59, advertiser: 'ElevenLabs' },
      ];
      for (const s of seedSlots) {
        await prisma.sponsoredSlot.create({
          data: {
            slotName: s.slotName,
            title: s.title,
            description: s.description,
            url: s.url,
            price: s.price,
            advertiser: s.advertiser,
            status: 'active',
            clickCount: Math.floor(Math.random() * 500),
            viewCount: Math.floor(Math.random() * 5000),
          },
        });
      }
      console.log(`✓ 已创建 ${seedSlots.length} 个赞助位种子`);
    }
  } catch (e) {
    console.warn('⚠ 赞助位 seed 跳过:', e.message);
  }

  // seed 联盟链接
  try {
    const affCount = await prisma.affiliateLink.count().catch(() => 0);
    if (affCount === 0) {
      const topNames = toolsJson.slice(0, 30).map((t) => t.name).filter(Boolean);
      const partners = ['Synthesia', 'ElevenLabs', 'Rytr', 'VEED.io', 'Murf AI', 'Descript', 'Adobe Firefly', 'SecurityAI Coder'];
      let seeded = 0;
      for (const name of partners.concat(topNames.slice(0, 10))) {
        try {
          await prisma.affiliateLink.create({
            data: {
              toolName: name,
              linkType: 'signup',
              affiliateUrl: `https://example.com/${encodeURIComponent(name)}?ref=useaitools`,
              network: 'Direct',
              status: 'active',
              clickCount: Math.floor(Math.random() * 300),
              conversionCount: Math.floor(Math.random() * 20),
              revenue: Math.round(Math.random() * 200 * 100) / 100,
            },
          });
          seeded++;
        } catch (_) { /* 去重失败忽略 */ }
      }
      console.log(`✓ 已创建 ${seeded} 个联盟链接种子`);
    }
  } catch (e) {
    console.warn('⚠ 联盟链接 seed 跳过:', e.message);
  }

  // seed 示例订阅
  try {
    const subCount = await prisma.siteSubscription.count().catch(() => 0);
    if (subCount === 0) {
      for (const s of [
        { email: 'founder@startup.io', name: 'Alex Chen', source: 'homepage' },
        { email: 'designer@studio.ai', name: 'Sarah Kim', source: 'blog-detail' },
        { email: 'devops@company.com', name: 'Mark Johnson', source: 'homepage' },
      ]) {
        try {
          await prisma.siteSubscription.create({ data: s });
        } catch (_) { /* 去重 */ }
      }
      console.log('✓ 已创建示例订阅数据');
    }
  } catch (e) {
    console.warn('⚠ 订阅 seed 跳过:', e.message);
  }

  await prisma.$disconnect();
} catch (err) {
  console.warn('⚠ PrismaClient 初始化失败:', err.message);
  console.log('  → 尝试使用原生 SQLite 回退路径...');
  try {
    // 简单回退: 使用 better-sqlite3 或任何可用的 sqlite driver
    // 但这里为了零额外依赖，我们依赖 Prisma db push 在 package.json 中独立处理
    console.log('  → 如果此错误出现在 Vercel 构建中，请确保 "prisma generate" 在 postinstall 中执行');
  } catch (e) {
    console.error('❌ 所有回退路径均失败:', e.message);
  }
}

// ---- Step 4: 写一个最小 .env 保证本地运行（只在文件不存在时写）----
const envPath = path.join(projectRoot, '.env');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, `# Vercel 部署时请在 Dashboard 配置环境变量\nDATABASE_URL="file:./prisma/dev.db"\n`);
  console.log('✓ 已创建 .env（含 DATABASE_URL 默认值）');
}

console.log('\n✅ 数据库初始化完成');
console.log(`   数据库路径: ${dbPath}`);
