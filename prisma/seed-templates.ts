import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始初始化工具评测模板...');

  // 创建默认评测模板
  const defaultTemplate = await prisma.toolReviewTemplate.upsert({
    where: { id: 'default-standard-review' },
    update: {},
    create: {
      id: 'default-standard-review',
      name: '标准评测模板',
      description: '适用于大多数 AI 工具的全面评测，包含概述、功能、定价、优缺点和总结',
      sections: JSON.stringify([
        { id: 'overview', title: '工具概述', type: 'text', required: true },
        { id: 'key-features', title: '核心功能', type: 'list', required: true },
        { id: 'pricing', title: '定价分析', type: 'text', required: true },
        { id: 'pros-cons', title: '优缺点', type: 'pros-cons', required: true },
        { id: 'best-for', title: '最适合谁', type: 'list', required: false },
        { id: 'verdict', title: '总结评价', type: 'text', required: true },
      ]),
      ratingDimensions: JSON.stringify([
        { id: 'ease-of-use', name: '易用性', weight: 1.0 },
        { id: 'features', name: '功能丰富度', weight: 1.0 },
        { id: 'value', name: '性价比', weight: 0.8 },
        { id: 'support', name: '客户支持', weight: 0.6 },
      ]),
      isActive: true,
      isDefault: true,
    },
  });

  console.log('✅ 默认评测模板已创建:', defaultTemplate.name);

  // 创建快速评测模板
  const quickTemplate = await prisma.toolReviewTemplate.upsert({
    where: { id: 'default-quick-review' },
    update: {},
    create: {
      id: 'default-quick-review',
      name: '快速评测模板',
      description: '简洁的评测模板，适合快速介绍工具的核心价值',
      sections: JSON.stringify([
        { id: 'overview', title: '一句话介绍', type: 'text', required: true },
        { id: 'pros-cons', title: '优缺点', type: 'pros-cons', required: true },
        { id: 'verdict', title: '推荐意见', type: 'text', required: true },
      ]),
      ratingDimensions: JSON.stringify([
        { id: 'overall', name: '综合评分', weight: 1.0 },
      ]),
      isActive: true,
      isDefault: false,
    },
  });

  console.log('✅ 快速评测模板已创建:', quickTemplate.name);

  // 创建对比评测模板
  const comparisonTemplate = await prisma.toolReviewTemplate.upsert({
    where: { id: 'default-comparison-review' },
    update: {},
    create: {
      id: 'default-comparison-review',
      name: '对比评测模板',
      description: '用于多个工具横向对比的评测模板',
      sections: JSON.stringify([
        { id: 'overview', title: '对比概述', type: 'text', required: true },
        { id: 'comparison-table', title: '功能对比表', type: 'table', required: true },
        { id: 'pricing-comparison', title: '定价对比', type: 'text', required: true },
        { id: 'pros-cons', title: '各自优缺点', type: 'pros-cons', required: true },
        { id: 'verdict', title: '推荐建议', type: 'text', required: true },
      ]),
      ratingDimensions: JSON.stringify([
        { id: 'features', name: '功能对比', weight: 1.0 },
        { id: 'pricing', name: '定价对比', weight: 0.8 },
        { id: 'ease-of-use', name: '易用性对比', weight: 0.8 },
      ]),
      isActive: true,
      isDefault: false,
    },
  });

  console.log('✅ 对比评测模板已创建:', comparisonTemplate.name);

  console.log('🎉 工具评测模板初始化完成！');
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
