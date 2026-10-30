import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import tools from '@/data/tools.json';
import { blogPosts } from '@/data/blog-posts';
import ToolSlugClient from './ToolSlugClient';
import { getAffiliateLink } from '@/lib/affiliate';
import { generateSlugFromName } from '@/lib/slug';
import { isToolWorthIndexing } from '@/lib/toolQuality';

export { generateSlugFromName };

const SITE_URL = 'https://useaitools.me';

type Tool = {
  id: number;
  name: string;
  description: string;
  description_en?: string;
  renamed_to?: string;
  category: 'Writing' | 'Image' | 'Productivity' | 'Code' | 'Audio' | 'Video';
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  examples?: { prompt: string; image_url: string }[];
  needs_vpn: boolean;
  languages: string[];
  use_cases?: { title: string; detail: string }[];
  pros_cons?: { pros: string[]; cons: string[] };
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  best_for?: string[];
  last_updated?: string;
};

const typedTools = tools as unknown as Tool[];

function findToolBySlug(slug: string): Tool | undefined {
  return typedTools.find(t => generateSlugFromName(t.name) === slug);
}

export async function generateStaticParams() {
  return typedTools
    .map(tool => generateSlugFromName(tool.name))
    .filter(Boolean)
    .map(slug => ({ slug }));
}

// Without this, any /tool/<anything> that is not a real tool is rendered on
// demand as a "Tool Not Found" page with a 200. Search Console was reporting
// those as soft 404s and low-quality pages. Only the slugs above exist now.
export const dynamicParams = false;

/** Real, data-derived answers — no invented claims. */
function buildFaqs(tool: Tool) {
  const isFree = ['Free', 'Freemium', 'Open Source'].includes(tool.pricing);
  const bestFor = tool.best_for?.length
    ? tool.best_for.slice(0, 3).join(', ')
    : `${tool.category.toLowerCase()} work`;
  return [
    {
      question: `What is ${tool.name}?`,
      answer: `${tool.name} is a ${tool.category.toLowerCase()} AI tool listed on Use AI Tools. ${tool.description_en || tool.description}`,
    },
    {
      question: `Is ${tool.name} free?`,
      answer: isFree
        ? `${tool.name} is listed as ${tool.pricing}. Check ${tool.url} for the current plan limits, as vendors change pricing frequently.`
        : `${tool.name} is listed as ${tool.pricing}. Visit ${tool.url} for current pricing and any available trial.`,
    },
    {
      question: `What is ${tool.name} best for?`,
      answer: `${tool.name} is commonly used for ${bestFor}. It supports ${(tool.languages || []).join(', ') || 'English'}${tool.needs_vpn ? ' and may require a VPN in some regions' : ''}.`,
    },
  ];
}

