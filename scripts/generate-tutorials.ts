import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateTutorialContent(toolName: string, toolDescription: string): string {
  return `# ${toolName} 使用教程：从零开始掌握这款 AI 工具

## 引言

${toolName} 是一款功能强大的 AI 工具，但对于新手来说，如何快速上手可能是个问题。本教程将带你从零开始，逐步掌握 ${toolName} 的核心功能和使用技巧。

## 准备工作

### 1. 注册账号
- 访问 ${toolName} 官网
- 点击"注册"按钮
- 填写邮箱和密码
- 验证邮箱（检查垃圾邮件文件夹）

### 2. 选择套餐
- **免费版**：适合个人试用，功能有限
- **专业版**：适合小型团队，功能完整
- **企业版**：适合大型组织，高级功能

### 3. 熟悉界面
登录后，你会看到主界面分为几个区域：
- **顶部导航栏**：快速访问主要功能
- **左侧菜单**：详细功能列表
- **中央工作区**：主要内容展示区
- **右侧面板**：设置和工具选项

## 基础操作

### 第一步：创建新项目

1. 点击"新建项目"按钮
2. 输入项目名称
3. 选择项目类型（文本、图像、视频等）
4. 点击"创建"

### 第二步：配置参数

在右侧面板中，你可以调整以下参数：
- **语言**：选择输出语言
- **风格**：选择内容风格（正式、轻松、专业等）
- **长度**：设置内容长度（短、中、长）
- **质量**：选择生成质量（标准、高质量）

### 第三步：生成内容

1. 在输入框中输入提示词或上传素材
2. 点击"生成"按钮
3. 等待 AI 处理（通常需要 5-30 秒）
4. 查看生成结果

### 第四步：编辑和优化

- **复制**：一键复制生成内容
- **下载**：导出为文件（TXT、PDF、PNG 等）
- **编辑**：在编辑器中修改内容
- **重新生成**：对结果不满意可以重新生成

## 进阶技巧

### 技巧 1：优化提示词

好的提示词能显著提升生成质量：

**差的提示词**：
\`\`\`
写一篇文章
\`\`\`

**好的提示词**：
\`\`\`
写一篇关于 AI 写作工具的文章，目标读者是内容创作者，
字数 800-1000 字，语气专业但友好，包含实际案例
\`\`\`

### 技巧 2：批量处理

${toolName} 支持批量处理多个任务：

1. 准备 CSV 文件，包含多组输入
2. 上传文件到批量处理页面
3. 设置统一参数
4. 点击"批量生成"
5. 下载结果文件

### 技巧 3：使用模板

${toolName} 提供多种预设模板：

- **博客文章模板**：快速生成结构化文章
- **营销文案模板**：生成吸引人的广告文案
- **社交媒体模板**：适合各平台的帖子格式
- **邮件模板**：专业邮件格式

### 技巧 4：API 集成

如果你需要自动化流程，可以使用 API：

\`\`\`javascript
const response = await fetch('https://api.example.com/generate', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: JSON.stringify({
    prompt: '你的提示词',
    options: { quality: 'high' }
  })
});
const data = await response.json();
\`\`\`

## 常见问题

### Q1: 生成速度慢怎么办？
**A**: 检查网络连接，或尝试降低生成质量设置。高峰期可能需要等待。

### Q2: 生成内容不满意？
**A**: 优化提示词，添加更多细节和约束条件。也可以尝试不同的风格设置。

### Q3: 如何保存历史记录？
**A**: 所有生成内容都会自动保存到"历史记录"页面，可以随时查看和下载。

### Q4: 是否支持多语言？
**A**: 是的，${toolName} 支持多种语言，可以在设置中切换。

### Q5: 免费版有什么限制？
**A**: 免费版每月有生成次数限制，部分高级功能不可用。建议升级到专业版。

## 最佳实践

### 1. 明确目标
在使用 ${toolName} 之前，先明确你的目标：
- 要生成什么类型的内容？
- 目标受众是谁？
- 期望的输出质量如何？

### 2. 迭代优化
不要期望一次生成完美结果。通过多次迭代，逐步优化：
- 第一次：生成初稿
- 第二次：调整细节
- 第三次：完善质量

### 3. 结合人工编辑
AI 生成的内容通常需要人工润色：
- 检查事实准确性
- 调整语气和风格
- 添加个人观点和案例

### 4. 定期备份
重要内容及时备份，避免意外丢失。

## 总结

通过本教程，你已经掌握了 ${toolName} 的基础操作和进阶技巧。记住，熟练使用 AI 工具需要时间和实践。多尝试不同的提示词和设置，找到最适合你的工作方式。

**下一步**：
- 尝试使用不同模板
- 探索高级功能
- 阅读官方文档了解更多

---

*如有疑问，欢迎在评论区留言讨论。*
`;
}

async function main() {
  console.log('🌱 开始生成 20 篇使用教程...');

  let tutorialCategory = await prisma.blogCategory.findFirst({
    where: { slug: 'tutorials' },
  });

  if (!tutorialCategory) {
    tutorialCategory = await prisma.blogCategory.create({
      data: {
        name: '使用教程',
        slug: 'tutorials',
        description: 'AI 工具使用教程和技巧',
      },
    });
    console.log('✅ 创建教程分类');
  }

  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { email: 'admin@useaitools.me', name: 'Use AI Tools', role: 'admin' },
    });
  }

  const tutorialTemplate = await prisma.blogPostTemplate.findFirst({
    where: { type: 'tutorial' },
  });

  const tools = await prisma.tool.findMany({
    take: 20,
    orderBy: { rating: 'desc' },
  });

  let created = 0;
  let skipped = 0;

  for (const tool of tools) {
    const slug = `tutorial-${tool.slug}`;

    const existing = await prisma.blogPost.findFirst({ where: { slug } });
    if (existing) {
      skipped++;
      continue;
    }

    const content = generateTutorialContent(tool.name, tool.description);

    await prisma.blogPost.create({
      data: {
        title: `${tool.name} 使用教程：从零开始完全掌握`,
        slug,
        excerpt: `详细讲解 ${tool.name} 的使用方法，从注册账号到高级技巧，帮你快速上手这款 AI 工具。`,
        content,
        metaTitle: `${tool.name} 使用教程 2026 - 完整指南`,
        metaDescription: `从零开始学习 ${tool.name}，包含详细步骤、进阶技巧和常见问题解答，帮你快速掌握这款 AI 工具。`,
        tags: JSON.stringify(['教程', '使用指南', tool.category, tool.name]),
        relatedToolIds: JSON.stringify([tool.id]),
        categoryId: tutorialCategory.id,
        authorId: user.id,
        templateId: tutorialTemplate?.id,
        isPublished: true,
        publishedAt: new Date(),
        isFeatured: created < 5,
      },
    });

    created++;
    console.log(`✅ [${created}/20] ${tool.name} 教程已创建`);
  }

  console.log(`\n✅ 完成！`);
  console.log(`   已创建: ${created} 篇教程`);
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
