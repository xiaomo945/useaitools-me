import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 开始迁移工具分类数据...');

  // 获取所有工具
  const tools = await prisma.tool.findMany({
    select: { id: true, categoryName: true },
  });

  console.log(`找到 ${tools.length} 个工具`);

  // 获取所有分类
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  });

  console.log(`找到 ${categories.length} 个分类`);

  // 创建名称映射（不区分大小写）
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    categoryMap.set(cat.name.toLowerCase(), cat.id);
    categoryMap.set(cat.slug.toLowerCase(), cat.id);
  }

  // 常见分类名称映射
  const nameAliases: Record<string, string> = {
    'writing': 'writing',
    'image': 'image',
    'video': 'video',
    'audio': 'audio',
    'code': 'code',
    'productivity': 'productivity',
    'chatbots': 'chatbots',
    'marketing': 'marketing',
    'design': 'design',
    'data & analytics': 'data-analytics',
    'data analytics': 'data-analytics',
    'data': 'data-analytics',
  };

  let updated = 0;
  let skipped = 0;

  for (const tool of tools) {
    const categoryName = tool.categoryName?.trim();
    if (!categoryName) {
      skipped++;
      continue;
    }

    // 尝试直接匹配
    let categoryId = categoryMap.get(categoryName.toLowerCase());

    // 尝试别名匹配
    if (!categoryId) {
      const alias = nameAliases[categoryName.toLowerCase()];
      if (alias) {
        categoryId = categoryMap.get(alias);
      }
    }

    if (categoryId) {
      await prisma.tool.update({
        where: { id: tool.id },
        data: { categoryId },
      });
      updated++;
    } else {
      console.log(`⚠️ 未找到分类: "${categoryName}" (工具: ${tool.id})`);
      skipped++;
    }
  }

  console.log(`\n✅ 迁移完成！`);
  console.log(`  已更新: ${updated} 个工具`);
  console.log(`  跳过: ${skipped} 个工具`);

  // 更新分类的工具计数
  const allCategories = await prisma.category.findMany({
    select: { id: true },
  });

  for (const cat of allCategories) {
    const count = await prisma.tool.count({
      where: { categoryId: cat.id },
    });
    await prisma.category.update({
      where: { id: cat.id },
      data: { toolCount: count },
    });
  }

  console.log(`\n📊 分类工具计数已更新`);
}

main()
  .catch((e) => {
    console.error('❌ 迁移失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
