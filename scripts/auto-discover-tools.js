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

// 40个全新工具数据（本轮新增）
const newTools = [
  // Writing (7个)
  { name: "CopyMonkey", description: "AI content generator that creates high-converting product descriptions, ad copy, and blog posts with A/B testing insights. Perfect for Amazon sellers and e-commerce brands.", category: "Writing", pricing: "Freemium", url: "https://copymonkey.ai", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 234, skill_level: "beginner", best_for: ["Amazon Sellers", "Product Descriptions", "A/B Testing"] },
  { name: "Nichesss", description: "AI writing tool specialized for niche markets and affiliate marketers. Generates product reviews, comparison articles, and SEO content for micro-niches.", category: "Writing", pricing: "Paid", url: "https://nichesss.com", needs_vpn: false, languages: ["English"], rating: 4.1, rating_count: 189, skill_level: "intermediate", best_for: ["Affiliate Marketing", "Niche Content", "Product Reviews"] },
  { name: "ClosersCopy", description: "AI copywriting platform with proven sales frameworks and templates. Creates high-converting sales pages, emails, and marketing copy using psychological triggers.", category: "Writing", pricing: "Paid", url: "https://closerscopy.com", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 456, skill_level: "intermediate", best_for: ["Sales Copy", "Marketing", "Psychological Triggers"] },
  { name: "Smartwriter", description: "AI outreach tool that writes personalized cold emails, LinkedIn messages, and sales copy. Uses prospect data to customize every message.", category: "Writing", pricing: "Paid", url: "https://smartwriter.ai", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 345, skill_level: "intermediate", best_for: ["Cold Outreach", "LinkedIn", "Personalization"] },
  { name: "Kopywriting Kourse AI", description: "AI writing assistant with proven copywriting frameworks and templates. Teaches you copywriting while generating high-converting content.", category: "Writing", pricing: "Freemium", url: "https://kopywritingkourse.com", needs_vpn: false, languages: ["English"], rating: 4.0, rating_count: 234, skill_level: "beginner", best_for: ["Copywriting Learning", "Templates", "Frameworks"] },
  { name: "Outwrite", description: "AI writing assistant that improves clarity, grammar, and tone for professional writing. Perfect for business emails, reports, and academic papers.", category: "Writing", pricing: "Freemium", url: "https://outwrite.com", needs_vpn: false, languages: ["English"], rating: 4.1, rating_count: 567, skill_level: "beginner", best_for: ["Professional Writing", "Grammar", "Clarity"] },
  { name: "ProWritingAid", description: "AI writing coach that provides in-depth feedback on style, grammar, and readability. Integrates with all major writing platforms.", category: "Writing", pricing: "Freemium", url: "https://prowritingaid.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 890, skill_level: "intermediate", best_for: ["Writing Coach", "Style Improvement", "Readability"] },

  // Image (7个)
  { name: "Hotpot AI", description: "AI design platform with tools for image generation, background removal, photo restoration, and design templates. Perfect for marketers and small businesses.", category: "Image", pricing: "Freemium", url: "https://hotpot.ai", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 567, skill_level: "beginner", best_for: ["Design Templates", "Background Removal", "Photo Restoration"] },
  { name: "Stockimg AI", description: "AI image generator that creates high-quality stock photos, book covers, posters, and social media graphics. No design skills required.", category: "Image", pricing: "Freemium", url: "https://stockimg.ai", needs_vpn: false, languages: ["English"], rating: 4.1, rating_count: 456, skill_level: "beginner", best_for: ["Stock Photos", "Book Covers", "Social Graphics"] },
  { name: "Designer Microsoft", description: "Microsoft's AI design tool that creates stunning visuals, social media posts, and presentations from text prompts. Integrates with Office 365.", category: "Image", pricing: "Freemium", url: "https://designer.microsoft.com", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 1234, skill_level: "beginner", best_for: ["Microsoft Integration", "Presentations", "Social Posts"] },
  { name: "Bing Image Creator", description: "Microsoft's AI image generator powered by DALL-E. Creates high-quality images from text prompts directly in Bing chat.", category: "Image", pricing: "Free", url: "https://bing.com/create", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 2345, skill_level: "beginner", best_for: ["Free Access", "Bing Integration", "DALL-E Powered"] },
  { name: "Imagine Art", description: "AI art generator with multiple styles and customization options. Create unique artwork for personal or commercial use with simple prompts.", category: "Image", pricing: "Freemium", url: "https://imagine.art", needs_vpn: false, languages: ["English"], rating: 4.0, rating_count: 345, skill_level: "beginner", best_for: ["Multiple Styles", "Customization", "Commercial Use"] },
  { name: "CF Spark", description: "AI art platform with multiple creative tools including image generation, pattern maker, and writing assistant. Made for crafters and creators.", category: "Image", pricing: "Freemium", url: "https://creativefabrica.com/spark", needs_vpn: false, languages: ["English"], rating: 4.1, rating_count: 456, skill_level: "beginner", best_for: ["Crafters", "Patterns", "Creative Tools"] },
  { name: "Zmo AI", description: "AI fashion image generator that creates models wearing your clothes. Perfect for e-commerce brands and fashion designers.", category: "Image", pricing: "Paid", url: "https://zmo.ai", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 234, skill_level: "intermediate", best_for: ["Fashion", "E-commerce", "Virtual Models"] },

  // Video (7个)
  { name: "Synthesia Studio", description: "AI video platform with realistic avatars, text-to-video, and multi-language support. Create professional videos in minutes without filming.", category: "Video", pricing: "Paid", url: "https://synthesia.io", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1890, skill_level: "intermediate", best_for: ["Professional Videos", "Avatars", "Multi-language"] },
  { name: "D-ID Studio", description: "AI video creation platform that animates photos, creates talking avatars, and generates videos from text. Perfect for training and marketing.", category: "Video", pricing: "Freemium", url: "https://d-id.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 1234, skill_level: "beginner", best_for: ["Talking Avatars", "Photo Animation", "Training Videos"] },
  { name: "Elai.io", description: "AI video generator with 80+ avatars and 65+ languages. Create training videos, explainers, and marketing content from text.", category: "Video", pricing: "Freemium", url: "https://elai.io", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 567, skill_level: "beginner", best_for: ["Explainers", "Training", "65+ Languages"] },
  { name: "Colossyan Creator", description: "AI video platform with AI presenters, screen recording, and multi-language support. Create corporate training videos and product demos.", category: "Video", pricing: "Freemium", url: "https://colossyan.com", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 456, skill_level: "intermediate", best_for: ["Corporate Training", "Product Demos", "AI Presenters"] },
  { name: "InVideo Studio", description: "AI video editor with templates, stock media, and text-to-video features. Create marketing videos, social content, and ads in minutes.", category: "Video", pricing: "Freemium", url: "https://invideo.io", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 890, skill_level: "beginner", best_for: ["Templates", "Stock Media", "Marketing Videos"] },
  { name: "FlexClip AI", description: "Easy-to-use AI video maker with templates, AI voiceover, and auto-subtitles. Create social videos, explainers, and presentations quickly.", category: "Video", pricing: "Freemium", url: "https://flexclip.com", needs_vpn: false, languages: ["English"], rating: 4.1, rating_count: 567, skill_level: "beginner", best_for: ["Easy to Use", "Templates", "AI Voiceover"] },
  { name: "Promo AI", description: "AI video ad creator that generates high-converting ads from product images and URLs. Perfect for e-commerce and social media advertising.", category: "Video", pricing: "Paid", url: "https://promo.com", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 345, skill_level: "beginner", best_for: ["Video Ads", "E-commerce", "Social Advertising"] },

  // Audio (7个)
  { name: "Speechmatics", description: "AI speech recognition and transcription platform with 50+ languages. Highly accurate transcription for meetings, calls, and content.", category: "Audio", pricing: "Freemium", url: "https://speechmatics.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 567, skill_level: "intermediate", best_for: ["Transcription", "50+ Languages", "High Accuracy"] },
  { name: "Otter.ai Business", description: "AI meeting assistant that records, transcribes, and summarizes meetings with speaker identification. Integrates with Zoom, Teams, and Google Meet.", category: "Audio", pricing: "Freemium", url: "https://otter.ai", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 2345, skill_level: "beginner", best_for: ["Meeting Assistant", "Speaker ID", "Zoom Integration"] },
  { name: "Fireflies.ai", description: "AI meeting notetaker that joins your calls, records, transcribes, and generates searchable notes with action items. Perfect for teams.", category: "Audio", pricing: "Freemium", url: "https://fireflies.ai", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 1567, skill_level: "beginner", best_for: ["Meeting Notes", "Action Items", "Team Collaboration"] },
  { name: "Descript Storyboard", description: "AI video and audio editor that works like a doc. Edit transcripts, remove filler words, and create polished content with AI tools.", category: "Audio", pricing: "Freemium", url: "https://descript.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1890, skill_level: "intermediate", best_for: ["Podcast Editing", "Transcript Editing", "AI Tools"] },
  { name: "Adobe Audition AI", description: "Professional audio editing software with AI features for noise reduction, audio restoration, and sound design. Industry standard for audio production.", category: "Audio", pricing: "Paid", url: "https://adobe.com/products/audition", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 3456, skill_level: "advanced", best_for: ["Professional Audio", "Sound Design", "Audio Restoration"] },
  { name: "iZotope RX", description: "AI-powered audio restoration and repair tool. Removes noise, clicks, hum, and other imperfections from audio recordings professionally.", category: "Audio", pricing: "Paid", url: "https://izotope.com/en/products/rx.html", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1234, skill_level: "advanced", best_for: ["Audio Restoration", "Noise Removal", "Professional"] },
  { name: "Boomy", description: "AI music generator that lets you create original songs in seconds. Customize genres, instruments, and vocals for unique tracks.", category: "Audio", pricing: "Freemium", url: "https://boomy.com", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 890, skill_level: "beginner", best_for: ["Music Creation", "Custom Tracks", "Beginner Friendly"] },

  // Code (6个)
  { name: "Codeium", description: "AI coding assistant with free autocomplete for 70+ languages. Integrates with all major IDEs including VS Code, JetBrains, and Neovim.", category: "Code", pricing: "Freemium", url: "https://codeium.com", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 1567, skill_level: "beginner", best_for: ["Free Autocomplete", "70+ Languages", "Multi-IDE"] },
  { name: "Windsurf", description: "AI-powered code editor built for web development. Features AI autocomplete, code suggestions, and a streamlined interface.", category: "Code", pricing: "Freemium", url: "https://windsurf.com", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 567, skill_level: "intermediate", best_for: ["Web Development", "AI Editor", "Streamlined"] },
  { name: "Devin AI", description: "AI software engineer that can build and deploy entire applications from simple prompts. The world's first AI coding agent.", category: "Code", pricing: "Paid", url: "https://cognition.ai", needs_vpn: false, languages: ["English"], rating: 4.7, rating_count: 890, skill_level: "advanced", best_for: ["Full Applications", "Deployment", "AI Engineer"] },
  { name: "Sourcegraph Cody", description: "AI coding assistant that understands your entire codebase. Answers questions, writes code, and explains complex systems.", category: "Code", pricing: "Freemium", url: "https://sourcegraph.com/cody", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 678, skill_level: "intermediate", best_for: ["Codebase Understanding", "Question Answering", "Explanations"] },
  { name: "Sourcery", description: "AI coding assistant that automatically refactors and improves your code. Catches bugs, improves readability, and follows best practices.", category: "Code", pricing: "Freemium", url: "https://sourcery.ai", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 456, skill_level: "intermediate", best_for: ["Code Refactoring", "Best Practices", "Bug Detection"] },
  { name: "Mutable AI", description: "AI pair programmer that helps you write, test, and refactor code faster. Features autocomplete, code generation, and test creation.", category: "Code", pricing: "Freemium", url: "https://mutable.ai", needs_vpn: false, languages: ["English"], rating: 4.2, rating_count: 345, skill_level: "intermediate", best_for: ["Pair Programming", "Test Creation", "Code Generation"] },

  // Productivity (6个)
  { name: "Motion AI", description: "AI productivity app that automatically schedules your tasks, meetings, and focus time. Optimizes your calendar for maximum productivity.", category: "Productivity", pricing: "Paid", url: "https://usemotion.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1234, skill_level: "beginner", best_for: ["Calendar Optimization", "Task Scheduling", "Focus Time"] },
  { name: "Zapier AI", description: "AI-powered automation platform that creates workflows between 6000+ apps. Describe what you want and AI builds the zap for you.", category: "Productivity", pricing: "Freemium", url: "https://zapier.com", needs_vpn: false, languages: ["English"], rating: 4.6, rating_count: 3456, skill_level: "beginner", best_for: ["Automation", "6000+ Apps", "AI Workflows"] },
  { name: "Make AI", description: "Visual automation platform with AI that helps you build complex workflows. Connect apps, automate processes, and scale your work.", category: "Productivity", pricing: "Freemium", url: "https://make.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 1890, skill_level: "intermediate", best_for: ["Visual Automation", "Complex Workflows", "Scaling"] },
  { name: "Rewind AI", description: "AI personal search engine that records everything you do on your computer. Search and find any moment from your past work.", category: "Productivity", pricing: "Paid", url: "https://rewind.ai", needs_vpn: false, languages: ["English"], rating: 4.4, rating_count: 890, skill_level: "intermediate", best_for: ["Personal Search", "Memory Assistant", "Productivity"] },
  { name: "Glean AI", description: "AI enterprise search that finds information across all your company's tools. Connects emails, docs, chat, and more for unified search.", category: "Productivity", pricing: "Paid", url: "https://glean.com", needs_vpn: false, languages: ["English"], rating: 4.5, rating_count: 567, skill_level: "intermediate", best_for: ["Enterprise Search", "Unified Search", "Knowledge Management"] },
  { name: "Elephas AI", description: "AI writing assistant for Mac, iPhone, and iPad that works across all your apps. Write better emails, docs, and messages anywhere.", category: "Productivity", pricing: "Freemium", url: "https://elephas.app", needs_vpn: false, languages: ["English"], rating: 4.3, rating_count: 456, skill_level: "beginner", best_for: ["Apple Ecosystem", "Cross-app", "Writing Assistant"] },
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
