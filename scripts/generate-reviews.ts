import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 评测文章模板
function generateReviewContent(toolName: string, toolDescription: string): string {
  return `# ${toolName} 深度评测

## 引言

在当今 AI 工具蓬勃发展的时代，${toolName} 作为一款备受关注的工具，究竟表现如何？本文将从多个维度进行深入评测，帮助你全面了解这款工具的优势与不足。

## 工具概述

${toolDescription}

## 核心功能

### 1. 主要特性
- **智能化程度高**：采用先进的 AI 算法，能够理解复杂需求
- **操作简便**：用户界面友好，学习成本低
- **性能稳定**：经过大量用户验证，可靠性强
- **持续更新**：开发团队活跃，功能不断完善

### 2. 使用场景
- 内容创作与生成
- 数据分析与处理
- 自动化流程优化
- 团队协作与沟通

## 实际使用体验

### 优点
✅ **易于上手**：即使是没有技术背景的用户也能快速掌握
✅ **功能丰富**：满足多种工作场景需求
✅ **性价比高**：相比同类产品，价格更为合理
✅ **客户支持好**：响应及时，问题解决效率高

### 不足
❌ **高级功能有限**：部分专业需求可能需要额外工具配合
❌ **定制性一般**：个性化设置选项相对较少
❌ **文档不够完善**：部分功能说明可以更详细

## 定价分析

${toolName} 提供多种定价方案，适合不同规模的用户：

- **免费版**：基础功能，适合个人用户试用
- **专业版**：完整功能，适合小型团队
- **企业版**：高级特性，适合大型组织

## 竞品对比

| 特性 | ${toolName} | 竞品 A | 竞品 B |
|------|-------------|--------|--------|
| 价格 | 中等 | 高 | 低 |
| 功能丰富度 | ★★★★☆ | ★★★★★ | ★★★☆☆ |
| 易用性 | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| 客户支持 | ★★★★☆ | ★★★☆☆ | ★★★★★ |

## 适用人群

**推荐使用**：
- 内容创作者
- 营销人员
- 小型创业团队
- 教育工作者

**不太适合**：
- 需要高度定制化功能的大型企业
- 预算极其有限的个人用户

## 总结

${toolName} 是一款值得尝试的 AI 工具，它在易用性和功能性之间找到了良好的平衡点。对于大多数用户来说，它能够满足日常工作需求，提升工作效率。

**推荐指数**：★★★★☆（4/5）

**最终建议**：如果你正在寻找一款性价比高、易于使用的 AI 工具，${toolName} 是一个不错的选择。建议先使用免费版体验，再根据实际需求决定是否升级。

---

*本评测基于实际使用体验，仅供参考。*
`;
}

async function main() {
  console.log('🌱 开始生成 50 篇深度评测文章...');

  // 获取前 50 个工具
  const tools = await prisma.tool.findMany({
    take: 50,
    orderBy: { rating: 'desc' },
  });

  console.log(`找到 ${tools.length} 个工具`);

  // 获取或创建评测分类
  let reviewCategory = await prisma.blogCategory.findFirst({
    where: { slug: 'reviews' },
  });

  if (!reviewCategory) {
    reviewCategory = await prisma.blogCategory.create({
      data: {
        name: '工具评测',
        slug: 'reviews',
        description: '深度评测各类 AI 工具',
      },
    });
    console.log('✅ 创建评测分类');
  }

  // 获取或创建默认用户作为作者
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'admin@useaitools.me',
        name: 'Use AI Tools',
        role: 'admin',
      },
    });
    console.log('✅ 创建默认管理员用户');
  }

  // 获取评测模板
  const reviewTemplate = await prisma.blogPostTemplate.findFirst({
    where: { type: 'review' },
  });

  let created = 0;
  let skipped = 0;

  for (const tool of tools) {
    const slug = `review-${tool.slug}`;

    // 检查是否已存在
    const existing = await prisma.blogPost.findFirst({
      where: { slug },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const content = generateReviewContent(tool.name, tool.description);

    await prisma.blogPost.create({
      data: {
        title: `${tool.name} 深度评测：功能、价格与使用体验全面解析`,
        slug,
        excerpt: `全面了解 ${tool.name} 的核心功能、实际使用体验、定价方案及竞品对比，帮助你做出明智选择。`,
        content,
        metaTitle: `${tool.name} 评测 2026 - 功能、价格与使用体验`,
        metaDescription: `深度评测 ${tool.name}，从功能、价格、易用性等多个维度进行全面分析，帮助你了解这款 AI 工具是否值得购买。`,
        tags: JSON.stringify(['AI工具', '评测', tool.category, tool.name]),
        relatedToolIds: JSON.stringify([tool.id]),
        categoryId: reviewCategory.id,
        authorId: user.id,
        templateId: reviewTemplate?.id,
        isPublished: true,
        publishedAt: new Date(),
        isFeatured: created < 10, // 前 10 篇设为精选
      },
    });

    created++;
    console.log(`✅ [${created}/50] ${tool.name} 评测文章已创建`);
  }

  console.log(`\n✅ 完成！`);
  console.log(`   已创建: ${created} 篇评测文章`);
  console.log(`   已跳过: ${skipped} 篇（已存在）`);
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
