'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Users, Target, Lightbulb, Star, HelpCircle } from 'lucide-react';

type CategoryData = {
  whoFor: { role: string; description: string }[];
  problems: string[];
  howToChoose: { dimension: string; description: string }[];
  faqs: { question: string; answer: string }[];
};

const categoryGuides: Record<string, CategoryData> = {
  Writing: {
    whoFor: [
      { role: 'Content Marketers', description: 'Blog posts, social media, email campaigns at scale' },
      { role: 'Freelance Writers', description: 'Faster drafts, overcome writer\'s block, meet deadlines' },
      { role: 'Startup Founders', description: 'Landing pages, pitch decks, investor updates' },
      { role: 'Students & Academics', description: 'Research papers, essays, literature reviews' },
    ],
    problems: [
      'Slow writing speed and tight deadlines',
      'Writer\'s block and creative fatigue',
      'Inconsistent brand voice across content',
      'Non-native English writing challenges',
      'SEO content that ranks well',
    ],
    howToChoose: [
      { dimension: 'Writing Quality', description: 'How natural and engaging is the generated text?' },
      { dimension: 'Template Variety', description: 'Does it support your specific use case (blog, email, social)?' },
      { dimension: 'Language Support', description: 'Does it support your target languages?' },
      { dimension: 'Brand Voice Control', description: 'Can you train it to match your brand\'s tone?' },
      { dimension: 'Pricing Model', description: 'Free tier, per-word, or unlimited subscription?' },
    ],
    faqs: [
      { question: 'Can AI writing tools replace human writers?', answer: 'AI tools excel at first drafts and routine content, but human writers bring creativity, strategy, and emotional intelligence. Best results come from AI + human collaboration.' },
      { question: 'Is AI-generated content detectable?', answer: 'Some detectors can identify AI content, but the quality gap is narrowing. The best approach is to use AI as a starting point and add your personal voice and insights.' },
      { question: 'Which AI writing tool is best for SEO?', answer: 'Tools like Jasper and Rytr have built-in SEO optimization features. Look for tools that integrate with Surfer SEO or offer keyword optimization.' },
    ],
  },
  Image: {
    whoFor: [
      { role: 'Graphic Designers', description: 'Rapid prototyping, mood boards, concept exploration' },
      { role: 'Marketers', description: 'Social media graphics, ad creatives, product photos' },
      { role: 'E-commerce Owners', description: 'Product photography, lifestyle images, mockups' },
      { role: 'Content Creators', description: 'YouTube thumbnails, blog featured images, illustrations' },
    ],
    problems: [
      'Expensive stock photo subscriptions',
      'Time-consuming photo editing',
      'Limited design skills for complex graphics',
      'Need for consistent brand imagery',
      'Multilingual text in images',
    ],
    howToChoose: [
      { dimension: 'Image Quality', description: 'Resolution, detail, and artistic fidelity' },
      { dimension: 'Prompt Understanding', description: 'How well does it interpret complex descriptions?' },
      { dimension: 'Style Consistency', description: 'Can you maintain consistent style across images?' },
      { dimension: 'Commercial License', description: 'Are you allowed to use generated images commercially?' },
      { dimension: 'Editing Features', description: 'Can you modify and refine generated images?' },
    ],
    faqs: [
      { question: 'Can I use AI-generated images commercially?', answer: 'Most major AI image generators allow commercial use. Always check the terms of service for the specific tool you\'re using.' },
      { question: 'Which AI image tool is best for product photography?', answer: 'Midjourney and DALL-E 3 are excellent for creative product shots. For realistic product photos, consider tools specifically designed for product photography.' },
      { question: 'How do I get consistent results?', answer: 'Use detailed prompts, reference images, and consistent style parameters. Many tools offer "seed" values to maintain consistency across generations.' },
    ],
  },
  Video: {
    whoFor: [
      { role: 'Video Marketers', description: 'Social media videos, ads, promotional content' },
      { role: 'Educators', description: 'Online courses, tutorials, lecture recordings' },
      { role: 'Corporate Teams', description: 'Training videos, presentations, internal communications' },
      { role: 'Content Creators', description: 'YouTube, TikTok, Instagram Reels production' },
    ],
    problems: [
      'High cost of professional video production',
      'Complex editing software learning curves',
      'Time-consuming post-production work',
      'Need for multilingual video content',
      'Lack of on-camera talent for tutorials',
    ],
    howToChoose: [
      { dimension: 'Output Quality', description: 'Video resolution, smoothness, and professional polish' },
      { dimension: 'Ease of Use', description: 'How quickly can you create a usable video?' },
      { dimension: 'AI Avatar Quality', description: 'If using avatars, how natural do they look?' },
      { dimension: 'Editing Capabilities', description: 'Can you fine-tune the output after generation?' },
      { dimension: 'Pricing per Video', description: 'Cost per minute of generated video content' },
    ],
    faqs: [
      { question: 'Are AI-generated videos realistic enough?', answer: 'AI video quality has improved dramatically. For talking-head videos, AI avatars are nearly indistinguishable from real humans. For creative video generation, quality varies by tool.' },
      { question: 'Can I use AI videos for YouTube monetization?', answer: 'Yes, as long as the content is original and adds value. YouTube allows AI-generated content, but you should disclose AI use if required.' },
      { question: 'How long does it take to generate an AI video?', answer: 'Simple text-to-video takes 2-5 minutes. Avatar-based videos take 5-10 minutes. Complex edited videos can take 10-30 minutes depending on length and complexity.' },
    ],
  },
  Audio: {
    whoFor: [
      { role: 'Podcasters', description: 'Voiceover, intro/outro music, audio editing' },
      { role: 'Content Creators', description: 'YouTube narration, audiobook production, meditation guides' },
      { role: 'Marketers', description: 'Radio ads, podcast sponsorships, audio branding' },
      { role: 'Educators', description: 'Course narration, language learning, accessibility' },
    ],
    problems: [
      'Expensive voice talent and studio recording',
      'Complex audio editing workflows',
      'Need for multi-language voiceovers',
      'Background music licensing costs',
      'Accessibility and caption requirements',
    ],
    howToChoose: [
      { dimension: 'Voice Naturalness', description: 'How human-like and expressive does the voice sound?' },
      { dimension: 'Voice Variety', description: 'Number of available voices and accents' },
      { dimension: 'Language Support', description: 'How many languages and dialects are available?' },
      { dimension: 'Editing Tools', description: 'Can you adjust pacing, pitch, and emphasis?' },
      { dimension: 'Commercial Rights', description: 'Are you allowed to monetize AI-generated audio?' },
    ],
    faqs: [
      { question: 'Is AI voiceover good enough for professional use?', answer: 'Top AI voice tools like ElevenLabs produce near-indistinguishable-from-human quality. Many podcasts and audiobooks now use AI narration.' },
      { question: 'Can I clone my own voice?', answer: 'Several tools offer voice cloning with proper consent. You\'ll typically need to provide 10-30 minutes of clean audio samples.' },
      { question: 'What about music generation?', answer: 'AI music tools like Suno can create original background music and songs. Quality has improved significantly and is suitable for many commercial use cases.' },
    ],
  },
  Code: {
    whoFor: [
      { role: 'Software Developers', description: 'Code completion, refactoring, documentation' },
      { role: 'DevOps Engineers', description: 'Infrastructure as code, CI/CD pipelines, monitoring' },
      { role: 'QA Engineers', description: 'Test generation, bug detection, coverage analysis' },
      { role: 'Technical Writers', description: 'API docs, tutorials, code examples' },
    ],
    problems: [
      'Time-consuming boilerplate and repetitive code',
      'Code review bottlenecks',
      'Documentation that falls behind code changes',
      'Security vulnerabilities in dependencies',
      'Onboarding new team members quickly',
    ],
    howToChoose: [
      { dimension: 'Language Support', description: 'Does it support your programming languages?' },
      { dimension: 'Integration', description: 'Works with your IDE, CI/CD, and version control?' },
      { dimension: 'Code Quality', description: 'How accurate and production-ready are the suggestions?' },
      { dimension: 'Security Awareness', description: 'Does it flag potential security issues?' },
      { dimension: 'Privacy', description: 'Is your code sent to external servers for processing?' },
    ],
    faqs: [
      { question: 'Is AI-generated code secure?', answer: 'AI can suggest code patterns, but you should always review for security vulnerabilities. Tools like GitHub Copilot can help, but human review is essential.' },
      { question: 'Will AI replace developers?', answer: 'AI augments developer productivity but doesn\'t replace the need for architectural thinking, problem-solving, and domain expertise. It\'s a powerful assistant, not a replacement.' },
      { question: 'Which AI coding tool is best for beginners?', answer: 'GitHub Copilot and Cursor are both excellent starting points. Copilot integrates directly into your IDE, while Cursor offers a more comprehensive AI-powered editing experience.' },
    ],
  },
  Productivity: {
    whoFor: [
      { role: 'Project Managers', description: 'Task automation, meeting notes, status reports' },
      { role: 'Sales Teams', description: 'CRM automation, email sequences, proposal generation' },
      { role: 'HR Professionals', description: 'Job descriptions, interview scheduling, onboarding' },
      { role: 'Freelancers', description: 'Invoice generation, time tracking, client communication' },
    ],
    problems: [
      'Too many tools, not enough integration',
      'Time wasted on repetitive administrative tasks',
      'Information overload and poor organization',
      'Difficulty tracking team productivity',
      'Scaling processes as the business grows',
    ],
    howToChoose: [
      { dimension: 'Integration', description: 'Does it connect with your existing tools?' },
      { dimension: 'Automation Depth', description: 'How many steps can it automate?' },
      { dimension: 'Learning Curve', description: 'How quickly can your team adopt it?' },
      { dimension: 'Customization', description: 'Can you tailor it to your specific workflows?' },
      { dimension: 'ROI', description: 'Time saved vs. cost of the tool' },
    ],
    faqs: [
      { question: 'Which productivity AI tool should I start with?', answer: 'Start with tools that solve your biggest pain points. For writing-heavy roles, try an AI writing tool. For organization, try Notion AI. For automation, look at Zapier or Make.' },
      { question: 'Can AI really save me time?', answer: 'Most users report 20-40% time savings on routine tasks. The key is identifying repetitive work that AI can handle reliably and freeing your time for strategic thinking.' },
      { question: 'Are there free AI productivity tools?', answer: 'Yes, many tools offer generous free tiers. ChatGPT free, Notion AI free, and various AI writing tools with character limits are great starting points.' },
    ],
  },
};

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case 'Writing':
      return <span className="text-2xl">✍️</span>;
    case 'Image':
      return <span className="text-2xl">🎨</span>;
    case 'Video':
      return <span className="text-2xl">🎬</span>;
    case 'Audio':
      return <span className="text-2xl">🎵</span>;
    case 'Code':
      return <span className="text-2xl">💻</span>;
    case 'Productivity':
      return <span className="text-2xl">⚡</span>;
    default:
      return <span className="text-2xl">🛠️</span>;
  }
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-medium text-slate-900 dark:text-white pr-4 text-sm sm:text-base">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
          <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function CategoryDecisionGuide({ category }: { category: string }) {
  const guide = categoryGuides[category];

  if (!guide) return null;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Who is this for? */}
      <section className="bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-gray-800 dark:to-emerald-500/10 border border-slate-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Who is this for?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {guide.whoFor.map((item, i) => (
            <div key={i} className="flex gap-3 items-start bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">{item.role}</p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What problems does it solve? */}
      <section className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">What problems does it solve?</h2>
        </div>
        <ul className="space-y-3">
          {guide.problems.map((problem, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-emerald-500 flex-shrink-0 mt-0.5">✦</span>
              <span className="text-sm sm:text-base text-slate-600 dark:text-gray-300">{problem}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How to choose? */}
      <section className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">How to choose?</h2>
        </div>
        <div className="space-y-3">
          {guide.howToChoose.map((item, i) => (
            <div key={i} className="flex gap-3 items-start bg-slate-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">{i + 1}</span>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">{item.dimension}</p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Common Questions</h2>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {guide.faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>
    </div>
  );
}
