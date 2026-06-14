import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AffiliateAdminClient from './AffiliateAdminClient';

export const dynamic = 'force-dynamic';

type AffiliateLinkRow = {
  id: string;
  toolId: string | null;
  toolName: string;
  linkType: string;
  affiliateUrl: string;
  network: string | null;
  status: string;
  clickCount: number;
  conversionCount: number;
  revenue: number;
  createdAt: string;
};

async function getAffiliateLinks(): Promise<{
  links: AffiliateLinkRow[];
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
}> {
  try {
    const tools = await prisma.tool.findMany({
      where: { affiliateUrl: { not: null } },
      orderBy: { clickCount: 'desc' }
    });

    const links: AffiliateLinkRow[] = (tools as any[]).map((tool) => ({
      id: tool.id,
      toolId: tool.id,
      toolName: tool.name,
      linkType: 'tool',
      affiliateUrl: tool.affiliateUrl || '',
      network: null,
      status: tool.isActive ? 'active' : 'inactive',
      clickCount: tool.clickCount || 0,
      conversionCount: 0,
      revenue: 0,
      createdAt: tool.createdAt.toISOString()
    }));

    const totalClicks = links.reduce((sum, l) => sum + (l.clickCount || 0), 0);
    const totalConversions = links.reduce((sum, l) => sum + (l.conversionCount || 0), 0);
    const totalRevenue = links.reduce((sum, l) => sum + (l.revenue || 0), 0);

    return { links, totalClicks, totalConversions, totalRevenue };
  } catch (e) {
    console.error('Failed to load affiliate links:', e);
    return { links: [], totalClicks: 0, totalConversions: 0, totalRevenue: 0 };
  }
}

export default async function AffiliateAdminPage() {
  const data = await getAffiliateLinks();

  return <AffiliateAdminClient initialData={data} />;
}
