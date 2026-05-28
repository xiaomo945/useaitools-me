const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const currentDate = new Date().toISOString().split('T')[0];

const newTools = [
  // Productivity tools
  {
    id: tools.length + 1,
    name: "Notion AI",
    description: "AI-powered workspace that supercharges your Notion experience with intelligent features like writing assistance, summarization, and content generation. Works seamlessly within the Notion interface you already know and love.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://notion.so",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Write a project brief for a SaaS product launch", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Summarize this 50-page research paper in bullet points", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.8,
      ease_of_use: { score: 4.7, note: "Seamlessly integrated into existing Notion workflow" },
      output_quality: { score: 4.6, note: "Excellent for writing and content summarization" },
      features: { score: 4.5, note: "AI writing, summarization, Q&A, and brainstorming" },
      value_for_money: { score: 4.4, note: "Included in Notion Plus and Business plans" },
      stability: { score: 4.9, note: "Highly reliable enterprise-grade platform" },
      support: { score: 4.6, note: "Excellent documentation and customer support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Teams", "Students", "Creatives"]
  },
  {
    id: tools.length + 2,
    name: "Superhuman AI",
    description: "AI-powered email client that learns your preferences and helps you reach inbox zero 3x faster. Features include AI email drafting, intelligent summarization, and smart reply suggestions.",
    category: "Productivity",
    pricing: "Paid",
    url: "https://superhuman.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Draft a polite response declining a meeting request", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Summarize this thread of 20+ emails", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.7,
      ease_of_use: { score: 4.5, note: "Clean interface with minimal learning curve" },
      output_quality: { score: 4.8, note: "Email drafts sound incredibly natural" },
      features: { score: 4.6, note: "AI writing, summarization, smart replies, and scheduling" },
      value_for_money: { score: 4.1, note: "Premium pricing for premium experience" },
      stability: { score: 4.9, note: "Exceptional reliability and performance" },
      support: { score: 4.7, note: "High-quality support team" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Professionals", "Executives", "Entrepreneurs"]
  },
  {
    id: tools.length + 3,
    name: "Todoist AI",
    description: "Smart task manager with AI-powered features that help you prioritize tasks, break down projects, and manage your time more effectively.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://todoist.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Break this marketing project into actionable tasks", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Suggest priorities based on my current workload", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.8, note: "Extremely intuitive interface" },
      output_quality: { score: 4.4, note: "Good task breakdowns and suggestions" },
      features: { score: 4.5, note: "AI task breakdown, prioritization, and recommendations" },
      value_for_money: { score: 4.6, note: "Great value for the features offered" },
      stability: { score: 4.7, note: "Very stable and reliable platform" },
      support: { score: 4.5, note: "Good documentation and support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Students", "Professionals", "Teams"]
  },
  // Writing tools
  {
    id: tools.length + 4,
    name: "Sudowrite",
    description: "AI writing assistant designed specifically for fiction authors, helping with plot development, character creation, and manuscript polishing.",
    category: "Writing",
    pricing: "Paid",
    url: "https://sudowrite.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Write a cliffhanger scene for a thriller novel", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Develop this side character with a mysterious backstory", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.8,
      ease_of_use: { score: 4.5, note: "Designed specifically for fiction writers" },
      output_quality: { score: 4.9, note: "Exceptional creative writing quality" },
      features: { score: 4.7, note: "Plot development, character arcs, and scene generation" },
      value_for_money: { score: 4.4, note: "Priced for professional authors" },
      stability: { score: 4.6, note: "Reliable performance" },
      support: { score: 4.5, note: "Good community and documentation" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Creatives", "Authors", "Storytellers"]
  },
  {
    id: tools.length + 5,
    name: "Copy.ai Pro",
    description: "Enterprise-grade AI copywriting platform with advanced features for marketing teams. Includes brand voice training, workflow automation, and collaborative tools.",
    category: "Writing",
    pricing: "Paid",
    url: "https://copy.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Write 10 variations of a Facebook ad headline for fitness gear", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Create a complete email marketing sequence for product launch", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.7,
      ease_of_use: { score: 4.6, note: "Easy to use for beginners and pros alike" },
      output_quality: { score: 4.7, note: "High-quality marketing copy generation" },
      features: { score: 4.8, note: "Brand voice training, workflows, and collaboration tools" },
      value_for_money: { score: 4.5, note: "Good value for marketing teams" },
      stability: { score: 4.8, note: "Enterprise-grade reliability" },
      support: { score: 4.6, note: "Excellent customer support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Marketing Teams", "Agencies", "Startups"]
  },
  // Image tools
  {
    id: tools.length + 6,
    name: "Stability AI SDXL Turbo",
    description: "Blazing-fast image generation model from Stability AI that creates stunning visuals in under a second with exceptional quality and detail.",
    category: "Image",
    pricing: "Freemium",
    url: "https://stability.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Cyberpunk cityscape at night with neon lights and rain-soaked streets", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Photorealistic portrait in natural golden hour lighting", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.9,
      ease_of_use: { score: 4.4, note: "Some technical knowledge helpful but not required" },
      output_quality: { score: 4.9, note: "Photorealistic quality with exceptional detail" },
      features: { score: 4.8, note: "Text-to-image, image-to-image, and inpainting" },
      value_for_money: { score: 4.7, note: "Excellent value for the quality" },
      stability: { score: 4.6, note: "Generally reliable with occasional updates" },
      support: { score: 4.4, note: "Active community and documentation" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Creatives", "Designers", "Artists"]
  },
  // Video tools
  {
    id: tools.length + 7,
    name: "Pika Labs 2.0",
    description: "Advanced AI video generation platform that creates stunning videos from text prompts, images, or other videos with unprecedented control and quality.",
    category: "Video",
    pricing: "Freemium",
    url: "https://pika.art",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Dragon flying over a fantasy castle at sunset, cinematic 4K", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Animate this static image into a smooth looping video", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.8,
      ease_of_use: { score: 4.5, note: "Intuitive Discord-based interface" },
      output_quality: { score: 4.9, note: "State-of-the-art video generation quality" },
      features: { score: 4.7, note: "Text-to-video, image-to-video, and video editing" },
      value_for_money: { score: 4.6, note: "Great value compared to alternatives" },
      stability: { score: 4.5, note: "Rapidly improving with consistent updates" },
      support: { score: 4.4, note: "Active Discord community" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Creatives", "Filmmakers", "Animators"]
  },
  // Audio tools
  {
    id: tools.length + 8,
    name: "Suno AI Chirp",
    description: "Revolutionary AI music generation platform that creates complete songs with vocals, instrumentation, and lyrics from simple text prompts.",
    category: "Audio",
    pricing: "Freemium",
    url: "https://suno.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Upbeat pop song about summer vacation, 80's style", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Epic orchestral film score with dramatic buildups", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.9,
      ease_of_use: { score: 4.6, note: "Simple text prompt interface" },
      output_quality: { score: 4.9, note: "Professional-quality music with vocals" },
      features: { score: 4.8, note: "Full song generation with lyrics and multiple genres" },
      value_for_money: { score: 4.7, note: "Exceptional value for the quality" },
      stability: { score: 4.5, note: "Generally reliable with peak traffic considerations" },
      support: { score: 4.4, note: "Good documentation and community" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Creatives", "Musicians", "Content Creators"]
  },
  // Code tools
  {
    id: tools.length + 9,
    name: "Sourcegraph Cody",
    description: "AI coding assistant that understands your entire codebase and provides intelligent code completion, refactoring suggestions, and natural language code search.",
    category: "Code",
    pricing: "Freemium",
    url: "https://sourcegraph.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Refactor this legacy code to use modern React patterns", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Find all files related to user authentication", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.7,
      ease_of_use: { score: 4.4, note: "IDE integration requires some setup" },
      output_quality: { score: 4.8, note: "Excellent code understanding across entire repo" },
      features: { score: 4.7, note: "Codebase understanding, refactoring, and search" },
      value_for_money: { score: 4.6, note: "Great value for development teams" },
      stability: { score: 4.7, note: "Enterprise-grade stability" },
      support: { score: 4.5, note: "Good documentation and enterprise support" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Developers", "Teams", "Enterprises"]
  },
  {
    id: tools.length + 10,
    name: "Cursor AI",
    description: "AI-first code editor built from the ground up for AI pair programming. Features intelligent autocompletion, chat-based coding, and smart refactoring tools.",
    category: "Code",
    pricing: "Freemium",
    url: "https://cursor.so",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Build a complete REST API with authentication and database", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Fix the bugs in this code and add proper error handling", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.8,
      ease_of_use: { score: 4.6, note: "Familiar VS Code-like interface" },
      output_quality: { score: 4.8, note: "High-quality code generation and understanding" },
      features: { score: 4.7, note: "AI chat, tab completion, and smart refactoring" },
      value_for_money: { score: 4.6, note: "Excellent value for the features" },
      stability: { score: 4.6, note: "Rapidly improving with regular updates" },
      support: { score: 4.5, note: "Good community and documentation" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Developers", "Students", "Teams"]
  }
];

const allTools = [...tools, ...newTools];

fs.writeFileSync(toolsPath, JSON.stringify(allTools, null, 2));

console.log(`✅ Added ${newTools.length} new tools`);
console.log(`📊 Total tools now: ${allTools.length}`);
console.log(`📝 New tools added: ${newTools.map(t => t.name).join(', ')}`);
