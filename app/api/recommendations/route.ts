import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations, type RecommendationStrategy } from '@/lib/recommendations';

const TIMEOUT_MS = 100;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Recommendation timeout'));
    }, ms);
    promise
      .then((v) => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(timer);
        reject(e);
      });
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const variant = (searchParams.get('variant') as RecommendationStrategy) || 'popular';
    const currentToolId = searchParams.get('currentToolId') || undefined;
    const currentCategory = searchParams.get('currentCategory') || undefined;
    const limitRaw = parseInt(searchParams.get('limit') || '6', 10);
    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(limitRaw, 50)) : 6;

    const results = await withTimeout(
      getRecommendations({
        strategy: variant,
        currentToolId,
        category: currentCategory,
        limit,
      }),
      TIMEOUT_MS
    );

    return NextResponse.json(results || []);
  } catch (e) {
    console.error('api/recommendations GET error:', e);
    return NextResponse.json([]);
  }
}
