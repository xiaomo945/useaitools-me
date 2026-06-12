'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    // When path changes, trigger a transition
    setTimeout(() => {
      setTransitionKey(prev => prev + 1);
      setDisplayChildren(children);
    }, 0);
  }, [pathname, children]);

  return (
    <div key={transitionKey} className="page-transition">
      {displayChildren}
    </div>
  );
}
