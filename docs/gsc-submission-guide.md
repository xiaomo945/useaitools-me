# Google Search Console 提交指南

> 创建日期：2026-06-13  
> 目标：确保所有新页面被 Google 正确索引

---

## 📋 提交前准备

### 1. 验证 Sitemap
访问 https://useaitools.me/sitemap.xml 确认：
- [ ] Sitemap 正常加载
- [ ] 包含约 908 个 URL（21 静态 + 6 分类 + 15 场景 + 80 工具 + 776 博客 + 10 工作流）
- [ ] 所有 URL 格式正确

### 2. 检查 robots.txt
访问 https://useaitools.me/robots.txt 确认：
- [ ] 允许所有爬虫（User-agent: *）
- [ ] 包含 Sitemap 声明：`Sitemap: https://useaitools.me/sitemap.xml`

---

## 🚀 GSC 提交步骤

### Step 1: 登录 Google Search Console
1. 访问 https://search.google.com/search-console
2. 选择属性：`useaitools.me`
3. 如果未添加，先添加属性并验证所有权

### Step 2: 提交 Sitemap
1. 左侧菜单 → **Sitemaps**
2. 在 "Add a new sitemap" 输入框中输入：`sitemap.xml`
3. 点击 **Submit**
4. 等待状态变为 "Success"

### Step 3: 请求索引关键页面
使用 **URL Inspection** 工具逐个提交以下高优先级页面：

#### 首页（必提交）
```
https://useaitools.me/
```

#### 分类页（6个）
```
https://useaitools.me/category/writing
https://useaitools.me/category/video
https://useaitools.me/category/image
https://useaitools.me/category/code
https://useaitools.me/category/audio
https://useaitools.me/category/productivity
```

#### 核心工具页（Top 10）
```
https://useaitools.me/tools/23  # Rytr
https://useaitools.me/tools/1   # ChatGPT
https://useaitools.me/tools/2   # Midjourney
https://useaitools.me/tools/3   # DALL-E 3
https://useaitools.me/tools/4   # Stable Diffusion
https://useaitools.me/tools/5   # Jasper
https://useaitools.me/tools/6   # Copy.ai
https://useaitools.me/tools/7   # VEED.io
https://useaitools.me/tools/8   # Synthesia
https://useaitools.me/tools/9   # HeyGen
```

#### 对比页（3个）
```
https://useaitools.me/compare
https://useaitools.me/compare/writing
https://useaitools.me/compare/video
```

#### 博客列表页
```
https://useaitools.me/blog
```

#### 场景页（Top 5）
```
https://useaitools.me/scenes/blog-writing
https://useaitools.me/scenes/social-media
https://useaitools.me/scenes/video-creation
https://useaitools.me/scenes/podcast-production
https://useaitools.me/scenes/youtube-shorts
```

### Step 4: 监控索引状态
1. 左侧菜单 → **Pages**
2. 查看 **Indexing status** 图表
3. 检查 **Why pages aren't indexed** 部分
4. 修复任何 "Excluded" 或 "Error" 状态的页面

---

## 📊 预期索引时间

| 页面类型 | 预期时间 | 备注 |
|:---|:---|:---|
| 首页 | 24-48 小时 | 最高优先级 |
| 分类页 | 2-5 天 | 高优先级 |
| 工具详情页 | 1-2 周 | 中等优先级 |
| 博客文章页 | 1-3 周 | 取决于内容质量 |
| 场景页 | 1-2 周 | 中等优先级 |

---

## 🔍 常见问题排查

### 问题 1: "Submitted URL seems to be a soft 404"
**原因**: 页面返回 404 或内容过少  
**解决**: 检查页面是否正常加载，确保有足够内容

### 问题 2: "Submitted URL has crawl issue"
**原因**: 爬虫无法访问页面  
**解决**: 检查 robots.txt 和服务器日志

### 问题 3: "Submitted URL is not selected as canonical"
**原因**: 存在重复内容  
**解决**: 确保每个页面有唯一的 canonical URL

### 问题 4: Sitemap 提交后长时间 "Couldn't fetch"
**原因**: Sitemap 格式错误或服务器响应慢  
**解决**: 验证 sitemap XML 格式，检查服务器性能

---

## 📈 监控指标

### 每周检查
- [ ] 索引页面数量变化
- [ ] 搜索点击量和展示次数
- [ ] 平均搜索排名
- [ ] 核心关键词排名

### 每月复盘
- [ ] 索引覆盖率（目标 >95%）
- [ ] 搜索流量趋势
- [ ] 关键词排名变化
- [ ] 页面体验指标（Core Web Vitals）

---

## 🎯 核心关键词监控

### 主要关键词
- best ai writing tools 2026
- best ai video tools 2026
- ai tools directory
- ai image generators
- ai voice generators

### 长尾关键词
- rytr vs jasper
- midjourney vs dall-e 3
- best free ai writing tools
- ai tools for content creation

---

## 📝 提交记录

| 日期 | 操作 | 结果 | 备注 |
|:---|:---|:---|:---|
| 2026-06-13 | 准备提交指南 | ✅ | 待执行 |
