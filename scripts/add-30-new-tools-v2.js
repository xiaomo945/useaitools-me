const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const currentDate = new Date().toISOString().split('T')[0];

const newTools = [
  // Writing tools
  {
    id: tools.length + 1,
    name: "Wordtune",
    description: "AI-powered writing companion that rewrites your sentences for clarity, tone, and style. Helps you express your thoughts precisely and write more efficiently across platforms.",
    category: "Writing",
    pricing: "Freemium",
    url: "https://wordtune.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Rewrite this email to sound more professional", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Simplify this technical paragraph for general audience", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.8, note: "Browser extension works everywhere" },
      output_quality: { score: 4.6, note: "Excellent tone adaptation" },
      features: { score: 4.4, note: "Rewrite, summarize, and suggest" },
      value_for_money: { score: 4.5, note: "Good free tier" },
      stability: { score: 4.7, note: "Very reliable" },
      support: { score: 4.3, note: "Helpful documentation" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Writers", "Professionals", "Students"]
  },
  {
    id: tools.length + 2,
    name: "QuillBot",
    description: "AI paraphrasing and grammar checking tool that rephrases text while maintaining original meaning. Perfect for academic writing and content improvement.",
    category: "Writing",
    pricing: "Freemium",
    url: "https://quillbot.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Paraphrase this research abstract in simpler terms", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Summarize this 500-word article in 50 words", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.7, note: "Simple web interface" },
      output_quality: { score: 4.5, note: "Good paraphrasing accuracy" },
      features: { score: 4.5, note: "Paraphraser, summarizer, grammar checker" },
      value_for_money: { score: 4.6, note: "Generous free tier" },
      stability: { score: 4.6, note: "Stable platform" },
      support: { score: 4.2, note: "Basic support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Students", "Researchers", "Writers"]
  },
  // Image tools
  {
    id: tools.length + 3,
    name: "Clipdrop",
    description: "AI-powered image editing suite with background removal, relighting, cleanup, and upscaling tools. Part of Stability AI ecosystem with professional-grade outputs.",
    category: "Image",
    pricing: "Freemium",
    url: "https://clipdrop.co",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Remove background from product photo", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Upscale low-res image to 4K quality", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.7, note: "Intuitive drag-and-drop" },
      output_quality: { score: 4.8, note: "Professional results" },
      features: { score: 4.7, note: "Cleanup, relight, upscale, remove bg" },
      value_for_money: { score: 4.4, note: "Free tier limited but useful" },
      stability: { score: 4.7, note: "Stability AI powered" },
      support: { score: 4.3, note: "Good documentation" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Designers", "Photographers", "E-commerce"]
  },
  {
    id: tools.length + 4,
    name: "Photoroom",
    description: "AI background removal and product photography tool that creates studio-quality images from simple smartphone photos. Perfect for e-commerce and social media.",
    category: "Image",
    pricing: "Freemium",
    url: "https://photoroom.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create product photo with white background", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate lifestyle scene for jewelry product", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.9, note: "One-tap background removal" },
      output_quality: { score: 4.6, note: "Studio-quality results" },
      features: { score: 4.4, note: "Background removal, AI scenes, batch" },
      value_for_money: { score: 4.5, note: "Good for sellers" },
      stability: { score: 4.6, note: "Very reliable" },
      support: { score: 4.3, note: "Good help center" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["E-commerce", "Sellers", "Social Media"]
  },
  // Video tools
  {
    id: tools.length + 5,
    name: "InVideo AI",
    description: "AI video creation platform that generates complete videos from text prompts. Includes script writing, voiceover, stock footage selection, and editing automation.",
    category: "Video",
    pricing: "Freemium",
    url: "https://invideo.io",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create a 2-minute YouTube explainer about AI", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate Instagram Reel from blog post", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.7, note: "Text-to-video simplicity" },
      output_quality: { score: 4.5, note: "Good quality for automated videos" },
      features: { score: 4.6, note: "Script, voiceover, stock footage" },
      value_for_money: { score: 4.5, note: "Affordable pricing" },
      stability: { score: 4.6, note: "Reliable platform" },
      support: { score: 4.3, note: "Good tutorials" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Content Creators", "Marketers", "YouTubers"]
  },
  {
    id: tools.length + 6,
    name: "Opus Clip",
    description: "AI video repurposing tool that automatically extracts viral short clips from long-form videos. Perfect for creating TikTok, Reels, and Shorts content from podcasts and YouTube videos.",
    category: "Video",
    pricing: "Freemium",
    url: "https://opus.pro",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Extract 10 viral clips from 1-hour podcast", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Create Shorts from tech review video", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.8, note: "Upload and get clips automatically" },
      output_quality: { score: 4.5, note: "Good clip selection" },
      features: { score: 4.6, note: "AI curation, captions, virality score" },
      value_for_money: { score: 4.5, note: "Time-saving value" },
      stability: { score: 4.6, note: "Stable" },
      support: { score: 4.3, note: "Good docs" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Content Creators", "Podcasters", "YouTubers"]
  },
  // Audio tools
  {
    id: tools.length + 7,
    name: "Adobe Podcast AI",
    description: "AI-powered audio enhancement tool that removes background noise, improves voice quality, and creates studio-grade recordings from any microphone. Includes transcription and editing.",
    category: "Audio",
    pricing: "Freemium",
    url: "https://podcast.adobe.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Enhance this phone recording to studio quality", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Remove echo from conference room recording", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.7,
      ease_of_use: { score: 4.8, note: "Simple upload and enhance" },
      output_quality: { score: 4.8, note: "Remarkable audio improvement" },
      features: { score: 4.5, note: "Enhance speech, mic check, transcript" },
      value_for_money: { score: 4.6, note: "Free tier generous" },
      stability: { score: 4.7, note: "Adobe infrastructure" },
      support: { score: 4.4, note: "Adobe support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Podcasters", "YouTubers", "Interviewers"]
  },
  {
    id: tools.length + 8,
    name: "Podcastle",
    description: "AI podcast creation platform with multitrack recording, automatic editing, noise removal, and AI voice cloning. Complete podcast production suite in one platform.",
    category: "Audio",
    pricing: "Freemium",
    url: "https://podcastle.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Record and edit podcast with remote guests", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate AI voiceover for podcast intro", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.5, note: "Web-based studio" },
      output_quality: { score: 4.5, note: "Good audio quality" },
      features: { score: 4.6, note: "Recording, editing, voice cloning" },
      value_for_money: { score: 4.5, note: "All-in-one value" },
      stability: { score: 4.4, note: "Generally stable" },
      support: { score: 4.2, note: "Good tutorials" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Podcasters", "Radio Hosts", "Content Creators"]
  },
  // Code tools
  {
    id: tools.length + 9,
    name: "Continue.dev",
    description: "Open-source AI code assistant that integrates with VS Code and JetBrains. Provides code completion, chat-based assistance, and custom prompt templates for any coding workflow.",
    category: "Code",
    pricing: "Free",
    url: "https://continue.dev",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Explain how this React hook works", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate unit tests for this API endpoint", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.5, note: "IDE plugin install" },
      output_quality: { score: 4.7, note: "Good code understanding" },
      features: { score: 4.6, note: "Open source, customizable, any LLM" },
      value_for_money: { score: 4.9, note: "Completely free" },
      stability: { score: 4.4, note: "Active development" },
      support: { score: 4.5, note: "Active GitHub community" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Developers", "Open Source Fans", "Teams"]
  },
  {
    id: tools.length + 10,
    name: "Mintlify",
    description: "AI-powered documentation generator that reads your codebase and automatically creates beautiful, searchable documentation sites. Integrates with GitHub for continuous updates.",
    category: "Code",
    pricing: "Freemium",
    url: "https://mintlify.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate API docs from OpenAPI spec", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Create developer guide from codebase", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.7, note: "CLI setup, GitHub integration" },
      output_quality: { score: 4.5, note: "Clean, modern docs" },
      features: { score: 4.4, note: "Auto-gen, search, analytics" },
      value_for_money: { score: 4.6, note: "Good free tier" },
      stability: { score: 4.5, note: "Growing platform" },
      support: { score: 4.4, note: "Good documentation" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Developers", "Tech Writers", "API Teams"]
  },
  // Productivity tools
  {
    id: tools.length + 11,
    name: "Mem AI",
    description: "AI-powered workspace that organizes notes, documents, and knowledge automatically. Uses AI to connect ideas, surface relevant information, and create a personal knowledge base.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://get.mem.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Organize my research notes by topic", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Find all notes related to project X", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.5, note: "Clean, minimal interface" },
      output_quality: { score: 4.4, note: "Good AI connections" },
      features: { score: 4.5, note: "Auto-organize, AI search, spaces" },
      value_for_money: { score: 4.3, note: "Competitive pricing" },
      stability: { score: 4.5, note: "Reliable" },
      support: { score: 4.2, note: "Active community" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Knowledge Workers", "Researchers", "Writers"]
  },
  {
    id: tools.length + 12,
    name: "Notta AI",
    description: "AI meeting transcription and note-taking tool that converts audio to text in 104 languages. Features speaker identification, summaries, and action item extraction.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://notta.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Transcribe and summarize sales meeting", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Extract action items from team standup", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.6, note: "Simple upload or record" },
      output_quality: { score: 4.5, note: "Good transcription accuracy" },
      features: { score: 4.5, note: "104 languages, summaries, action items" },
      value_for_money: { score: 4.5, note: "Good free tier" },
      stability: { score: 4.5, note: "Reliable" },
      support: { score: 4.2, note: "Good help center" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Teams", "Students", "Journalists"]
  },
  {
    id: tools.length + 13,
    name: "Tome",
    description: "AI storytelling and presentation platform that creates beautiful decks from simple prompts. Features AI-generated text, images, and layouts with collaborative editing.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://tome.app",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create pitch deck for AI startup", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate product roadmap presentation", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.8, note: "Prompt to presentation" },
      output_quality: { score: 4.5, note: "Modern, clean designs" },
      features: { score: 4.4, note: "AI generation, DALL-E images, embeds" },
      value_for_money: { score: 4.4, note: "Reasonable pricing" },
      stability: { score: 4.5, note: "Stable" },
      support: { score: 4.3, note: "Good docs" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Founders", "Sales Teams", "Educators"]
  },
  {
    id: tools.length + 14,
    name: "Taskade AI",
    description: "AI-powered project management and collaboration platform with task generation, mind mapping, and automated workflows. Combines notes, tasks, and AI in one workspace.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://taskade.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate project plan from description", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Create mind map for marketing campaign", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.6, note: "Intuitive workspace" },
      output_quality: { score: 4.4, note: "Good AI generation" },
      features: { score: 4.6, note: "Tasks, mind maps, AI agents" },
      value_for_money: { score: 4.5, note: "Generous free tier" },
      stability: { score: 4.5, note: "Reliable" },
      support: { score: 4.2, note: "Good templates" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Teams", "Project Managers", "Creatives"]
  },
  // Writing tools
  {
    id: tools.length + 15,
    name: "Jenni AI",
    description: "AI writing assistant for academics and researchers with citation management, literature review assistance, and plagiarism detection. Helps write papers and research articles faster.",
    category: "Writing",
    pricing: "Freemium",
    url: "https://jenni.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Write literature review section with citations", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate abstract for research paper", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.5, note: "Academic-focused interface" },
      output_quality: { score: 4.6, note: "Good academic writing" },
      features: { score: 4.6, note: "Citations, literature review, AI autocomplete" },
      value_for_money: { score: 4.4, note: "Priced for students" },
      stability: { score: 4.5, note: "Reliable" },
      support: { score: 4.3, note: "Good tutorials" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Researchers", "Students", "Academics"]
  },
  {
    id: tools.length + 16,
    name: "HyperWrite",
    description: "AI writing assistant browser extension that helps you write anywhere on the web. Generates content, rewrites text, and provides suggestions in any text field.",
    category: "Writing",
    pricing: "Freemium",
    url: "https://hyperwriteai.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Write LinkedIn post about AI trends", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Rewrite this paragraph for clarity", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.3,
      ease_of_use: { score: 4.8, note: "Works everywhere via extension" },
      output_quality: { score: 4.3, note: "Good general writing" },
      features: { score: 4.3, note: "Auto-write, rewrite, templates" },
      value_for_money: { score: 4.5, note: "Free tier useful" },
      stability: { score: 4.4, note: "Generally stable" },
      support: { score: 4.1, note: "Growing support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Writers", "Social Media Managers", "Bloggers"]
  },
  // Video tools
  {
    id: tools.length + 17,
    name: "Descript",
    description: "All-in-one audio and video editing platform that lets you edit media by editing text. Features AI voice cloning, screen recording, and automatic transcription.",
    category: "Video",
    pricing: "Freemium",
    url: "https://descript.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Edit podcast by editing transcript", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Clone my voice for voiceover", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.7,
      ease_of_use: { score: 4.6, note: "Text-based editing is intuitive" },
      output_quality: { score: 4.7, note: "Professional results" },
      features: { score: 4.8, note: "Transcription, voice clone, screen record" },
      value_for_money: { score: 4.5, note: "Good for podcasters" },
      stability: { score: 4.6, note: "Reliable" },
      support: { score: 4.5, note: "Good docs and tutorials" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Podcasters", "Video Creators", "Marketers"]
  },
  {
    id: tools.length + 18,
    name: "Fliki AI",
    description: "AI video creation tool that converts text, blog posts, and scripts into engaging videos with AI voiceover and stock media. Perfect for social media content at scale.",
    category: "Video",
    pricing: "Freemium",
    url: "https://fliki.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Convert blog post to YouTube video", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Create TikTok video from product description", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.7, note: "Simple text-to-video workflow" },
      output_quality: { score: 4.4, note: "Good for social media" },
      features: { score: 4.5, note: "75+ languages, 1100+ voices" },
      value_for_money: { score: 4.5, note: "Affordable" },
      stability: { score: 4.4, note: "Generally stable" },
      support: { score: 4.2, note: "Good tutorials" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Content Creators", "Social Media", "Marketers"]
  },
  // Image tools
  {
    id: tools.length + 19,
    name: "Canva AI Magic Studio",
    description: "AI-enhanced design platform with Magic Write, Magic Edit, background removal, and AI image generation. All-in-one design tool for non-designers and professionals.",
    category: "Image",
    pricing: "Freemium",
    url: "https://canva.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate social media post from prompt", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Edit photo with AI Magic Edit", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.7,
      ease_of_use: { score: 4.9, note: "Drag-and-drop simplicity" },
      output_quality: { score: 4.6, note: "Professional designs" },
      features: { score: 4.8, note: "Templates, AI tools, collaboration" },
      value_for_money: { score: 4.7, note: "Great free tier" },
      stability: { score: 4.9, note: "Highly reliable" },
      support: { score: 4.6, note: "Excellent support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Designers", "Marketers", "Small Businesses"]
  },
  {
    id: tools.length + 20,
    name: "Looka AI",
    description: "AI logo and brand identity generator that creates professional logos, business cards, and brand guidelines. Perfect for startups and small businesses on a budget.",
    category: "Image",
    pricing: "Paid",
    url: "https://looka.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate logo for tech startup", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Create complete brand identity kit", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.3,
      ease_of_use: { score: 4.8, note: "Simple wizard flow" },
      output_quality: { score: 4.3, note: "Good logo variety" },
      features: { score: 4.4, note: "Logo, brand kit, social media kit" },
      value_for_money: { score: 4.4, note: "One-time payment" },
      stability: { score: 4.6, note: "Stable" },
      support: { score: 4.2, note: "Good help center" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Startups", "Small Businesses", "Freelancers"]
  },
  // Code tools
  {
    id: tools.length + 21,
    name: "v0 by Vercel",
    description: "AI-powered UI generation tool from Vercel that creates React components from text descriptions. Integrates with Tailwind CSS and shadcn/ui for production-ready code.",
    category: "Code",
    pricing: "Freemium",
    url: "https://v0.dev",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate a dashboard with charts and sidebar", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Create a pricing page with three tiers", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.7, note: "Simple text prompt interface" },
      output_quality: { score: 4.7, note: "Production-ready components" },
      features: { score: 4.5, note: "Text-to-UI, iterative refinement" },
      value_for_money: { score: 4.5, note: "Good free tier" },
      stability: { score: 4.6, note: "Vercel powered" },
      support: { score: 4.4, note: "Growing docs" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Frontend Developers", "Designers", "Startups"]
  },
  {
    id: tools.length + 22,
    name: "Sweep.dev",
    description: "AI-powered code refactoring tool that automatically fixes bugs, adds features, and cleans up technical debt through GitHub issues. Works as a GitHub bot.",
    category: "Code",
    pricing: "Freemium",
    url: "https://sweep.dev",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Fix null pointer exception in user service", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Add input validation to login form", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.6, note: "GitHub issue integration" },
      output_quality: { score: 4.4, note: "Good for simple tasks" },
      features: { score: 4.4, note: "Auto-fixes, PR generation" },
      value_for_money: { score: 4.5, note: "Good free tier" },
      stability: { score: 4.3, note: "Improving" },
      support: { score: 4.3, note: "Discord community" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Developers", "Teams", "Open Source"]
  },
  // Audio tools
  {
    id: tools.length + 23,
    name: "VoiceMode",
    description: "AI voice cloning and text-to-speech platform with ultra-realistic voice generation. Create custom voiceovers for videos, podcasts, and audiobooks with natural-sounding results.",
    category: "Audio",
    pricing: "Paid",
    url: "https://voicemode.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Clone voice for video narration", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate audiobook chapter with emotion", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.5, note: "Web-based platform" },
      output_quality: { score: 4.6, note: "Very natural voices" },
      features: { score: 4.4, note: "Voice cloning, TTS, emotion control" },
      value_for_money: { score: 4.2, note: "Premium pricing" },
      stability: { score: 4.4, note: "Stable" },
      support: { score: 4.2, note: "Good docs" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Content Creators", "Podcasters", "Audiobook Producers"]
  },
  {
    id: tools.length + 24,
    name: "Beatoven AI",
    description: "AI music composition tool that creates royalty-free background music for videos, podcasts, and content. Customize mood, genre, tempo, and duration with simple controls.",
    category: "Audio",
    pricing: "Freemium",
    url: "https://beatoven.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create upbeat background music for vlog", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate cinematic score for short film", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.3,
      ease_of_use: { score: 4.6, note: "Simple controls" },
      output_quality: { score: 4.4, note: "Good for background music" },
      features: { score: 4.3, note: "Mood, genre, tempo customization" },
      value_for_money: { score: 4.4, note: "Royalty-free value" },
      stability: { score: 4.3, note: "Generally stable" },
      support: { score: 4.1, note: "Basic support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Video Creators", "Podcasters", "Filmmakers"]
  },
  // Productivity tools
  {
    id: tools.length + 25,
    name: "Notewise AI",
    description: "AI note-taking app for students and professionals that records lectures, transcribes audio, and generates study materials, flashcards, and summaries automatically.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://notewise.app",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Transcribe lecture and create study guide", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate flashcards from meeting notes", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.3,
      ease_of_use: { score: 4.5, note: "Simple recording interface" },
      output_quality: { score: 4.3, note: "Good summaries" },
      features: { score: 4.4, note: "Record, transcribe, summarize, flashcards" },
      value_for_money: { score: 4.5, note: "Great for students" },
      stability: { score: 4.3, note: "Stable" },
      support: { score: 4.1, note: "Basic support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Students", "Professionals", "Researchers"]
  },
  {
    id: tools.length + 26,
    name: "Rewind AI",
    description: "Personal AI search engine that indexes everything you do on your computer - apps, websites, meetings, documents - and lets you search your entire digital life with natural language.",
    category: "Productivity",
    pricing: "Paid",
    url: "https://rewind.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Find that website I visited last week", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "What did I discuss about pricing last month?", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.4, note: "Background recording" },
      output_quality: { score: 4.6, note: "Accurate search results" },
      features: { score: 4.5, note: "Records everything, AI search" },
      value_for_money: { score: 4.1, note: "Premium pricing" },
      stability: { score: 4.5, note: "Mac optimized" },
      support: { score: 4.3, note: "Good support" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Knowledge Workers", "Executives", "Researchers"]
  },
  {
    id: tools.length + 27,
    name: "Perplexity AI",
    description: "AI-powered search engine that provides direct answers with citations instead of links. Combines web search with LLM reasoning for accurate, sourced responses.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://perplexity.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "What are the best practices for React Server Components?", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Compare pricing of top AI image generators", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.7,
      ease_of_use: { score: 4.8, note: "Just ask questions" },
      output_quality: { score: 4.8, note: "Accurate, cited answers" },
      features: { score: 4.5, note: "Search, citations, collections" },
      value_for_money: { score: 4.6, note: "Good free tier, Pro worth it" },
      stability: { score: 4.7, note: "Very reliable" },
      support: { score: 4.4, note: "Growing docs" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Researchers", "Students", "Professionals"]
  },
  // Writing tools
  {
    id: tools.length + 28,
    name: "ProWritingAid",
    description: "Comprehensive AI writing analysis tool with 25+ reports covering grammar, style, readability, and structure. Integrates with Google Docs, Scrivener, and major writing platforms.",
    category: "Writing",
    pricing: "Freemium",
    url: "https://prowritingaid.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Analyze this chapter for readability issues", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Check this article for style and grammar", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.5, note: "Comprehensive but detailed interface" },
      output_quality: { score: 4.6, note: "Thorough analysis" },
      features: { score: 4.7, note: "25+ reports, integrations" },
      value_for_money: { score: 4.5, note: "Lifetime option available" },
      stability: { score: 4.7, note: "Very stable" },
      support: { score: 4.4, note: "Good documentation" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Writers", "Editors", "Authors"]
  },
  // Video tools
  {
    id: tools.length + 29,
    name: "Luma Dream Machine",
    description: "AI video generation model that creates realistic, high-quality videos from text and images. Features temporal consistency, camera control, and cinematic quality outputs.",
    category: "Video",
    pricing: "Freemium",
    url: "https://lumalabs.ai/dream-machine",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate cinematic drone shot over mountains", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Animate product photo into 3D showcase", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.5, note: "Simple text-to-video interface" },
      output_quality: { score: 4.8, note: "Cinematic quality" },
      features: { score: 4.5, note: "Text/image to video, camera control" },
      value_for_money: { score: 4.4, note: "Limited free credits" },
      stability: { score: 4.4, note: "New but improving" },
      support: { score: 4.2, note: "Growing community" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Filmmakers", "Creatives", "Marketers"]
  },
  {
    id: tools.length + 30,
    name: "Kling AI",
    description: "Advanced AI video generation platform that produces high-quality, temporally consistent videos from text prompts. Supports up to 5-minute videos with realistic motion and detail.",
    category: "Video",
    pricing: "Freemium",
    url: "https://klingai.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create 30-second product commercial", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate nature scene with flowing water", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.5, note: "Prompt-based generation" },
      output_quality: { score: 4.7, note: "High-quality, consistent" },
      features: { score: 4.5, note: "Up to 5-min videos, multiple styles" },
      value_for_money: { score: 4.4, note: "Competitive pricing" },
      stability: { score: 4.3, note: "Growing platform" },
      support: { score: 4.2, note: "Documentation improving" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Video Creators", "Filmmakers", "Advertisers"]
  }
];

const allTools = [...tools, ...newTools];

fs.writeFileSync(toolsPath, JSON.stringify(allTools, null, 2));

console.log(`✅ Added ${newTools.length} new tools`);
console.log(`📊 Total tools now: ${allTools.length}`);
console.log(`📝 New tools: ${newTools.map(t => t.name).join(', ')}`);
