'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Advertisement {
  id: string;
  name: string;
  title: string;
  description?: string;
  imageUrl?: string;
  targetUrl: string;
  position: string;
  adType: string;
  status: string;
  advertiser?: string;
}

interface AdvertisementDisplayProps {
  position: string;
  category?: string;
}

export default function AdvertisementDisplay({ position, category }: AdvertisementDisplayProps) {
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvertisement();
  }, [position, category]);

  const fetchAdvertisement = async () => {
    try {
      const params = new URLSearchParams({
        position,
        status: 'active',
      });
      
      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`/api/advertisements?${params.toString()}`);
      const data = await response.json();
      
      if (data.advertisements && data.advertisements.length > 0) {
        setAdvertisement(data.advertisements[0]);
        
        // 记录展示
        await fetch('/api/advertisements/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: data.advertisements[0].id,
            action: 'view',
          }),
        });
      }
    } catch (error) {
      console.error('Failed to fetch advertisement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (!advertisement) return;

    try {
      // 记录点击
      await fetch('/api/advertisements/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: advertisement.id,
          action: 'click',
        }),
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  if (loading || !advertisement) {
    return null;
  }

  const getContainerClass = () => {
    switch (position) {
      case 'header':
        return 'w-full max-w-4xl mx-auto';
      case 'sidebar':
        return 'w-full';
      case 'footer':
        return 'w-full max-w-4xl mx-auto';
      case 'inline':
        return 'w-full';
      default:
        return 'w-full';
    }
  };

  const getStyleClass = () => {
    switch (advertisement.adType) {
      case 'banner':
        return 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800';
      case 'native':
        return 'bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800';
      case 'sponsored':
        return 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800';
      default:
        return 'bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800';
    }
  };

  return (
    <div className={`${getContainerClass()} my-6`}>
      <Link
        href={advertisement.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`block rounded-xl overflow-hidden transition-all hover:shadow-lg ${getStyleClass()}`}
      >
        <div className="p-4">
          <div className="flex items-start gap-4">
            {advertisement.imageUrl && (
              <img
                src={advertisement.imageUrl}
                alt={advertisement.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  {advertisement.adType === 'sponsored' ? '赞助' : '广告'}
                </span>
                {advertisement.advertiser && (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    • {advertisement.advertiser}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 truncate">
                {advertisement.title}
              </h3>
              {advertisement.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {advertisement.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
