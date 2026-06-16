'use client';

import { useState } from 'react';
import Link from 'next/link';
import toolsData from '@/data/tools.json';

type Tool = {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  rating?: number;
  affiliate_link?: string;
  url: string;
};

const tools = toolsData as Tool[];

type UserProfile = {
  label: string;
  emoji: string;
  description: string;
  toolIds: number[];
};

const userProfiles: Record<string, UserProfile> = {
  creator: {
    label: 'Content Creator',
    emoji: '🎨',
    description: 'Video, image, and audio tools for creators',
    toolIds: [1, 8, 9, 12, 13], // Midjourney, ElevenLabs, Runway ML, Pika Labs, Suno AI
  },
  developer: {
    label: 'Developer',
    emoji: '💻',
    description: 'Code assistants and productivity tools',
    toolIds: [6, 7, 11, 14, 15], // ChatGPT, GitHub Copilot, Cursor, Tabnine, Obsidian Copilot
  },
  student: {
    label: 'Student',
    emoji: '📚',
    description: 'Writing and research tools for learning',
    toolIds: [5, 6, 10, 16, 17], // Notion AI, ChatGPT, Whisper, Jasper, Claude
  },
  marketer: {
    label: 'Marketer',
    emoji: '📊',
    description: 'Marketing copy and social media tools',
    toolIds: [5, 6, 16, 18, 19], // Notion AI, ChatGPT, Jasper, Adobe Firefly, Copy.ai
  },
};

const getCategoryColors = (category: string) => {
  switch (category) {
    case 'Writing':
      return { bg: 'bg-blue-500', text: 'text-blue-600' };
    case 'Image':
      return { bg: 'bg-violet-500', text: 'text-violet-600' };
    case 'Productivity':
      return { bg: 'bg-teal-500', text: 'text-teal-600' };
    case 'Code':
      return { bg: 'bg-orange-500', text: 'text-orange-600' };
    case 'Audio':
      return { bg: 'bg-pink-500', text: 'text-pink-600' };
    case 'Video':
      return { bg: 'bg-indigo-500', text: 'text-indigo-600' };
    default:
      return { bg: 'bg-slate-500', text: 'text-slate-600' };
  }
};

export default function QuickStart() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const profile = selectedProfile ? userProfiles[selectedProfile] : null;
  const recommendedTools = profile
    ? profile.toolIds
        .map(id => tools.find(t => t.id === id))
        .filter(Boolean) as Tool[]
    : [];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-950/20 rounded-3xl p-6 sm:p-8 mb-8 border border-slate-200 dark:border-gray-800">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Quick Start: Find Your Perfect Tools
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Tell us what you do, and we'll recommend the best AI tools for you
        </p>
      </div>

      {!selectedProfile ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(userProfiles).map(([key, profile]) => (
            <button
              key={key}
              onClick={() => setSelectedProfile(key)}
              className="p-4 sm:p-5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl hover:border-emerald-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                {profile.emoji}
              </div>
              <div className="font-semibold text-slate-900 dark:text-white mb-1">
                {profile.label}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {profile.description}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{profile?.emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Recommended for {profile?.label}s
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {profile?.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedProfile(null)}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedTools.map(tool => {
              const colors = getCategoryColors(tool.category);
              const hasAffiliate = !!tool.affiliate_link;

              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4 hover:border-emerald-500 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {tool.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {tool.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-semibold ${colors.text}`}>
                          {tool.category}
                        </span>
                        {tool.rating && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ⭐ {tool.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {tool.pricing}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                      {hasAffiliate ? 'Try Free →' : 'View Details →'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
            >
              Explore All Tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
