/**
 * Single source of truth for tool URL slugs.
 *
 * Used by:
 *  - app/tool/[slug]/page.tsx        (canonical tool page)
 *  - app/tools/[id]/page.tsx         (legacy numeric URL -> 308 redirect)
 *  - app/sitemap.ts                  (canonical URLs submitted to Google)
 *  - app/blog/[slug]/page.tsx        (related-tool links inside articles)
 */
export function generateSlugFromName(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Numeric id -> canonical slug path. Returns null when the tool does not exist. */
export function toolSlugById(tools: { id: number; name: string }[], id: number): string | null {
  const tool = tools.find(t => t.id === id);
  if (!tool) return null;
  const slug = generateSlugFromName(tool.name);
  return slug ? `/tool/${slug}` : null;
}
