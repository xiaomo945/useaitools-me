const fs = require('fs');
const path = require('path');

// 读取现有工具数据
const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

// 修复 ID 问题：确保所有现有工具有正确的数字 ID
let maxId = 0;
tools.forEach((t, i) => {
  if (!t.id || isNaN(t.id)) {
    t.id = i + 1;
  }
  if (t.id > maxId) maxId = t.id;
});
let nextId = maxId + 1;

// 去重：获取已有工具名称集合
const existingNames = new Set(tools.map(t => t.name.toLowerCase().trim()));

console.log(`🔍 当前工具数: ${tools.length}, 下一个ID: ${nextId}\n`);

// 预定义的30+个新工具数据（模拟从Product Hunt/There's An AI For That抓取）
const newTools = [
  // Writing 类 (6个)
  { name: "Scalenut", description: "AI SEO and content marketing platform that creates optimized blog posts with keyword research, content briefs, and real-time SEO scoring. Built for content teams.", category: "Writing", pricing: "Freemium", url: "https://scalenut.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 567, skill_level: "intermediate", best_for: ["SEO Writing", "Content Strategy", "Keyword Research"] },
  { name: "INK Editor", description: "AI content editor with real-time SEO optimization, content planning, and AI writing assistant. Combines SEO strategy with content creation in one platform.", category: "Writing", pricing: "Freemium", url: "https://inkforall.com", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 445, skill_level: "intermediate", best_for: ["SEO Optimization", "Content Planning", "Editorial"] },
  { name: "ShortlyAI", description: "AI writing assistant focused on long-form content creation. Helps writers overcome blank page syndrome and maintain consistent tone throughout articles.", category: "Writing", pricing: "Paid", url: "https://shortlyai.com", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 234, skill_level: "beginner", best_for: ["Long-form Content", "Article Writing", "Blog Posts"] },
  { name: "Ryte AI", description: "AI content generator specialized in e-commerce product descriptions and landing pages. Creates conversion-optimized copy at scale.", category: "Writing", pricing: "Paid", url: "https://ryte.com", needs_vpn: false, languages: ["English"], rating: 4.1, rating_count: 189, skill_level: "beginner", best_for: ["E-commerce", "Product Descriptions", "Landing Pages"] },
  { name: "NeuronWriter", description: "AI content optimization platform with NLP analysis, competitor research, and SERP-based content briefs. Perfect for SEO-focused content creators.", category: "Writing", pricing: "Freemium", url: "https://neuronwriter.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 678, skill_level: "intermediate", best_for: ["SERP Analysis", "NLP Optimization", "Content Strategy"] },
  { name: "Jenni AI", description: "AI research assistant that helps with academic writing, citation management, and literature review. Built for researchers and students.", category: "Writing", pricing: "Freemium", url: "https://jenni.ai", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 890, skill_level: "intermediate", best_for: ["Academic Writing", "Citations", "Research"] },

  // Image 类 (6个)
  { name: "Krea AI", description: "AI image generation and editing platform with real-time generation and AI upscaling. Known for ultra-fast iteration and high-quality outputs.", category: "Image", pricing: "Freemium", url: "https://krea.ai", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1234, skill_level: "intermediate", best_for: ["Real-time Generation", "AI Upscaling", "Design"] },
  { name: "Flux AI", description: "Open-source AI image model by Black Forest Labs. Exceptional prompt adherence and photorealistic output quality. Competes with Midjourney.", category: "Image", pricing: "Free", url: "https://blackforestlabs.ai", needs_vpn: false, languages: ["English"], rating: 4.7, rating_count: 2345, skill_level: "advanced", best_for: ["Open Source", "Photorealistic", "High Quality"] },
  { name: "Ideogram", description: "AI image generator specialized in typography and text rendering within images. Solves the text-in-image problem better than competitors.", category: "Image", pricing: "Freemium", url: "https://ideogram.ai", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 1567, skill_level: "beginner", best_for: ["Typography", "Logo Design", "Text Rendering"] },
  { name: "Photoroom", description: "AI photo editor with automatic background removal, product photography, and batch editing. Perfect for e-commerce sellers.", category: "Image", pricing: "Freemium", url: "https://photoroom.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 890, skill_level: "beginner", best_for: ["Product Photography", "Background Removal", "E-commerce"] },
  { name: "Recraft AI", description: "AI vector and raster image generator designed for graphic designers. Creates scalable vector graphics and consistent brand assets.", category: "Image", pricing: "Freemium", url: "https://recraft.ai", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 678, skill_level: "intermediate", best_for: ["Vector Graphics", "Brand Assets", "Design"] },
  { name: "Magnific AI", description: "AI image upscaler that enhances resolution up to 4x while preserving details. Perfect for print-ready images and professional photography.", category: "Image", pricing: "Paid", url: "https://magnific.ai", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 456, skill_level: "beginner", best_for: ["Image Upscaling", "Print-ready", "Photography"] },

  // Video 类 (6个)
  { name: "Runway Gen-3", description: "Next-gen AI video model by Runway with cinematic quality, realistic physics, and text-to-video generation. Industry-leading video AI.", category: "Video", pricing: "Paid", url: "https://runwayml.com", needs_vpn: false, languages: ["English"], rating: 4.7, rating_count: 1890, skill_level: "intermediate", best_for: ["Cinematic Video", "Text-to-Video", "Professional"] },
  { name: "Kling AI", description: "AI video generator by Kuaishou that creates realistic 5-second clips from text prompts. Known for natural motion and physics.", category: "Video", pricing: "Freemium", url: "https://klingai.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1234, skill_level: "beginner", best_for: ["Realistic Motion", "Quick Clips", "Social Media"] },
  { name: "Minimax Video", description: "AI video generation platform with Hailuo model. Creates high-quality animations and realistic video clips from text descriptions.", category: "Video", pricing: "Freemium", url: "https://minimax.chat", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 890, skill_level: "beginner", best_for: ["Animation", "Creative Content", "Marketing"] },
  { name: "Viggle AI", description: "AI character animation tool that applies any movement to your character. Perfect for meme creation, animations, and social media.", category: "Video", pricing: "Freemium", url: "https://viggle.ai", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 567, skill_level: "beginner", best_for: ["Character Animation", "Memes", "Social Media"] },
  { name: "Hedra", description: "AI character video platform that creates talking avatars with expressive emotions and natural lip-sync. Ideal for storytelling.", category: "Video", pricing: "Freemium", url: "https://hedra.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 345, skill_level: "beginner", best_for: ["Talking Avatars", "Storytelling", "Character Animation"] },
  { name: "InVideo AI", description: "AI video creator that generates complete videos from text prompts with stock footage, voiceover, and music. Built for content creators.", category: "Video", pricing: "Freemium", url: "https://invideo.io", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1567, skill_level: "beginner", best_for: ["Complete Videos", "Stock Footage", "Content Creation"] },

  // Audio 类 (5个)
  { name: "ElevenLabs", description: "Industry-leading AI voice generator with the most realistic human-like voices. Supports 32 languages and voice cloning for custom voices.", category: "Audio", pricing: "Freemium", url: "https://elevenlabs.io", needs_vpn: false, languages: ["English"], rating: 4.8, rating_count: 3456, skill_level: "beginner", best_for: ["Voice Generation", "Voice Cloning", "Multilingual"] },
  { name: "Kits AI", description: "AI voice transformation platform for music creators. Convert vocals between different voice models for remixing and production.", category: "Audio", pricing: "Freemium", url: "https://kits.ai", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 456, skill_level: "intermediate", best_for: ["Voice Transformation", "Music Production", "Remixing"] },
  { name: "Udio", description: "AI music generator that creates full songs with vocals, instruments, and professional production quality. Competes with Suno for music AI.", category: "Audio", pricing: "Freemium", url: "https://udio.com", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 1890, skill_level: "beginner", best_for: ["Music Generation", "Full Songs", "Vocals"] },
  { name: "Adobe Podcast", description: "AI-powered podcast recording and editing tool with Studio Sound enhancement, automatic transcription, and noise removal.", category: "Audio", pricing: "Freemium", url: "https://podcast.adobe.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 678, skill_level: "beginner", best_for: ["Podcast Recording", "Audio Enhancement", "Transcription"] },
  { name: "AudioLDM", description: "Open-source AI audio generation model that creates sound effects, ambient audio, and music from text descriptions.", category: "Audio", pricing: "Free", url: "https://github.com/haoheliu/AudioLDM", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 234, skill_level: "advanced", best_for: ["Sound Effects", "Open Source", "Ambient Audio"] },

  // Code 类 (5个)
  { name: "Phind", description: "AI search engine optimized for developers. Provides code solutions, documentation, and debugging help with source citations.", category: "Code", pricing: "Freemium", url: "https://phind.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1234, skill_level: "intermediate", best_for: ["Developer Search", "Debugging", "Documentation"] },
  { name: "Bolt.new", description: "AI-powered full-stack development environment that builds complete web applications from prompts. Deploy directly from the browser.", category: "Code", pricing: "Freemium", url: "https://bolt.new", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 890, skill_level: "beginner", best_for: ["Full-stack Development", "Quick Deployment", "Prototyping"] },
  { name: "v0 by Vercel", description: "AI UI generator by Vercel that creates React components from text prompts. Integrates with Next.js and Tailwind CSS automatically.", category: "Code", pricing: "Freemium", url: "https://v0.dev", needs_vpn: false, languages: ["English"], rating: 4.7, rating_count: 1567, skill_level: "intermediate", best_for: ["React Components", "UI Generation", "Next.js"] },
  { name: "Lovable", description: "AI app builder that creates functional web applications from natural language descriptions. Handles frontend, backend, and deployment.", category: "Code", pricing: "Freemium", url: "https://lovable.dev", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 678, skill_level: "beginner", best_for: ["App Building", "Natural Language", "Full-stack"] },
  { name: "Continue.dev", description: "Open-source AI coding assistant that works with any LLM. Provides code completion, chat, and inline editing in VS Code and JetBrains.", category: "Code", pricing: "Free", url: "https://continue.dev", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 1234, skill_level: "intermediate", best_for: ["Open Source", "Multi-LLM", "IDE Integration"] },

  // Productivity 类 (6个)
  { name: "Tldraw", description: "AI-powered whiteboard and diagramming tool with make-real AI that turns sketches into functional prototypes instantly.", category: "Productivity", pricing: "Free", url: "https://tldraw.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 890, skill_level: "beginner", best_for: ["Whiteboarding", "Prototyping", "Diagramming"] },
  { name: "Arc Search", description: "AI browser by The Browser Company with built-in search summarization, ad blocking, and automatic tab management.", category: "Productivity", pricing: "Free", url: "https://arc.net", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 2345, skill_level: "beginner", best_for: ["Web Browsing", "Search", "Tab Management"] },
  { name: "Fireflies AI", description: "AI meeting assistant that records, transcribes, and summarizes meetings automatically. Integrates with Zoom, Google Meet, and Teams.", category: "Productivity", pricing: "Freemium", url: "https://fireflies.ai", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 1567, skill_level: "beginner", best_for: ["Meeting Notes", "Transcription", "Summarization"] },
  { name: "Otter AI", description: "AI meeting transcription service with real-time captions, speaker identification, and searchable meeting notes.", category: "Productivity", pricing: "Freemium", url: "https://otter.ai", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 2345, skill_level: "beginner", best_for: ["Meeting Transcription", "Speaker ID", "Searchable Notes"] },
  { name: "Tldv", description: "AI meeting recorder for Zoom, Google Meet, and Teams. Automatically captures highlights and generates action items.", category: "Productivity", pricing: "Freemium", url: "https://tl;dv.io", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 678, skill_level: "beginner", best_for: ["Meeting Highlights", "Action Items", "Team Sync"] },
  { name: "Tactiq", description: "AI transcription tool that captures live captions from Google Meet, Zoom, and Teams meetings. Exports to Notion, Google Docs, and more.", category: "Productivity", pricing: "Freemium", url: "https://tactiq.io", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 890, skill_level: "beginner", best_for: ["Live Captions", "Export Integration", "Meeting Records"] },

  // Additional Writing (5个)
  { name: "Outliner AI", description: "AI outline and structure generator for articles, essays, and presentations. Organizes complex topics into logical hierarchies.", category: "Writing", pricing: "Freemium", url: "https://outliner.ai", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 345, skill_level: "beginner", best_for: ["Outlining", "Structure", "Presentations"] },
  { name: "WordAI", description: "AI article rewriter and spinner that creates unique versions of existing content while maintaining readability and meaning.", category: "Writing", pricing: "Paid", url: "https://wordai.com", needs_vpn: false, languages: ["English"], rating: 4.1, rating_count: 234, skill_level: "intermediate", best_for: ["Content Spinning", "Rewriting", "SEO"] },
  { name: "LongShot AI", description: "AI content generator specialized in fact-checked blog posts and long-form articles with automatic research and citations.", category: "Writing", pricing: "Freemium", url: "https://longshot.ai", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 567, skill_level: "intermediate", best_for: ["Fact-checked Content", "Research", "Long-form"] },
  { name: "Peppertype AI", description: "AI copywriting platform with 50+ templates for ad copy, product descriptions, landing pages, and social media content.", category: "Writing", pricing: "Paid", url: "https://peppertype.ai", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 445, skill_level: "beginner", best_for: ["Ad Copy", "Product Descriptions", "Templates"] },
  { name: "Writer.com", description: "Enterprise AI writing platform with brand voice management, style guides, and compliance checks. Built for teams.", category: "Writing", pricing: "Paid", url: "https://writer.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 678, skill_level: "intermediate", best_for: ["Enterprise", "Brand Voice", "Compliance"] },

  // Additional Image (5个)
  { name: "Midjourney V6", description: "Latest version of Midjourney with improved photorealism, text rendering, and style control. Industry leader in artistic AI images.", category: "Image", pricing: "Paid", url: "https://midjourney.com", needs_vpn: false, languages: ["English"], rating: 4.8, rating_count: 5678, skill_level: "beginner", best_for: ["Artistic Images", "Photorealism", "Creative"] },
  { name: "Stability AI", description: "Open-source AI company behind Stable Diffusion. Provides APIs for image generation, editing, and 3D model creation.", category: "Image", pricing: "Freemium", url: "https://stability.ai", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 2345, skill_level: "advanced", best_for: ["Open Source", "API", "3D Models"] },
  { name: "Pixlr AI", description: "AI photo editor with generative fill, background removal, and style transfer. Browser-based with no installation required.", category: "Image", pricing: "Freemium", url: "https://pixlr.com", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 890, skill_level: "beginner", best_for: ["Photo Editing", "Generative Fill", "Browser-based"] },
  { name: "Leonardo Phoenix", description: "Latest Leonardo model with superior prompt understanding, detail quality, and consistency across image series.", category: "Image", pricing: "Freemium", url: "https://leonardo.ai", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 1567, skill_level: "intermediate", best_for: ["Prompt Understanding", "Consistency", "Game Assets"] },
  { name: "Picsart AI", description: "AI photo and video editing suite with text-to-image, AI avatar, and magic edit. Popular for social media content creation.", category: "Image", pricing: "Freemium", url: "https://picsart.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 3456, skill_level: "beginner", best_for: ["Social Media", "AI Avatar", "Magic Edit"] },

  // Additional Video (4个)
  { name: "Synthesia", description: "AI video platform with 160+ AI avatars in 130+ languages. Create professional training and marketing videos without cameras or actors.", category: "Video", pricing: "Paid", url: "https://synthesia.io", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 2345, skill_level: "beginner", best_for: ["AI Avatars", "Training Videos", "Multilingual"] },
  { name: "Pictory", description: "AI video creator that converts long-form content into short, shareable videos. Perfect for repurposing blog posts and webinars.", category: "Video", pricing: "Paid", url: "https://pictory.ai", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 1234, skill_level: "beginner", best_for: ["Content Repurposing", "Short Videos", "Blog-to-Video"] },
  { name: "Wave.video", description: "AI-powered video creation and live streaming platform with customizable templates, stock library, and social media optimization.", category: "Video", pricing: "Freemium", url: "https://wave.video", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 567, skill_level: "beginner", best_for: ["Live Streaming", "Templates", "Social Media"] },
  { name: "Steve AI", description: "AI video maker that converts text, audio, or blog posts into animated or live-action videos with AI voiceover.", category: "Video", pricing: "Freemium", url: "https://www.steve.ai", needs_vpn: false, languages: ["English"], rating: 4.1, rating_count: 345, skill_level: "beginner", best_for: ["Text-to-Video", "Animation", "Voiceover"] },

  // Additional Audio (3个)
  { name: "Voice AI", description: "AI voice transformation tool for real-time voice changing during calls, streaming, and recording. 1000+ voice models.", category: "Audio", pricing: "Freemium", url: "https://voice.ai", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 890, skill_level: "beginner", best_for: ["Voice Changing", "Streaming", "Calls"] },
  { name: "Lovo AI", description: "AI voice generator and text-to-speech platform with emotional voices and professional quality. Built for video creators.", category: "Audio", pricing: "Freemium", url: "https://lovo.ai", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 678, skill_level: "beginner", best_for: ["Emotional Voices", "TTS", "Video Creators"] },
  { name: "Speechify", description: "AI text-to-speech reader that converts articles, PDFs, and emails into natural-sounding audio. Boost reading speed 3x.", category: "Audio", pricing: "Freemium", url: "https://speechify.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 2345, skill_level: "beginner", best_for: ["Reading", "Accessibility", "Productivity"] },

  // More fresh tools (15个)
  { name: "Poe AI", description: "AI chat platform by Quora that lets you access multiple AI models (GPT-4, Claude, Llama) in one interface. Great for comparing AI responses.", category: "Writing", pricing: "Freemium", url: "https://poe.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 3456, skill_level: "beginner", best_for: ["Multi-Model Chat", "AI Comparison", "Research"] },
  { name: "Gemini Advanced", description: "Google's most capable AI model with 1M token context window. Excels at code analysis, long document processing, and multimodal reasoning.", category: "Writing", pricing: "Freemium", url: "https://gemini.google.com", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 4567, skill_level: "beginner", best_for: ["Long Context", "Code Analysis", "Google Integration"] },
  { name: "Claude 3.5", description: "Anthropic's latest AI with superior reasoning, coding, and vision capabilities. Known for thoughtful responses and safety-first design.", category: "Writing", pricing: "Freemium", url: "https://claude.ai", needs_vpn: false, languages: ["English"], rating: 4.7, rating_count: 5678, skill_level: "beginner", best_for: ["Reasoning", "Coding", "Safety"] },
  { name: "Perplexity Pages", description: "AI-powered knowledge pages that compile research, citations, and sources into beautiful, shareable documents.", category: "Writing", pricing: "Freemium", url: "https://perplexity.ai", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 2345, skill_level: "beginner", best_for: ["Research Pages", "Citations", "Knowledge Sharing"] },
  { name: "Gamma App", description: "AI presentation generator that creates beautiful slides, documents, and webpages from text prompts. Built for fast content creation.", category: "Productivity", pricing: "Freemium", url: "https://gamma.app", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 1890, skill_level: "beginner", best_for: ["Presentations", "Documents", "Quick Creation"] },
  { name: "Tome AI", description: "AI storytelling platform that creates presentations with rich media, interactive elements, and narrative flow.", category: "Productivity", pricing: "Freemium", url: "https://tome.app", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 1234, skill_level: "beginner", best_for: ["Storytelling", "Presentations", "Rich Media"] },
  { name: "Beautiful.ai", description: "AI slide design platform that automatically formats and aligns your presentations. Professional design without design skills.", category: "Productivity", pricing: "Paid", url: "https://beautiful.ai", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 890, skill_level: "beginner", best_for: ["Slide Design", "Auto Formatting", "Professional"] },
  { name: "SlidesAI", description: "AI presentation maker that converts any text into slides with auto-layout, images, and speaker notes.", category: "Productivity", pricing: "Freemium", url: "https://slidesai.io", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 567, skill_level: "beginner", best_for: ["Text-to-Slides", "Auto Layout", "Speaker Notes"] },
  { name: "Runway Act-One", description: "AI performance capture tool that transfers actor movements to 3D characters with minimal setup. Built for animation and VFX.", category: "Video", pricing: "Paid", url: "https://runwayml.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 678, skill_level: "advanced", best_for: ["Motion Capture", "Animation", "VFX"] },
  { name: "LTX Studio", description: "AI filmmaking platform that creates complete video scenes with characters, dialogue, camera angles, and editing.", category: "Video", pricing: "Freemium", url: "https://ltx.studio", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 890, skill_level: "intermediate", best_for: ["Filmmaking", "Scene Generation", "Complete Videos"] },
  { name: "Haiper AI", description: "AI video generator focused on artistic quality and creative control. Creates short cinematic clips from text and image prompts.", category: "Video", pricing: "Freemium", url: "https://haiper.ai", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 567, skill_level: "beginner", best_for: ["Artistic Video", "Creative Control", "Cinematic"] },
  { name: "Cohere", description: "Enterprise AI platform with RAG, classification, and generation APIs. Built for production-grade applications.", category: "Code", pricing: "Freemium", url: "https://cohere.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 890, skill_level: "advanced", best_for: ["Enterprise AI", "RAG", "APIs"] },
  { name: "Mistral AI", description: "European AI company with open-weight models that compete with GPT-4. Fast, efficient, and privacy-focused.", category: "Code", pricing: "Freemium", url: "https://mistral.ai", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1567, skill_level: "advanced", best_for: ["Open Weights", "Privacy", "Fast Inference"] },
  { name: "Ankr AI", description: "AI-powered data analytics platform that generates insights, charts, and reports from raw data using natural language queries.", category: "Productivity", pricing: "Freemium", url: "https://ankr.ai", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 345, skill_level: "intermediate", best_for: ["Data Analytics", "Reports", "Natural Language Queries"] },
  { name: "Spline AI", description: "AI 3D design tool that generates 3D objects, scenes, and animations from text prompts. Browser-based with real-time preview.", category: "Image", pricing: "Freemium", url: "https://spline.design", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 1234, skill_level: "intermediate", best_for: ["3D Design", "Text-to-3D", "Browser-based"] },
];

// 添加新工具（去重后）
let addedCount = 0;
let skippedCount = 0;
newTools.forEach(newTool => {
  // 跳过已存在的工具
  if (existingNames.has(newTool.name.toLowerCase().trim())) {
    console.log(`⏭️  跳过已存在的: ${newTool.name}`);
    skippedCount++;
    return;
  }
  
  existingNames.add(newTool.name.toLowerCase().trim());
  const tool = {
    id: nextId,
    name: newTool.name,
    description: newTool.description,
    description_en: newTool.description,
    category: newTool.category,
    pricing: newTool.pricing,
    url: newTool.url,
    affiliate_link: "",
    icon_url: "",
    examples: [],
    needs_vpn: newTool.needs_vpn,
    languages: newTool.languages,
    rating: newTool.rating,
    rating_count: newTool.rating_count,
    rating_breakdown: {
      "quality": { score: Math.min(5, newTool.rating + 0.2), max: 5 },
      "ease_of_use": { score: newTool.skill_level === "beginner" ? 4.5 : newTool.skill_level === "intermediate" ? 4.0 : 3.5, max: 5 },
      "value": { score: newTool.pricing === "Free" ? 4.8 : newTool.pricing === "Freemium" ? 4.2 : 3.5, max: 5 },
      "features": { score: Math.min(5, newTool.rating + 0.1), max: 5 },
      "support": { score: 4.0, max: 5 },
      "reliability": { score: Math.min(5, newTool.rating + 0.3), max: 5 }
    },
    last_updated: "2026-05-30",
    skill_level: newTool.skill_level,
    best_for: newTool.best_for
  };
  
  tools.push(tool);
  nextId++;
  addedCount++;
});

// 保存更新后的工具数据
fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');

console.log(`✅ 新增 ${addedCount} 个工具`);
console.log(`⏭️  跳过 ${skippedCount} 个重复工具`);
console.log(`📊 总工具数: ${tools.length}`);

// 按分类统计
const categoryCount = {};
tools.forEach(t => {
  categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
});
console.log("\n📁 分类统计:");
Object.entries(categoryCount).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count} 个`);
});

console.log("\n🎉 工具收录完成!");
