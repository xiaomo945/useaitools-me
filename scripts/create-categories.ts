import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoryHierarchy = [
  {
    name: 'Writing',
    slug: 'writing',
    description: 'AI 写作工具，帮助你创作高质量内容',
    icon: 'Pen',
    sortOrder: 1,
    children: [
      { name: '博客写作', slug: 'blog-writing', description: '博客文章创作、内容生成工具', sortOrder: 1 },
      { name: '营销文案', slug: 'marketing-copy', description: '广告文案、产品描述、营销内容', sortOrder: 2 },
      { name: '学术写作', slug: 'academic-writing', description: '论文辅助、学术内容生成', sortOrder: 3 },
      { name: '社交媒体', slug: 'social-media', description: '社交媒体帖子、推文生成', sortOrder: 4 },
    ],
  },
  {
    name: 'Image',
    slug: 'image',
    description: 'AI 图像工具，创作精美视觉内容',
    icon: 'Image',
    sortOrder: 2,
    children: [
      { name: '图像生成', slug: 'image-generation', description: '文本转图像、AI 绘画工具', sortOrder: 1 },
      { name: '图像编辑', slug: 'image-editing', description: '图像增强、背景移除、修图工具', sortOrder: 2 },
      { name: '设计工具', slug: 'design-tools', description: 'Logo 设计、UI 设计、平面设计', sortOrder: 3 },
      { name: '图标素材', slug: 'icons-assets', description: '图标生成、素材库、插画工具', sortOrder: 4 },
    ],
  },
  {
    name: 'Video',
    slug: 'video',
    description: 'AI 视频工具，快速制作专业视频',
    icon: 'Video',
    sortOrder: 3,
    children: [
      { name: '视频生成', slug: 'video-generation', description: '文本转视频、AI 视频创作', sortOrder: 1 },
      { name: '视频编辑', slug: 'video-editing', description: '视频剪辑、特效、字幕工具', sortOrder: 2 },
      { name: '动画制作', slug: 'animation', description: '动画生成、动态图形、3D 动画', sortOrder: 3 },
      { name: '屏幕录制', slug: 'screen-recording', description: '屏幕录制、教程视频、演示工具', sortOrder: 4 },
    ],
  },
  {
    name: 'Audio',
    slug: 'audio',
    description: 'AI 音频工具，创作和编辑音频内容',
    icon: 'Headphones',
    sortOrder: 4,
    children: [
      { name: '语音合成', slug: 'text-to-speech', description: '文本转语音、配音工具', sortOrder: 1 },
      { name: '音乐创作', slug: 'music-creation', description: 'AI 作曲、音乐生成、配乐工具', sortOrder: 2 },
      { name: '音频编辑', slug: 'audio-editing', description: '音频剪辑、降噪、混音工具', sortOrder: 3 },
      { name: '语音克隆', slug: 'voice-cloning', description: '声音克隆、语音复制工具', sortOrder: 4 },
    ],
  },
  {
    name: 'Code',
    slug: 'code',
    description: 'AI 编程工具，提升开发效率',
    icon: 'Code',
    sortOrder: 5,
    children: [
      { name: '代码生成', slug: 'code-generation', description: '代码生成、代码补全、自动编程', sortOrder: 1 },
      { name: '代码审查', slug: 'code-review', description: '代码检查、Bug 检测、代码优化', sortOrder: 2 },
      { name: '开发工具', slug: 'dev-tools', description: 'IDE 插件、调试工具、版本控制', sortOrder: 3 },
      { name: 'API 工具', slug: 'api-tools', description: 'API 生成、测试、文档工具', sortOrder: 4 },
    ],
  },
  {
    name: 'Productivity',
    slug: 'productivity',
    description: 'AI 生产力工具，提升工作效率',
    icon: 'Zap',
    sortOrder: 6,
    children: [
      { name: '任务管理', slug: 'task-management', description: '任务规划、项目管理、待办清单', sortOrder: 1 },
      { name: '笔记工具', slug: 'note-taking', description: '智能笔记、知识管理、文档协作', sortOrder: 2 },
      { name: '自动化', slug: 'automation', description: '工作流自动化、流程优化', sortOrder: 3 },
      { name: '数据分析', slug: 'data-analysis', description: '数据处理、可视化、报告生成', sortOrder: 4 },
    ],
  },
];

async function main() {
  console.log('🌱 开始创建工具分类体系...');

  for (const category of categoryHierarchy) {
    // 创建主分类
    const parentCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        sortOrder: category.sortOrder,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        sortOrder: category.sortOrder,
      },
    });

    console.log(`✅ 主分类: ${category.name}`);

    // 创建子分类
    for (const child of category.children) {
      await prisma.category.upsert({
        where: { slug: child.slug },
        update: {
          name: child.name,
          description: child.description,
          sortOrder: child.sortOrder,
          parentId: parentCategory.id,
        },
        create: {
          name: child.name,
          slug: child.slug,
          description: child.description,
          sortOrder: child.sortOrder,
          parentId: parentCategory.id,
        },
      });

      console.log(`  └─ 子分类: ${child.name}`);
    }
  }

  console.log('\n✅ 完成！已创建 6 个主分类和 24 个子分类');
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
