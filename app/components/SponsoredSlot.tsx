'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type SponsoredSlotData = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  advertiser: string | null;
};

type SponsoredSlotProps = {
  slotName: string;
  toolCategory?: string;
};

export default function SponsoredSlot({ slotName, toolCategory }: SponsoredSlotProps) {
  const [slot, setSlot] = useState<SponsoredSlotData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    params.set('slotName', slotName);
    if (toolCategory) {
      params.set('category', toolCategory);
    }

    fetch(`/api/sponsored-slot?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        const slotData: SponsoredSlotData | null =
          data && data.slot
            ? {
                id: data.slot.id,
                title: data.slot.title,
                description: data.slot.description ?? null,
                url: data.slot.url,
                imageUrl: data.slot.imageUrl ?? null,
                advertiser: data.slot.advertiser ?? null,
              }
            : null;
        setSlot(slotData);
        if (slotData) {
          fetch('/api/track-sponsored', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sponsoredSlotId: slotData.id, action: 'view' }),
          }).catch(() => undefined);
        }
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slotName, toolCategory]);

  if (!loaded || !slot) {
    return null;
  }

  const handleClick = () => {
    fetch('/api/track-sponsored', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sponsoredSlotId: slot.id, action: 'click' }),
    }).catch(() => undefined);
  };

  return (
    <section className="relative bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase">
            Sponsored
          </span>
          {slot.advertiser && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {slot.advertiser}
            </span>
          )}
        </div>
        {slot.imageUrl && (
          <div className="mb-4 overflow-hidden rounded-xl relative h-36">
            <Image
              src={slot.imageUrl}
              alt={slot.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {slot.title}
        </h3>
        {slot.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            {slot.description}
          </p>
        )}
        <a
          href={slot.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
        >
          了解更多 →
        </a>
      </div>
    </section>
  );
}
