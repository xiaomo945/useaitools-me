# 社交平台统一简介模板

> 创建日期：2026-06-13  
> 目标：确保所有平台品牌形象一致

---

## 🎨 品牌核心信息

### 一句话定位
**Curated AI tools directory helping creators discover the best tools for writing, video, image, and more.**

### 核心价值主张
- 80+ AI 工具评测
- 776+ 博客文章指南
- 6 大类别覆盖（Writing, Video, Image, Code, Audio, Productivity）
- 独立开发者运营，透明真诚

---

## 📝 各平台简介模板

### Twitter/X (@jiongxiaomo)

**Bio (160 字符限制):**
```
Building UseAITools.me - a curated directory of 80+ AI tools 🚀 | Helping creators find the best AI tools for writing, video, image & more | Indie hacker building in public
```

**备选版本 (更简洁):**
```
Founder of UseAITools.me 🎯 | 80+ AI tools reviewed | Helping creators discover the best AI tools | Building in public #indiehacker #ai
```

**置顶推文模板:**
```
🚀 I built UseAITools.me from an internet café in China

80+ AI tools reviewed
776+ blog articles
6 categories covered

All while traveling as a digital nomad.

Check it out 👇
https://useaitools.me

#buildinpublic #indiehacker #ai
```

---

### Reddit (u/xiaomo)

**Profile Bio:**
```
Founder of UseAITools.me - a curated AI tools directory with 80+ tools and 776+ guides. Building in public as an indie hacker.
```

**自我介绍帖子模板 (r/SideProject):**
```
Title: I built an AI tools directory from an internet café — now it has 80+ tools and 776+ articles

Body:
Hey r/SideProject!

I'm Xiaomo, an indie hacker from China. I built UseAITools.me while traveling as a digital nomad (sometimes working from internet cafés!).

**What it is:**
A curated directory of 80+ AI tools across 6 categories:
- Writing (Rytr, Jasper, Copy.ai)
- Video (VEED.io, Synthesia, HeyGen)
- Image (Midjourney, DALL-E 3, Stable Diffusion)
- Code (GitHub Copilot, Cursor)
- Audio (ElevenLabs, Murf AI)
- Productivity (Notion AI, Grammarly)

**What I've built:**
- 80+ detailed tool reviews
- 776+ blog articles (guides, comparisons, tutorials)
- Comparison tools for writing, video, and audio
- Scene-based recommendations (blog writing, social media, podcast, etc.)

**Tech stack:**
- Next.js 16 + TypeScript
- Tailwind CSS
- Vercel (hosting + analytics)
- All static data (no database needed!)

**Traffic so far:**
- [Update with current number] monthly visitors
- Growing organic search traffic
- Featured in several AI newsletters

**What's next:**
- Submit to 25+ AI directories
- Apply for affiliate programs (Descript, Notion AI, Grammarly)
- Build community on Reddit and Indie Hackers

Would love your feedback! What features would you like to see?

🔗 https://useaitools.me
```

---

### Indie Hackers (xiaomo)

**Profile Bio:**
```
Building UseAITools.me - a curated AI tools directory. 80+ tools, 776+ articles, 6 categories. Building in public from internet cafés around the world.
```

**里程碑帖子模板:**
```
🎯 Milestone: UseAITools.me hits [X] monthly visitors!

**What I built:**
- AI tools directory with 80+ tools
- 776+ blog articles (guides, comparisons, tutorials)
- 6 categories: Writing, Video, Image, Code, Audio, Productivity

**Traffic sources:**
- Organic search: [X]%
- Direct: [X]%
- Social media: [X]%
- Referrals: [X]%

**Revenue:**
- Rytr affiliate: $[X] (30% recurring commission)
- VEED.io affiliate: $[X] (40% commission)
- Total: $[X]/month

**What's working:**
- SEO-optimized blog content
- Detailed tool comparisons
- Scene-based recommendations

**What's next:**
- Submit to 25+ AI directories
- Apply for 3 more affiliate programs
- Build community on Reddit

Full transparency: I built this from internet cafés while traveling as a digital nomad. Sometimes the WiFi is terrible, but the adventure is worth it!

🔗 https://useaitools.me
```

---

### Dev.to (xiaomo)

**Profile Bio:**
```
Indie hacker building UseAITools.me - a curated AI tools directory. Writing about Next.js, AI tools, and building in public.
```

