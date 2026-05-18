'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher').then(mod => mod.default), {
  ssr: false
});

export default function LanguageSwitcherWrapper() {
  return (
    <Suspense fallback={null}>
      <LanguageSwitcher />
    </Suspense>
  );
}
