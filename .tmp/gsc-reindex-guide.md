# Google Search Console 重新抓取指引

> 生成时间：2026-07-07  
> 适用站点：https://useaitools.me  
> 配套 Sitemap：https://useaitools.me/sitemap.xml

---

## 一、Sitemap 当前状态

| 项目 | 数值 |
|------|------|
| 数据源文章文件数 | 776 |
| 构建状态 | 通过（Next.js 16.2.6） |
| Sitemap 文件 | `public/sitemap.xml` 已生成 |
| URL 总数 | 3,333 |
| 工具详情页 | 1,298 |
| 博客文章页 | 725 |
| 分类页 | 6 |

Sitemap 已包含首页、分类页、工具页、博客页、对比页、场景页、工作流页等全量 URL，且 `<lastmod>` 统一为 `2026-06-01`，`changefreq` 为 `weekly`。

---

## 二、GSC 手动重新抓取步骤

### 1. 登录并选择资源
1. 打开 [Google Search Console](https://search.google.com/search-console/)
2. 选择资源（Property）：`useaitools.me`
3. 左侧菜单选择 **索引 → 站点地图**

### 2. 重新提交 Sitemap
1. 在「已提交的站点地图」中找到 `sitemap.xml`
2. 点击 **重新提交**（或先删除再重新添加）
3. 等待状态变为「成功」，并记录「已发现的网页」数量

### 3. 请求优先 URL 重新编入索引
1. 左侧菜单选择 **URL 检查工具**
2. 依次输入下方「优先提交索引的核心页面 URL」
3. 点击 **在 Google 上测试实际网址**
4. 测试通过后，点击 **请求编入索引**
5. 每天限额约 10–20 条，建议分批执行

### 4. 监控索引覆盖状态
1. 进入 **索引 → 页面**
2. 关注以下状态：
   - 已编入索引
   - 未编入索引（需排查原因）
   - 需要改善（如 CLS、LCP 问题）
3. 对大量未收录的工具页/博客页，优先检查是否存在重复内容、404、canonical 错误

### 5. 加速抓取的小技巧
- 确保 `robots.txt` 允许 Googlebot 访问所有页面
- 在首页或高权重页面添加内部链接指向新 URL
- 通过 Twitter/X、Reddit、Dev.to 等外链引导 Google 发现新内容
- 若站点地图 URL 超过 50,000，需拆分为多个 sitemap 文件（当前 3,333，无需拆分）

---

## 三、优先提交索引的核心页面 URL

### 1. 首页与聚合页
- https://useaitools.me
- https://useaitools.me/blog
- https://useaitools.me/compare
- https://useaitools.me/search
- https://useaitools.me/saved

### 2. 分类页
- https://useaitools.me/category/writing
- https://useaitools.me/category/image
- https://useaitools.me/category/code
- https://useaitools.me/category/audio
- https://useaitools.me/category/video
- https://useaitools.me/category/productivity

### 3. 高权重工具详情页（代表性 Top 20）
- https://useaitools.me/tool/midjourney
- https://useaitools.me/tool/dall-e-3
- https://useaitools.me/tool/stable-diffusion
- https://useaitools.me/tool/canva-magic-design
- https://useaitools.me/tool/notion-ai
- https://useaitools.me/tool/chatgpt
- https://useaitools.me/tool/github-copilot
- https://useaitools.me/tool/elevenlabs
- https://useaitools.me/tool/runway-ml
- https://useaitools.me/tool/perplexity-ai
- https://useaitools.me/tool/whisper
- https://useaitools.me/tool/pika-labs
- https://useaitools.me/tool/cursor
- https://useaitools.me/tool/obsidian-copilot
- https://useaitools.me/tool/suno-ai
- https://useaitools.me/tool/sora
- https://useaitools.me/tool/tabnine
- https://useaitools.me/tool/jasper
- https://useaitools.me/tool/adobe-firefly
- https://useaitools.me/tool/claude

### 4. 热门对比页
- https://useaitools.me/compare/rytr-vs-jasper
- https://useaitools.me/compare/midjourney-vs-dall-e-3
- https://useaitools.me/compare/chatgpt-vs-claude
- https://useaitools.me/compare/audio
- https://useaitools.me/compare/video
- https://useaitools.me/compare/writing

### 5. 场景页（部分代表性）
- https://useaitools.me/scenes/blog-writing
- https://useaitools.me/scenes/social-media
- https://useaitools.me/scenes/video-creation

### 6. 工作流页（部分代表性）
- https://useaitools.me/workflows/wf-001
- https://useaitools.me/workflows/wf-002
- https://useaitools.me/workflows/wf-003

### 7. 高价值博客文章（代表性）
- https://useaitools.me/blog/best-ai-video-tools-2026-6
- https://useaitools.me/blog/free-vs-paid-ai-tools-2026-67
- https://useaitools.me/blog/best-ai-tools-for-students-2026-69
- https://useaitools.me/blog/best-ai-tools-for-freelancers-2026-70
- https://useaitools.me/blog/best-ai-audio-tools-for-musicians-2026-94

---

## 四、后续建议

1. **每日检查 GSC 索引状态**，持续 1–2 周
2. **对未收录页面**，使用 URL 检查工具查看具体原因
3. **优先优化高点击潜力页面**（如工具详情页、对比页）的标题与描述
4. **每周更新 Sitemap 的 `<lastmod>` 时间戳**，促使 Google 重新抓取
5. **监控 Core Web Vitals**，确保 LCP ≤ 2.5s、CLS ≤ 0.1、INP ≤ 200ms

---

*本指引由自动化任务生成，作为 GSC 重新抓取的操作参考。*
