const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '..', 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const currentDate = new Date().toISOString().split('T')[0];

const newTools = [
  // Instagram Marketing tools
  {
    id: tools.length + 1,
    name: "Later AI",
    description: "AI-powered social media scheduler and content creator for Instagram. Generates captions, hashtag suggestions, and optimal posting times to maximize engagement.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://later.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create 5 Instagram captions for a coffee shop launch", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate hashtag suggestions for fitness content", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.7, note: "Intuitive drag-and-drop calendar" },
      output_quality: { score: 4.4, note: "Good caption suggestions" },
      features: { score: 4.5, note: "Scheduling, analytics, and AI content" },
      value_for_money: { score: 4.6, note: "Great value for social media managers" },
      stability: { score: 4.8, note: "Reliable platform" },
      support: { score: 4.3, note: "Good documentation" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Social Media Managers", "Brands", "Influencers"]
  },
  {
    id: tools.length + 2,
    name: "Ocoya",
    description: "AI content creation and social media automation platform that generates posts, graphics, and scheduling across Instagram, Facebook, Twitter, and LinkedIn.",
    category: "Productivity",
    pricing: "Paid",
    url: "https://ocoya.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create a week of Instagram posts for a fashion brand", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate AI captions for product photography", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.5, note: "Simple interface" },
      output_quality: { score: 4.4, note: "Quality social media content" },
      features: { score: 4.6, note: "AI generation + scheduling + analytics" },
      value_for_money: { score: 4.3, note: "Competitive pricing" },
      stability: { score: 4.5, note: "Stable platform" },
      support: { score: 4.2, note: "Adequate support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Small Businesses", "Content Creators", "Marketers"]
  },
  // YouTube Video tools
  {
    id: tools.length + 3,
    name: "TubeBuddy AI",
    description: "AI-powered YouTube optimization tool that generates titles, descriptions, tags, and thumbnail suggestions to boost video discoverability.",
    category: "Video",
    pricing: "Freemium",
    url: "https://tubebuddy.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate SEO-optimized title for tech review video", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Create YouTube description with timestamps", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.8, note: "Browser extension makes it seamless" },
      output_quality: { score: 4.5, note: "Good SEO suggestions" },
      features: { score: 4.7, note: "Tags, titles, A/B testing, analytics" },
      value_for_money: { score: 4.5, note: "Worth the investment" },
      stability: { score: 4.7, note: "Very reliable" },
      support: { score: 4.4, note: "Helpful community" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["YouTubers", "Content Creators", "Video Marketers"]
  },
  {
    id: tools.length + 4,
    name: "VidIQ AI",
    description: "AI YouTube analytics and optimization platform that provides keyword research, competitor analysis, and content suggestions to grow your channel faster.",
    category: "Video",
    pricing: "Freemium",
    url: "https://vidiq.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Find trending keywords in tech niche", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Analyze competitor video strategy", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.7,
      ease_of_use: { score: 4.6, note: "Chrome extension integration" },
      output_quality: { score: 4.7, note: "Accurate analytics" },
      features: { score: 4.8, note: "Keyword research, scorecard, daily ideas" },
      value_for_money: { score: 4.5, note: "Good free tier, premium worth it" },
      stability: { score: 4.8, note: "Excellent uptime" },
      support: { score: 4.5, note: "Responsive support" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["YouTubers", "Channel Managers", "Video Marketers"]
  },
  // Wall Art Image tools
  {
    id: tools.length + 5,
    name: "NightCafe Creator",
    description: "AI art generator with multiple algorithms (Stable Diffusion, DALL-E, etc.) optimized for creating high-resolution prints and wall art. Features community challenges and style transfer.",
    category: "Image",
    pricing: "Freemium",
    url: "https://nightcafe.studio",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create abstract landscape painting for office wall art", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate minimalist poster design in 300 DPI", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.6, note: "User-friendly web interface" },
      output_quality: { score: 4.7, note: "Print-quality resolution" },
      features: { score: 4.5, note: "Multiple algorithms, style transfer" },
      value_for_money: { score: 4.6, note: "Free daily credits" },
      stability: { score: 4.4, note: "Generally reliable" },
      support: { score: 4.3, note: "Active Discord community" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Artists", "Print Designers", "Home Decor"]
  },
  {
    id: tools.length + 6,
    name: "Leonardo AI",
    description: "Professional AI image generation platform with fine-tuned models for art, photography, and design. Offers real-time canvas editing and model training capabilities.",
    category: "Image",
    pricing: "Freemium",
    url: "https://leonardo.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate fantasy landscape for large format print", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Create modern abstract art with geometric shapes", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.8,
      ease_of_use: { score: 4.5, note: "Advanced features require learning" },
      output_quality: { score: 4.9, note: "Exceptional quality" },
      features: { score: 4.8, note: "Model training, real-time editing" },
      value_for_money: { score: 4.6, note: "Generous free tier" },
      stability: { score: 4.7, note: "Solid platform" },
      support: { score: 4.5, note: "Good documentation" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Artists", "Designers", "Print Professionals"]
  },
  // Audiobook Audio tools
  {
    id: tools.length + 7,
    name: "ElevenLabs Reader",
    description: "AI-powered audiobook creation platform with ultra-realistic voices in 29 languages. Perfect for converting books, articles, and scripts into professional audiobooks.",
    category: "Audio",
    pricing: "Freemium",
    url: "https://elevenlabs.io",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Convert this 20-page document to audiobook", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate audiobook chapter with emotional narration", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.9,
      ease_of_use: { score: 4.7, note: "Simple upload and generate" },
      output_quality: { score: 4.9, note: "Industry-leading voice quality" },
      features: { score: 4.8, note: "Voice cloning, emotion control" },
      value_for_money: { score: 4.6, note: "Free tier for testing" },
      stability: { score: 4.8, note: "Very reliable" },
      support: { score: 4.5, note: "Good documentation" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Authors", "Publishers", "Content Creators"]
  },
  {
    id: tools.length + 8,
    name: "Play.ht",
    description: "Enterprise-grade AI voice generator for audiobooks, podcasts, and eLearning. Offers 900+ voices with emotion, pronunciation control, and SSML support.",
    category: "Audio",
    pricing: "Paid",
    url: "https://play.ht",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create audiobook narration with male British voice", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate podcast intro with energetic tone", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.5, note: "Web-based editor" },
      output_quality: { score: 4.8, note: "High-quality voices" },
      features: { score: 4.7, note: "900+ voices, SSML, API" },
      value_for_money: { score: 4.3, note: "Premium pricing" },
      stability: { score: 4.7, note: "Enterprise reliability" },
      support: { score: 4.5, note: "Good enterprise support" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Publishers", "eLearning", "Podcasters"]
  },
  // DevOps Code tools
  {
    id: tools.length + 9,
    name: "GitHub Copilot for DevOps",
    description: "AI pair programmer extended for infrastructure-as-code, CI/CD pipelines, and cloud configuration. Supports Terraform, Kubernetes, Docker, and AWS/GCP/Azure templates.",
    category: "Code",
    pricing: "Paid",
    url: "https://github.com/features/copilot",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Write Terraform module for AWS VPC setup", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate GitHub Actions workflow for deployment", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.8,
      ease_of_use: { score: 4.7, note: "IDE integration" },
      output_quality: { score: 4.8, note: "Production-ready code" },
      features: { score: 4.9, note: "Multi-language, IaC support" },
      value_for_money: { score: 4.5, note: "Worth it for developers" },
      stability: { score: 4.9, note: "GitHub infrastructure" },
      support: { score: 4.6, note: "Excellent docs" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["DevOps Engineers", "Developers", "SREs"]
  },
  {
    id: tools.length + 10,
    name: "Amazon CodeWhisperer",
    description: "AI coding companion from AWS that provides code suggestions, security scanning, and infrastructure optimization. Free for individual developers.",
    category: "Code",
    pricing: "Freemium",
    url: "https://aws.amazon.com/codewhisperer",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate CloudFormation template for ECS cluster", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Find security vulnerabilities in this Lambda function", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.6, note: "VS Code plugin" },
      output_quality: { score: 4.5, note: "Good AWS-specific suggestions" },
      features: { score: 4.6, note: "Security scanning, code gen" },
      value_for_money: { score: 4.8, note: "Free for individuals" },
      stability: { score: 4.8, note: "AWS reliability" },
      support: { score: 4.4, note: "AWS docs" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["AWS Developers", "DevOps", "Cloud Engineers"]
  },
  {
    id: tools.length + 11,
    name: "Warp Terminal",
    description: "AI-powered terminal with natural language command input, block-based output, and intelligent suggestions for common DevOps workflows.",
    category: "Code",
    pricing: "Freemium",
    url: "https://warp.dev",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Show me all running Docker containers", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Find and kill process on port 3000", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.8, note: "Modern terminal experience" },
      output_quality: { score: 4.5, note: "Good command suggestions" },
      features: { score: 4.6, note: "AI command input, blocks" },
      value_for_money: { score: 4.7, note: "Free for individuals" },
      stability: { score: 4.5, note: "Still maturing" },
      support: { score: 4.4, note: "Growing community" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Developers", "DevOps", "System Admins"]
  },
  // Product Description Writing tools
  {
    id: tools.length + 12,
    name: "Anyword",
    description: "AI copywriting platform with predictive performance scoring. Specializes in product descriptions, ad copy, and e-commerce content with data-driven insights.",
    category: "Writing",
    pricing: "Paid",
    url: "https://anyword.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Write product description for wireless headphones", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate 10 Amazon listing bullet points", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.6, note: "Easy interface" },
      output_quality: { score: 4.6, note: "E-commerce focused" },
      features: { score: 4.7, note: "Predictive scoring, templates" },
      value_for_money: { score: 4.2, note: "Premium pricing" },
      stability: { score: 4.6, note: "Stable platform" },
      support: { score: 4.3, note: "Good support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["E-commerce", "Marketers", "Copywriters"]
  },
  {
    id: tools.length + 13,
    name: "Writesonic",
    description: "AI writing platform with product description generator, landing page copy, and e-commerce content tools. Integrates with Shopify and WooCommerce.",
    category: "Writing",
    pricing: "Freemium",
    url: "https://writesonic.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create Shopify product description for skincare line", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Write comparison table for SaaS pricing page", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.7, note: "Simple templates" },
      output_quality: { score: 4.4, note: "Good for e-commerce" },
      features: { score: 4.5, note: "Product descriptions, landing pages" },
      value_for_money: { score: 4.6, note: "Affordable pricing" },
      stability: { score: 4.5, note: "Reliable" },
      support: { score: 4.3, note: "Helpful docs" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["E-commerce", "Small Businesses", "Copywriters"]
  },
  // Avatar Video tools
  {
    id: tools.length + 14,
    name: "Elai.io",
    description: "AI avatar video generator that creates professional spokesperson videos from text. Supports 75+ languages, custom avatars, and automated video generation.",
    category: "Video",
    pricing: "Paid",
    url: "https://elai.io",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create training video with AI presenter", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate product demo video with custom avatar", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.7, note: "Template-based workflow" },
      output_quality: { score: 4.5, note: "Good avatar quality" },
      features: { score: 4.6, note: "Custom avatars, 75+ languages" },
      value_for_money: { score: 4.2, note: "Mid-range pricing" },
      stability: { score: 4.5, note: "Reliable" },
      support: { score: 4.3, note: "Good support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Training", "Marketing", "HR"]
  },
  {
    id: tools.length + 15,
    name: "Colossyan",
    description: "AI video creation platform with realistic avatars for learning and development content. Features automatic translations and collaborative editing.",
    category: "Video",
    pricing: "Paid",
    url: "https://colossyan.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create onboarding video with AI presenter", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate compliance training video in 5 languages", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.6, note: "User-friendly" },
      output_quality: { score: 4.5, note: "Professional quality" },
      features: { score: 4.5, note: "Auto-translation, collaboration" },
      value_for_money: { score: 4.1, note: "Enterprise pricing" },
      stability: { score: 4.6, note: "Stable" },
      support: { score: 4.4, note: "Good support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["L&D Teams", "Corporate Training", "HR"]
  },
  // Sales Script Productivity tools
  {
    id: tools.length + 16,
    name: "Lavender",
    description: "AI email coach for sales teams that analyzes and optimizes cold emails in real-time. Provides response rate predictions and improvement suggestions.",
    category: "Productivity",
    pricing: "Paid",
    url: "https://lavender.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Optimize this cold outreach email for higher response", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Write follow-up email after demo call", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.8, note: "Gmail/Outlook extension" },
      output_quality: { score: 4.5, note: "Data-driven suggestions" },
      features: { score: 4.5, note: "Email scoring, coaching" },
      value_for_money: { score: 4.3, note: "Sales team pricing" },
      stability: { score: 4.7, note: "Reliable" },
      support: { score: 4.4, note: "Good onboarding" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Sales Teams", "SDRs", "Founders"]
  },
  {
    id: tools.length + 17,
    name: "Regie.ai",
    description: "AI sales content platform that generates sales scripts, email sequences, call scripts, and LinkedIn outreach messages with CRM integration.",
    category: "Productivity",
    pricing: "Paid",
    url: "https://regie.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create 5-touch email sequence for SaaS demo", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Write cold call script for enterprise software", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.4, note: "CRM integration required" },
      output_quality: { score: 4.6, note: "Sales-focused AI" },
      features: { score: 4.7, note: "Full sales content suite" },
      value_for_money: { score: 4.2, note: "Enterprise pricing" },
      stability: { score: 4.6, note: "Stable" },
      support: { score: 4.4, note: "Good onboarding" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Sales Teams", "Revenue Teams", "SDRs"]
  },
  // Freelancer Productivity tools
  {
    id: tools.length + 18,
    name: "Motion",
    description: "AI-powered calendar and task manager that auto-schedules your day, prioritizes tasks, and adjusts plans when priorities change. Perfect for freelancers managing multiple clients.",
    category: "Productivity",
    pricing: "Paid",
    url: "https://usemotion.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Auto-schedule my week with 3 client projects", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Prioritize tasks for deadline-driven sprint", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.6, note: "Calendar integration" },
      output_quality: { score: 4.5, note: "Smart scheduling" },
      features: { score: 4.6, note: "Auto-scheduling, project mgmt" },
      value_for_money: { score: 4.2, note: "Premium pricing" },
      stability: { score: 4.6, note: "Reliable" },
      support: { score: 4.3, note: "Good support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Freelancers", "Project Managers", "Solopreneurs"]
  },
  {
    id: tools.length + 19,
    name: "Lago Fast",
    description: "AI freelance business assistant that handles invoicing, time tracking, proposal writing, and client communication. All-in-one platform for independent workers.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://lago.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate proposal for website redesign project", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Create invoice for completed milestone", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.3,
      ease_of_use: { score: 4.5, note: "Simple interface" },
      output_quality: { score: 4.3, note: "Good templates" },
      features: { score: 4.5, note: "Invoicing, proposals, tracking" },
      value_for_money: { score: 4.6, note: "Free tier available" },
      stability: { score: 4.4, note: "Reliable" },
      support: { score: 4.2, note: "Basic support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Freelancers", "Consultants", "Contractors"]
  },
  // Inventory Management Productivity tools
  {
    id: tools.length + 20,
    name: "EazyStock",
    description: "AI inventory management and demand forecasting tool that predicts stock levels, automates reordering, and optimizes warehouse operations for small to medium businesses.",
    category: "Productivity",
    pricing: "Paid",
    url: "https://eazystock.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Forecast Q1 inventory needs for retail store", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate reorder recommendations based on trends", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.3, note: "Requires initial setup" },
      output_quality: { score: 4.5, note: "Accurate forecasts" },
      features: { score: 4.6, note: "Demand planning, auto-reorder" },
      value_for_money: { score: 4.3, note: "Mid-range pricing" },
      stability: { score: 4.6, note: "Reliable" },
      support: { score: 4.3, note: "Good onboarding" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Retail", "E-commerce", "Warehouses"]
  },
  {
    id: tools.length + 21,
    name: "Inventory Planner",
    description: "AI-powered inventory planning and purchasing tool that integrates with Shopify, Amazon, and WooCommerce. Generates smart purchase orders and demand forecasts.",
    category: "Productivity",
    pricing: "Paid",
    url: "https://inventory-planner.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate purchase order for next month", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Identify slow-moving inventory items", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.4, note: "E-commerce integration" },
      output_quality: { score: 4.6, note: "Accurate planning" },
      features: { score: 4.6, note: "Multi-platform support" },
      value_for_money: { score: 4.3, note: "Worth it for volume sellers" },
      stability: { score: 4.7, note: "Very stable" },
      support: { score: 4.4, note: "Good support" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["E-commerce", "Retailers", "Distributors"]
  },
  {
    id: tools.length + 22,
    name: "Slack AI",
    description: "AI-powered features for Slack including message summarization, channel recaps, smart search, and automated workflow suggestions to improve team productivity.",
    category: "Productivity",
    pricing: "Paid",
    url: "https://slack.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Summarize this channel's discussion from today", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Find all mentions of project deadline", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.8, note: "Built into Slack" },
      output_quality: { score: 4.5, note: "Good summaries" },
      features: { score: 4.5, note: "Search, summaries, workflows" },
      value_for_money: { score: 4.2, note: "Requires Business+ plan" },
      stability: { score: 4.9, note: "Enterprise reliability" },
      support: { score: 4.5, note: "Slack support" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Teams", "Remote Workers", "Managers"]
  },
  {
    id: tools.length + 23,
    name: "Otter AI",
    description: "AI meeting assistant that records, transcribes, and summarizes meetings in real-time. Integrates with Zoom, Google Meet, and Teams with action item extraction.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://otter.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Transcribe and summarize client meeting", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Extract action items from sprint planning", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.7, note: "Automatic recording" },
      output_quality: { score: 4.5, note: "Good transcription accuracy" },
      features: { score: 4.6, note: "Real-time, summaries, integration" },
      value_for_money: { score: 4.5, note: "Free tier generous" },
      stability: { score: 4.6, note: "Reliable" },
      support: { score: 4.3, note: "Good docs" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Teams", "Students", "Journalists"]
  },
  {
    id: tools.length + 24,
    name: "Beautiful.ai",
    description: "AI presentation designer that creates professional slideshows from outlines or content. Auto-adjusts layouts, suggests visuals, and maintains design consistency.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://beautiful.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create investor pitch deck from outline", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Design marketing strategy presentation", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.4,
      ease_of_use: { score: 4.7, note: "Drag-and-drop" },
      output_quality: { score: 4.5, note: "Professional slides" },
      features: { score: 4.4, note: "Auto-layout, templates" },
      value_for_money: { score: 4.3, note: "Reasonable pricing" },
      stability: { score: 4.6, note: "Stable" },
      support: { score: 4.2, note: "Good templates" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Presenters", "Marketers", "Consultants"]
  },
  {
    id: tools.length + 25,
    name: "Gamma AI",
    description: "AI-powered document and presentation generator that creates polished decks, docs, and webpages from simple prompts. Collaborative and embeddable.",
    category: "Productivity",
    pricing: "Freemium",
    url: "https://gamma.app",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Create project proposal document from notes", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate interactive product demo page", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.8, note: "Prompt-to-document" },
      output_quality: { score: 4.6, note: "Clean, modern design" },
      features: { score: 4.5, note: "Docs, decks, webpages" },
      value_for_money: { score: 4.6, note: "Good free tier" },
      stability: { score: 4.5, note: "Improving" },
      support: { score: 4.3, note: "Growing docs" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Teams", "Startups", "Educators"]
  },
  {
    id: tools.length + 26,
    name: "Runway ML Gen-3",
    description: "Next-generation AI video generation platform with photorealistic outputs, motion brush control, and cinematic quality. Industry-leading creative tools for filmmakers.",
    category: "Video",
    pricing: "Freemium",
    url: "https://runwayml.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate cinematic product commercial", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Animate still image with camera movement", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.8,
      ease_of_use: { score: 4.5, note: "Advanced features" },
      output_quality: { score: 4.9, note: "Cinematic quality" },
      features: { score: 4.8, note: "Gen-3, motion brush, editing" },
      value_for_money: { score: 4.4, note: "Premium pricing" },
      stability: { score: 4.6, note: "Rapidly improving" },
      support: { score: 4.4, note: "Good community" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Filmmakers", "Creatives", "Agencies"]
  },
  {
    id: tools.length + 27,
    name: "Murf AI",
    description: "AI voiceover studio for videos, podcasts, and eLearning. Features 120+ voices in 20 languages with pitch, emphasis, and speed controls for natural-sounding narration.",
    category: "Audio",
    pricing: "Freemium",
    url: "https://murf.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Generate YouTube voiceover with American male voice", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Create eLearning narration with pacing control", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.7, note: "Web-based studio" },
      output_quality: { score: 4.6, note: "Natural voices" },
      features: { score: 4.5, note: "120+ voices, video sync" },
      value_for_money: { score: 4.5, note: "Good free tier" },
      stability: { score: 4.6, note: "Reliable" },
      support: { score: 4.3, note: "Helpful docs" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Video Creators", "eLearning", "Podcasters"]
  },
  {
    id: tools.length + 28,
    name: "Krisp AI",
    description: "AI noise cancellation app for meetings and recordings. Removes background noise, echoes, and distractions in real-time for crystal-clear audio communication.",
    category: "Audio",
    pricing: "Freemium",
    url: "https://krisp.ai",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Remove background noise during Zoom call", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Clean up recorded podcast audio", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.9, note: "Install and forget" },
      output_quality: { score: 4.7, note: "Excellent noise removal" },
      features: { score: 4.4, note: "Noise cancellation, voice changer" },
      value_for_money: { score: 4.6, note: "Free tier useful" },
      stability: { score: 4.7, note: "Very reliable" },
      support: { score: 4.3, note: "Good docs" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Remote Workers", "Podcasters", "Streamers"]
  },
  {
    id: tools.length + 29,
    name: "Replit AI",
    description: "AI-powered coding platform with intelligent code completion, debugging assistance, and real-time collaboration. Built-in hosting and deployment for instant projects.",
    category: "Code",
    pricing: "Freemium",
    url: "https://replit.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Build a full-stack web app with database", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Debug and fix this Python script", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.6,
      ease_of_use: { score: 4.8, note: "Browser-based IDE" },
      output_quality: { score: 4.5, note: "Good suggestions" },
      features: { score: 4.7, note: "Coding, hosting, AI" },
      value_for_money: { score: 4.7, note: "Generous free tier" },
      stability: { score: 4.6, note: "Reliable" },
      support: { score: 4.4, note: "Active community" }
    },
    last_updated: currentDate,
    skill_level: "beginner",
    best_for: ["Students", "Beginners", "Prototypers"]
  },
  {
    id: tools.length + 30,
    name: "Tabnine",
    description: "AI code completion tool trained on your team's codebase for personalized suggestions. Supports 40+ languages and integrates with all major IDEs.",
    category: "Code",
    pricing: "Freemium",
    url: "https://tabnine.com",
    affiliate_link: "",
    icon_url: "",
    examples: [
      { prompt: "Auto-complete React component with props", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" },
      { prompt: "Generate unit test for API endpoint", image_url: "https://placehold.co/600x400/1a1a2e/eee?text=AI+Demo" }
    ],
    ratings: {
      overall: 4.5,
      ease_of_use: { score: 4.7, note: "IDE plugin" },
      output_quality: { score: 4.5, note: "Context-aware" },
      features: { score: 4.5, note: "40+ languages, private models" },
      value_for_money: { score: 4.6, note: "Free basic tier" },
      stability: { score: 4.8, note: "Very stable" },
      support: { score: 4.4, note: "Good enterprise support" }
    },
    last_updated: currentDate,
    skill_level: "intermediate",
    best_for: ["Developers", "Teams", "Enterprises"]
  }
];

const allTools = [...tools, ...newTools];

fs.writeFileSync(toolsPath, JSON.stringify(allTools, null, 2));

console.log(`✅ Added ${newTools.length} new tools`);
console.log(`📊 Total tools now: ${allTools.length}`);
console.log(`📝 New tools: ${newTools.map(t => t.name).join(', ')}`);
