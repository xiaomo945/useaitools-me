'use client';

import { Share2, MessageCircle, Link as LinkIcon, Check, Globe } from 'lucide-react';
import { useState } from 'react';
import { track } from '@/lib/analytics';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
}

export default function SocialShare({ title, url, description, className = '' }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = [
    {
      name: 'Twitter',
      icon: MessageCircle,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-600 dark:text-sky-400'
    },
    {
      name: 'Facebook',
      icon: Globe,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: Share2,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
    }
  ];

  const handleShare = (platform: string) => {
    track('share', { platform, title });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      handleShare('copy');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">Share:</span>
      {shareLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share to ${link.name}`}
            onClick={() => handleShare(link.name.toLowerCase())}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${link.color}`}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
      <button
        onClick={copyToClipboard}
        aria-label="Copy link"
        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}
