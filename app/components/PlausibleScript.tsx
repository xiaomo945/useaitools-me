'use client';

import Script from 'next/script';

export default function PlausibleScript() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_URL || 'https://plausible.io';

  if (!plausibleDomain) {
    return null;
  }

  return (
    <Script
      src={`${plausibleUrl}/js/script.js`}
      data-domain={plausibleDomain}
      strategy="afterInteractive"
    />
  );
}
