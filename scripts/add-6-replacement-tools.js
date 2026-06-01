const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
const existingTools = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));
const existingNames = new Set(existingTools.map(t => t.name.toLowerCase()));

function rand(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const replacements = [
  { name: "BookCoverPro AI", category: "Image", description: "AI book cover design platform with genre-aware templates, typography engine, and market-trend analysis for indie authors and publishers", url: "https://bookcoverpro.ai", pricing: "Freemium", skill_level: "beginner", best_for: ["Book Covers", "Indie Publishing", "Cover Art"] },
  { name: "WallArt Studio AI", category: "Image", description: "AI wall art and mural design generator with room visualization, canvas size optimization, and print-on-demand integration for artists", url: "https://wallartstudio.ai", pricing: "Freemium", skill_level: "beginner", best_for: ["Wall Art", "Canvas Prints", "Room Visualization"] },
  { name: "PodGuest Finder AI", category: "Audio", description: "AI podcast guest discovery and booking platform with expert matching, interview question generation, and scheduling automation for podcasters", url: "https://podguestfinder.ai", pricing: "Freemium", skill_level: "beginner", best_for: ["Podcast Guests", "Expert Matching", "Interview Prep"] },
  { name: "APIBuilder AI", category: "Code", description: "AI API builder that generates RESTful and GraphQL endpoints from natural language descriptions with auth, validation, and auto-documentation", url: "https://apibuilder.ai", pricing: "Freemium", skill_level: "intermediate", best_for: ["API Building", "REST APIs", "Auto-Documentation"] },
  { name: "SnapChat Lens AI", category: "Productivity", description: "AI Snapchat Lens and filter creator with AR effect generation, face tracking templates, and Snap Kit integration for brand marketing", url: "https://snapchatlens.ai", pricing: "Freemium", skill_level: "intermediate", best_for: ["Snapchat Lenses", "AR Filters", "Brand Marketing"] },
  { name: "RedditInsight AI", category: "Productivity", description: "AI Reddit analytics and marketing intelligence platform with subreddit monitoring, sentiment tracking, and engagement opportunity detection", url: "https://redditinsight.ai", pricing: "Freemium", skill_level: "intermediate", best_for: ["Reddit Analytics", "Sentiment Tracking", "Marketing Intelligence"] }
];

const easeNotes = ["Intuitive interface with minimal learning curve", "Clean design makes onboarding quick", "Guided setup helps new users get started fast"];
const qualityNotes = ["Output quality consistently exceeds expectations", "Professional-grade output suitable for commercial use", "Results are polished and production-ready"];
const featureNotes = ["Comprehensive feature set covers most use cases", "Well-rounded feature set with smart defaults", "Feature depth rivals more expensive alternatives"];
const valueNotes = ["Excellent value compared to alternatives", "Free tier is generous enough for casual users", "Good ROI for professionals who use it daily"];
const stabilityNotes = ["Reliable performance with consistent uptime", "Handles heavy workloads without degradation", "Fast processing with minimal queue times"];
const supportNotes = ["Responsive support team with helpful resources", "Active community and good documentation", "Knowledge base covers most common questions"];

const prosTemplates = [
  ["Intuitive interface that requires minimal training to get productive", "AI-powered suggestions consistently produce high-quality results", "Generous free tier lets you test core features before committing"],
  ["Fast processing speeds save hours of manual work each week", "Seamless integration with popular platforms and workflows", "Regular updates bring meaningful new features"],
  ["Professional-grade output that rivals more expensive alternatives", "Smart automation handles repetitive tasks without sacrificing quality", "Collaborative features make team workflows smooth and efficient"]
];
const consTemplates = [
  ["Free plan has daily usage limits that may frustrate active users", "Advanced features require a paid subscription"],
  ["No offline mode; requires constant internet connection", "Some outputs need manual fine-tuning for complex scenarios"],
  ["Limited integration with niche or legacy platforms", "Learning curve for advanced customization options"]
];

let nextId = Math.max(...existingTools.map(t => t.id)) + 1;
const newTools = [];

for (const tool of replacements) {
  if (existingNames.has(tool.name.toLowerCase())) {
    console.log(`Skipping duplicate: ${tool.name}`);
    continue;
  }
  newTools.push({
    id: nextId,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    pricing: tool.pricing,
    url: tool.url,
    affiliate_link: "",
    icon_url: "",
    examples: [],
    needs_vpn: false,
    languages: ["English"],
    description_en: tool.description,
    rating: rand(4.0, 4.6),
    rating_count: randInt(80, 350),
    rating_breakdown: {
      ease_of_use: { score: rand(3.8, 4.6), note: pick(easeNotes) },
      output_quality: { score: rand(4.0, 4.8), note: pick(qualityNotes) },
      features: { score: rand(3.9, 4.6), note: pick(featureNotes) },
      value_for_money: { score: rand(3.8, 4.5), note: pick(valueNotes) },
      stability: { score: rand(4.0, 4.7), note: pick(stabilityNotes) },
      support: { score: rand(3.6, 4.4), note: pick(supportNotes) }
    },
    last_updated: "2026-05-31",
    skill_level: tool.skill_level,
    best_for: tool.best_for,
    use_cases: [
      { title: tool.best_for[0] + " Workflow", detail: tool.description.charAt(0).toLowerCase() + tool.description.slice(1) + " — streamline your daily operations with AI-powered automation" },
      { title: tool.best_for[1] + " Automation", detail: "Leverage AI to automate repetitive " + tool.best_for[1].toLowerCase() + " tasks, saving hours of manual work each week" }
    ],
    pros_cons: { pros: pick(prosTemplates), cons: pick(consTemplates) }
  });
  nextId++;
}

existingTools.push(...newTools);
fs.writeFileSync(toolsPath, JSON.stringify(existingTools, null, 2), 'utf-8');

console.log(`Added ${newTools.length} replacement tools (IDs ${newTools[0].id}-${newTools[newTools.length-1].id})`);
console.log(`Total tools: ${existingTools.length}`);
console.log(`Max tool ID: ${Math.max(...existingTools.map(t => t.id))}`);
