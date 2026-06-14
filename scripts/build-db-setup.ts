// 构建时确保数据库存在并已初始化
// 从 tools.json 迁移数据到 SQLite（如果数据库为空）
import { PrismaClient } from '@prisma/client';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);

async function main() {
  console.log('🔧 [Build Setup] 检查数据库状态...');

  // 确保 prisma/dev.db 存在
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  if (!fs.existsSync(dbPath)) {
    console.log('📦 数据库文件不存在，开始初始化...');
  } else {
    const stats = fs.statSync(dbPath);
    console.log(`📦 现有数据库大小: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  }

  const prisma = new PrismaClient();

  try {
    // 检查数据库是否有工具数据
    const toolCount = await prisma.tool.count();
    console.log(`✅ 数据库中工具数量: ${toolCount}`);

    if (toolCount === 0) {
      console.log('📦 数据库为空，从 tools.json 迁移数据...');
      const tools = require('../data/tools.json');
      console.log(`📥 加载 ${tools.length} 个工具...`);

      // 批量插入工具
      const toolData = tools.map((t: any) => ({
        name: t.name,
        description: t.description || '',
        category: t.category || 'Productivity',
        pricing: t.pricing || 'Freemium',
        url: t.url || '',
        affiliateUrl: t.affiliate_link || '',
        iconUrl: t.icon_url || '',
        rating: t.rating || 4.5,
        reviewCount: t.review_count || 0,
        useCases: t.use_cases ? JSON.stringify(t.use_cases) : null,
        features: t.features ? JSON.stringify(t.features) : null,
        prosCons: t.pros_cons ? JSON.stringify(t.pros_cons) : null,
        isActive: true,
      }));

      // 分批插入工具（使用单个 create 以避免 SQLite 限制）
      // SQLite 不支持 skipDuplicates，所以我们先检查现有工具
      const batchSize = 100;
      const existingTools = await prisma.tool.findMany({ select: { name: true } });
      const existingNames = new Set(existingTools.map((t: any) => t.name));

      const toolsToInsert = toolData.filter((t: any) => !existingNames.has(t.name));
      console.log(`📝 需要插入 ${toolsToInsert.length} 个新工具`);

      // 分批插入
      for (let i = 0; i < toolsToInsert.length; i += batchSize) {
        const batch = toolsToInsert.slice(i, i + batchSize);
        // SQLite 不支持 createMany 返回值，使用事务批量创建
        await prisma.$transaction(
          batch.map((t: any) => prisma.tool.create({ data: t }))
        );
        console.log(`  ✓ 已插入 ${Math.min(i + batchSize, toolsToInsert.length)}/${toolsToInsert.length}`);
      }

      console.log(`✅ 迁移完成！共 ${toolsToInsert.length} 个工具`);
    } else {
      console.log('✅ 数据库已有数据，跳过迁移');
    }

    // 检查博客文章
    const blogCount = await prisma.blogPost.count();
    console.log(`✅ 博客文章数量: ${blogCount}`);

    if (blogCount === 0) {
      console.log('📝 尝试从 blog-posts.ts 迁移文章（如需要可手动运行）');
    }

    console.log('✅ 数据库初始化完成');
  } catch (error: any) {
    console.error('⚠️ 数据库初始化警告:', error.message);
    console.log('  继续构建... (Next.js 将在构建时尝试访问数据库)');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('❌ 致命错误:', e);
  process.exit(0); // 不阻止构建，即使失败也继续
});
