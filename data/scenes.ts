import type { Tool } from '@/types';

export interface SceneConfig {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroTag: string;
  heroTagLabel: string;
  metaTitle: string;
  metaDescription: string;
  includes: (string | string[])[]; // tool names to include (array = AND match across categories)
  excludes?: string[]; // tool names to exclude
  topPicks: string[]; // tool names for top 3 editor picks
  faq?: { question: string; answer: string }[];
}

export const scenes: SceneConfig[] = [
  {
    slug: 'blog-writing',
    title: 'Blog Writing',
    subtitle: 'Best AI Tools for Blog Content Creation',
    description: 'Write high-quality blog posts in minutes, not hours. Our curated list covers everything from topic research to SEO optimization.',
    heroTag: '📝',
    heroTagLabel: 'Content Creation',
    metaTitle: 'Best AI Blog Writing Tools in 2026: Write Posts in Minutes',
    metaDescription: 'Compare the top AI blog writing tools. From SEO-optimized long-form to quick posts, find the perfect tool for your content workflow.',
    includes: [
      'Rytr', 'Jasper', 'Copy.ai', 'Writesonic', 'Grammarly',
      'Wordtune', 'QuillBot', 'Frase', 'Surfer SEO', 'NeuronWriter',
      'LongShot', 'Anyword', 'ParagraphAI', 'Bramework', 'Hypotenuse AI'
    ],
    topPicks: ['Rytr', 'Jasper', 'Writesonic'],
    faq: [
      {
        question: 'What is the best AI tool for blog writing?',
        answer: 'The best AI blog writing tool depends on your needs. For budget-conscious writers, Rytr offers excellent value at $9/month with 30+ languages. For enterprise teams, Jasper provides advanced collaboration features. For SEO-focused content, Surfer SEO integrates content optimization directly into the writing process.'
      },
      {
        question: 'Can AI write entire blog posts?',
        answer: 'Yes, modern AI writing tools can generate complete blog posts from a simple prompt. However, the best results come from using AI as a first draft generator, then adding your own expertise, examples, and personality. The most efficient workflow is: AI generates → you edit → AI polishes → you publish.'
      },
      {
        question: 'Is AI-generated blog content good for SEO?',
        answer: 'AI-generated content can rank well in search engines if it\'s properly optimized and provides genuine value. Use tools with built-in SEO features (like Surfer SEO or Frase), ensure the content is factually accurate, and always add your unique perspective and expertise. Google rewards helpful, people-first content regardless of how it\'s created.'
      }
    ]
  },
  {
    slug: 'social-media',
    title: 'Social Media',
    subtitle: 'AI Tools for Social Media Content Creation',
    description: 'Create scroll-stopping social media posts, captions, and graphics. Schedule, optimize, and analyze your content performance.',
    heroTag: '📱',
    heroTagLabel: 'Social Growth',
    metaTitle: 'Best AI Social Media Tools in 2026: Create Posts That Go Viral',
    metaDescription: 'Discover AI tools for creating, scheduling, and optimizing social media content. From captions to graphics, grow your following faster.',
    includes: [
      'Rytr', 'Copy.ai', 'Jasper', 'Writesonic', 'Buffer',
      'Later', 'Hootsuite', 'Canva', 'Lately', 'Ocoya',
      'Predis.ai', 'Copymatic', 'Simplified'
    ],
    topPicks: ['Copy.ai', 'Rytr', 'Canva'],
    faq: [
      {
        question: 'What AI tool is best for social media content?',
        answer: 'For text-based content (captions, posts), Copy.ai is excellent with its social media templates. For visual content, Canva\'s AI features are unmatched. For end-to-end management, Buffer combines AI writing with scheduling and analytics.'
      },
      {
        question: 'Can AI write engaging social media captions?',
        answer: 'Absolutely. AI tools like Copy.ai and Rytr have specialized templates for different social platforms (Twitter threads, Instagram captions, LinkedIn posts). They understand platform-specific best practices like character limits, hashtag usage, and tone.'
      }
    ]
  },
  {
    slug: 'video-creation',
    title: 'Video Creation',
    subtitle: 'AI Tools for Professional Video Production',
    description: 'From script to screen in minutes. AI video tools that generate, edit, and enhance your video content without expensive software or skills.',
    heroTag: '🎬',
    heroTagLabel: 'Video Production',
    metaTitle: 'Best AI Video Creation Tools in 2026: Make Videos Without Skills',
    metaDescription: 'Create professional videos with AI tools. Text-to-video, auto-editing, subtitles, and more. No video editing experience required.',
    includes: [
      'VEED.io', 'Pictory', 'Synthesia', 'Runway', 'Lumen5',
      'InVideo', 'Descript', 'HeyGen', 'Murf AI', 'FlexClip',
      'Wondershare Filmora', 'Pictory AI', 'Fliki'
    ],
    topPicks: ['VEED.io', 'Pictory', 'Synthesia'],
    faq: [
      {
        question: 'Can AI create videos from text?',
        answer: 'Yes, tools like Pictory and Lumen5 can transform blog posts, scripts, or outlines into fully produced videos with stock footage, voiceovers, and text overlays. The quality has improved dramatically — many AI-generated videos are indistinguishable from human-produced content.'
      },
      {
        question: 'What is the easiest AI video tool for beginners?',
        answer: 'VEED.io is the easiest to start with. It\'s entirely browser-based (no software to install), has a drag-and-drop interface, and AI features like auto-subtitles and background removal work with one click. For text-to-video specifically, Pictory lets you paste a blog post and get a video in minutes.'
      },
      {
        question: 'Are AI video tools worth the cost?',
        answer: 'If you create video content regularly, AI tools can save you hours per video and eliminate the need for expensive software or hiring editors. VEED.io\'s free plan alone covers basic editing. Paid plans start at $15-20/month — much less than hiring a video editor or subscribing to Adobe Creative Cloud.'
      }
    ]
  },
  {
    slug: 'podcast-production',
    title: 'Podcast Production',
    subtitle: 'AI Tools for Podcast Creation & Editing',
    description: 'Record, edit, and distribute your podcast with AI-powered tools. From voice cloning to auto-transcription and noise removal.',
    heroTag: '🎙️',
    heroTagLabel: 'Audio Production',
    metaTitle: 'Best AI Podcast Tools in 2026: Record & Edit Like a Pro',
    metaDescription: 'Professional podcast production with AI. Voice generation, auto-editing, transcription, and distribution tools for podcasters of all levels.',
    includes: [
      'Murf AI', 'Descript', 'Riverside.fm', 'Buzzsprout', 'Anchor',
      'Podcastle', 'Alitu', 'Auphonic', 'Cleanfeed', 'SquadCast',
      'ElevenLabs', 'Audacity', 'Hindenburg'
    ],
    topPicks: ['Descript', 'Murf AI', 'Riverside.fm'],
    faq: [
      {
        question: 'What is the best AI tool for podcast editing?',
        answer: 'Descript is the best AI podcast editing tool. It lets you edit audio by editing text — like a word processor for your podcast. It automatically removes filler words ("um", "ah"), generates transcripts, and even clones your voice for quick corrections.'
      },
      {
        question: 'Can AI generate podcast voiceovers?',
        answer: 'Yes. Tools like Murf AI and ElevenLabs can generate studio-quality voiceovers in dozens of languages and voices. They\'re perfect for intros, outros, ad reads, and even full episodes. The voice quality is now so natural that most listeners can\'t tell the difference.'
      }
    ]
  },
  {
    slug: 'email-marketing',
    title: 'Email Marketing',
    subtitle: 'AI Tools for Email Campaign Creation',
    description: 'Write high-converting emails, automate sequences, and optimize open rates. AI-powered email marketing tools that deliver results.',
    heroTag: '✉️',
    heroTagLabel: 'Email Strategy',
    metaTitle: 'Best AI Email Marketing Tools in 2026: Higher Open Rates',
    metaDescription: 'Boost email marketing with AI. Write better subject lines, automate sequences, and increase conversions with intelligent email tools.',
    includes: [
      'Rytr', 'Copy.ai', 'Jasper', 'Phrasee', 'Seventh Sense',
      'Persado', 'SendCheck', 'Smartwriter', 'Anyword'
    ],
    topPicks: ['Copy.ai', 'Rytr', 'Phrasee'],
    faq: [
      {
        question: 'How can AI improve email marketing?',
        answer: 'AI can help at every stage: writing compelling subject lines (increasing open rates by 20-50%), personalizing email content based on recipient behavior, optimizing send times, and A/B testing variations automatically. Tools like Phrasee use AI to generate and test thousands of subject line variations.'
      },
      {
        question: 'What is the most affordable AI email writing tool?',
        answer: 'Rytr at $9/month is the most affordable option for email marketing. It has dedicated templates for cold emails, newsletters, welcome sequences, and follow-ups. Copy.ai is also great with a generous free tier. For larger teams, the time saved with AI typically pays for the subscription within the first campaign.'
      }
    ]
  },
  {
    slug: 'seo-content',
    title: 'SEO Content',
    subtitle: 'AI Tools for SEO-Optimized Content',
    description: 'Create content that ranks. AI-powered SEO tools for keyword research, content optimization, and competitive analysis.',
    heroTag: '🔍',
    heroTagLabel: 'SEO Strategy',
    metaTitle: 'Best AI SEO Content Tools in 2026: Rank Higher on Google',
    metaDescription: 'Write SEO-optimized content with AI tools. Keyword research, content briefs, optimization suggestions, and ranking analysis in one place.',
    includes: [
      'Surfer SEO', 'Frase', 'NeuronWriter', 'MarketMuse', 'Clearscope',
      'Jasper', 'Writesonic', 'LongShot', 'Rytr', 'Semrush',
      'Ahrefs', 'SE Ranking'
    ],
    topPicks: ['Surfer SEO', 'Frase', 'Jasper'],
    faq: [
      {
        question: 'Can AI write SEO-optimized content?',
        answer: 'Yes. AI tools like Surfer SEO and Frase analyze the top-ranking pages for your target keyword and generate content briefs that include optimal word count, keyword density, headings structure, and related terms. Combined with AI writing tools like Jasper or Rytr, you can create SEO-optimized drafts in minutes.'
      },
      {
        question: 'Is AI SEO content better than manual writing?',
        answer: 'AI-generated SEO content is not necessarily "better" than human-written content, but it\'s significantly faster. The best approach is a hybrid: AI generates the first draft following SEO best practices, then a human editor adds unique insights, examples, and brand voice. This combination delivers both speed and quality.'
      }
    ]
  }
];

export const getSceneBySlug = (slug: string): SceneConfig | undefined => {
  return scenes.find(s => s.slug === slug);
};

export const getSceneSlugs = (): string[] => {
  return scenes.map(s => s.slug);
};
