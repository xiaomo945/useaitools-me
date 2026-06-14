import { blogPosts } from '@/data/blog-posts';

function escapeXml(unsafe: string): string {
  return unsafe.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[c] || c,
  );
}

export async function GET() {
  const siteUrl = 'https://useaitools.me';
  const siteTitle = 'Use AI Tools Blog';
  const siteDescription =
    'In-depth AI tool reviews, side-by-side comparisons, and practical guides. Updated weekly with expert insights.';

  const items = (blogPosts || [])
    .slice(0, 200)
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      const title = post.title;
      const description =
        post.description || post.content.replace(/<[^>]+>/g, '').slice(0, 200) + '...';

      return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join('');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>${escapeXml(siteTitle)}</title>
      <link>${siteUrl}</link>
    </image>${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
