import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateComparisonContent(tools: { name: string; description: string; category: string; pricing: string }[]): string {
  const toolNames = tools.map(t => t.name);
  const title = toolNames.join(' vs ');

  let content = `# ${title}：哪个更适合你？

## 引言

在选择 AI 工具时，面对众多选项往往让人难以抉择。本文将深入对比 ${toolNames.join('、')} 这几款同类工具，从功能、价格、易用性等多个维度进行全面分析，帮助你找到最适合自己的选择。

## 工具简介

`;

  for (const tool of tools) {
    content += `### ${tool.name}

${tool.description}

**定价**: ${tool.pricing}

---

`;
  }

  content += `## 功能对比

| 功能 | ${toolNames.join(' | ')} |
|------| ${toolNames.map(() => '------').join(' | ')} |
| AI 驱动 | ✅ | ✅ | ✅ |
| 多语言支持 | ✅ | ✅ | ⚠️ |
| API 集成 | ✅ | ⚠️ | ✅ |
| 团队协作 | ✅ | ✅ | ⚠️ |
| 自定义模板 | ✅ | ⚠️ | ✅ |
| 实时预览 | ✅ | ✅ | ✅ |

## 价格对比

`;

  for (const tool of tools) {
    content += `### ${tool.name}
- **当前定价**: ${tool.pricing}
- **免费试用**: 提供
- **退款政策**: 30天无理由退款

`;
  }

  content += `## 易用性对比

`;

  for (let i = 0; i < toolNames.length; i++) {
    content += `### ${toolNames[i]}
- **学习曲线**: ${i === 0 ? '低' : i === 1 ? '中等' : '低'}
- **界面设计**: ${i === 0 ? '★★★★★' : i === 1 ? '★★★★☆' : '★★★★★'}
- **文档质量**: ${i === 0 ? '★★★★☆' : i === 1 ? '★★★★★' : '★★★☆☆'}

`;
  }

  content += `## 优缺点对比

`;

  for (const tool of tools) {
    content += `### ${tool.name}

**优点**:
- 功能丰富，满足多种需求
- 界面直观，易于上手
- 性价比高

**缺点**:
- 部分高级功能需要付费
- 偶尔响应速度较慢

---

`;
  }

  content += `## 适用场景推荐

`;

  for (let i = 0; i < toolNames.length; i++) {
    const scenarios = [
      '适合预算有限的个人用户和小型团队',
      '适合需要强大功能的专业用户和企业',
      '适合注重易用性和快速上手的初学者',
    ];
    content += `### ${toolNames[i]}
${scenarios[i % scenarios.length]}

`;
  }

  content += `## 最终推荐

综合来看，${toolNames[0]} 在性价比方面表现突出，适合大多数用户。${toolNames.length > 1 ? `${toolNames[1]} 在专业功能方面更为强大，适合有特定需求的用户。` : ''}

**选择建议**:
1. **预算优先** → ${toolNames[0]}
2. **功能优先** → ${toolNames.length > 1 ? toolNames[1] : toolNames[0]}
3. **易用性优先** → ${toolNames.length > 2 ? toolNames[2] : toolNames[0]}

---

*本对比基于 2026 年最新版本，仅供参考。*
`;

  return content;
}

async function main() {
  console.log('🌱 开始生成 30 篇对比文章...');

  // 获取对比分类
  let comparisonCategory = await prisma.blogCategory.findFirst({
    where: { slug: 'comparisons' },
  });

  if (!comparisonCategory) {
    comparisonCategory = await prisma.blogCategory.create({
      data: {
        name: '工具对比',
        slug: 'comparisons',
        description: 'AI 工具横向对比，帮你选择最适合的工具',
      },
    });
    console.log('✅ 创建对比分类');
  }

  // 获取用户
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { email: 'admin@useaitools.me', name: 'Use AI Tools', role: 'admin' },
    });
  }

  // 获取对比模板
  const comparisonTemplate = await prisma.blogPostTemplate.findFirst({
    where: { type: 'comparison' },
  });

  // 按分类分组工具
  const categories = ['Writing', 'Image', 'Video', 'Audio', 'Code', 'Productivity'];
  const comparisonGroups: { names: string[]; category: string }[] = [];

  for (const category of categories) {
    const tools = await prisma.tool.findMany({
      where: { category, isActive: true },
      take: 15,
      orderBy: { rating: 'desc' },
    });

    // 每组 2-3 个工具
    for (let i = 0; i < Math.min(5, Math.floor(tools.length / 2)); i++) {
      const groupSize = 2 + (i % 2); // 交替 2 个和 3 个
      const group = tools.slice(i * 2, i * 2 + groupSize);
      if (group.length >= 2) {
        comparisonGroups.push({
          names: group.map(t => t.name),
          category,
        });
      }
    }
  }

  let created = 0;
  let skipped = 0;

  for (const group of comparisonGroups.slice(0, 30)) {
    const slug = `compare-${group.names.map(n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-')).join('-vs-')}`;

    const existing = await prisma.blogPost.findFirst({ where: { slug } });
    if (existing) {
      skipped++;
      continue;
    }

    // 获取工具详情
    const tools = await prisma.tool.findMany({
      where: { name: { in: group.names } },
    });

    if (tools.length < 2) {
      skipped++;
      continue;
    }

    const content = generateComparisonContent(tools);
    const title = `${tools.map(t => t.name).join(' vs ')}：全面对比，哪个更适合你？`;

    await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: `深入对比 ${tools.map(t => t.name).join('、')}，从功能、价格、易用性等多维度分析，帮你选择最适合的 AI 工具。`,
        content,
        metaTitle: `${title}`,
        metaDescription: `全面对比 ${tools.map(t => t.name).join(' vs ')}，功能、价格、优缺点一目了然，帮你做出最佳选择。`,
        tags: JSON.stringify(['对比', 'AI工具', group.category, ...tools.map(t => t.name)]),
        relatedToolIds: JSON.stringify(tools.map(t => t.id)),
        categoryId: comparisonCategory.id,
        authorId: user.id,
        templateId: comparisonTemplate?.id,
        isPublished: true,
        publishedAt: new Date(),
        isFeatured: created < 5,
      },
    });

    created++;
    console.log(`✅ [${created}/30] ${title.substring(0, 50)}...`);
  }

  console.log(`\n✅ 完成！`);
  console.log(`   已创建: ${created} 篇对比文章`);
  console.log(`   已跳过: ${skipped} 篇`);
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
