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

  // eslint-disable-next-line react-hooks/set-state-in-effect -- Trigger transition animation on route change
  useEffect(() => {
    // When path changes, trigger a transition
    setTransitionKey(prev => prev + 1);
    setDisplayChildren(children);
  }, [pathname, children]);

  return (
    <div key={transitionKey} className="page-transition">
      {displayChildren}
    </div>
  );
}
