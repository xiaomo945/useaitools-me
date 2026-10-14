import toolsData from '@/data/tools.json';
import { generateSlugFromName } from '@/lib/slug';
import type { Tool } from '@/types';

/**
 * Single source of truth for /compare/[slugs].
 *
 * The pairs used to be hard-coded as URL slugs guessed from tool names, and
 * four of the eight never resolved: `hemingway` is not in the directory at all,
 * and the real names are `Canva AI`, `Figma AI`, `Notion AI` and `VEED.io`, so
 * `canva-vs-figma`, `notion-vs-obsidian` and `descript-vs-veed` matched nothing
 * and rendered 404. Pairs are now declared as tool names and slugged through
 * `generateSlugFromName` — the same function `app/tool/[slug]` uses — so a pair
 * either resolves to two real tools or is not emitted at all.
 */
const COMPARISON_PAIRS: [string, string][] = [
  ['Rytr', 'Jasper'],
  ['Midjourney', 'DALL-E 3'],
  ['ChatGPT', 'Claude'],
  ['Grammarly', 'ProWritingAid'],
  ['Canva AI', 'Figma AI'],
  ['Notion AI', 'Obsidian'],
  ['Descript', 'VEED.io'],
  ['Synthesia', 'HeyGen'],
];

const tools = toolsData as unknown as Tool[];

/** slug -> tool, first occurrence wins ('ChatGPT' beats 'ChatGPT Browser'). */
const slugToTool = new Map<string, Tool>();
for (const tool of tools) {
  const slug = generateSlugFromName(tool.name);
  if (slug && !slugToTool.has(slug)) slugToTool.set(slug, tool);
}

export function comparisonSlug(a: string, b: string): string {
  return `${generateSlugFromName(a)}-vs-${generateSlugFromName(b)}`;
}

/** Resolves `/compare/<a>-vs-<b>` to the two tools, or null when either is missing. */
export function resolveComparison(slugs: string): [Tool, Tool] | null {
  const separator = '-vs-';
  const index = slugs.indexOf(separator);
  if (index <= 0) return null;

  const tool1 = slugToTool.get(slugs.slice(0, index));
  const tool2 = slugToTool.get(slugs.slice(index + separator.length));
  return tool1 && tool2 ? [tool1, tool2] : null;
}

/**
 * The comparison URLs that actually render. Consumed by both
 * `app/compare/[slugs]/page.tsx` (generateStaticParams) and `app/sitemap.ts`,
 * so the sitemap can never again list a comparison that 404s.
 */
export const COMPARISON_SLUGS: string[] = COMPARISON_PAIRS.map(([a, b]) =>
  comparisonSlug(a, b),
).filter((slug) => resolveComparison(slug) !== null);
