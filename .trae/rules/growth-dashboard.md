# 📊 增长仪表盘 — 监控与审计规则

## 🎯 核心定位

这是 Use AI Tools (useaitools.me) 的**增长数据中枢**。所有商业决策、内容策略、联盟优化都以本文档定义的指标为依据。

**唯一原则**：不需要 100 个指标，只需要 5 个核心指标就能看清全局。

---

## 📐 核心 KPI 定义

### 1. DAU / MAU（日/月活跃用户）

| 项目 | 说明 |
|:---|:---|
| **定义** | DAU = 每日独立访客数；MAU = 每月独立访客数 |
| **数据源** | Vercel Analytics → Visitors 面板 |
| **查询方法** | Vercel Dashboard → Analytics → Visits → 切换日/月视图 |
| **基准目标** | Month 1: 100 MAU → Month 3: 1,000 MAU → Month 6: 5,000 MAU |
| **分析频率** | 每周（每周一回顾上周数据） |
| **预警阈值** | DAU 连续 3 天下降 > 20% → 检查 SEO 排名和外部链接 |
| **行动触发** | DAU 突破里程碑 → 准备 Product Hunt 发布素材 |

### 2. 转化率漏斗（工具点击 → 联盟访问 → 最终转化）

| 层级 | 事件 | 追踪方式 | 目标转化率 |
|:---|:---|:---|:---|
| 第 1 层 | 首页/列表页 → 工具详情页 | 工具卡片点击（首页内链点击） | > 15% |
| 第 2 层 | 工具详情页 → 联盟链接点击 | `affiliate_click` 事件 | > 8% |
| 第 3 层 | 联盟链接点击 → 最终注册/购买 | 联盟后台报表 | > 3% |

**数据源**：
- 第 1-2 层：Vercel Analytics 自定义事件 + `@vercel/analytics` `track()` 函数
- 第 3 层：各联盟平台后台（Rytr Dashboard, VEED.io Partner Portal）

**分析频率**：每周
**行动触发**：任一环节转化率 < 目标值 → 优化对应页面的 CTA 位置/文案/颜色

### 3. 联盟收入（按工具和来源细分）

| 工具 | 佣金结构 | 数据源 | 分析维度 |
|:---|:---|:---|:---|
| Rytr | 30% 循环/12 月 | Rytr Affiliate Dashboard | 按文章/页面来源细分 |
| VEED.io | 40%/最高 $50 | VEED.io Partner Dashboard | 按工具页/博客页来源细分 |
| Synthesia | 25%/12 月 | Synthesia Affiliate Portal | 按推荐路径细分 |
| 新增 | 待确认 | 对应联盟后台 | 同上 |

**查询方法**：每周登录各联盟后台，手动记录到 `.tmp/affiliates/affiliate-tracker.md`
**分析频率**：每周日汇总
**预警阈值**：单工具连续 2 周零转化 → 检查联盟链接有效性 + 优化推荐内容

### 4. SEO 关键词排名

| 关键词类型 | 核心词示例 | 数据源 | 查询方法 |
|:---|:---|:---|:---|
| **品牌词** | "use ai tools", "useaitools" | Google Search Console | Performance → Pages → 搜索查询 |
| **工具对比词** | "rytr vs jasper", "best ai writing tools" | Google Search Console | Performance → Queries → 过滤 |
| **长尾词** | "best ai video tools 2026", "copy.ai review" | Google Search Console + Ahrefs Free | 每周检查 5 个核心长尾词 |
| **行业通用词** | "ai tools", "ai writing tools", "ai video editor" | Google Search Console | 监控平均排名变化 |

**基准目标**：
- Month 1: 核心长尾词排名前 30
- Month 3: 核心长尾词排名前 10
- Month 6: 核心长尾词排名前 3

**分析频率**：每周（每周一）
**行动触发**：任一核心词排名下降 > 5 位 → 更新对应文章内容 + 检查竞争对手

### 5. 性能指标（Core Web Vitals）

| 指标 | 目标 | 数据源 | 查询方法 |
|:---|:---|:---|:---|
| **LCP** | ≤ 2.5s | Vercel Analytics → Web Vitals | Dashboard → Analytics → Speed |
| **CLS** | ≤ 0.1 | Vercel Analytics → Web Vitals | 同上 |
| **INP** | ≤ 200ms | Vercel Analytics → Web Vitals | 同上 |
| **TTFB** | ≤ 800ms | Vercel Analytics → Speed | 同上 |
| **PageSpeed Score** | ≥ 90 | PageSpeed Insights | 手动测试首页/工具页/博客页 |

