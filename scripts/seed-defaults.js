// Seed script: 初始化联盟链接、赞助位、示例订阅
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

(async () => {
  console.log('🌱 Starting seed...');

  // ============== 1. 联盟链接 ==============
  console.log('\n[1/4] Seeding affiliate links...');
  const affiliateData = [
    { name: 'VEED.io', type: 'signup', network: 'VEED Affiliate Program', url: 'https://veed.io?ref=useaitools' },
    { name: 'Synthesia', type: 'signup', network: 'Synthesia Partner Program', url: 'https://synthesia.io/?ref=useaitools' },
    { name: 'Adobe Firefly', type: 'signup', network: 'Adobe Affiliate', url: 'https://firefly.adobe.com/?ref=useaitools' },
    { name: 'ElevenLabs', type: 'signup', network: 'ElevenLabs Affiliate', url: 'https://elevenlabs.io/?ref=useaitools' },
    { name: 'Outranking', type: 'pricing', network: 'Outranking Affiliate', url: 'https://www.outranking.io/?ref=useaitools' },
    { name: 'Rytr', type: 'signup', network: 'Rytr Affiliate', url: 'https://rytr.me/?ref=useaitools' },
    { name: 'Descript', type: 'signup', network: 'Descript Affiliate', url: 'https://www.descript.com/?ref=useaitools' },
    { name: 'SecurityAI Coder', type: 'pricing', network: 'Direct', url: 'https://securityai.io/?ref=useaitools' },
    { name: 'Replit Ghostwriter', type: 'signup', network: 'Replit', url: 'https://replit.com/?ref=useaitools' },
    { name: 'AgentGPT', type: 'homepage', network: 'Direct', url: 'https://agentgpt.reworkd.ai/?ref=useaitools' },
    { name: 'Submagic', type: 'signup', network: 'Submagic', url: 'https://submagic.io/?ref=useaitools' },
    { name: 'Lalal.ai', type: 'signup', network: 'Lalal.ai', url: 'https://www.lalal.ai/?ref=useaitools' },
    { name: 'Bearly AI', type: 'pricing', network: 'Bearly', url: 'https://bearly.ai/?ref=useaitools' },
    { name: 'Khanmigo', type: 'signup', network: 'Khan Academy', url: 'https://www.khanacademy.org/khanmigo?ref=useaitools' },
    { name: 'Murf AI', type: 'signup', network: 'Murf', url: 'https://murf.ai/?ref=useaitools' },
    { name: 'Voicemod', type: 'signup', network: 'Voicemod', url: 'https://www.voicemod.net/?ref=useaitools' },
  ];

  let createdAff = 0, skippedAff = 0;
  for (const item of affiliateData) {
    const tool = await p.tool.findFirst({
      where: { name: { startsWith: item.name.substring(0, 6) } },
      select: { id: true, slug: true, name: true },
    });

    const existing = await p.affiliateLink.findFirst({
      where: { toolName: { startsWith: item.name.substring(0, 6) } },
    });
    if (existing) { skippedAff++; continue; }

    await p.affiliateLink.create({
      data: {
        toolId: tool?.id || null,
        toolName: tool?.name || item.name,
        linkType: item.type,
        network: item.network,
        affiliateUrl: item.url,
        originalUrl: item.url,
        status: 'active',
        clickCount: Math.floor(Math.random() * 500) + 50,
        conversionCount: Math.floor(Math.random() * 30) + 1,
        revenue: Math.round((Math.random() * 300 + 20) * 100) / 100,
        createdAt: new Date(),
      },
    });
    createdAff++;
    console.log('  +', item.name);
  }
  console.log(`  ✅ Created: ${createdAff}, Skipped: ${skippedAff}`);

  // ============== 2. 赞助位 ==============
  console.log('\n[2/4] Seeding sponsored slots...');
  const slotData = [
    { slot: 'homepage-top', title: '推荐: VEED.io - AI 视频编辑', description: '一站式 AI 视频制作工具，自动字幕、AI 语音、背景生成', url: 'https://veed.io?ref=useaitools', price: 99, advertiser: 'VEED.io' },
    { slot: 'category-sidebar', title: 'AI 写作首选: Rytr', description: '高质量 AI 内容生成，40+ 场景模板', url: 'https://rytr.me?ref=useaitools', price: 49, advertiser: 'Rytr' },
    { slot: 'tool-detail-bottom', title: '试试 Synthesia - AI 虚拟人视频', description: '无需拍摄，10 分钟产出专业视频', url: 'https://synthesia.io?ref=useaitools', price: 79, advertiser: 'Synthesia' },
    { slot: 'blog-bottom', title: '赞助: ElevenLabs - AI 语音合成', description: '100+ 语音，29+ 语言，自然流畅的 AI 语音', url: 'https://elevenlabs.io?ref=useaitools', price: 59, advertiser: 'ElevenLabs' },
  ];

  let createdSlot = 0;
  for (const item of slotData) {
    const existing = await p.sponsoredSlot.findFirst({ where: { slotName: item.slot } });
    if (existing) continue;
    await p.sponsoredSlot.create({
      data: {
        slotName: item.slot,
        title: item.title,
        description: item.description,
        url: item.url,
        price: item.price,
        currency: 'USD',
        advertiser: item.advertiser,
        status: 'active',
        clickCount: Math.floor(Math.random() * 1000) + 100,
        viewCount: Math.floor(Math.random() * 5000) + 500,
        priority: 10,
        createdAt: new Date(),
      },
    });
    createdSlot++;
    console.log('  +', item.slot, '-', item.advertiser);
  }
  console.log(`  ✅ Created: ${createdSlot}`);

  // ============== 3. 示例订阅 ==============
  console.log('\n[3/4] Seeding example subscriptions...');
  const sampleSubs = [
    { email: 'founder@startup.io', name: 'Alex Chen', source: 'homepage' },
    { email: 'designer@studio.ai', name: 'Sarah Kim', source: 'blog-detail' },
    { email: 'devops@company.com', name: 'Mark Johnson', source: 'blog-list' },
    { email: 'pm@product.ai', name: 'Lisa Wang', source: 'homepage' },
    { email: 'editor@magazine.io', name: 'Tom Richards', source: 'tool-detail' },
  ];
  let createdSub = 0;
  for (const s of sampleSubs) {
    const existing = await p.siteSubscription.findUnique({ where: { email: s.email } });
    if (existing) continue;
    await p.siteSubscription.create({
      data: {
        email: s.email,
        name: s.name,
        source: s.source,
        status: 'active',
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    });
    createdSub++;
  }
  console.log(`  ✅ Created: ${createdSub} subscriptions`);

  // ============== 4. 用户交互示例数据 ==============
  console.log('\n[4/4] Seeding user interactions...');
  const topTools = await p.tool.findMany({
    take: 20,
    orderBy: { rating: 'desc' },
    select: { id: true, name: true, category: true },
  });

  const actions = ['view', 'compare', 'click', 'search'];
  let createdInt = 0;
  for (let i = 0; i < 200; i++) {
    const tool = topTools[Math.floor(Math.random() * topTools.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    await p.userInteraction.create({
      data: {
        sessionId: 'session-' + (i % 15),
        actionType: action,
        toolId: tool?.id || null,
        toolName: tool?.name || null,
        category: tool?.category || null,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
    createdInt++;
  }
  console.log(`  ✅ Created: ${createdInt} interactions`);

  console.log('\n🎉 Seed complete!');
  console.log(`  联盟链接: ${createdAff} 个`);
  console.log(`  赞助位: ${createdSlot} 个`);
  console.log(`  订阅: ${createdSub} 个`);
  console.log(`  用户交互: ${createdInt} 条`);

  await p.$disconnect();
})();
