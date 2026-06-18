import { NextRequest, NextResponse } from 'next/server';
import tools from '@/data/tools.json';
import { getAffiliateLink } from '@/lib/affiliate';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const enrichedTools = tools.map(tool => ({
      ...tool,
      affiliate_link: getAffiliateLink(tool)
    }));

    const paginatedTools = enrichedTools.slice(startIndex, endIndex);
    const hasMore = endIndex < enrichedTools.length;

    const response = NextResponse.json({
      tools: paginatedTools,
      page,
      limit,
      totalCount: enrichedTools.length,
      hasMore
    });

    // Cache for 5 minutes, stale-while-revalidate for 10 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return response;
  } catch (error) {
    console.error('Failed to fetch tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
