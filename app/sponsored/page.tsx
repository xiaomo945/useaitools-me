import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import SponsoredClient, { SponsoredPackage } from './SponsoredClient';

export const metadata: Metadata = {
  title: 'Sponsored listings & advertising on Use AI Tools',
  description:
    'Put your AI tool in front of thousands of active buyers. Category listings $50, homepage features $150, in-content placements $300 per 30 days.',
  openGraph: {
    title: 'Sponsored listings & advertising on Use AI Tools',
    description:
      'Category listings $50, homepage features $150, in-content placements $300 per 30 days.',
    url: 'https://useaitools.me/sponsored',
    siteName: 'Use AI Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sponsored listings & advertising on Use AI Tools',
    description:
      'Category listings $50, homepage features $150, in-content placements $300 per 30 days.',
  },
  alternates: {
    canonical: 'https://useaitools.me/sponsored',
  },
};

/**
 * Shown when the database has not been seeded yet, so the sales page never
 * renders as a broken empty grid while an operator is still setting up.
 * Mirrors prisma/seed-sponsored.ts so the copy stays in one place per surface.
 */
const FALLBACK_PACKAGES: SponsoredPackage[] = [
  {
    id: 'basic',
    name: 'basic',
    displayName: 'Essential',
    description: 'For indie developers and side projects.',
    price: 50,
    currency: 'USD',
    duration: 30,
    position: 'sidebar',
    features: [
      'Sidebar placement for 30 days',
      '10,000+ impressions per month',
      'Click and view tracking',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'pro',
    displayName: 'Featured',
    description: 'For growing teams launching a product',
    price: 150,
    currency: 'USD',
    duration: 30,
    position: 'header',
    features: [
      'Homepage hero placement for 30 days',
      '50,000+ impressions per month',
      'Click-through tracking',
      'Priority positioning',
      'Priority email support',
    ],
  },
  {
    id: 'premium',
    name: 'premium',
    displayName: 'Enterprise',
    description: 'For companies running a serious launch',
    price: 300,
    currency: 'USD',
    duration: 30,
    position: 'inline',
    features: [
      'In-content placement for 30 days',
      '100,000+ impressions per month',
      'Click-through tracking',
      'Best available positioning',
      'Dedicated account contact',
      'Custom performance report',
      'Multi-placement coverage',
    ],
  },
];

function parseFeatures(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw !== 'string' || raw.length === 0) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

async function loadPackages(): Promise<{ packages: SponsoredPackage[]; loaded: boolean }> {
  try {
    const rows = await prisma.sponsoredPackage.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    if (!rows || rows.length === 0) return { packages: FALLBACK_PACKAGES, loaded: false };

    const packages = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      displayName: row.displayName,
      description: row.description ?? null,
      price: row.price,
      currency: row.currency,
      duration: row.duration,
      position: row.position,
      features: parseFeatures(row.features),
    }));

    return { packages, loaded: true };
  } catch (error) {
    console.warn('[sponsored] package load failed, using fallback rate card:', error);
    return { packages: FALLBACK_PACKAGES, loaded: false };
  }
}

export default async function SponsoredPage() {
  const { packages, loaded } = await loadPackages();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Promote your AI tool</h1>
          <p className="text-xl text-gray-600">
            Put your product in front of tens of thousands of actively searching AI buyers.
          </p>
        </div>

        <SponsoredClient packages={packages} seedLoaded={loaded} />
      </div>
    </div>
  );
}
