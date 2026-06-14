const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  const total = await p.tool.count();
  console.log('Total tools:', total);

  const withAff = await p.tool.findMany({
    where: { AND: [{ affiliateUrl: { not: null } }, { affiliateUrl: { not: '' } }] },
    take: 30,
    select: { name: true, slug: true, affiliateUrl: true, category: true, rating: true },
  });
  console.log('Tools with affiliateUrl:', withAff.length);
  withAff.slice(0, 10).forEach(t => console.log('  ', t.name, '|', t.category, '|', String(t.affiliateUrl).substring(0, 50)));

  const cats = await p.tool.groupBy({ by: ['category'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } });
  console.log('\nCategories:');
  cats.slice(0, 12).forEach(c => console.log('  ', c.category, c._count.id));

  try { console.log('Subscriptions:', await p.siteSubscription.count()); } catch (e) { console.log('Subscriptions: table missing'); }
  try { console.log('SponsoredSlots:', await p.sponsoredSlot.count()); } catch (e) { console.log('SponsoredSlots: table missing'); }
  try { console.log('AffiliateLinks:', await p.affiliateLink.count()); } catch (e) { console.log('AffiliateLinks: table missing'); }

  await p.$disconnect();
})();
