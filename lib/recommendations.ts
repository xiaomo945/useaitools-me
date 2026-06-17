import toolsData from '@/data/tools.json';

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

interface JsonTool {
  id: number;
  name: string;
  category: string;
  slug?: string;
  icon_url?: string;
  rating?: number;
  rating_count?: number;
  description?: string;
  last_updated?: string;
  [key: string]: any;
}

const tools = toolsData as JsonTool[];

function toSlug(tool: JsonTool): string {
  return tool.slug || tool.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapTool(tool: JsonTool): RecommendedTool {
  return {
    id: String(tool.id),
    name: tool.name,
    category: tool.category,
    slug: toSlug(tool),
    iconUrl: tool.icon_url || null,
    rating: tool.rating ?? null,
    reviewCount: tool.rating_count ?? null,
    description: tool.description ?? null,
  };
}

function getPopular(limit: number): RecommendedTool[] {
  return [...tools]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, Math.max(limit * 3, 20))
    .sort(() => Math.random() - 0.5)
    .slice(0, limit)
    .map(mapTool);
}

function getSimilarCategory(toolId: string | undefined, category: string | undefined, limit: number): RecommendedTool[] {
  let targetCategory = category;
  if (!targetCategory && toolId) {
    const ref = tools.find(t => String(t.id) === toolId);
    if (ref) targetCategory = ref.category;
  }

  let filtered = tools;
  if (targetCategory) {
    filtered = tools.filter(t => t.category === targetCategory);
  }
  if (toolId) {
    filtered = filtered.filter(t => String(t.id) !== toolId);
  }

  return filtered
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit)
    .map(mapTool);
}

function getNewest(limit: number): RecommendedTool[] {
  return [...tools]
    .sort((a, b) => {
      const dateA = a.last_updated ? new Date(a.last_updated).getTime() : 0;
      const dateB = b.last_updated ? new Date(b.last_updated).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit)
    .map(mapTool);
}

function getRandom(limit: number): RecommendedTool[] {
  const categories = [...new Set(tools.map(t => t.category))];
  if (categories.length === 0) return [];

  const perCat = Math.ceil(limit / categories.length) + 1;
  const all: RecommendedTool[] = [];
  const seen = new Set<string>();

  for (const cat of categories) {
    const catTools = tools
      .filter(t => t.category === cat)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, perCat);
    for (const t of catTools) {
      const id = String(t.id);
      if (!seen.has(id)) {
        seen.add(id);
        all.push(mapTool(t));
      }
    }
  }

  return all.sort(() => Math.random() - 0.5).slice(0, limit);
}

function getWeighted(options: RecommendationOptions, limit: number): RecommendedTool[] {
  const weights: Record<string, number> = {
    popular: options.weights?.popular ?? 0.4,
    similar_category: options.weights?.similar_category ?? (options.currentToolId || options.category ? 0.5 : 0),
    newest: options.weights?.newest ?? 0.2,
    random: options.weights?.random ?? 0.1,
  };

  const popularList = getPopular(limit * 2);
  const similarList = getSimilarCategory(options.currentToolId, options.category, limit * 2);
  const newestList = getNewest(limit * 2);
  const randomList = getRandom(limit);

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
    .filter(item => !excludeId || item.tool.id !== excludeId)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.tool);
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
