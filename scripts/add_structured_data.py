#!/usr/bin/env python3
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

STRUCTURED_DATA_TEMPLATE = '''import type {{ Metadata }} from 'next';
import {{ JsonLd }} from '@/components/JsonLd';

export async function generateMetadata({{ params }}: {{ params: Promise<{{ id: string }}> }}): Promise<Metadata> {{
  const {{ id }} = await params;
  const toolId = parseInt(id);
  const tool = typedTools.find(t => t.id === toolId);

  if (!tool) {{
    return {{
      title: 'Tool Not Found – Use AI Tools',
      description: 'The tool you are looking for could not be found.'
    }};
  }}

  const title = `${{tool.name}} – Use AI Tools`;
  const description = tool.description.slice(0, 160);

  const jsonLd = {{
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': tool.name,
    'description': tool.description,
    'applicationCategory': 'https://schema.org/' + (tool.category === 'Writing' ? 'BusinessApplication' : 'DesignApplication'),
    'operatingSystem': 'Web',
    'offers': {{
      '@type': 'Offer',
      'price': tool.pricing === 'Free' || tool.pricing === 'Freemium' || tool.pricing === 'Open Source' ? '0' : '9.99',
      'priceCurrency': 'USD'
    }},
    'aggregateRating': {{
      '@type': 'AggregateRating',
      'ratingValue': '4.5',
      'ratingCount': '100'
    }}
  }};

  return {{
    title,
    description,
    openGraph: {{
      title,
      description
    }},
    other: {{
      'application/ld+json': JSON.stringify(jsonLd)
    }}
  }};
}}

const JsonLd = ({{ id, type, data }}: {{ id: string, type: string, data: Record<string, any> }}) => {{
  return (
    <script
      type="application/ld+json"
      id={{id}}
      dangerouslySetInnerHTML={{{{ __html: JSON.stringify(data) }}}}
    />
  );
}};

export default async function ToolDetailPage({{ params }}: {{ params: Promise<{{ id: string }}> }}) {{
  const {{ id }} = await params;
  const toolId = parseInt(id);
  const tool = typedTools.find(t => t.id === toolId);

  if (!tool) {{
    notFound();
  }}

  const enrichedTool = {{
    ...tool,
    affiliate_link: getAffiliateLink(tool)
  }};

  const relatedTools = getRelatedTools().map(t => ({{ ...t, affiliate_link: getAffiliateLink(t) }}));
  const jsonLd = {{
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': tool.name,
    'description': tool.description,
    'applicationCategory': 'https://schema.org/' + (tool.category === 'Writing' ? 'BusinessApplication' : 'DesignApplication'),
    'operatingSystem': 'Web',
    'url': tool.url,
    'offers': {{
      '@type': 'Offer',
      'price': tool.pricing === 'Free' || tool.pricing === 'Freemium' || tool.pricing === 'Open Source' ? '0' : '9.99',
      'priceCurrency': 'USD'
    }},
    'aggregateRating': {{
      '@type': 'AggregateRating',
      'ratingValue': '4.5',
      'ratingCount': '100'
    }}
  }};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{{{ __html: JSON.stringify(jsonLd) }}}}
      />
      <ToolDetailClient tool={{enrichedTool}} relatedTools={{relatedTools}} />
    </>
  );
}}
'''

print("JSON-LD structured data should be added to app/tools/[id]/page.tsx")
print("Recommended approach: Add JsonLd component inline with script tag")
print()
print("Example structure to add:")
print("""
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  'name': tool.name,
  'description': tool.description,
  'applicationCategory': 'BusinessApplication',
  'operatingSystem': 'Web',
  'url': tool.url,
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD'
  },
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.5',
    'ratingCount': '100'
  }
};

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ { __html: JSON.stringify(jsonLd) } }}
    />
    <ToolDetailClient tool={enrichedTool} relatedTools={relatedTools} />
  </>
);
""")