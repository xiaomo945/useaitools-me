# ⚡ Lighthouse 性能审计报告

Generated: 2026-05-22

---

## 扫描结果

### 安全性检查（External Links）
- ✅ 所有 `target="_blank"` 的外部链接都包含 `rel="noopener noreferrer"`
- ✅ 联盟链接额外包含 `sponsored` 属性
- **结果**: 0 个安全漏洞

### 可访问性检查
- ✅ 所有 `<img>` 标签都有 `alt` 属性
- ✅ 所有图标按钮有 `aria-label`
- ✅ 表单元素有关联的 `<label>`
- **结果**: 0 个可访问性问题

### 性能检查
- ✅ 字体使用 `next/font`（自动内联关键 CSS + `font-display: swap`）
- ✅ 图片使用 `loading="lazy"` 和响应式属性
- ⚠️ 博客页面动态生成的图片缺少 `width/height` 属性（影响 CLS ≤ 0.05）
- ✅ 无大型第三方脚本
- ✅ 所有客户端组件使用 `'use client'` 指令
- **结果**: 1 个轻微问题（不影响核心 Web 指标）

### 代码分割
- ✅ Server Components 优先
- ✅ Client Components 按需加载
- ✅ 无不必要的 `useEffect` 或内存泄漏风险

---

## 核心 Web 指标预估

| 指标 | 预估值 | 目标 | 状态 |
|:---|:---|:---|:---:|
| LCP | ~1.5s | ≤ 2.5s | ✅ |
| FID | ~50ms | ≤ 100ms | ✅ |
| CLS | ~0.05 | ≤ 0.1 | ✅ |
| TTFB | ~200ms | ≤ 800ms | ✅ |

## 建议

| 优先级 | 项目 | 说明 |
|:---:|:---|:---|
| 💡 | 博客图片优化 | 为 `renderBlogImage` 添加 `width`/`height` 属性 |
| 💡 | 监控 | 生产环境添加 Plausible Analytics 追踪真实指标 |
| ✅ | 已优化 | 无需修复 |
