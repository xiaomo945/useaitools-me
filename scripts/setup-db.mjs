// 构建前数据库初始化脚本（Vercel 环境专用 — 永不失败）
//
// 步骤:
//   1. 确保 prisma/dev.db 存在
//   2. 尝试 npx prisma db push 同步 schema（失败静默）
//   3. 数据库为空时尝试从 data/tools.json 导入
//
// 设计原则: 任何一步失败都 exit 0，绝不中断 npm run build
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

console.log('▶ setup-db: project root =', projectRoot);
console.log('▶ setup-db: db path =', dbPath);

// Step 1: 确保目录 + 空数据库文件存在
try {
  if (!fs.existsSync(prismaDir)) fs.mkdirSync(prismaDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '');
    console.log('✓ setup-db: 创建空数据库 prisma/dev.db');
  } else {
    const stat = fs.statSync(dbPath);
    console.log(`✓ setup-db: 数据库已存在 (${(stat.size/1024).toFixed(1)} KB)`);
  }
} catch (e) {
  console.warn('⚠ setup-db: 创建数据库文件时出错，跳过:', e.message);
}

// Step 2: 设置 DATABASE_URL 环境变量（供本进程内子命令使用）
process.env.DATABASE_URL = `file:${dbPath}`;

// Step 3: 跑 prisma db push — 把 schema.prisma 的表结构同步到 SQLite
// 失败不中断
console.log('▶ setup-db: npx prisma db push --skip-generate ...');
try {
  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    cwd: projectRoot,
    stdio: 'pipe',
    timeout: 120000,
    env: {
      ...process.env,
      DATABASE_URL: `file:${dbPath}`,
    },
  });
  console.log('✓ setup-db: schema 已同步');
} catch (e) {
  const out = (e.stdout || e.stderr || e.message || '').toString();
  console.warn('⚠ setup-db: prisma db push 未成功（不影响构建）—',
    out.split('\n').slice(0, 3).join(' | '));
}

// Step 4: 可选 — 从 tools.json 导入数据
try {
  if (!fs.existsSync(toolsJsonPath)) {
    console.log('⚠ setup-db: data/tools.json 不存在，跳过 seed');
  } else {
    const raw = fs.readFileSync(toolsJsonPath, 'utf-8');
    const tools = JSON.parse(raw);
    console.log(`✓ setup-db: 读取 tools.json，共 ${tools.length} 条`);

    // 用 PrismaClient 做一次简单查询，验证数据库可用
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient({
        datasources: { db: { url: `file:${dbPath}` } },
        log: [],
      });
      const count = await prisma.tool.count().catch(() => 0);
      console.log(`✓ setup-db: 数据库现有 ${count} 个工具`);

      if (count === 0 && tools.length > 0) {
        // 分批 createMany，每批 100 条，单条失败忽略
        const BATCH = 100;
        let inserted = 0;
        for (let i = 0; i < Math.min(tools.length, 500); i += BATCH) {
          const slice = tools.slice(i, i + BATCH).map((t, idx) => {
            const name = (t.name || `Tool ${i + idx + 1}`).toString();
            return {
              name,
              slug: name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '') || `tool-${i + idx}`,
              description: (t.description || 'AI tool').toString(),
              category: (t.category || 'Productivity').toString(),
              subcategory: (t.subcategory || '').toString(),
              url: (t.url || t.affiliate_link || '').toString(),
              affiliateUrl: (t.affiliate_link || '').toString(),
              iconUrl: (t.icon_url || '').toString(),
              pricing: (t.pricing || 'free').toString(),
              rating: typeof t.rating === 'number' ? t.rating : 4.0,
              reviewCount: typeof t.review_count === 'number' ? t.review_count : 10,
              isActive: true,
            };
          });
          try {
            await prisma.tool.createMany({ data: slice });
            inserted += slice.length;
          } catch (_) {
            // 这一批失败，退化为单条
            for (const item of slice) {
              try { await prisma.tool.create({ data: item }); inserted++; } catch (_2) { /* ignore */ }
            }
          }
        }
        console.log(`✓ setup-db: 已导入 ${inserted} 个工具`);
      }
      await prisma.$disconnect().catch(() => {});
    } catch (e) {
      console.warn('⚠ setup-db: PrismaClient 初始化/写入失败，跳过 seed（不影响静态生成）:', e.message);
    }
  }
} catch (e) {
  console.warn('⚠ setup-db: tools.json seed 阶段错误，跳过:', e.message);
}

console.log('\n✅ setup-db: 完成（无论数据库状态如何，构建将继续）');
process.exit(0);
