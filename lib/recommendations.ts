import { prisma } from '@/lib/prisma';

export type RecommendationStrategy = 'popular' | 'similar_category' | 'newest' | 'random' | 'weighted';

export interface RecommendationOptions {
  sessionId?: string;
  currentToolId?: string;
  category?: string;
  limit?: number;
  strategy?: RecommendationStrategy;
  weights?: Partial<Record<RecommendationStrategy, number>>;
}

export interface RecommendedTool {
  id: string;
  name: string;
  category: string;
  slug: string;
  iconUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  description: string | null;
}

function mapToRecommended(tool: {
  id: string;
  name: string;
  category: string;
  slug?: string;
  iconUrl?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  description?: string | null;
}): RecommendedTool {
  const slug =
    tool.slug ||
    tool.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  return {
    id: tool.id,
    name: tool.name,
    category: tool.category,
    slug,
    iconUrl: tool.iconUrl ?? null,
    rating: tool.rating ?? null,
    reviewCount: tool.reviewCount ?? null,
    description: tool.description ?? null,
  };
}

async function getPopular(limit: number): Promise<RecommendedTool[]> {
  try {
    const tools = await prisma.tool.findMany({
      where: { isActive: true },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' },
      ],
      take: Math.max(limit * 3, 20),
      select: {
        id: true,
        name: true,
        category: true,
        slug: true,
        iconUrl: true,
        rating: true,
        reviewCount: true,
        description: true,
      },
    });

    const shuffled = [...tools].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit).map(mapToRecommended);
  } catch (e) {
    console.error('recommendations.getPopular error:', e);
    return [];
  }
}

async function getSimilarCategory(toolId: string | undefined, category: string | undefined, limit: number): Promise<RecommendedTool[]> {
  try {
    const whereClause: any = { isActive: true };
    if (category) {
      whereClause.category = category;
    } else if (toolId) {
      const ref = await prisma.tool.findUnique({
        where: { id: toolId },
        select: { category: true },
      });
      if (ref?.category) whereClause.category = ref.category;
    }
    if (toolId) whereClause.id = { not: toolId };

    const tools = await prisma.tool.findMany({
      where: whereClause,
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        category: true,
        slug: true,
        iconUrl: true,
        rating: true,
        reviewCount: true,
        description: true,
      },
    });
    return tools.map(mapToRecommended);
  } catch (e) {
    console.error('recommendations.getSimilarCategory error:', e);
    return [];
  }
}

async function getNewest(limit: number): Promise<RecommendedTool[]> {
  try {
    const tools = await prisma.tool.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        category: true,
        slug: true,
        iconUrl: true,
        rating: true,
        reviewCount: true,
        description: true,
      },
    });
    return tools.map(mapToRecommended);
  } catch (e) {
    console.error('recommendations.getNewest error:', e);
    return [];
  }
}

async function getRandom(limit: number): Promise<RecommendedTool[]> {
  try {
    const categories = await prisma.tool.groupBy({
      by: ['category'],
      where: { isActive: true },
    });
    const cats = categories.map((c) => c.category);
    if (cats.length === 0) return [];

    const perCat = Math.ceil(limit / cats.length) + 1;
    const all: RecommendedTool[] = [];
    const seen = new Set<string>();

    for (const cat of cats) {
      const tools = await prisma.tool.findMany({
        where: { isActive: true, category: cat },
        take: perCat,
        orderBy: { rating: 'desc' },
        select: {
          id: true,
          name: true,
          category: true,
          slug: true,
          iconUrl: true,
          rating: true,
          reviewCount: true,
          description: true,
        },
      });
      for (const t of tools) {
        if (!seen.has(t.id)) {
          seen.add(t.id);
          all.push(mapToRecommended(t));
        }
      }
    }

    return all.sort(() => Math.random() - 0.5).slice(0, limit);
  } catch (e) {
    console.error('recommendations.getRandom error:', e);
    return [];
  }
}

async function getWeighted(options: RecommendationOptions, limit: number): Promise<RecommendedTool[]> {
  try {
    const weights: Record<string, number> = {
      popular: options.weights?.popular ?? 0.4,
      similar_category: options.weights?.similar_category ?? (options.currentToolId || options.category ? 0.5 : 0),
      newest: options.weights?.newest ?? 0.2,
      random: options.weights?.random ?? 0.1,
    };

    const [popularList, similarList, newestList, randomList] = await Promise.all([
      getPopular(limit * 2),
      getSimilarCategory(options.currentToolId, options.category, limit * 2),
      getNewest(limit * 2),
      getRandom(limit),
    ]);

    const scored: Map<string, { tool: RecommendedTool; score: number }> = new Map();
    const addScore = (list: RecommendedTool[], weight: number) => {
      list.forEach((tool, idx) => {
        const rankBonus = Math.max(0, 1 - idx / Math.max(list.length, 1));
        const current = scored.get(tool.id);
        const add = weight * (0.5 + rankBonus * 0.5);
        if (current) {
          current.score += add;
        } else {
          scored.set(tool.id, { tool, score: add });
        }
      });
    };

    addScore(popularList, weights.popular);
    addScore(similarList, weights.similar_category);
    addScore(newestList, weights.newest);
    addScore(randomList, weights.random);

    const excludeId = options.currentToolId;
    return Array.from(scored.values())
      .filter((item) => !excludeId || item.tool.id !== excludeId)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.tool);
  } catch (e) {
    console.error('recommendations.getWeighted error:', e);
    return [];
  }
}

export async function getRecommendations(options: RecommendationOptions = {}): Promise<RecommendedTool[]> {
  const { strategy = 'popular', limit = 6, currentToolId, category } = options;
  const safeLimit = Math.max(1, Math.min(limit, 50));

  try {
    switch (strategy) {
      case 'similar_category':
        return getSimilarCategory(currentToolId, category, safeLimit);
      case 'newest':
        return getNewest(safeLimit);
      case 'random':
        return getRandom(safeLimit);
      case 'weighted':
        return getWeighted(options, safeLimit);
      case 'popular':
      default:
        return getPopular(safeLimit);
    }
  } catch (e) {
    console.error('recommendations.getRecommendations error:', e);
    return [];
  }
}
