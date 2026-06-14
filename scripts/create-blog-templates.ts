import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultTemplates = [
  {
    name: '标准评测模板',
    type: 'review',
    description: '用于深度评测单个AI工具的标准模板，包含完整的功能分析、优缺点评估和使用建议',
    structure: [
      { id: 'intro', title: '引言', type: 'text', required: true, description: '吸引读者注意力，介绍评测工具的背景' },
      { id: 'overview', title: '工具概述', type: 'text', required: true, description: '简要介绍工具的核心定位和主要功能' },
      { id: 'features', title: '核心功能', type: 'list', required: true, description: '详细列出3-5个主要功能，每个功能配使用说明' },
      { id: 'user-experience', title: '使用体验', type: 'text', required: true, description: '分享实际使用过程中的体验和感受' },
      { id: 'pros-cons', title: '优缺点分析', type: 'pros-cons', required: true, description: '客观分析工具的优缺点，至少各3条' },
      { id: 'pricing', title: '定价方案', type: 'text', required: true, description: '详细分析定价策略，对比竞品价格' },
      { id: 'comparison', title: '竞品对比', type: 'table', required: false, description: '与2-3个竞品进行功能对比' },
      { id: 'verdict', title: '总结评价', type: 'text', required: true, description: '给出最终评分和适用人群建议' },
    ],
    guidelines: {
      wordCount: { min: 1000, max: 2000 },
      seoRequirements: [
        '标题包含核心关键词',
        '使用H2/H3标签组织内容',
        '添加2-3个内部链接',
        '图片添加alt标签',
      ],
      qualityChecks: [
        '内容100%原创',
        '事实准确，数据可靠',
        '语言流畅，逻辑清晰',
        '提供真实使用截图',
      ],
    },
    isActive: true,
    isDefault: true,
  },
  {
    name: '工具对比模板',
    type: 'comparison',
    description: '用于对比多个同类AI工具的模板，帮助读者选择最适合的工具',
    structure: [
      { id: 'intro', title: '引言', type: 'text', required: true, description: '说明对比目的和适用场景' },
      { id: 'tools-overview', title: '工具简介', type: 'list', required: true, description: '简要介绍每个对比工具的核心特点' },
      { id: 'feature-comparison', title: '功能对比', type: 'table', required: true, description: '详细对比各项功能，使用表格展示' },
      { id: 'pricing-comparison', title: '定价对比', type: 'table', required: true, description: '对比各工具的定价方案' },
      { id: 'user-experience', title: '使用体验', type: 'text', required: true, description: '分享使用不同工具的体验差异' },
      { id: 'pros-cons', title: '各自优缺点', type: 'pros-cons', required: true, description: '列出每个工具的优缺点' },
      { id: 'recommendations', title: '推荐建议', type: 'text', required: true, description: '根据不同需求给出具体推荐' },
    ],
    guidelines: {
      wordCount: { min: 1200, max: 2500 },
      seoRequirements: [
        '标题包含"vs"或"对比"',
        '使用表格展示对比数据',
        '添加相关工具的链接',
      ],
      qualityChecks: [
        '对比维度公平客观',
        '数据准确且最新',
        '推荐建议具体明确',
      ],
    },
    isActive: true,
    isDefault: true,
  },
  {
    name: '使用教程模板',
    type: 'tutorial',
    description: '用于编写AI工具使用教程的模板，步骤清晰，配有截图说明',
    structure: [
      { id: 'intro', title: '引言', type: 'text', required: true, description: '说明教程目标和适用人群' },
      { id: 'prerequisites', title: '准备工作', type: 'list', required: true, description: '列出开始前的准备工作' },
      { id: 'step-by-step', title: '详细步骤', type: 'list', required: true, description: '分步骤详细说明操作流程' },
      { id: 'tips', title: '使用技巧', type: 'list', required: false, description: '分享进阶使用技巧' },
      { id: 'common-issues', title: '常见问题', type: 'text', required: false, description: '解答常见问题和解决方法' },
      { id: 'conclusion', title: '总结', type: 'text', required: true, description: '总结学习成果和下一步建议' },
    ],
    guidelines: {
      wordCount: { min: 800, max: 1500 },
      seoRequirements: [
        '标题包含"How to"或"教程"',
        '步骤使用有序列表',
        '关键步骤配截图说明',
      ],
      qualityChecks: [
        '步骤可复现',
        '截图清晰标注',
        '语言简洁明了',
      ],
    },
    isActive: true,
    isDefault: true,
  },
  {
    name: '新闻资讯模板',
    type: 'news',
    description: '用于发布AI工具相关新闻和更新的模板',
    structure: [
      { id: 'headline', title: '新闻标题', type: 'text', required: true, description: '简洁有力的新闻标题' },
      { id: 'summary', title: '新闻摘要', type: 'text', required: true, description: '5W1H要素齐全的新闻摘要' },
      { id: 'details', title: '详细内容', type: 'text', required: true, description: '详细展开新闻内容' },
      { id: 'impact', title: '影响分析', type: 'text', required: false, description: '分析对用户和行业的影响' },
      { id: 'related', title: '相关链接', type: 'list', required: false, description: '提供相关资源链接' },
    ],
    guidelines: {
      wordCount: { min: 500, max: 1000 },
      seoRequirements: [
        '标题包含新闻关键词',
        '及时发布，抓住时效性',
      ],
      qualityChecks: [
        '信息准确可靠',
        '来源标注清晰',
        '客观中立报道',
      ],
    },
    isActive: true,
    isDefault: false,
  },
];

async function main() {
  console.log('🌱 开始创建默认博客文章模板...');

  for (const template of defaultTemplates) {
    const existing = await prisma.blogPostTemplate.findFirst({
      where: { name: template.name },
    });

    if (existing) {
      console.log(`⏭️  ${template.name} 已存在，跳过`);
      continue;
    }

    await prisma.blogPostTemplate.create({
      data: {
        ...template,
        structure: JSON.stringify(template.structure),
        guidelines: JSON.stringify(template.guidelines),
      },
    });

    console.log(`✅ ${template.name} 创建成功`);
  }

  console.log('\n✅ 完成！默认博客文章模板已创建');
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
