import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href: string;
  current?: boolean;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': `https://useaitools.me${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
      />
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center gap-2">
            {index > 0 && (
              <svg className="w-3 h-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {item.current ? (
              <span className="text-gray-900 dark:text-gray-100 font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
