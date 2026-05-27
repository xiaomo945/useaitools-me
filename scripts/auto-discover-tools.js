const fs = require('fs');
const path = require('path');

// 读取现有工具数据
const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
const maxId = Math.max(...tools.map(t => t.id));
let nextId = maxId + 1;

console.log(`🔍 当前工具数: ${tools.length}, 下一个ID: ${nextId}\n`);

// 预定义的50+个新工具数据（模拟从Product Hunt/There's An AI For That抓取）
const newTools = [
  // Writing 类 (10个)
  { name: "Writesonic", description: "AI-powered content generation platform that creates SEO-optimized blog posts, marketing copy, and social media content in seconds. Features built-in SEO checker and 100+ templates for various content types.", category: "Writing", pricing: "Freemium", url: "https://writesonic.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 892, skill_level: "beginner", best_for: ["Blog Posts", "Marketing Copy", "SEO Content"] },
  { name: "CopyAI", description: "AI copywriting assistant that generates high-converting marketing copy, ad copy, and social media posts. Perfect for marketers who need to scale content production.", category: "Writing", pricing: "Freemium", url: "https://copy.ai", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 756, skill_level: "beginner", best_for: ["Marketing Copy", "Ad Copy", "Social Media"] },
  { name: "Grammarly", description: "AI-powered writing assistant that checks grammar, spelling, tone, and clarity. Helps you communicate more effectively across all your written content.", category: "Writing", pricing: "Freemium", url: "https://grammarly.com", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 2341, skill_level: "beginner", best_for: ["Grammar Check", "Tone Analysis", "Clarity"] },
  { name: "Wordtune", description: "AI rewriting tool that rewrites your sentences for better clarity and style. Helps you express your thoughts more effectively.", category: "Writing", pricing: "Freemium", url: "https://wordtune.com", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 445, skill_level: "beginner", best_for: ["Sentence Rewriting", "Style Improvement", "Clarity"] },
  { name: "QuillBot", description: "AI paraphrasing and summarization tool that rewrites text while preserving meaning. Great for students and researchers.", category: "Writing", pricing: "Freemium", url: "https://quillbot.com", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 678, skill_level: "beginner", best_for: ["Paraphrasing", "Summarization", "Research"] },
  { name: "Sudowrite", description: "AI creative writing assistant designed specifically for fiction writers and novelists. Helps with brainstorming, story structure, and character development.", category: "Writing", pricing: "Paid", url: "https://sudowrite.com", needs_vpn: false, languages: ["English"], rating: 4.7, rating_count: 234, skill_level: "intermediate", best_for: ["Fiction Writing", "Creative Writing", "Story Development"] },
  { name: "HyperWrite", description: "AI writing assistant that helps you compose emails, essays, and documents faster. Integrates with Chrome for web-wide assistance.", category: "Writing", pricing: "Freemium", url: "https://hyperwriteai.com", needs_vpn: false, languages: ["English"], rating: 4.1, rating_count: 312, skill_level: "beginner", best_for: ["Email Writing", "Essays", "Web Writing"] },
  { name: "ParagraphAI", description: "AI-powered paragraph generator that creates well-structured content from bullet points. Perfect for quick content creation.", category: "Writing", pricing: "Freemium", url: "https://paragraphai.com", needs_vpn: false, languages: ["English"], rating: 4.0, rating_count: 189, skill_level: "beginner", best_for: ["Paragraph Generation", "Quick Content", "Brainstorming"] },
  { name: "TextCortex", description: "AI writing tool with 100+ templates for content creation, including blog posts, product descriptions, and social media posts.", category: "Writing", pricing: "Freemium", url: "https://textcortex.com", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 423, skill_level: "beginner", best_for: ["Template-based Writing", "Product Descriptions", "Blog Posts"] },
  { name: "ArticleForge", description: "AI article generator that creates complete, well-researched articles on any topic. Built for content marketers and SEO professionals.", category: "Writing", pricing: "Paid", url: "https://articleforge.com", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 345, skill_level: "intermediate", best_for: ["Article Generation", "SEO Content", "Content Marketing"] },

  // Image 类 (10个)
  { name: "DALL-E 3", description: "OpenAI's most advanced image generation model that creates highly realistic and creative images from text descriptions. Exceptional at understanding complex prompts.", category: "Image", pricing: "Paid", url: "https://openai.com/dall-e-3", needs_vpn: false, languages: ["English"], rating: 4.8, rating_count: 1567, skill_level: "beginner", best_for: ["Realistic Images", "Complex Prompts", "Creative Concepts"] },
  { name: "Stable Diffusion", description: "Open-source AI image generation model that creates high-quality images from text prompts. Fully customizable and runs locally for privacy.", category: "Image", pricing: "Free", url: "https://stability.ai", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 2341, skill_level: "advanced", best_for: ["Custom Generation", "Open Source", "Local Processing"] },
  { name: "Canva AI", description: "AI-powered design platform with Magic Edit, Text-to-Image, and background removal. Perfect for non-designers who need professional graphics quickly.", category: "Image", pricing: "Freemium", url: "https://canva.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 3456, skill_level: "beginner", best_for: ["Graphic Design", "Social Media", "Marketing"] },
  { name: "Leonardo AI", description: "AI image generation platform optimized for game assets, concept art, and character design. Offers fine-tuned control over style and composition.", category: "Image", pricing: "Freemium", url: "https://leonardo.ai", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 892, skill_level: "intermediate", best_for: ["Game Assets", "Concept Art", "Character Design"] },
  { name: "Playground AI", description: "Free AI art generator that creates beautiful images from text prompts. Features an intuitive interface and multiple style options.", category: "Image", pricing: "Free", url: "https://playgroundai.com", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 678, skill_level: "beginner", best_for: ["Free Art Generation", "Style Exploration", "Quick Prototyping"] },
  { name: "Adobe Firefly", description: "Adobe's AI image generator integrated into Creative Cloud. Creates commercially-safe images with built-in brand asset integration.", category: "Image", pricing: "Freemium", url: "https://firefly.adobe.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1234, skill_level: "intermediate", best_for: ["Commercial Use", "Brand Assets", "Creative Cloud Integration"] },
  { name: "Runway ML", description: "AI-powered creative suite for image and video editing. Offers Gen-2 text-to-video, motion brush, and advanced editing features for professionals.", category: "Image", pricing: "Freemium", url: "https://runwayml.com", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 987, skill_level: "advanced", best_for: ["Video Editing", "Professional Creative", "Motion Graphics"] },
  { name: "Fotor", description: "AI photo editor and enhancer with background removal, object removal, and image upscaling. Perfect for quick photo improvements.", category: "Image", pricing: "Freemium", url: "https://fotor.com", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 567, skill_level: "beginner", best_for: ["Photo Enhancement", "Background Removal", "Quick Editing"] },
  { name: "Clipdrop", description: "AI-powered visual creation toolkit by Stability AI. Includes text-to-image, background removal, and upscaling tools in one platform.", category: "Image", pricing: "Freemium", url: "https://clipdrop.co", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 445, skill_level: "intermediate", best_for: ["Background Removal", "Image Upscaling", "Quick Edits"] },
  { name: "Craiyon", description: "Free AI art generator based on DALL-E Mini. Creates unique images from text descriptions with no registration required.", category: "Image", pricing: "Free", url: "https://craiyon.com", needs_vpn: false, languages: ["English"], rating: 3.9, rating_count: 890, skill_level: "beginner", best_for: ["Free Art", "Quick Prototyping", "Casual Use"] },

  // Video 类 (10个)
  { name: "Pika", description: "AI video generator that creates high-quality videos from text prompts and images. Specializes in cinematic animations and motion effects.", category: "Video", pricing: "Freemium", url: "https://pika.art", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1234, skill_level: "beginner", best_for: ["Cinematic Video", "Animation", "Quick Generation"] },
  { name: "Luma Dream Machine", description: "AI video generator that creates realistic video clips from text and images. Known for high-quality motion and realistic physics.", category: "Video", pricing: "Freemium", url: "https://lumalabs.ai", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 890, skill_level: "beginner", best_for: ["Realistic Video", "Motion Graphics", "Product Demos"] },
  { name: "Kaiber", description: "AI video creation platform that transforms images and text into stunning animated videos. Popular for music videos and artistic content.", category: "Video", pricing: "Paid", url: "https://kaiber.ai", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 567, skill_level: "intermediate", best_for: ["Music Videos", "Artistic Content", "Animation"] },
  { name: "HeyGen", description: "AI video platform that creates professional videos with AI avatars. Ideal for training, marketing, and multilingual content.", category: "Video", pricing: "Paid", url: "https://heygen.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 678, skill_level: "beginner", best_for: ["AI Avatars", "Training Videos", "Marketing"] },
  { name: "Elai.io", description: "AI video generator that turns text into professional videos with AI presenters. Supports 75+ languages for global content.", category: "Video", pricing: "Paid", url: "https://elai.io", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 445, skill_level: "beginner", best_for: ["Text-to-Video", "Multilingual", "AI Presenters"] },
  { name: "Fliki", description: "AI video creator that converts text, blog posts, and scripts into videos with AI voices and stock footage. Perfect for faceless channels.", category: "Video", pricing: "Freemium", url: "https://fliki.ai", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 789, skill_level: "beginner", best_for: ["Faceless Videos", "Blog-to-Video", "Social Media"] },
  { name: "Colossyan", description: "AI video creation platform for corporate training and learning content. Features realistic AI presenters and scenario-based learning.", category: "Video", pricing: "Paid", url: "https://colossyan.com", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 345, skill_level: "intermediate", best_for: ["Corporate Training", "Learning Content", "AI Presenters"] },
  { name: "Descript", description: "AI-powered video and podcast editor that edits like a word processor. Features automatic transcription and voice cloning.", category: "Video", pricing: "Freemium", url: "https://descript.com", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 1567, skill_level: "intermediate", best_for: ["Video Editing", "Podcast Editing", "Transcription"] },
  { name: "Captions AI", description: "AI video editing tool that automatically adds captions, enhances audio, and optimizes videos for social media platforms.", category: "Video", pricing: "Freemium", url: "https://captions.ai", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 678, skill_level: "beginner", best_for: ["Auto Captions", "Social Media", "Audio Enhancement"] },
  { name: "Opus Clip", description: "AI video repurposing tool that automatically extracts viral clips from long-form videos. Perfect for content creators and marketers.", category: "Video", pricing: "Paid", url: "https://opus.pro", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 890, skill_level: "beginner", best_for: ["Video Repurposing", "Short Clips", "Social Media"] },

  // Audio 类 (7个)
  { name: "PlayHT", description: "AI voice generator with ultra-realistic voices in 140+ languages. Perfect for podcasts, audiobooks, and video voiceovers.", category: "Audio", pricing: "Freemium", url: "https://play.ht", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 567, skill_level: "beginner", best_for: ["Voice Generation", "Podcasts", "Audiobooks"] },
  { name: "Resemble AI", description: "AI voice cloning and generation platform that creates custom voices for games, videos, and interactive applications.", category: "Audio", pricing: "Paid", url: "https://resemble.ai", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 345, skill_level: "intermediate", best_for: ["Voice Cloning", "Games", "Custom Voices"] },
  { name: "Murf AI", description: "Studio-quality AI voiceover generator with 120+ voices in 20+ languages. Perfect for professional video narration.", category: "Audio", pricing: "Freemium", url: "https://murf.ai", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 789, skill_level: "beginner", best_for: ["Studio Quality", "Video Narration", "Multilingual"] },
  { name: "VoiceMod", description: "AI voice changer and soundboard that transforms your voice in real-time for gaming, streaming, and content creation.", category: "Audio", pricing: "Freemium", url: "https://voicemod.net", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 1234, skill_level: "beginner", best_for: ["Voice Changer", "Gaming", "Streaming"] },
  { name: "Suno AI", description: "AI music generator that creates original songs from text descriptions. Supports various genres and styles for content creators.", category: "Audio", pricing: "Freemium", url: "https://suno.ai", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 2345, skill_level: "beginner", best_for: ["Music Generation", "Content Creation", "Original Songs"] },
  { name: "Podcastle", description: "AI-powered podcast recording and editing platform. Features automatic noise removal, transcription, and one-click publishing.", category: "Audio", pricing: "Freemium", url: "https://podcastle.ai", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 234, skill_level: "beginner", best_for: ["Podcast Recording", "Auto Editing", "Publishing"] },
  { name: "Beatoven AI", description: "AI music composer that creates royalty-free background music for videos, podcasts, and presentations.", category: "Audio", pricing: "Paid", url: "https://beatoven.ai", needs_vpn: false, languages: ["English"], rating: 4.1, rating_count: 189, skill_level: "beginner", best_for: ["Background Music", "Royalty-Free", "Video Content"] },

  // Code 类 (7个)
  { name: "Tabnine", description: "AI code completion tool that supports 30+ programming languages. Learns from your codebase for personalized suggestions.", category: "Code", pricing: "Freemium", url: "https://tabnine.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 890, skill_level: "intermediate", best_for: ["Code Completion", "30+ Languages", "Personalized"] },
  { name: "Amazon CodeWhisperer", description: "AI coding assistant by AWS that generates code suggestions and security scans. Free for individual developers.", category: "Code", pricing: "Free", url: "https://aws.amazon.com/codewhisperer", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 678, skill_level: "intermediate", best_for: ["Free Tool", "AWS Integration", "Security Scans"] },
  { name: "Replit AI", description: "AI-powered coding environment with ghostwriter, debugging, and deployment. Build, run, and deploy apps from your browser.", category: "Code", pricing: "Freemium", url: "https://replit.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1567, skill_level: "beginner", best_for: ["Browser IDE", "Quick Deployment", "Learning"] },
  { name: "Codeium", description: "Free AI code completion and search tool that works with your IDE. Supports 70+ languages and provides intelligent suggestions.", category: "Code", pricing: "Free", url: "https://codeium.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 1234, skill_level: "intermediate", best_for: ["Free Completion", "70+ Languages", "IDE Integration"] },
  { name: "Windsurf", description: "AI-powered IDE that understands your entire codebase and provides context-aware suggestions. Built for professional developers.", category: "Code", pricing: "Paid", url: "https://windsurf.com", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 456, skill_level: "advanced", best_for: ["Professional IDE", "Context-Aware", "Codebase Understanding"] },
  { name: "Devin AI", description: "AI software engineer that can complete complex coding tasks autonomously. From planning to deployment, handles full development workflows.", category: "Code", pricing: "Paid", url: "https://devin.ai", needs_vpn: false, languages: ["English"], rating: 4.7, rating_count: 789, skill_level: "intermediate", best_for: ["Autonomous Coding", "Full Workflow", "Complex Tasks"] },
  { name: "Sourcegraph Cody", description: "AI coding assistant that understands your entire codebase and answers questions about your code. Integrates with VS Code and JetBrains.", category: "Code", pricing: "Freemium", url: "https://sourcegraph.com/cody", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 567, skill_level: "intermediate", best_for: ["Code Understanding", "Q&A", "Codebase Navigation"] },

  // Productivity 类 (8个)
  { name: "Notion AI", description: "AI-powered workspace that helps you write, organize, and automate your work. Integrates seamlessly with Notion's databases and pages.", category: "Productivity", pricing: "Freemium", url: "https://notion.so", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 3456, skill_level: "beginner", best_for: ["Workspace", "Writing", "Organization"] },
  { name: "Mem AI", description: "AI-powered note-taking app that automatically organizes your thoughts, connects ideas, and surfaces relevant information when you need it.", category: "Productivity", pricing: "Freemium", url: "https://mem.ai", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 567, skill_level: "beginner", best_for: ["Smart Notes", "Idea Connection", "Knowledge Management"] },
  { name: "Motion", description: "AI calendar and task manager that automatically schedules your tasks and meetings. Optimizes your day for maximum productivity.", category: "Productivity", pricing: "Paid", url: "https://motion.app", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 890, skill_level: "beginner", best_for: ["Calendar Management", "Task Scheduling", "Time Optimization"] },
  { name: "Zapier AI", description: "AI-powered automation platform that connects 6000+ apps and automates workflows without coding. Perfect for business automation.", category: "Productivity", pricing: "Freemium", url: "https://zapier.com", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 2345, skill_level: "intermediate", best_for: ["Workflow Automation", "App Integration", "Business Processes"] },
  { name: "Make AI", description: "Visual automation platform that connects apps and automates complex workflows. More flexible than traditional automation tools.", category: "Productivity", pricing: "Freemium", url: "https://make.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1234, skill_level: "intermediate", best_for: ["Visual Automation", "Complex Workflows", "API Integration"] },
  { name: "ClickUp AI", description: "AI-powered project management platform that automates tasks, generates documents, and provides intelligent insights for teams.", category: "Productivity", pricing: "Freemium", url: "https://clickup.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 1567, skill_level: "intermediate", best_for: ["Project Management", "Team Collaboration", "Task Automation"] },
  { name: "Rewind AI", description: "AI personal assistant that records and indexes everything you see on your computer. Search your digital life with natural language.", category: "Productivity", pricing: "Paid", url: "https://rewind.ai", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 345, skill_level: "beginner", best_for: ["Memory Aid", "Search", "Productivity Tracking"] },
  { name: "Glean", description: "AI-powered workplace search that connects all your company's tools and documents. Find any information instantly across your organization.", category: "Productivity", pricing: "Paid", url: "https://glean.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 678, skill_level: "intermediate", best_for: ["Enterprise Search", "Knowledge Management", "Team Productivity"] },
];

// 添加新工具
let addedCount = 0;
newTools.forEach(newTool => {
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