**技术文章模板:**
```
Title: How I Built an AI Tools Directory with Next.js 16 (No Database Needed!)

Body:
Hey Dev.to community! 👋

I'm Xiaomo, and I built UseAITools.me - a curated directory of 80+ AI tools. Today I want to share how I built it with Next.js 16, TypeScript, and zero database.

## Why No Database?

Most directories use a database. I chose static JSON files because:
- **Simplicity**: No database setup, no migrations
- **Performance**: All data is static, loads instantly
- **Cost**: $0 hosting on Vercel
- **SEO**: Static HTML is perfect for search engines

## Tech Stack

- **Next.js 16**: App Router, Server Components
- **TypeScript**: Type safety for all tool data
- **Tailwind CSS**: Rapid UI development
- **Vercel**: Hosting + Analytics + Edge Network

## Data Structure

```typescript
interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
  rating: number;
  // ... more fields
}
```

All 80+ tools are stored in `data/tools.json`. Blog posts are individual JSON files in `data/blog-posts/`.

## Key Features

### 1. Dynamic Sitemap
Generated from JSON files at build time:
```typescript
export default async function sitemap() {
  const tools = loadTools();
  const blogPosts = loadBlogPosts();
  // ... generate URLs
}
```

### 2. Search & Filter
Client-side search with fuzzy matching:
```typescript
const filteredTools = tools.filter(tool => 
  tool.name.toLowerCase().includes(search.toLowerCase())
);
```

### 3. Comparison Tool
Side-by-side comparison of up to 4 tools.

## Performance

- **Lighthouse Score**: 95+ on all metrics
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **Bundle Size**: Optimized with code splitting

## What I Learned

1. **Static is powerful**: You don't always need a database
2. **TypeScript saves time**: Catch errors at build time
3. **Vercel is amazing**: Zero-config deployment
4. **SEO matters**: Optimize for search from day one

## What's Next

- Add user reviews
- Build a newsletter feature
- Expand to 100+ tools

Check out the code: [GitHub repo](https://github.com/xiaomo945/useaitools-me)
Live site: https://useaitools.me

Would love your feedback! What features should I add next?

#nextjs #typescript #ai #buildinpublic
```

---

### Product Hunt (待发布)

**Tagline:**
```
Curated directory of 80+ AI tools with reviews and comparisons
```

**Description:**
```
UseAITools.me helps creators, marketers, and developers discover the best AI tools for their workflows.

🎯 What we offer:
- 80+ AI tools reviewed across 6 categories (Writing, Video, Image, Code, Audio, Productivity)
- 776+ blog articles with guides, comparisons, and tutorials
- Side-by-side tool comparisons
- Scene-based recommendations (blog writing, social media, podcast, etc.)

🚀 Why we're different:
- Independent & transparent: No paid placements, honest reviews
- Comprehensive coverage: From ChatGPT to niche tools
- Practical guides: Not just listings, but how-to articles
- Built by an indie hacker: Personal touch, fast iteration

💡 Perfect for:
- Content creators looking for AI writing/video tools
- Marketers wanting to automate workflows
- Developers seeking AI coding assistants
- Anyone curious about AI tools

🔗 Website: https://useaitools.me
🐦 Twitter: @jiongxiaomo
```

---

## 📸 统一视觉素材

### Logo
- **主 Logo**: `public/logo.png` (512x512px)
- **Favicon**: `public/favicon.ico` (32x32px)
- **社交头像**: 使用主 Logo，所有平台统一

### 封面图
- **Twitter Header**: 1500x500px，展示网站截图 + 标语
- **Reddit Banner**: 1920x384px
- **Dev.to Cover**: 1000x420px

### 网站截图
准备 3-5 张高质量截图：
1. 首页全景
2. 工具卡片展示
3. 对比功能
4. 博客文章
5. 移动端适配

---

## ✅ 统一检查清单

每个平台检查：
- [ ] 头像使用统一 Logo
- [ ] 简介包含核心信息（80+ tools, 776+ articles, 6 categories）
- [ ] 链接指向 https://useaitools.me
- [ ] 联系方式一致（affiliate@useaitools.me, @jiongxiaomo）
- [ ] 品牌语调一致（professional, warm, direct）

---

## 📅 更新计划

- **每月**: 更新流量数据和里程碑
- **每季度**: 重新审视简介，确保信息准确
- **重大更新**: 工具数量突破 100、文章突破 1000 时更新
