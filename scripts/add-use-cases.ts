import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 为每个分类定义使用场景模板
const useCaseTemplates: Record<string, Array<{ title: string; detail: string }>> = {
  Writing: [
    {
      title: '博客文章创作',
      detail: '使用 AI 工具快速生成高质量的博客文章，包括标题、大纲、正文内容，节省 80% 的写作时间。'
    },
    {
      title: '营销文案撰写',
      detail: '生成吸引人的广告文案、产品描述、社交媒体帖子，提升转化率和用户参与度。'
    },
    {
      title: '学术论文辅助',
      detail: '帮助研究人员整理论文结构、润色语言表达、生成文献综述，提高学术写作效率。'
    },
    {
      title: '邮件模板生成',
      detail: '快速生成专业的商务邮件、客户跟进邮件、求职信等，确保语法正确、语气得体。'
    }
  ],
  Image: [
    {
      title: '产品图片生成',
      detail: '为电商产品生成高质量的展示图片，支持多种风格和背景，降低摄影成本。'
    },
    {
      title: '社交媒体配图',
      detail: '快速生成适合 Instagram、Facebook、Twitter 等平台的精美配图，提升内容吸引力。'
    },
    {
      title: '品牌 Logo 设计',
      detail: '使用 AI 生成品牌 Logo 概念图，提供设计灵感，加速品牌视觉识别系统开发。'
    },
    {
      title: '艺术创作辅助',
      detail: '帮助艺术家和设计师探索创意方向，生成概念艺术、插画、角色设计等。'
    }
  ],
  Video: [
    {
      title: '短视频制作',
      detail: '快速生成适合 TikTok、YouTube Shorts 的短视频内容，包括脚本、画面、配音。'
    },
    {
      title: '产品演示视频',
      detail: '为产品创建专业的演示视频，展示功能特点，提升用户理解和购买意愿。'
    },
    {
      title: '教育培训视频',
      detail: '生成教学视频、培训课程，支持多语言配音，扩大教育内容覆盖面。'
    },
    {
      title: '营销宣传片',
      detail: '制作企业宣传片、产品广告视频，降低视频制作成本，提高营销效率。'
    }
  ],
  Audio: [
    {
      title: '播客内容生成',
      detail: '生成播客脚本、话题大纲，支持多语言语音合成，快速制作高质量播客内容。'
    },
    {
      title: '有声书制作',
      detail: '将文本内容转换为自然流畅的语音，制作有声书，支持多种音色和语速调节。'
    },
    {
      title: '音乐创作辅助',
      detail: '生成背景音乐、音效，支持多种风格，为视频、游戏、应用提供音频素材。'
    },
    {
      title: '语音克隆',
      detail: '克隆特定人声，用于个性化语音助手、品牌声音定制等场景。'
    }
  ],
  Code: [
    {
      title: '代码生成与补全',
      detail: '根据自然语言描述生成代码片段，自动补全代码，提高开发效率，减少重复劳动。'
    },
    {
      title: '代码审查与优化',
      detail: '自动检测代码问题、性能瓶颈，提供优化建议，提升代码质量和可维护性。'
    },
    {
      title: '文档自动生成',
      detail: '为代码自动生成文档注释、API 文档、README，确保文档与代码同步更新。'
    },
    {
      title: 'Bug 修复辅助',
      detail: '分析错误日志、堆栈信息，定位问题根源，提供修复方案和代码建议。'
    }
  ],
  Productivity: [
    {
      title: '会议纪要整理',
      detail: '自动记录会议内容，生成结构化纪要，提取关键决策和行动项，节省整理时间。'
    },
    {
      title: '任务管理与规划',
      detail: '智能分解任务、设置优先级、生成工作计划，帮助团队高效协作。'
    },
    {
      title: '数据分析报告',
      detail: '自动分析数据、生成可视化图表、撰写分析报告，支持数据驱动决策。'
    },
    {
      title: '知识库构建',
      detail: '整理文档、建立知识图谱、智能搜索，提升团队知识管理和复用效率。'
    }
  ]
};

async function main() {
  console.log('🌱 开始添加工具使用场景...');

  const tools = await prisma.tool.findMany({
    select: { id: true, name: true, category: true },
  });

  console.log(`找到 ${tools.length} 个工具`);

  let updated = 0;

  for (const tool of tools) {
    const category = tool.category as string;
    const useCases = useCaseTemplates[category];

    if (useCases) {
      // 根据工具特点微调使用场景
      const customizedCases = useCases.map((uc, idx) => ({
        title: uc.title,
        detail: uc.detail.replace('AI 工具', tool.name).replace('AI', tool.name)
      }));

      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          useCases: JSON.stringify(customizedCases)
        }
      });

      updated++;
      console.log(`✅ ${tool.name} (${category}) - ${customizedCases.length} 个使用场景`);
    }
  }

  console.log(`\n✅ 完成！已更新 ${updated} 个工具的使用场景`);
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
