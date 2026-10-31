import { MetadataRoute } from 'next';

/**
 * Single source of truth for /robots.txt.
 *
 * `public/robots.txt` used to exist alongside this route with `Allow: /` and no
 * disallows, so which one won depended on the Next.js version. It has been
 * deleted — this route is the only robots file now.
 *
 * /saved and /history are deliberately NOT disallowed: they are private,
 * per-visitor pages that carry `noindex` in their own metadata. Blocking them
 * here would stop crawlers from ever reading that `noindex`.
 *
 * ── AI crawler policy ────────────────────────────────────────────────────────
 * The split below is deliberate and is NOT "block all AI". There are two kinds
 * of AI crawler and they cost very different things:
 *
 *   • Training crawlers index the site once so its text can go into a model
 *     checkpoint. They never send a visitor back. Pure cost.
 *   • Retrieval crawlers fetch a page because a person just asked a question,
 *     and the answer cites the site. That is referral traffic, which this site
 *     needs, so they stay allowed.
 *
 * Only the first group is blocked. Do NOT add OAI-SearchBot, ChatGPT-User,
 * Claude-User, Claude-SearchBot or PerplexityBot to that list — those are the
 * ones that actually link back.
 *
 * The motivation is concrete: the site burned 100% of its 1M/month ISR read
 * allowance on Vercel's Hobby plan. Training crawlers were a meaningful share
 * of that traffic while returning nothing.
 *
 * /search is disallowed because it is an unbounded query space — every `?q=`
 * permutation is a fresh URL, so crawling it burns crawl budget and server
 * renders without ever producing an indexable page.
 */
export default function robots(): MetadataRoute.Robots {
  // Trailing slashes matter here. `Disallow: /admin/` does not match `/admin` -
  // robots.txt is a prefix match, and the prefix it matches is "/admin/". The
  // bare index of each of these sections was therefore crawlable, thin, and
  // carrying the site's own <title>. Dropping the slash covers both.
  const disallow = ['/api', '/admin', '/private', '/checkout', '/search'];

  // Training-only crawlers: block entirely.
  const trainingCrawlers = [
    'GPTBot',             // OpenAI, model training
    'Google-Extended',    // Gemini / Vertex training (does NOT affect Search)
    'Applebot-Extended',  // Apple Intelligence training (does NOT affect Siri search)
    'CCBot',              // Common Crawl, feeds most public training sets
    'anthropic-ai',       // Anthropic, legacy training crawler
    'ClaudeBot',          // Anthropic, training crawler
    'meta-externalagent', // Meta AI training
    'cohere-ai',          // Cohere training
    'Diffbot',            // bulk dataset vendor
    'ImagesiftBot',       // image dataset vendor
    'Bytespider',         // ByteDance; also ignores robots.txt in practice
    'Amazonbot',          // aggressive, no referral value here
    'PetalBot',           // Huawei, aggressive
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      ...trainingCrawlers.map((userAgent) => ({
        userAgent,
        disallow: '/',
      })),
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow,
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow,
        crawlDelay: 2,
      },
    ],
    sitemap: 'https://useaitools.me/sitemap.xml',
    host: 'https://useaitools.me',
  };
}
