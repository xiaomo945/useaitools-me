import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

const affiliateKeywords = ['rytr', 'jasper', 'veed', 'grammarly', 'notion', 'surfer', 'copy', 'synthesia', 'runway', 'pictory', 'descript', 'elevenlabs', 'midjourney', 'krisp', 'writesonic', 'wordtune', 'originality', 'adobe', 'canva', 'figma'];

(async () => {
  // 搜索高评分 Writing/Video/Image 类工具，作为联盟候选
  const tools = await p.tool.findMany({
    where: {
      rating: { gte: 4.0 },
      category: { in: ['Writing', 'Video', 'Image', 'Audio', 'Code', 'Productivity'] },
    },
    select: { name: true, slug: true, category: true, rating: true, reviewCount: true, url: true },
    orderBy: { rating: 'desc' },
    take: 50,
  });

  console.log('=== 潜在联盟推广工具 (按评分排序) ===');
  tools.forEach((t, i) => {
    const hit = affiliateKeywords.find(k => t.name.toLowerCase().includes(k));
    const marker = hit ? '⭐' : '  ';
    console.log(`${marker} ${i + 1}. ${t.name} | ${t.category} | rating:${t.rating} rev:${t.reviewCount} | slug:${t.slug}`);
  });

  // 总结各分类 top 工具
  const cats = ['Writing', 'Video', 'Image', 'Audio', 'Code', 'Productivity'];
  console.log('\n=== 各分类 Top 3 ===');
  for (const c of cats) {
    const top = tools.filter(t => t.category === c).slice(0, 3);
    if (top.length) console.log(`  ${c}: ${top.map(t => t.name).join(', ')}`);
  }

  await p.$disconnect();
})();
