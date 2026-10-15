# Reddit r/SideProject 发帖草稿

> 创建日期：2026-06-13  
> 目标：在 r/SideProject 发布项目介绍，获取反馈和流量

---

## 📋 发帖前准备

### 账号要求
- [ ] Karma 达到 50+（前两周只评论不发帖）
- [ ] 在 r/SideProject、r/artificial、r/startups 有活跃评论
- [ ] 账号年龄 > 2 周

### 发帖时间
- **最佳时间**: 美东时间周二/周三/周四 上午 9-11 点
- **对应北京时间**: 晚上 9-11 点

---

## 📝 帖子草稿

### 标题选项（选择一个）

**选项 1（推荐）:**
```
I built an AI tools directory from an internet café — now it has 80+ tools and 776+ articles
```

**选项 2:**
```
Built UseAITools.me while traveling as a digital nomad — 80+ AI tools reviewed, 776+ guides written
```

**选项 3:**
```
From 0 to 80+ AI tools: How I built a curated directory while working from internet cafés
```

---

### 正文内容

```
Hey r/SideProject! 👋

I'm Xiaomo, an indie hacker from China. I built UseAITools.me while traveling as a digital nomad (sometimes working from internet cafés with terrible WiFi!).

## What I Built

UseAITools.me is a curated directory of AI tools helping creators, marketers, and developers discover the best tools for their workflows.

**Current stats:**
- 80+ AI tools reviewed across 6 categories
- 776+ blog articles (guides, comparisons, tutorials)
- 6 categories: Writing, Video, Image, Code, Audio, Productivity
- Scene-based recommendations (blog writing, social media, podcast, etc.)

## Why I Built It

I was overwhelmed by the number of AI tools launching every week. Every day there's a new "game-changing" AI tool, but how do you know which ones are actually worth your time?

I wanted to create a trusted, independent resource that:
- Tests and reviews tools honestly (no paid placements)
- Compares similar tools side-by-side
- Provides practical guides and tutorials
- Helps people find the right tool for their specific use case

## Tech Stack

- **Next.js 16** with App Router and Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Vercel** for hosting and analytics
- **No database!** All data is stored in static JSON files

The "no database" approach was intentional:
- $0 hosting cost
- Instant page loads
- Perfect for SEO (all static HTML)
- Easy to maintain and update

## What's Working

### SEO Content Strategy
I've written 776+ blog articles targeting long-tail keywords:
- "best ai writing tools 2026"
- "rytr vs jasper"
- "midjourney vs dall-e 3"
- "ai tools for content creation"

Each article includes:
- Detailed tool reviews
- Side-by-side comparisons
- Practical use cases
- Affiliate links (for monetization)

### Scene-Based Recommendations
Instead of just listing tools, I created "scenes" for specific use cases:
- Blog Writing (Rytr, Jasper, Copy.ai)
- Social Media (Canva AI, Pictory, VEED.io)
- Podcast Production (Descript, Murf AI, Riverside.fm)
- YouTube Shorts (VEED.io, Pictory, Opus Clip)

This helps users find tools based on what they want to do, not just what the tool does.

## Current Traction

**Traffic:**
- [Update with current monthly visitors]
- Growing organic search traffic (60%+ from Google)
- Featured in several AI newsletters

**Revenue:**
- Rytr affiliate: 30% recurring commission
- VEED.io affiliate: 40% commission
- Total: $[X]/month (still early!)

**What's next:**
- Submit to 25+ AI directories (prepared a list!)
- Apply for 3 more affiliate programs (Descript, Notion AI, Grammarly)
- Build community on Reddit and Indie Hackers

## Challenges Faced

### 1. Content Creation at Scale
Writing 776+ articles took months. I built scripts to help generate drafts, but every article still needs manual review and editing.

### 2. SEO in a Competitive Niche
"AI tools" is extremely competitive. I focused on long-tail keywords and comparison articles to rank faster.

### 3. Monetization Without Losing Trust
I'm transparent about affiliate links (have an affiliate disclosure page), but I worry about maintaining trust while monetizing.

### 4. Working from Internet Cafés
Sometimes the WiFi drops mid-deployment. Vercel's auto-retry saves me, but it's stressful! 😅

## What I'd Love Feedback On

1. **Content strategy**: Am I targeting the right keywords? What topics should I cover?
2. **UX improvements**: Any friction points in finding/recommending tools?
3. **Monetization**: Should I add sponsored listings? Premium features?
4. **Community building**: How do I build a loyal audience beyond SEO traffic?

## Links

🔗 **Website**: https://useaitools.me  
🐦 **Twitter**: @jiongxiaomo  
💻 **GitHub**: https://github.com/xiaomo945/useaitools-me

---

Thanks for reading! Would love your feedback and suggestions. What features would you like to see? What tools should I review next?

*P.S. If you're building an AI tool and want it reviewed, DM me or submit it through the website!*
```

---

## 💬 预设回复模板

### 如果有人问技术细节
```
Great question! I used Next.js 16 with the App Router. All data is stored in static JSON files (no database), which keeps hosting costs at $0 and page loads instant.

The tricky part was generating the sitemap dynamically from 776+ blog posts, but Next.js handles that beautifully with generateStaticParams.

Happy to share more details if you're interested!
```

### 如果有人问流量数据
```
Thanks for asking! I'm currently at [X] monthly visitors, with 60%+ coming from organic search.

The growth has been steady but not explosive. I'm focusing on:
- Long-tail SEO content
- AI directory submissions
- Community building on Reddit/Indie Hackers

Still early days, but the trajectory is positive! 📈
```

### 如果有人问收入
```
I'm being transparent about revenue since I'm building in public:

Current monthly revenue: $[X]
- Rytr affiliate: 30% recurring commission
- VEED.io affiliate: 40% commission

It's not much yet, but I'm focusing on building traffic and trust first. The goal is $100/month by month 3, $500/month by month 6.

Any monetization advice is welcome! 💰
```

### 如果有人提出批评
```
Thanks for the honest feedback! You're right about [specific point].

I'm planning to [how you'll address it]. Would love to hear more specific suggestions if you have any.

Appreciate you taking the time to share your thoughts! 🙏
```

---

## 📊 发帖后跟进

### 第 1 小时
- [ ] 回复所有评论
- [ ] 感谢正面反馈
- [ ] 认真回应批评

### 第 24 小时
- [ ] 检查帖子浏览量
- [ ] 回复新评论
- [ ] 记录有价值的反馈

### 第 1 周
- [ ] 监控流量变化（Vercel Analytics）
- [ ] 检查是否有新订阅者
- [ ] 总结学到的经验

---

## ⚠️ 注意事项

### 不要做
- ❌ 不要过度自夸（"best AI directory ever"）
- ❌ 不要贬低竞争对手
- ❌ 不要虚假宣传流量/收入数据
- ❌ 不要在多个子版块重复发帖（至少间隔 1 个月）
- ❌ 不要在发帖后立刻删除负面评论

### 要做
- ✅ 保持真诚和透明
- ✅ 承认不足和挑战
- ✅ 感谢所有反馈（正面和负面）
- ✅ 提供具体数据和细节
- ✅ 邀请用户测试和反馈

---

## 📈 成功指标

### 短期（1 周）
- 帖子浏览量 > 1000
- 评论数 > 20
- 网站新增访问 > 100

### 中期（1 个月）
- Karma 增长 > 50
- 网站新增访问 > 500
- 收到有价值的反馈 > 5 条

### 长期（3 个月）
- 成为 r/SideProject 活跃成员
- 建立可持续的流量来源
- 获得忠实的早期用户
