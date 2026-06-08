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
  },
  // ===== Phase 2: 用户意图驱动的场景（反方核心建议） =====
  {
    slug: 'youtube-shorts',
    title: 'YouTube Shorts',
    subtitle: 'Create Viral Short-Form Videos',
    description: 'AI tools that help you script, edit, and optimize YouTube Shorts. From idea to upload in minutes.',
    heroTag: '📱',
    heroTagLabel: 'Short-Form Video',
    metaTitle: 'Best AI Tools for YouTube Shorts in 2026: Script, Edit, Publish',
    metaDescription: 'Create viral YouTube Shorts with AI. Auto-generate scripts, edit videos, add captions, and optimize for the algorithm.',
    includes: [
      'VEED.io', 'Pictory', 'InVideo', 'Descript', 'Opus Clip',
      'CapCut', 'HeyGen', 'Lumen5', 'FlexClip', 'Murf AI',
      'ElevenLabs', 'Synthesia', 'Fliki', 'Suno', 'Udio'
    ],
    topPicks: ['VEED.io', 'Pictory', 'InVideo'],
    faq: [
      {
        question: 'What is the best AI tool for making YouTube Shorts?',
        answer: 'For editing, CapCut is free and has built-in AI features. For scripting and creating from scratch, VEED.io and InVideo are the most beginner-friendly. For repurposing long videos into Shorts, Opus Clip uses AI to find the most viral moments automatically.'
      }
    ]
  },
  {
    slug: 'resume-writing',
    title: 'Resume & Cover Letter',
    subtitle: 'AI Tools to Land Your Dream Job',
    description: 'Stand out with AI-crafted resumes and cover letters. Beat ATS systems and impress recruiters.',
    heroTag: '💼',
    heroTagLabel: 'Job Search',
    metaTitle: 'Best AI Resume & Cover Letter Tools in 2026: Land More Interviews',
    metaDescription: 'AI tools to write resumes, cover letters, and LinkedIn profiles that get you interviews. Beat ATS systems and impress recruiters.',
    includes: [
      'Rytr', 'Resume.io', 'Rezi', 'Kickresume', 'Teal',
      'Grammarly', 'Jasper', 'Copy.ai', 'Wordtune', 'QuillBot',
      'LinkedIn', 'Enhancv', 'Zety'
    ],
    topPicks: ['Rytr', 'Rezi', 'Teal'],
    faq: [
      {
        question: 'Can AI write a good resume?',
        answer: 'Yes, modern AI resume tools can write ATS-optimized resumes that pass screening systems. Tools like Rezi and Teal specifically focus on ATS compatibility, keyword optimization, and recruiter-friendly formatting. For best results, use AI to draft the content, then customize with your personal achievements.'
      }
    ]
  },
  {
    slug: 'language-learning',
    title: 'Language Learning',
    subtitle: 'AI Tutors for Any Language',
    description: 'Learn languages faster with AI tutors. Practice conversation, get instant feedback, and improve pronunciation.',
    heroTag: '🗣️',
    heroTagLabel: 'Education',
    metaTitle: 'Best AI Language Learning Tools in 2026: Speak Fluently Faster',
    metaDescription: 'AI language tutors for English, Spanish, French, and 50+ languages. Practice conversation, get corrections, and improve pronunciation.',
    includes: [
      'Duolingo', 'Babbel', 'Speechify', 'Grammarly', 'Murf AI',
      'ElevenLabs', 'Speechmatics', 'Loora', 'Speak', 'BoldVoice',
      'Cake', 'Elsa Speak', 'Lingvist'
    ],
    topPicks: ['Murf AI', 'Speechify', 'Grammarly'],
  },
  {
    slug: 'study-learning',
    title: 'Study & Learning',
    subtitle: 'AI Tools for Students and Self-Learners',
    description: 'Learn anything faster with AI tutors, note-takers, and study planners. Perfect for students and lifelong learners.',
    heroTag: '📚',
    heroTagLabel: 'Education',
    metaTitle: 'Best AI Study Tools in 2026: Learn Faster, Remember More',
    metaDescription: 'AI tools for students and self-learners. Note-taking, flashcards, summarization, and personalized tutoring for any subject.',
    includes: [
      'Notion AI', 'Grammarly', 'QuillBot', 'Speechify', 'ChatGPT',
      'Perplexity', 'Wolfram Alpha', 'Socratic', 'Quizlet', 'Anki',
      'Elicit', 'Consensus', 'Genei', 'Scholarcy'
    ],
    topPicks: ['Notion AI', 'QuillBot', 'Grammarly'],
  },
  {
    slug: 'design-graphics',
    title: 'Design & Graphics',
    subtitle: 'Create Stunning Visuals Without Skills',
    description: 'Design logos, social media graphics, presentations, and marketing materials with AI. No Photoshop needed.',
    heroTag: '🎨',
    heroTagLabel: 'Visual Design',
    metaTitle: 'Best AI Design & Graphics Tools in 2026: Create Like a Pro',
    metaDescription: 'Create professional designs with AI. Logos, social media graphics, presentations, and marketing materials — no design skills required.',
    includes: [
      'Canva', 'Adobe Firefly', 'Midjourney', 'DALL-E', 'Ideogram',
      'Leonardo', 'Stable Diffusion', 'Looka', 'Brandmark', 'Designs.ai',
      'Microsoft Designer', 'Snappa', 'Figma', 'Recraft'
    ],
    topPicks: ['Canva', 'Adobe Firefly', 'Midjourney'],
  },
  {
    slug: 'data-analysis',
    title: 'Data Analysis',
    subtitle: 'AI Tools for Insights and Visualization',
    description: 'Turn data into insights with AI. Analyze spreadsheets, generate reports, and create visualizations automatically.',
    heroTag: '📊',
    heroTagLabel: 'Business Intelligence',
    metaTitle: 'Best AI Data Analysis Tools in 2026: Insights Without Coding',
    metaDescription: 'AI tools for data analysis, visualization, and reporting. Analyze spreadsheets, generate insights, and create dashboards automatically.',
    includes: [
      'Julius AI', 'ChatGPT', 'Microsoft Copilot', 'Google Bard', 'DataRobot',
      'Tableau', 'Power BI', 'Akkio', 'Obviously AI', 'MonkeyLearn',
      'Airtable', 'Notion AI'
    ],
    topPicks: ['Julius AI', 'Microsoft Copilot', 'Akkio'],
  },
  {
    slug: 'customer-support',
    title: 'Customer Support',
    subtitle: 'AI Tools for Support Teams',
    description: 'AI chatbots, ticket triage, and help desk automation. Deliver 24/7 support without scaling your team.',
    heroTag: '💬',
    heroTagLabel: 'Customer Service',
    metaTitle: 'Best AI Customer Support Tools in 2026: 24/7 Service at Scale',
    metaDescription: 'AI tools for customer support. Chatbots, ticket triage, knowledge bases, and help desk automation for any business size.',
    includes: [
      'Intercom', 'Zendesk', 'Drift', 'Tidio', 'Ada',
      'LivePerson', 'Freshdesk', 'Kustomer', 'Crisp', 'Help Scout',
      'ChatGPT', 'Claude', 'Forethought'
    ],
    topPicks: ['Intercom', 'Tidio', 'Crisp'],
  },
  {
    slug: 'meeting-productivity',
    title: 'Meeting Productivity',
    subtitle: 'AI Tools for Smarter Meetings',
    description: 'Transcribe, summarize, and extract action items from meetings automatically. Never take notes again.',
    heroTag: '🎯',
    heroTagLabel: 'Productivity',
    metaTitle: 'Best AI Meeting Tools in 2026: Never Take Notes Again',
    metaDescription: 'AI tools for meeting transcription, summarization, and action item extraction. Save 5+ hours per week with smart meeting assistants.',
    includes: [
      'Otter.ai', 'Fireflies.ai', 'Fathom', 'Zoom', 'Microsoft Teams',
      'Notion AI', 'Granola', 'tl;dv', 'Read.ai', 'Avoma',
      'Krisp', 'Sembly'
    ],
    topPicks: ['Otter.ai', 'Fathom', 'Granola'],
  },
  {
    slug: 'ai-art-generation',
    title: 'AI Art Generation',
    subtitle: 'Create Beautiful Artwork with AI',
    description: 'Generate stunning artwork, illustrations, and concept art with AI. From photorealistic to anime styles.',
    heroTag: '🖼️',
    heroTagLabel: 'Creative Arts',
    metaTitle: 'Best AI Art Generators in 2026: From Realistic to Anime',
    metaDescription: 'Compare the top AI art generators. Midjourney, DALL-E, Stable Diffusion and more. Create stunning artwork in any style.',
    includes: [
      'Midjourney', 'DALL-E', 'Stable Diffusion', 'Leonardo', 'Ideogram',
      'Adobe Firefly', 'Recraft', 'Flux', 'Krea', 'Playground AI',
      'Lexica', 'NightCafe', 'Bing Image Creator', 'Sora'
    ],
    topPicks: ['Midjourney', 'DALL-E', 'Adobe Firefly'],
  }
];

export const getSceneBySlug = (slug: string): SceneConfig | undefined => {
  return scenes.find(s => s.slug === slug);
};

export const getSceneSlugs = (): string[] => {
  return scenes.map(s => s.slug);
};
