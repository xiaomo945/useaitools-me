import { NextRequest, NextResponse } from 'next/server';
import tools from '@/data/tools.json';

function getAffiliateLink(tool: { name: string; affiliate_link?: string }): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name.includes('Rytr')) {
    shortEnvVarName = 'AFFILIATE_RYTR';
  } else if (tool.name.includes('VEED')) {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name.includes('Murf')) {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name.includes('Pictory')) {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  } else if (tool.name.includes('Grammarly')) {
    shortEnvVarName = 'AFFILIATE_GRAMMARLY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return envLink || tool.affiliate_link || '';
}

export async function GET(request: NextRequest) {
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

  return NextResponse.json({
    tools: paginatedTools,
    page,
    limit,
    totalCount: enrichedTools.length,
    hasMore
  });
}