function buildJsonLd(tool: Tool, slug: string) {
  const isFree = ['Free', 'Freemium', 'Open Source'].includes(tool.pricing);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.name,
        // A renamed product should still match the name readers search for,
        // so the current brand goes in alternateName rather than replacing
        // the title and the slug the page is reachable at.
        alternateName: tool.renamed_to,
        description: (tool.description_en || tool.description).slice(0, 500),
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: `${tool.category} AI`,
        operatingSystem: 'Web',
        url: tool.url,
        featureList: [
          `${tool.category} AI tool`,
          `${tool.pricing} pricing`,
          `Supports: ${(tool.languages || []).join(', ') || 'English'}`,
        ],
        offers: {
          '@type': 'Offer',
          price: isFree ? '0' : undefined,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          description: tool.pricing,
          url: tool.url,
        },
        author: { '@type': 'Organization', name: 'Use AI Tools', url: SITE_URL },
        publisher: {
          '@type': 'Organization',
          name: 'Use AI Tools',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: `${tool.category} AI Tools`,
            item: `${SITE_URL}/category/${tool.category.toLowerCase()}`,
          },
          { '@type': 'ListItem', position: 3, name: tool.name, item: `${SITE_URL}/tool/${slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: buildFaqs(tool).map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
}

/**
 * Title and description for a tool page.
 *
 * The old title was `${name} – ${category} AI Tool (${pricing})`, which gave all
 * 1,141 pages the same shape and promised nothing a searcher wants - nobody
 * clicks "Video AI Tool (Paid)". Search Console showed 111 clicks on 19,600
 * impressions (0.6% CTR) at an average position of 17.1, and every top query was
 * a brand name: people looking up one product to decide whether to use it. The
 * page already answers exactly that, with an "Honest Review" section, pros and
 * cons, a pricing badge, an FAQ block and "Alternatives to {name}". So the title
 * now promises what is on the page instead of restating the category.
 *
 * The pattern is capped at 62 characters and stays unique across the whole
 * catalogue because the name is always in it.
 */
function buildToolMeta(tool: Tool) {
  const pricingUnknown = !tool.pricing || tool.pricing === 'Unknown';
  const year = new Date().getFullYear();
  const pricingWord = pricingUnknown ? 'Features' : 'Pricing';

  // The full pattern is 41 characters of suffix, which pushes a long product
  // name past the ~60 characters Google shows before truncating - nine tools
  // were over, the worst at 76. Truncation cuts the part that earns the click
  // ("Pros & Alternatives"), so drop qualifiers from the tail instead until the
  // whole thing fits. Every variant still leads with the name and "Review",
  // which is what these pages are searched for.
  const titleCandidates = [
    `${tool.name} Review ${year}: ${pricingWord}, Pros & Alternatives`,
    `${tool.name} Review ${year}: ${pricingWord} & Pros`,
    `${tool.name} Review ${year}`,
    `${tool.name} Review`,
  ];
  const title =
    titleCandidates.find(candidate => candidate.length <= 62) ?? `${tool.name} Review`;

  // A hard slice at 160 cut descriptions mid-word, so SERPs showed fragments
  // like "assembling footage, a". Prefer the last complete sentence, but only
  // when it fills enough of the snippet: cutting at a short first sentence
  // wastes half the space (the average description here is 220 characters, so
  // most tools have a second sentence worth showing). Below the threshold, fall
  // back to a word boundary and mark the truncation.
  const full = (tool.description_en || tool.description || '').trim();
  let description = full;
  if (full.length > 158) {
    const head = full.slice(0, 158);
    const sentenceEnd = Math.max(
      head.lastIndexOf('. '),
      head.lastIndexOf('! '),
      head.lastIndexOf('? '),
    );
    if (sentenceEnd >= 130) {
      description = head.slice(0, sentenceEnd + 1);
    } else {
      const wordEnd = head.lastIndexOf(' ');
      description = `${head.slice(0, wordEnd > 0 ? wordEnd : 158).trimEnd()}…`;
    }
  }
  return { title, description };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = findToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found – Use AI Tools',
      description: 'The tool you are looking for could not be found.',
      robots: { index: false, follow: true },
    };
  }

  const { title, description } = buildToolMeta(tool);

  // Pages with no use cases, no pros/cons and no article pointing at them are
  // about 30 words of unique text. Google crawled those and declined to index
  // them (623 pages sat in "crawled, not indexed"), so rather than keep paying
  // crawl budget for a page that cannot rank, say so explicitly. They stay
  // online and stay linked; `follow` keeps passing their internal links along.
  const indexable = isToolWorthIndexing(tool.id);

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/tool/${slug}` },
    robots: indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/tool/${slug}`,
      siteName: 'Use AI Tools',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ToolSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = findToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const enrichedTool = {
    ...tool,
    affiliate_link: getAffiliateLink(tool),
  };

  // Related tools: same category, most recently updated first (no fake scores involved).
  //
  // slice(0, 5) meant every page in a category linked to the same five
  // freshest tools, which left 497 of 533 tool pages with no internal link
  // pointing at them at all - invisible to crawlers and to readers. Starting
  // from a per-tool offset instead spreads the links evenly: each page still
  // recommends five same-category tools, but every tool now receives at least
  // five inbound links. Deterministic, so static generation stays stable.
  const sameCategory = typedTools
    .filter(t => t.id !== tool.id && t.category === tool.category)
    .sort((a, b) => (b.last_updated || '').localeCompare(a.last_updated || ''));

  const relatedTools = (() => {
    if (sameCategory.length <= 5) return sameCategory;
    const byId = [...sameCategory].sort((a, b) => a.id - b.id);
    const next = byId.findIndex(t => t.id > tool.id);
    const start = next === -1 ? 0 : next;
    return Array.from({ length: 5 }, (_, k) => byId[(start + k) % byId.length]);
  })().map(t => ({
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.description,
  }));

  // Same rotation for articles: taking the five newest per category left 411
  // of 441 posts with no link from any tool page. Offsetting by the tool id
  // spreads them out while keeping each list newest-first.
  const categoryPosts = blogPosts
    .filter(post => {
      const postCategory = post.category?.toLowerCase() || '';
      const toolCategory = tool.category.toLowerCase();
      return postCategory === toolCategory || postCategory.includes(toolCategory);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // The offset is the tool's rank inside its own category, not its id: ids are
  // sparse, so id % length skipped some posts entirely, while ranking walks the
  // list in contiguous blocks and covers every post in the category.
  const rankInCategory = typedTools
    .filter(t => t.category === tool.category)
    .sort((a, b) => a.id - b.id)
    .findIndex(t => t.id === tool.id);

  // Posts that actually link to this tool come first. A page that only has
  // ~30 words of its own reads far better when the articles beneath it are the
  // ones that discuss it, and it gives the crawler a real reason to follow.
  const citingPosts = blogPosts
    .filter(post => (post.content || '').includes(`[[link:/tools/${tool.id}|`))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const rotatedCategoryPosts = categoryPosts.length <= 5
    ? categoryPosts
    : Array.from(
        { length: 5 },
        (_, k) => categoryPosts[(rankInCategory * 5 + k) % categoryPosts.length],
      );

  const seenSlug = new Set<string>();
  const relatedArticles = [...citingPosts, ...rotatedCategoryPosts]
    .filter(post => {
      if (seenSlug.has(post.slug)) return false;
      seenSlug.add(post.slug);
      return true;
    })
    .slice(0, 5)
    // The card shows a thumbnail, a category, a date, a title and two lines of
    // summary. Sending the whole post meant every tool page carried the full
    // text of five unrelated articles - about 45 KB of the 191 KB document.
    .map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      date: post.date,
      description: post.description,
      category: post.category,
      images: post.images?.slice(0, 1),
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(tool, slug)) }}
      />
      <ToolSlugClient
        tool={enrichedTool}
        relatedTools={relatedTools}
        relatedArticles={relatedArticles}
        slug={slug}
      />
    </>
  );
}
