import fs from 'fs';
import path from 'path';

/**
 * Decides which tool pages are worth handing to a search engine.
 *
 * Background: most of the 533 tool pages carry only about 30 words that no other
 * page has - a name, one sentence of description and a pricing badge. Google
 * crawled them and declined to index them: Search Console reported 623 pages as
 * "crawled, not indexed" and 408 as "discovered, not indexed", while the whole
 * site's impressions fell from ~2,400 a day to 1-2.
 *
 * The fix is not to invent filler. Fabricated paragraphs that repeat across
 * hundreds of pages are judged more harshly than an honestly short page, and
 * they were the reason neighbouring pages started to look duplicated. Instead
 * this module picks out the pages that already have a reason to exist:
 *
 *  - the tool has its own substance (use cases, pros/cons or examples), or
 *  - an article on the site links to it, so that article is the backing.
 *
 * Everything else stays online and stays linked - it is simply not pushed at
 * Google, so crawl budget and quality signals concentrate on pages that can
 * actually rank.
 */

type ToolRecord = {
  id: number;
  use_cases?: unknown[];
  pros_cons?: unknown;
  examples?: unknown[];
};

let cachedWorthIndexing: Set<number> | null = null;

function loadToolRecords(): ToolRecord[] {
  const toolsPath = path.join(process.cwd(), 'data', 'tools.json');
  if (!fs.existsSync(toolsPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(toolsPath, 'utf8')) as ToolRecord[];
  } catch {
    return [];
  }
}

/**
 * Every tool id that at least one article links to, in the
 * [[link:/tools/<id>|Name]] syntax used inside the post bodies.
 */
function loadCitedToolIds(): Set<number> {
  const cited = new Set<number>();
  const dir = path.join(process.cwd(), 'data', 'blog-posts');
  if (!fs.existsSync(dir)) return cited;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as { content?: string };
      for (const m of (data.content || '').matchAll(/\[\[link:\/tools\/(\d+)\|/g)) {
        cited.add(Number(m[1]));
      }
    } catch {
      // Skip unreadable files rather than failing the whole build.
    }
  }
  return cited;
}

/**
 * Ids of tool pages that have enough substance to be worth indexing.
 * Computed once per process - the scan reads ~440 post files.
 */
export function toolsWorthIndexing(): Set<number> {
  if (cachedWorthIndexing) return cachedWorthIndexing;

  const cited = loadCitedToolIds();
  const keep = new Set<number>();
  for (const tool of loadToolRecords()) {
    const hasOwnContent =
      (tool.use_cases || []).length > 0 || !!tool.pros_cons || (tool.examples || []).length > 0;
    if (hasOwnContent || cited.has(tool.id)) keep.add(tool.id);
  }

  cachedWorthIndexing = keep;
  return keep;
}

export function isToolWorthIndexing(id: number): boolean {
  return toolsWorthIndexing().has(id);
}
