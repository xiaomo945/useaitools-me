import { notFound, permanentRedirect } from 'next/navigation';
import tools from '@/data/tools.json';
import { generateSlugFromName } from '@/lib/slug';

/**
 * Legacy numeric URLs (/tools/123) are permanently redirected to the canonical
 * slug URL (/tool/midjourney).
 *
 * Why: both URLs served the same content, which split crawl budget and ranking
 * signals across two pages per tool. Slug URLs carry the tool name, which is
 * what people actually search for, so they are now canonical. The sitemap only
 * emits /tool/<slug>, and every in-app link still points at /tools/<id>, so they
 * follow this redirect automatically.
 *
 * permanentRedirect() emits 308, which Google treats the same as a 301.
 */
type Tool = { id: number; name: string };

const typedTools = tools as unknown as Tool[];

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const toolId = Number.parseInt(id, 10);

  if (!Number.isFinite(toolId)) {
    notFound();
  }

  const tool = typedTools.find(t => t.id === toolId);
  if (!tool) {
    notFound();
  }

  const slug = generateSlugFromName(tool.name);
  if (!slug) {
    notFound();
  }

  permanentRedirect(`/tool/${slug}`);
}
