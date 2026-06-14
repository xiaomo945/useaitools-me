import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 为每个分类定义描述模板
const descriptionTemplates: Record<string, (toolName: string) => string> = {
  Writing: (toolName) => `${toolName} 是一款专业的 AI 写作工具，专为内容创作者、营销人员和作家设计。它利用先进的人工智能技术，帮助你快速生成高质量的文章、博客帖子、营销文案和社交媒体内容。

核心功能包括：智能内容生成、多语言支持、SEO 优化建议、语法检查和风格调整。无论你是需要撰写产品描述、电子邮件模板还是长篇博客文章，${toolName} 都能提供专业级别的写作辅助。

${toolName} 的独特之处在于其深度学习算法能够理解上下文语境，生成自然流畅、符合品牌语调的内容。它还支持多种写作风格，从正式商务到轻松活泼，满足不同的内容需求。

使用 ${toolName}，你可以将写作时间缩短 70%，同时提升内容质量和一致性。适合个人博主、企业营销团队、自由撰稿人和内容营销专家。`,

  Image: (toolName) => `${toolName} 是一款强大的 AI 图像生成和编辑工具，为设计师、营销人员和创意工作者提供专业级的视觉内容创作能力。它利用先进的生成式 AI 技术，让你能够通过简单的文字描述创建高质量的图像、插图和设计作品。

核心功能包括：文本到图像生成、图像风格转换、背景移除和替换、图像增强和修复、批量图像处理。${toolName} 支持多种艺术风格，从写实摄影到抽象艺术，从扁平设计到 3D 渲染。

${toolName} 的优势在于其直观的界面和强大的定制能力。你可以精确控制图像的构图、色彩、光影和细节，生成完全符合品牌视觉标准的内容。它还支持高分辨率输出，适合印刷和数字媒体使用。

使用 ${toolName}，你可以在几分钟内完成原本需要数小时的设计工作，大幅降低设计成本。适合平面设计师、社交媒体经理、电商运营和创意总监。`,

  Video: (toolName) => `${toolName} 是一款创新的 AI 视频创作工具，让任何人都能轻松制作专业级别的视频内容。它利用先进的人工智能技术，将文字、图片和音频转化为引人入胜的视频作品。

核心功能包括：文本到视频生成、智能视频剪辑、自动字幕添加、视频风格转换、背景音乐匹配。${toolName} 支持多种视频格式和比例，从短视频到长视频，从竖屏到横屏。

${toolName} 的独特之处在于其智能场景识别和自动编辑功能。它能够分析内容结构，自动添加转场效果、节奏调整和视觉增强，让视频更具吸引力。它还支持多语言配音和字幕，帮助你触达全球受众。

使用 ${toolName}，你可以将视频制作时间从数天缩短到数小时，无需专业的视频编辑技能。适合内容创作者、营销人员、教育工作者和社交媒体运营。`,

  Audio: (toolName) => `${toolName} 是一款专业的 AI 音频工具，为音乐制作人、播客主持人和内容创作者提供全方位的音频处理和创作能力。它利用先进的音频 AI 技术，让你能够轻松生成、编辑和优化音频内容。

核心功能包括：文本到语音合成、音乐生成、音频增强、噪音消除、语音克隆。${toolName} 支持多种语音风格和音乐类型，从自然对话到专业播音，从古典音乐到电子音乐。

${toolName} 的优势在于其高质量的音频输出和灵活的定制选项。你可以精确控制语音的语调、节奏和情感，生成逼真的配音效果。它还支持多轨道编辑和音频混合，满足专业级别的制作需求。

使用 ${toolName}，你可以在没有专业录音棚和设备的情况下，制作出广播级别的音频内容。适合播客制作人、音乐创作者、有声书制作和视频配音。`,

  Code: (toolName) => `${toolName} 是一款智能的 AI 编程助手，为开发者提供全方位的代码生成、优化和调试支持。它利用先进的代码理解技术，帮助你快速编写高质量代码、解决编程难题和提升开发效率。

核心功能包括：代码自动生成、智能代码补全、代码审查和优化、Bug 检测和修复、文档自动生成。${toolName} 支持多种编程语言和框架，包括 JavaScript、Python、Java、React、Vue 等。

${toolName} 的独特之处在于其深度代码理解能力。它不仅能生成语法正确的代码，还能理解业务逻辑、遵循最佳实践、考虑性能优化。它还支持与 IDE 集成，提供实时的编码建议和错误提示。

使用 ${toolName}，你可以将编码效率提升 50%，减少 Bug 数量，加速项目交付。适合全栈开发者、前端工程师、后端开发者和编程初学者。`,

  Productivity: (toolName) => `${toolName} 是一款智能的 AI 生产力工具，帮助个人和团队提升工作效率、优化工作流程和管理复杂任务。它利用先进的人工智能技术，自动化重复性工作、智能分析数据并提供决策支持。

核心功能包括：任务管理和规划、自动化工作流、数据分析报告、知识库管理、团队协作工具。${toolName} 支持与多种主流工具集成，包括 Slack、Notion、Google Workspace 和 Microsoft 365。

${toolName} 的优势在于其智能优先级排序和时间管理功能。它能够分析任务紧急程度、依赖关系和个人工作习惯，自动生成最优的工作计划。它还支持自定义自动化规则，减少手动操作。

使用 ${toolName}，你可以将日常管理工作时间减少 40%，专注于高价值的创造性工作。适合项目经理、团队领导、自由职业者和知识工作者。`,
};

async function main() {
  console.log('🌱 开始优化工具描述...');

  const tools = await prisma.tool.findMany({
    select: { id: true, name: true, category: true, description: true },
  });

  console.log(`找到 ${tools.length} 个工具`);

  let updated = 0;
  let skipped = 0;

  for (const tool of tools) {
    // 如果描述已经足够长（200+ 字符），跳过
    if (tool.description && tool.description.length >= 200) {
      skipped++;
      continue;
    }

    const category = tool.category as string;
    const template = descriptionTemplates[category];

    if (template) {
      const newDescription = template(tool.name);

      await prisma.tool.update({
        where: { id: tool.id },
        data: { description: newDescription },
      });

      updated++;
      console.log(`✅ ${tool.name} (${category}) - ${newDescription.length} 字符`);
    }
  }

  console.log(`\n✅ 完成！`);
  console.log(`   已更新: ${updated} 个工具`);
  console.log(`   已跳过: ${skipped} 个工具（描述已足够长）`);
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
