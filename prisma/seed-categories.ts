import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始创建分类体系...');

  // 定义主分类和子分类
  const categories = [
    {
      name: 'Writing',
      slug: 'writing',
      description: 'AI writing tools for content creation, copywriting, and text generation',
      icon: 'PenTool',
      sortOrder: 1,
      children: [
        { name: 'Content Writing', slug: 'content-writing', description: 'Blog posts, articles, and long-form content' },
        { name: 'Copywriting', slug: 'copywriting', description: 'Marketing copy, ads, and sales text' },
        { name: 'SEO Writing', slug: 'seo-writing', description: 'SEO-optimized content and keyword research' },
        { name: 'Email Writing', slug: 'email-writing', description: 'Email templates and outreach' },
        { name: 'Social Media', slug: 'social-media-writing', description: 'Social media posts and captions' },
      ],
    },
    {
      name: 'Image',
      slug: 'image',
      description: 'AI image generation and editing tools',
      icon: 'Image',
      sortOrder: 2,
      children: [
        { name: 'Image Generation', slug: 'image-generation', description: 'Text-to-image and AI art generation' },
        { name: 'Image Editing', slug: 'image-editing', description: 'Photo editing and enhancement' },
        { name: 'Background Removal', slug: 'background-removal', description: 'Remove and replace backgrounds' },
        { name: 'Image Upscaling', slug: 'image-upscaling', description: 'Enhance and upscale image resolution' },
      ],
    },
    {
      name: 'Video',
      slug: 'video',
      description: 'AI video creation and editing tools',
      icon: 'Video',
      sortOrder: 3,
      children: [
        { name: 'Video Generation', slug: 'video-generation', description: 'Text-to-video and AI video creation' },
        { name: 'Video Editing', slug: 'video-editing', description: 'Video editing and post-production' },
        { name: 'Video Transcription', slug: 'video-transcription', description: 'Transcribe videos to text' },
        { name: 'Avatar Videos', slug: 'avatar-videos', description: 'AI avatar and talking head videos' },
      ],
    },
    {
      name: 'Audio',
      slug: 'audio',
      description: 'AI audio and music tools',
      icon: 'Music',
      sortOrder: 4,
      children: [
        { name: 'Text to Speech', slug: 'text-to-speech', description: 'Convert text to natural speech' },
        { name: 'Speech to Text', slug: 'speech-to-text', description: 'Transcribe audio to text' },
        { name: 'Music Generation', slug: 'music-generation', description: 'AI music and sound generation' },
        { name: 'Voice Cloning', slug: 'voice-cloning', description: 'Clone and synthesize voices' },
      ],
    },
    {
      name: 'Code',
      slug: 'code',
      description: 'AI coding and development tools',
      icon: 'Code',
      sortOrder: 5,
      children: [
        { name: 'Code Generation', slug: 'code-generation', description: 'Generate code from descriptions' },
        { name: 'Code Review', slug: 'code-review', description: 'Automated code review and suggestions' },
        { name: 'Debugging', slug: 'debugging', description: 'AI-powered debugging tools' },
        { name: 'Documentation', slug: 'code-documentation', description: 'Generate code documentation' },
      ],
    },
    {
      name: 'Productivity',
      slug: 'productivity',
      description: 'AI tools for productivity and workflow automation',
      icon: 'Zap',
      sortOrder: 6,
      children: [
        { name: 'Task Management', slug: 'task-management', description: 'AI-powered task and project management' },
        { name: 'Note Taking', slug: 'note-taking', description: 'Smart note-taking and organization' },
        { name: 'Meeting Assistant', slug: 'meeting-assistant', description: 'Meeting transcription and summaries' },
        { name: 'Workflow Automation', slug: 'workflow-automation', description: 'Automate repetitive tasks' },
      ],
    },
    {
      name: 'Chatbots',
      slug: 'chatbots',
      description: 'AI chatbot and conversational AI tools',
      icon: 'MessageCircle',
      sortOrder: 7,
      children: [
        { name: 'Customer Support', slug: 'customer-support', description: 'Customer service chatbots' },
        { name: 'Conversational AI', slug: 'conversational-ai', description: 'General purpose chatbots' },
        { name: 'Chatbot Builders', slug: 'chatbot-builders', description: 'Build custom chatbots' },
      ],
    },
    {
      name: 'Marketing',
      slug: 'marketing',
      description: 'AI marketing and advertising tools',
      icon: 'TrendingUp',
      sortOrder: 8,
      children: [
        { name: 'SEO Tools', slug: 'seo-tools', description: 'SEO optimization and analysis' },
        { name: 'Social Media Marketing', slug: 'social-media-marketing', description: 'Social media management' },
        { name: 'Ad Copy Generation', slug: 'ad-copy', description: 'Generate ad copy and creatives' },
        { name: 'Email Marketing', slug: 'email-marketing', description: 'Email campaign optimization' },
      ],
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'AI design and creative tools',
      icon: 'Palette',
      sortOrder: 9,
      children: [
        { name: 'UI/UX Design', slug: 'ui-ux-design', description: 'UI and UX design assistance' },
        { name: 'Logo Design', slug: 'logo-design', description: 'AI logo generation' },
        { name: 'Presentation Design', slug: 'presentation-design', description: 'Create presentations with AI' },
        { name: 'Graphic Design', slug: 'graphic-design', description: 'General graphic design tools' },
      ],
    },
    {
      name: 'Data & Analytics',
      slug: 'data-analytics',
      description: 'AI data analysis and business intelligence tools',
      icon: 'BarChart',
      sortOrder: 10,
      children: [
        { name: 'Data Analysis', slug: 'data-analysis', description: 'Analyze and visualize data' },
        { name: 'Business Intelligence', slug: 'business-intelligence', description: 'BI and reporting tools' },
        { name: 'Predictive Analytics', slug: 'predictive-analytics', description: 'Forecasting and predictions' },
      ],
    },
  ];

  // 创建分类
  for (const category of categories) {
    const { children, ...parentData } = category;
    
    const parent = await prisma.category.upsert({
      where: { slug: parentData.slug },
      update: parentData,
      create: parentData,
    });

    console.log(`✅ 创建主分类: ${parent.name}`);

    // 创建子分类
    if (children) {
      for (const child of children) {
        await prisma.category.upsert({
          where: { slug: child.slug },
          update: {
            ...child,
            parentId: parent.id,
          },
          create: {
            ...child,
            parentId: parent.id,
          },
        });
        console.log(`  📁 创建子分类: ${child.name}`);
      }
    }
  }

  console.log('\n🎉 分类体系创建完成！');
  
  // 统计
  const totalCategories = await prisma.category.count();
  const parentCategories = await prisma.category.count({
    where: { parentId: null },
  });
  const subCategories = await prisma.category.count({
    where: { parentId: { not: null } },
  });

  console.log(`\n📊 统计:`);
  console.log(`  总分类数: ${totalCategories}`);
  console.log(`  主分类: ${parentCategories}`);
  console.log(`  子分类: ${subCategories}`);
}

main()
  .catch((e) => {
    console.error('❌ 创建分类失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
