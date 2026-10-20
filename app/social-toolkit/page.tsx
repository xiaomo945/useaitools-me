import { Metadata } from 'next';
import Link from 'next/link';
import { Share2, MessageSquare, BookOpen, CheckCircle, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Social Media Promotion Toolkit - Use AI Tools',
  description: 'Generate ready-to-use promotion templates for Twitter, Reddit, Dev.to and more, and share the AI tools you love in seconds.',
};

const platforms = [
  {
    name: 'Twitter / X',
    icon: MessageSquare,
    color: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    limit: '280 characters',
    templates: [
      {
        title: 'Tool Recommendation',
        template: `Just discovered [Tool name] — it's [one-line description].\n\n[Key numbers/results]\n\nTry it → [Link]\n\n#AITools #BuildInPublic`,
      },
      {
        title: 'Comparison Post',
        template: `I've tested [number] AI [category] tools.\n\nHere's my ranking:\n\n1. [Tool A] — [reason]\n2. [Tool B] — [reason]\n3. [Tool C] — [reason]\n\nFull comparison → [Link]`,
      },
      {
        title: 'Results Showcase',
        template: `[Time period] ago I started using AI tools for [task].\n\nBefore: [problem with the old way]\nAfter: [results with the new way]\n\nThe tool that changed everything: [Tool name] → [Link]`,
      },
    ],
  },
  {
    name: 'Reddit',
    icon: MessageSquare,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    limit: 'No character limit',
    templates: [
      {
        title: 'Build in Public',
        template: `## Title: I built [what] from [unusual situation] — [key numbers/results]\n\nHey r/SideProject!\n\nI wanted to share what I've been working on...\n\n**What it does:**\n- [Feature 1]\n- [Feature 2]\n- [Feature 3]\n\n**Tech stack:** [Tech stack]\n\n**Current stats:**\n- [Metric 1]\n- [Metric 2]\n\nWould love your feedback! Link in comments.`,
      },
      {
        title: 'Tool Recommendation Post',
        template: `## Title: After testing [number] AI [category] tools, here are my top picks\n\nI've spent [time period] testing various AI tools for [use case]. Here's what I found:\n\n**Best for [Scenario A]:** [Tool name]\n- Pros: [pros]\n- Cons: [cons]\n- Price: [price]\n\n**Best for [Scenario B]:** [Tool name]\n- Pros: [pros]\n- Cons: [cons]\n- Price: [price]\n\nFull breakdown: [Link]\n\nHappy to answer any questions!`,
      },
    ],
  },
  {
    name: 'Dev.to',
    icon: BookOpen,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    limit: 'No character limit',
    templates: [
      {
        title: 'Technical Article',
        template: `# [Number] AI [Category] Tools That [Pain point they solve]\n\n## Introduction\n[Hook: describe the problem your readers are probably facing]\n\n## Tool 1: [Tool name]\n**What it does:** [one line]\n**Best for:** [best use case]\n**Price:** [price]\n[Detailed review]\n\n## Tool 2: [Tool name]\n[Same structure as above]\n\n## Comparison Table\n| Tool | Best For | Price | Rating |\n|------|----------|-------|--------|\n| [A]  | [Use case]  | [Price] | [Rating] |\n\n## Final Verdict\n[Recommendations for different needs]\n\n---\n*What AI tools are you using? Let me know in the comments!*`,
      },
      {
        title: 'Site Build Story',
        template: `# How I Built [Project name] with [Tech stack] in [Time frame]\n\n## Why I Built This\n[Motivation and background]\n\n## The Tech Stack\n- **Frontend:** [Technology]\n- **Backend:** [Technology]\n- **Hosting:** [Technology]\n\n## Key Challenges\n### Challenge 1: [Problem]\n[Solution]\n\n### Challenge 2: [Problem]\n[Solution]\n\n## What I Learned\n1. [Lesson 1]\n2. [Lesson 2]\n3. [Lesson 3]\n\n## Results\n- [Metric 1]\n- [Metric 2]\n\nCheck it out: [Link]\n\n*Feedback welcome!*`,
      },
    ],
  },
];

const tips = [
  {
    icon: Target,
    title: 'Post at the Right Time',
    description: 'Best windows: Twitter/X 9–10 AM ET; Reddit on weekday mornings; Dev.to Tuesday and Thursday mornings.',
  },
  {
    icon: Zap,
    title: 'Make It Genuinely Useful',
    description: 'Share real hands-on experience with concrete numbers and screenshots. Skip the hard sell — communities value authenticity most.',
  },
  {
    icon: TrendingUp,
    title: 'Keep Engaging to Build Trust',
    description: 'Reply to every comment and join the discussion. Don’t post and ghost — consistent engagement is what builds influence.',
  },
];

export default function SocialToolkitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold mb-6">
            <Share2 className="w-4 h-4" />
            Promotion Toolkit
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Social Media Promotion Toolkit
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Copy platform-ready templates in one click, share the AI tools you love, and help more people discover great tools
          </p>
        </section>

        {/* Tips Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.title}
                  className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
                >
                  <Icon className="w-8 h-8 text-emerald-600 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {tip.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Platform Templates */}
        <section className="space-y-12">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.name}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl ${platform.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${platform.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {platform.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Character limit: {platform.limit}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {platform.templates.map((tpl) => (
                    <div
                      key={tpl.title}
                      className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {tpl.title}
                        </h3>
                        <Link
                          href="/"
                          className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Choose a Tool <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <pre className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto">
                        {tpl.template}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Start Promoting Your Favorite AI Tools
            </h2>
            <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
              Pick a tool, copy a template, and share it on social media. Help more people discover great AI tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
              >
                Browse AI Tools <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-800 transition-colors"
              >
                Read the Blog
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
