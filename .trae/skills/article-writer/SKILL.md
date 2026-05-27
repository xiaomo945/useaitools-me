# 📝 Article Writer Skill

## 触发词
- 批量写文章
- 内容生产
- 写文章
- 生成文章
- 批量生产内容
- 内容冲量

## 触发条件
当用户要求批量生成文章或内容生产时自动激活。

## 工作流

### 1. 选题阶段
- 运行 `node scripts/auto-topic-generator.js` 生成10个选题
- 结合工具数据和关键词库生成高质量选题
- 每个选题包含：标题、关键词、分类、模板类型

### 2. 内容生成阶段
- 运行 `node scripts/batch-content-producer.js` 批量生成文章
- 每篇文章包含：
  - 完整标题（SEO优化）
  - 详细介绍（1000-1500字）
  - 对比表格
  - 内链（2-3个）
  - CTA（行动号召）
  - 配图提示词（3张）

### 3. 配图阶段
- 调用 `node scripts/generate-images.js` 生成配图
- 使用 Pollinations.ai 免费API
- 生成header/mid/cta三张图
- 自动保存到 `public/blog-images/`

### 4. 联盟植入阶段
- 运行 `node scripts/enhance-article-content.js`
- 在Writing/Video/Productivity文章中自然植入联盟工具
- 确保每篇文章提到1-2个联盟工具

### 5. 内链补充阶段
- 运行 `node scripts/add-recent-blog-internal-links.js`
- 为新文章添加2-3个同分类内链
- 确保无孤岛文章

## 执行命令

```bash
# 完整内容生产流程（生成10篇）
node scripts/batch-content-producer.js

# 单独选题
node scripts/auto-topic-generator.js

# 单独生成配图
node scripts/generate-images.js

# 联盟工具植入
node scripts/enhance-article-content.js

# 内链补充
node scripts/add-recent-blog-internal-links.js
```

## 输出
- 新增文章保存到 `data/blog-posts.json`
- 配图保存到 `public/blog-images/`
- 选题保存到 `.tmp/auto-topics-batch.md`

## 质量标准
- 每篇文章1000-1500字
- 包含对比表格
- 包含2-3个内链
- 包含清晰CTA
- 标题SEO优化（50-60字符）
- 覆盖所有6个分类

## 联盟工具清单
- Writing: Rytr, Grammarly, Copy.ai, Jasper
- Video: VEED.io, Synthesia, Pictory, Runway ML
- Productivity: Notion AI, ClickUp AI, Perplexity AI
- Audio: ElevenLabs, Murf AI, Suno AI
- Code: GitHub Copilot, Cursor, Tabnine
- Image: Midjourney, DALL-E 3, Stable Diffusion