**分析频率**：每次重大更新后 + 每月定期测试
**预警阈值**：LCP > 3s 或 CLS > 0.15 → 立即优化（检查图片懒加载、字体预加载、组件 SSR）
**行动触发**：性能回退 → 回滚最近一次代码变更，逐个排查

---

## 🔄 增长飞轮

```
SEO 内容生产
    ↓
关键词排名提升
    ↓
有机流量增长
    ↓
工具点击（埋点追踪: tool_click, search_perform, filter）
    ↓
联盟/广告转化
    ↓
收益（美元）
    ↓
再投入生产（更多工具/更多内容/更多推广）
    ↓
（循环）
```

### 飞轮关键节点监控

| 节点 | 监控指标 | 频率 | 成功信号 |
|:---|:---|:---|:---|
| 内容生产 | 每周发布文章数 | 每周 | ≥ 2 篇/周 |
| 关键词排名 | 核心词 Top 10 数量 | 每周 | 持续增长 |
| 有机流量 | Google Search Console 点击量 | 每周 | 周环比 +10% |
| 工具点击 | `tool_click` 事件数 | 每日 | 持续增长 |
| 联盟转化 | 联盟后台注册数 | 每周 | > 0 |
| 收益 | 联盟总收入 | 每月 | 正增长 |

---

## 📊 事件追踪规范（与 09-analytics.md 对齐）

### 已埋点事件

| 事件名 | 触发时机 | 参数 | 数据源 |
|:---|:---|:---|:---|
| `tool_click` | 点击工具卡片"Visit Website" | `tool_name`, `category`, `affiliate` | Vercel Analytics |
| `affiliate_click` | 点击联盟链接 | `tool_name`, `position` | Vercel Analytics |
| `search_perform` | 搜索框回车/点击 | `query`, `results_count` | Vercel Analytics |

### 命名规则
- 事件名：`snake_case`，动词在前（如 `tool_click`、`search_perform`）
- 参数名：`snake_case`（如 `tool_name`、`results_count`）
- 禁止使用 `any` 类型

### 待埋点事件（后续扩展）
- `filter`：分类筛选切换（参数：`category_name`）
- `compare`：工具对比使用（参数：`tool_pair`）
- `save`：收藏工具（参数：`tool_name`）
- `blog_read`：浏览博客文章（参数：`slug`）

---

## 📅 分析日历

| 时间 | 动作 | 数据源 | 输出 |
|:---|:---|:---|:---|
| **每周一** | 回顾上周 DAU、CTR、CVR | Vercel Analytics | weekly-review 记录 |
| **每周三** | 检查核心关键词排名 | Google Search Console | 排名变化记录 |
| **每周五** | 汇总联盟收入 | 各联盟后台 | affiliate-tracker 更新 |
| **每月 1 号** | 全量 Core Web Vitals 测试 | PageSpeed Insights | 性能报告 |
| **每月 15 号** | 竞品联盟计划扫描 | 搜索引擎 + 竞品站 | 新联盟候选列表 |

---


## 📝 内容日历（Content Pipeline）

| 状态 | 主题/标题 | 目标关键词 | 核心联盟工具 | 计划发布日 |
|:---|:---|:---|:---|:---|
| ✅ 已发布 | Best AI Tools for Students 2026 | AI tools for students, best AI for homework | Rytr, Grammarly | 2026-05-22 |
| 📝 计划中 | Synthesia深度评测：AI Avatar 真的能替代真人讲师吗？ | Synthesia review 2026, AI avatar video | Synthesia | 2026-05-29 |
| 📝 计划中 | 7个AI工具让自由职业者收入翻倍 | AI tools for freelancers 2026 | Rytr, VEED.io | 2026-06-05 |
| 📝 计划中 | Midjourney v7 完整评测：值得订阅吗？ | Midjourney v7 review, best AI image generator | Midjourney | 2026-06-12 |

---

## 🚨 异常处理流程

| 异常 | 诊断步骤 | 修复方法 |
|:---|:---|:---|
| DAU 骤降 | 检查 Google Search Console → 索引状态 → 手动操作 | 修复技术问题，提交重新索引请求 |
| 转化率骤降 | 检查联盟链接有效性 → CTA 按钮可见性 | 修复链接，恢复 CTA 展示 |
| LCP > 3s | 检查 PageSpeed Insights → 识别阻塞资源 | 优化图片加载、代码分割、字体预加载 |
| 联盟零收入 | 检查链接有效性 → 联盟账户状态 → 转化追踪代码 | 修复链接，联系联盟平台 |
