# useaitools.me 双语（中/英）站点实施方案

> 状态：设计稿，未实施。本方案只产出文档，不改动任何源码。
> 撰写前已对代码现状做逐项核实，下文所有数字均来自当前仓库实际统计（分支 `revive/content-value`）。

---

## 0. 结论先行

| 问题 | 结论 |
| --- | --- |
| 路由方案 | **`/[locale]` 全站前缀 + `localePrefix: 'as-needed'` + `defaultLocale: 'en'`**。英文 URL 保持零迁移，中文走 `/zh/...` |
| 是否全量双语 | **否**。推荐「UI 全中文化 + 工具数据全中文化 + 博客按需渐进」，不做 441 篇博客全量翻译 |
| 分几阶段 | **4 个阶段**，每阶段结束站点均可用、均可上线 |
| 工作量 | 骨架改造约 **57 个公开页面目录搬迁 + 9 个动态路由页签名改造 + 约 1,074 条公开 UI 文案抽取**；内容翻译按需推进 |
| 现在是否投入 | 只投入 **阶段 0–2**（约 4–6 人天量级 + 7.3 万字工具翻译）。阶段 3（博客）必须等阶段 2 的 GSC 数据出来再决定要不要继续 |

---

## 1. 现状核实：事实清单

动笔前逐项核实了用户给出的前提。有几处**与描述不符，且直接影响方案**，先列清楚。

### 1.1 已确认属实

| 项 | 实测 |
| --- | --- |
| `next.config.ts` 无 i18n 配置 | ✅ 确认，全文 179 行，只有 security headers / images / experimental.optimizePackageImports |
| 无 `[locale]` 路由段 | ✅ 确认 |
| `lib/seo.ts` hreflang 无效 | ✅ 确认，`lib/seo.ts:47-53`，`zh` 指向 `${canonicalPath}?lang=zh`，站内无 `?lang` 处理逻辑 |
| `lang="en"` | ✅ 确认，`app/layout.tsx:109` |
| `needs_vpn` 112 条 true | ✅ 确认，`data/tools.json` 中 `true: 112 / false: 421 / 缺失: 0`，533 条全覆盖 |
| next-intl 已装未用 | ✅ 确认，全仓仅 `app/components/SponsoredBadge.tsx:8` 一处 `import { useTranslations } from 'next-intl'` |

### 1.2 与描述不符 / 需要修正（重要）

**① `needs_vpn` 不在 Prisma schema 里，也不在数据库里。**

`prisma/schema.prisma` 的 `Tool` model 共 31 个字段，**没有 `needs_vpn`**。该字段只存在于 `data/tools.json` 这个静态 JSON 中。

更关键的是：**工具内容根本不走 Prisma。** `app/tool/[slug]/page.tsx:3` 是 `import tools from '@/data/tools.json'` —— 直接静态 import JSON。`lib/prisma.ts` 只服务于用户 / 收藏 / 评论 / 广告 / 会员等写操作。

> 这对方案是**好消息**：工具内容的多语言化只需要给 JSON 加字段，**不需要任何数据库迁移**。

**② `needs_vpn` 不是"埋着没用"，它已经被渲染了 —— 而且渲染给了英文用户。**

`app/tool/[slug]/ToolSlugClient.tsx:198-207`：

```tsx
{tool.needs_vpn ? (
  <span ...>🪜 VPN Required</span>
) : (
  <span ...>✅ Direct Access</span>
)}
```

一个语义为"中国用户是否需要梯子"的字段，正以英文徽章的形式展示给全球访客。英文站上"VPN Required"对欧美用户毫无意义（他们本来就能直连）。这是**当前最刺眼的错配**，也是阶段 2 要优先修掉的。

**③ 数据层里没有任何中文内容。**

实测扫描结果：

- 533 条工具 `description`：**含中文字符的 0 条**
- 441 篇博客 `content`：**含中文字符的 0 篇**
- `description_en` 字段 533 条全部存在，但也是英文 —— 它是 `description` 的**短版**，411 条与 `description` 完全相同，并非"中文描述的英文版"

所以"中文市场内核"实际只有两样东西：`needs_vpn` 的 112 条标注，以及国产工具条目（ChatGLM / Ernie Bot / Qwen / Qwen Chat / Qwen-Image / Kimi AI / Doubao / Tencent Yuanbao，共 8 条，且名称均为英文）。

**没有任何现成中文语料可以复用。** 翻译工作量必须从零算起。

**④ 现有 `locales/*.json` 基本不可用，且是死代码。**

- 7 个语言目录，每个 `common.json` 约 2 KB、**57 个叶子键**，只覆盖 nav / hero / tools / categories / footer 五小块
- 唯一消费方 `app/i18n.ts` 是**纯客户端**实现（`getLocale()` 读 `localStorage`，SSR 时永远返回 `'en'`），且只被 `app/components/SearchBar.tsx` 一处 import
- `app/components/LanguageSwitcher.tsx` **未被任何文件渲染**，且其 `handleLocaleChange` 会 `router.push('/zh' + pathname)` —— 指向一个不存在的路由，点下去就是 404
- `app/components/SponsoredBadge.tsx` 调用 `useTranslations('common')` 但**没有任何 Provider**，一旦被渲染会直接抛错；所幸它也未被引用

结论：`locales/` 和 `app/i18n.ts` 是**推倒重来**，不是复用。57 个键相对全站 UI 文案量（见 1.3）只是零头。

### 1.3 规模实测数据

**代码规模**

| 指标 | 数量 |
| --- | --- |
| `page.tsx` 总数 | 75（公开 57 + admin 18） |
| `.tsx` 文件 | 210（公开 184 + admin 26） |
| `'use client'` 组件 | 125 |
| 公开 UI 硬编码英文文案（JSX 文本节点 + placeholder/title/aria-label/alt） | **1,074**（967 + 107），admin 另有 60 |
| 含 `<Link>` 的文件 / 出现次数 | 104 / 284 |
| `href="/` 出现次数 | 176 |
| 含 `useRouter` 的文件 / `router.push(` 次数 | 12 / 28 |
| 含 `usePathname` 的文件 | 6 |
| 公开动态路由段 | 9 个：`blog/[slug]`、`blog/category/[slug]`、`category/[slug]`、`scenes/[slug]`、`tool/[slug]`、`tools/[id]`、`workflows/[slug]`、`compare/[slugs]`、`community/[id]` |

UI 文案 Top 文件（抽取时需优先处理）：`HomeClient.tsx` 37、`submit/page.tsx` 31、`CompareClient.tsx` 25、`SubmitClient.tsx` 24、`ToolDetailClient.tsx` 24、`ClientBlogDetail.tsx` 23、`SponsoredClient.tsx` 23、`Footer.tsx` 21。

> 说明：1,074 是**正则命中的原始次数**，去重后实际 key 数估计 600–800。admin 的 60 条不翻译。

**内容规模**

| 内容 | 体量 |
| --- | --- |
| 工具 `description` | 533 条，共 **72,797 字符**（均值 137，最长 610） |
| 工具 `longDescription` | 0（Prisma 有此字段，JSON 中无数据） |
| 博客 `content` | 441 篇，共 **2,907,190 字符 / 397,227 英文词**，均值 901 词，中位 5,827 字符，最长 19,447 |
| 博客 `description` | 共 61,963 字符 |
| 博客内链 | 4,141 处 `[[link:...]]` 自定义语法，其中 **3,179 处是旧式 `/tools/<id>`** |
| 场景 / 工作流 / 分类 | 18 scenes、10 workflows、6 tool categories、6 blog categories |

**SSG 页面数（构建期生成）**

| 路由 | 数量 |
| --- | --- |
| `tool/[slug]` | 533 |
| `blog/[slug]` | 441（`dynamicParams = false`） |
| `blog/category/[slug]` | 6 |
| `scenes/[slug]` | 18 |
| `workflows/[slug]` | 10 |
| `compare/[slugs]` | 8（硬编码的热门对比，非组合爆炸） |
| **合计** | **≈ 1,016 页** |

双语后 ≈ **2,032 页**。这是第 6 节风险评估的核心输入。

### 1.4 必须先知道的 SEO 现实

`lib/toolQuality.ts` 头部注释记录了当前的真实处境：

> Google 抓取了这些页面但拒绝索引：Search Console 报告 **623 页 "crawled, not indexed"**、**408 页 "discovered, not indexed"**，全站 impressions 从约 2,400/天 跌到 **1–2/天**。

项目已经为此做了激进的瘦身：`toolsWorthIndexing()` 只把"有实质内容（use_cases / pros_cons / examples）或被站内文章链接背书"的工具页推给 Google；`app/tools/[id]/page.tsx` 已对 `tool/[slug]` 做 308 永久重定向以合并重复内容。

**这个事实决定了本方案的整体取向**：本站的核心病灶是**页面单薄、重复度高**，不是语言。任何"批量生成数百页机器翻译内容"的动作，都会精准命中它已经踩过的坑。

### 1.5 前提：与 hreflang 清理 agent 的协同

同一批次另一个 agent 正在移除 `lib/seo.ts` 的无效 hreflang（为真正的多语言路由让路）。本方案**建立在该清理已完成的前提上**，全文不再讨论"如何修补现有 hreflang"，而是"从零建立真正的多语言路由"。

冲突提示：本方案阶段 1 会重写 `lib/seo.ts` 的 `buildMetadata()`。若清理尚未合入，需先合并再动 `lib/seo.ts`。

---

## 2. 路由与架构决策

### 2.1 三个候选方案对比

| 方案 | URL 形态 | hreflang 正确性 | 重复内容风险 | 已有 URL 迁移 | 工程量 | 域名权重 |
| --- | --- | --- | --- | --- | --- | --- |
| **A. `/[locale]` 全站前缀** | `/tool/midjourney`、`/zh/tool/midjourney` | ✅ 同域路径，标准且最易验证 | 可控（靠 sitemap + noindex 分层管理） | **可做到 0 迁移**（as-needed） | 中：目录搬迁 + 链接改造 | ✅ 单一域名，权重集中 |
| **B. 中文独立子域 `cn.useaitools.me`** | `/tool/...` 在 cn 子域 | ✅ 支持跨子域 hreflang | 中：子域常被搜索引擎视为独立实体，需额外交叉验证 | 英文站 0 迁移 | 大：双部署、双 analytics、跨子域 Cookie/鉴权（next-auth 需改配置） | ❌ 权重分散，对本站是净损失 |
| **C. 中文独立域名** | 新域名 | ✅ | 高：全新域名从零起，且大量内容原文相同 | 英文站 0 迁移 | 最大：两套基建 | ❌❌ 全新域名沙盒期，零权重继承 |

### 2.2 推荐：方案 A，`/[locale]` + `localePrefix: 'as-needed'`

**明确推荐 A，不做 B/C。**

理由，按重要性排序：

1. **英文 URL 零迁移。** 这是决定性因素。`localePrefix: 'as-needed'` 的语义是：`defaultLocale` 不加前缀，其他 locale 加前缀。取 `defaultLocale = 'en'`，则：

   | 页面 | 英文 URL | 中文 URL |
   | --- | --- | --- |
   | 首页 | `/` | `/zh` |
   | 工具详情页 | `/tool/midjourney` | `/zh/tool/midjourney` |
   | 博客 | `/blog/xxx` | `/zh/blog/xxx` |

   **现有全部 ≈1,016 个英文 URL 一个字节都不变。** 不需要 301 映射表，不需要担心 GSC 重抓，不需要重提 sitemap。而 B/C 虽然英文站同样零迁移，却付出了权重分散的代价。

2. **权重集中。** 本站域名权重接近于零，把它再劈成两半是自伤。同域路径是 hreflang 最容易被搜索引擎正确理解的形式。

3. **一套基建。** 单仓库、单 Vercel 项目、单 sitemap、单 analytics、next-auth 无需跨子域配置。B/C 都要额外处理 `AUTH_URL` / Cookie domain / CORS。

4. **工程量可控。** 目录搬迁是 `git mv` 级的机械操作（57 个公开页面目录），真正需要人脑介入的是 9 个动态路由页的 `params` 签名和约 1,074 条 UI 文案抽取。

### 2.3 关于"中文为主站"的处理（重要取舍）

用户决策是"中文为主站、英文保留"。**但"主站"不应该体现在 URL 根路径上。**

若把 `defaultLocale` 设为 `'zh'`，则：
- 中文占 `/`，英文全部迁到 `/en/...`
- ≈1,016 个已收录英文 URL 需要 301
- 英文站（目前唯一被索引的）承担全部迁移风险与信号重置

对一个 impressions 已经跌到 1–2/天 的站，这个损失的**绝对值**确实很小，但**收益也是零** —— 换根路径不会让中文站多一个访客。

**推荐做法：URL 层保持 `en` 为 defaultLocale，"中文为主站"通过以下方式落实：**

1. **协商层**：`proxy.ts` 对 `Accept-Language: zh-*` 且无 locale Cookie 的访客，重定向到 `/zh/...`。中国访客落地即中文。
2. **内容层**：中文站获得英文站没有的差异化内容 —— `needs_vpn` 免梯子筛选、国产工具专区、中文 prompt 示例。这是"主站"的实质。
3. **优先级层**：新内容中文优先产出；英文站不再新增内容，进入维护态。

**如果日后确认英文站流量可忽略、且确实想让中文占据根路径**：改 `defaultLocale: 'zh'` 是一行改动，配合 `vercel.json` 里 `/:path*` → `/en/:path*` 的 308 规则即可。把它留到数据说话之后，现在不要赌。

### 2.4 hreflang 与重复内容治理规则（贯穿全阶段）

这是本方案区别于" naive 双语站"的关键：**不是所有中文页都配 hreflang、都进 sitemap。**

规则（写进 `lib/seo.ts` 与 `app/sitemap.ts` 的公共逻辑）：

```
若某中文页面有对应的中文内容（已翻译）:
    → 输出 hreflang: en=<英文URL>, zh=<中文URL>, x-default=<英文URL>
    → 进入 sitemap
若某中文页面尚无中文内容（内容仍是英文）:
    → 不输出 hreflang
    → 该页 metadata 加 robots: noindex, follow
    → 不进入 sitemap
```

`noindex, follow` 而非 `noindex, nofollow`：页面对用户完全可用（`follow` 让爬虫继续顺着链接走），但不向 Google 推送一批"和英文页 90% 相同"的薄页面。项目已有 `robotsDirective()` 工具（`lib/seo.ts:85-87`），直接复用。

> 这条规则让「阶段 1 结束 = UI 中文化但内容仍英文」成为一个**可上线的正确状态**，而不是半成品。这是分阶段能成立的前提。

---

## 3. next-intl 落地路径

### 3.1 Next.js 16 的两个坑（必须先知道）

**坑 1：`middleware.ts` 在 Next 16 已改名为 `proxy.ts`。**

next-intl 官方文档明确："`proxy.ts` was called `middleware.ts` up until Next.js 16." 本项目是 **Next 16.2.6**，且根目录**不存在** `middleware.ts` 或 `proxy.ts`。所以：

- 新建文件叫 **`proxy.ts`**，放在项目根目录（本项目无 `src/`，`app/` 在根，与 `next.config.ts` 同级）
- 不要叫 `middleware.ts`，Next 16 不会识别

**坑 2：`next/root-params` 需要 Next 16.3+，本项目是 16.2.6。**

next-intl 的现代配置路径依赖 `next/root-params` 读取 locale。文档注明："`next/root-params` is available by default in Next.js 16.3 and later. In earlier versions, it needs to be enabled via `experimental.rootParams`."

两条路：

- **推荐**：`next.config.ts` 加 `experimental: { rootParams: true }`（一行），用现代路径。**好处是不需要在 57 个页面里逐个调 `setRequestLocale()`** —— 这对本项目的工程量影响很大。
- 备选：legacy `setRequestLocale(locale)`，稳定但**必须在每个 layout 和每个 page 里都调一次**，57 个页面逐个改，且极易漏。

验收动作：改完先跑一次 `npm run build`，确认 `[locale]` 下页面标记为 `●  (SSG)` 而非 `ƒ (Dynamic)`。

### 3.2 文件结构

```
项目根/
├── proxy.ts                      # 新增（Next 16 的 middleware）
├── next.config.ts                # 改：加 createNextIntlPlugin + experimental.rootParams
├── i18n/
│   ├── routing.ts                # 新增：defineRouting
│   ├── navigation.ts             # 新增：createNavigation（Link/redirect/useRouter 包装）
│   └── request.ts                # 新增：getRequestConfig（消息加载）
├── messages/
│   ├── en.json                   # 新增
│   └── zh.json                   # 新增
├── app/
│   ├── layout.tsx                # 删除/清空（root layout 迁到 [locale] 下）
│   ├── [locale]/                 # 新增：57 个公开页面目录整体迁入
│   │   ├── layout.tsx            # 由原 app/layout.tsx 改造而来
│   │   ├── page.tsx
│   │   ├── tool/[slug]/...
│   │   └── ...
│   ├── admin/                    # 不迁移，保持无 locale（后台无需多语）
│   └── api/                      # 不迁移（proxy matcher 已排除）
└── data/                         # 不动（阶段 2 加 _zh 字段）
```

注意：**`app/admin/`（18 页）和 `app/api/` 不迁入 `[locale]`**，后台和 API 无需多语言，省掉 18 个页面的改造。`proxy.ts` 的 matcher 排除 `api`，admin 则靠"路径不存在于 `[locale]` 下"自然不受影响 —— 但更简单的是 matcher 显式加 `admin`。

### 3.3 关键代码骨架

**`i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // 只保留 en / zh。其余 5 种语言（ja/ko/es/fr/de）零内容、零维护，直接放弃
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  // 关键：defaultLocale 不加前缀 → 现有英文 URL 零迁移
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
```

**`proxy.ts`（根目录）**

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 排除 api / trpc / _next / _vercel / admin，以及带点的静态文件
  matcher: '/((?!api|trpc|admin|_next|_vercel|.*\\..*).*)',
};
```

> 注意：现有 `app/tools/[id]/page.tsx` 用 `permanentRedirect()` 做 308 跳转，`app/sitemap.ts` 里也有 slug 逻辑。proxy 的 matcher 不能吞掉 `/tools/<id>`，否则旧链接会先被 locale 协商改写。已排除 `.*\\..*` 但不排除 `tools`，保持生效。

**`i18n/navigation.ts`**

```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from '@/i18n/routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

用途：把全站 104 个文件里的 284 处 `<Link>`、176 处 `href="/..."`、12 个文件的 `useRouter` / 28 处 `router.push` 逐步替换为这套包装，内部链接自动带上当前 locale，无需手写 `/zh`。

**`i18n/request.ts`**

```ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**`next.config.ts` 改动**

```ts
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();   // 默认读 ./i18n/request.ts

const nextConfig: NextConfig = {
  // ... 现有配置全部保留
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
    rootParams: true,        // Next 16.2.6 < 16.3，需显式开启
  },
};

export default withNextIntl(nextConfig);
```

**`app/[locale]/layout.tsx`**（由现有 `app/layout.tsx` 改造）

```tsx
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return { /* title / description / alternates.languages 见 2.4 规则 */ };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={/* 现有字体变量 */}>
      {/* 现有 head 内容（JSON-LD、Clarity 等）原样保留 */}
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

三个要点：
1. `lang={locale}` —— 替换现在的硬编码 `lang="en"`，这是 `app/layout.tsx:109`
2. `NextIntlClientProvider` 必须包上，否则 125 个 `'use client'` 组件里的 `useTranslations` 全部抛错（现有 `SponsoredBadge.tsx` 就是这个死法）
3. `generateStaticParams` 放在 layout 层，子页面不必各自再写

**Server Component 用法**

```tsx
import { useTranslations } from 'next-intl';

export default function ToolPage() {
  const t = useTranslations('ToolDetail');
  return <h1>{t('overview')}</h1>;
}
```

**Client Component 用法**（125 个客户端组件走这条）

```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function SearchBar() {
  const t = useTranslations('Search');
  return <input placeholder={t('placeholder')} />;
}
```

**异步 / metadata 场景**

```ts
import { getTranslations } from 'next-intl/server';
const t = await getTranslations({ locale, namespace: 'Metadata' });
```

### 3.4 目录搬迁的机械步骤

```bash
# 1. 建 [locale] 目录
mkdir -p "app/[locale]"
# 2. 除 admin / api 外，把 app 下一级目录与 page.tsx 整体移入
git mv app/about "app/[locale]/about"
git mv app/tool  "app/[locale]/tool"
# ... 其余 55 个公开页面目录同理
git mv app/page.tsx "app/[locale]/page.tsx"
# 3. 原 app/layout.tsx 内容迁入 app/[locale]/layout.tsx 后删除原文件
```

`app/admin/`、`app/api/`、`app/robots.ts`、`app/sitemap.ts`、`app/manifest.json`、`app/rss.xml`、`app/favicon.ico`、`app/opengraph-image.png`、`app/error.tsx`、`app/not-found.tsx`、`app/loading.tsx`、`app/globals.css`、`app/fonts/`、`app/utils/` 保持原位。

> `app/error.tsx` 与 `app/not-found.tsx` 需要保留一份在根（Next 要求 global-error 在根），`[locale]` 下可各放一份本地化版本。

---

## 4. 内容翻译策略

### 4.1 成本认知：翻译 API 不是瓶颈

先破除一个直觉误区。全站待翻译量约 **300 万字符**（博客 290 万 + 工具 7.3 万 + 博客 description 6.2 万）。按 LLM 价格量级估算（约 75 万 input token + 约 100 万 output token），即使使用较好的模型，总成本也在**几十美元量级**；用 DeepL / Google 的按字符计费更低。

**真正的成本是：① 抽取与接线的工时；② 译后质检；③ 译错造成的 SEO 损失。** 这决定了策略取向 —— 不要为了省 API 费而牺牲质量，也不要因为"反正便宜"就无脑全翻。

### 4.2 三类内容的差异化策略

| 内容 | 体量 | 策略 | 理由 |
| --- | --- | --- | --- |
| **UI 文案** | 公开 1,074 条（去重后约 600–800 key） | **全量人工/LLM 翻译，一次性做完** | 量小、复用率高、译错代价大（按钮/表单）。且 UI 不翻译的话中文站根本不能看 |
| **工具 `description`** | 533 条 / 72,797 字符 | **全量翻译（LLM 批量 + 国产工具人工精写）** | 体量仅为博客的 2.5%，但覆盖 533 个可索引页面 —— **性价比最高的一块** |
| **博客 `content`** | 441 篇 / 397,227 词 | **不全翻。按优先级渐进，首批 30–50 篇** | 见 4.4 |

### 4.3 工具描述翻译（阶段 2，推荐优先做）

**数据改造方式：纯增量加字段，零回归风险。**

```jsonc
// data/tools.json —— 只加不改
{
  "id": 23,
  "name": "Rytr",
  "description": "AI writing assistant that ...",     // 保留，英文站用
  "description_en": "AI writing assistant ...",        // 保留（现有短版）
  "description_zh": "AI 写作助手，...",                // 新增
  "use_cases_zh": [ { "title": "...", "detail": "..." } ],  // 新增
  "pros_cons_zh": { "pros": ["..."], "cons": ["..."] },     // 新增
  "best_for_zh": ["..."],                                    // 新增
  "needs_vpn": true                                          // 保留
}
```

读取侧加一个 resolver：

```ts
// lib/i18nContent.ts
export function toolDescription(tool: Tool, locale: Locale) {
  if (locale === 'zh') return tool.description_zh ?? tool.description;
  return tool.description;
}
```

**为什么"全量翻这 533 条"是划算的**：

- 成本极低：7.3 万字符 ≈ 不到全站翻译量的 3%
- 收益面大：直接让 533 个中文工具页从"薄页面"变成"有独立中文内容的页面"，可全部配 hreflang、全部进 sitemap
- 风险可控：短文本（均值 137 字符）机器翻译质量高，误译影响小

**国产工具必须人工精写**（8 条已确认：ChatGLM、Ernie Bot、Qwen、Qwen Chat、Qwen-Image、Kimi AI、Doubao、Tencent Yuanbao）。理由：这批条目是中文站最具差异化的资产，且涉及"国内可用/备案/价格体系"等机器翻译必然出错的信息。

**质量红线**：翻译后的 `description_zh` 若与原文语义偏差过大，比不翻更糟 —— 它会让中文页面变成 Google 眼中的"机器生成内容"。建议抽样 5% 人工复核。

### 4.4 博客翻译优先级（阶段 3，按需渐进）

441 篇 × 901 词 = 39.7 万词。**全量翻译是不合理的**，理由：

1. 本站刚因为"页面单薄、重复度高"被 Google 大规模拒绝索引（623 + 408 页）。再灌入 441 篇机器翻译的中文长文，是在同一个坑里再摔一次。
2. 长文本机器翻译的质量衰减明显（中位 5,827 字符，最长 19,447），术语一致性、代码块、内链都容易损坏。
3. 现阶段零流量，无法判断哪 441 篇里有多少值得翻 —— 应该让数据来筛选。

**优先级分层**（按 `data/blog-posts/*.json` 的 `title` / `style` / `category` 字段分类）：

| 优先级 | 类别 | 判据 | 建议首批数量 |
| --- | --- | --- | --- |
| **P0** | 对比/评测类（"X vs Y"、"Best X for Y"） | 商业意图强，中文搜索量集中，转化路径短 | **20–30 篇** |
| **P1** | 教程/指南类（How-to、Guide） | 长尾流量，留存价值高 | **10–20 篇** |
| **P2** | 新闻/资讯类 | 时效性强，翻译完已过时 | **0，不翻** |
| **P3** | 其余 | — | 视数据决定 |

首批合计 **30–50 篇**（约 2.7–4.5 万英文词），翻完先观察 60–90 天 GSC 数据，再决定是否扩到 150–200 篇。**永远不承诺 441 篇全翻。**

**翻译时必须处理的两个技术点**：

1. **保留 `[[link:...]]` 自定义语法。** 博客正文共 4,141 处。翻译 prompt 必须明确要求"原样保留所有 `[[link:path|text]]` 标记，只翻译 text 部分"。建议翻译后用脚本校验：译文中 `[[link:` 的数量必须与原文一致。

2. **顺手修掉 3,179 处旧式内链。** 其中 `[[link:/tools/<id>|Name]]` 有 3,179 处，而 `/tools/<id>` 已 308 跳转到 `/tool/<slug>`。翻译时直接输出 `/tool/<slug>` 形式，每篇文章省一次跳转 —— 这是"翻译"这个动作顺带能拿到的白捡收益。

### 4.5 现有 `locales/*.json`：推倒重来

**结论：不用，删掉。**

- 57 个键 vs 全站 ~1,074 条 UI 文案 —— 覆盖率约 5%
- 结构是为 `app/i18n.ts` 那个 localStorage 方案设计的，与 next-intl 的 namespace 模型不匹配
- 7 种语言里 5 种（ja/ko/es/fr/de）零内容零维护，是本方案明确要砍掉的负担

处理方式：新建 `messages/en.json` / `messages/zh.json`，按 next-intl namespace 重新组织（`Nav` / `Hero` / `ToolDetail` / `Blog` / `Search` / `Forms` / `Footer` / `Metadata` / `Errors` ...）。`locales/` 目录、`app/i18n.ts`、`app/components/LanguageSwitcher.tsx`、`app/components/SponsoredBadge.tsx` 一并删除（后两者是未被引用的死代码，`SponsoredBadge` 缺 Provider 一旦渲染即崩溃）。

`SearchBar.tsx` 里对 `app/i18n.ts` 的唯一 import 改为 next-intl 的 `useTranslations`。

### 4.6 分阶段路线图

设计原则：**每个阶段结束时站点都处于可上线状态** —— 要么内容完整，要么明确 `noindex`，绝不留"翻译到一半的半成品"。

---

**阶段 0 — 清场**
- 合并/确认 hreflang 清理（另一 agent 正在进行）
- 删除：`locales/`（7 语）、`app/i18n.ts`、`LanguageSwitcher.tsx`、`SponsoredBadge.tsx`
- 保留 2 个 locale：`en` / `zh`
- **结束状态**：干净的单语英文站，行为与今天完全一致，无 SEO 变化。可上线。

---

**阶段 1 — 骨架 + UI 中文化**
- 建 `i18n/routing.ts` / `proxy.ts` / `i18n/navigation.ts` / `i18n/request.ts`
- `next.config.ts` 加 `createNextIntlPlugin` + `experimental.rootParams`
- 57 个公开页面目录迁入 `app/[locale]/`
- `messages/en.json` + `messages/zh.json`，抽取并翻译 UI 文案（先做高频的 300–500 条：导航、按钮、表单、空状态、错误页、Footer）
- `<html lang={locale}>`；`NextIntlClientProvider` 就位
- 内部链接换用 next-intl 的 `Link`（284 处 `<Link>` / 176 处 `href="/` / 28 处 `router.push`）
- **内容层仍是英文**（tools.json 与 blog 不动），中文页按 2.4 规则打 `noindex, follow` + 不进 sitemap
- **结束状态**：英文站 URL 与内容完全不变（零迁移）；中文站可完整浏览，UI 全中文，内容暂为英文且不推送给搜索引擎。**可上线，无 SEO 损害。**

---

**阶段 2 — 工具数据中文化（推荐的最小完整交付）**
- `data/tools.json` 增量加 `description_zh` / `use_cases_zh` / `pros_cons_zh` / `best_for_zh`
- LLM 批量翻译 533 条（7.3 万字符）；8 条国产工具人工精写
- 加 `lib/i18nContent.ts` resolver，页面按 locale 取字段
- `needs_vpn` 差异化呈现（见第 5 节）
- 工具页中文版解除 `noindex`，输出 hreflang，进 sitemap
- **结束状态**：**533 个中文工具页 + 全中文 UI 的完整中文站**，英文站不受影响。这是本方案推荐的"够用线"。**可上线，可开始投中文渠道。**

---

**阶段 3 — 博客按需翻译（数据驱动，不承诺全量）**
- 按 4.4 的 P0/P1 优先级翻首批 30–50 篇
- 脚本校验 `[[link:` 数量一致；顺带把 3,179 处 `/tools/<id>` 改写为 `/tool/<slug>`
- 已翻页面解除 `noindex`、配 hreflang、进 sitemap
- 观察 60–90 天 GSC（impression / click / 索引率）
- **结束状态**：中文站 30–50 篇自有中文内容。可上线。

---

**阶段 4 — 评估与扩张（闸门）**
- **若**中文站拿到正向信号（有索引、有 impression）→ 扩到 150–200 篇，考虑让中文占根路径
- **若**中文页大面积 "crawled, not indexed" → **停止投入**，维持阶段 2/3 状态，把精力转回"让英文站内容变厚"
- 无论哪种结果，站点都保持可用

---

## 5. `needs_vpn` 等中文专属字段的差异化呈现

### 5.1 现状问题

`needs_vpn`（112 true / 421 false）当前在 `app/tool/[slug]/ToolSlugClient.tsx:198-207` 被无条件渲染为英文徽章：

| `needs_vpn` | 当前渲染 | 英文访客视角 | 中文访客视角 |
| --- | --- | --- | --- |
| `true` | 🪜 VPN Required | 无意义（他们直连） | **关键信息** |
| `false` | ✅ Direct Access | 无意义 | **关键信息**（"免梯子"） |

这个字段对英文访客是噪音，对中文访客是**核心价值** —— 它回答的是"这个工具我到底能不能用"。

### 5.2 差异化规则

**英文站（locale = en）**：**完全隐藏** `needs_vpn` 徽章。英文用户不存在"需不需要梯子"的问题，展示它只会让人困惑（"为什么告诉我需要 VPN？"）。

**中文站（locale = zh）**：从"角落徽章"提升为**一等筛选维度**：

1. **工具详情页**：徽章中文化并强化语义
   - `true` → `🪜 需梯子`（红色/橙色系，可点击展开"大陆访问需科学上网"说明）
   - `false` → `✅ 免梯子直连`（绿色系）
2. **列表/搜索页**：加「免梯子」筛选开关（默认可关闭），这是中文站相对英文站的独家功能
3. **分类页**：顶部加"本分类免梯子工具 N 个"的统计条
4. **结构化数据**：中文页的 JSON-LD 可加 `additionalProperty: { name: "大陆直连", value: true/false }`，形成英文站没有的结构化差异

实现要点：resolver 收口，避免在各组件里散落 `if (locale === 'zh')`：

```ts
// lib/i18nContent.ts
export function vpnBadge(tool: Tool, locale: Locale) {
  if (locale !== 'zh') return null;              // 英文站不显示
  return tool.needs_vpn
    ? { icon: '🪜', label: '需梯子', tone: 'warn' }
    : { icon: '✅', label: '免梯子直连', tone: 'ok' };
}
```

组件侧 `{vpn && <VpnBadge {...vpn} />}`，英文站传 `null` 直接不渲染。

### 5.3 其他中文专属字段

| 字段 / 资产 | 处理 |
| --- | --- |
| `languages`（工具界面语言） | 中英都展示，但中文站把 `zh` 排在首位 |
| `examples[].prompt`（prompt 示例） | 中文站翻译 prompt 内容 —— prompt 是最值得翻译的部分（用户要直接复制使用），且量小 |
| 国产工具（8 条） | 中文站人工精写 + 可加「国产」标签；英文站保持原样 |
| 价格（`priceMonthly` / `priceYearly`） | 中文站可标注人民币参考价（**注意**：汇率换算需标注"仅供参考，以官网为准"，避免误导） |
| Prisma 侧（reviews / discussions 等 UGC） | **不翻译**。UGC 保持原文，中文站可标注"以下评论为原文"。这是唯一合理的做法 |

---

## 6. 风险与工作量评估

### 6.1 改动文件量估算

| 类别 | 数量 | 依据 |
| --- | --- | --- |
| 新建基础设施文件 | 6 | `proxy.ts`、`i18n/{routing,navigation,request}.ts`、`messages/{en,zh}.json` |
| 配置文件改动 | 2 | `next.config.ts`、`tsconfig.json`（如需） |
| 页面目录搬迁（机械） | **57** | 公开 `page.tsx` 数（75 总数 − 18 admin）；`git mv` 级操作 |
| 动态路由页签名改造（需人脑） | **9** | `blog/[slug]`、`blog/category/[slug]`、`category/[slug]`、`scenes/[slug]`、`tool/[slug]`、`tools/[id]`、`workflows/[slug]`、`compare/[slugs]`、`community/[id]` |
| 需抽取 UI 文案的文件 | **184** | 公开 `.tsx` 文件数 |
| 需替换链接/路由调用的文件 | **104 + 12 + 6** | 含 `<Link>` 104 个文件、含 `useRouter` 12 个、含 `usePathname` 6 个（有重叠） |
| 需包 `NextIntlClientProvider` 的客户端组件 | **125** | `'use client'` 文件数（Provider 在 layout 层一次性包好，不需要逐个改，但这些组件内的 `useTranslations` 依赖它） |
| 数据文件 | 1 | `data/tools.json`（阶段 2，增量加字段） |
| **合计触及文件量级** | **约 200–230 个文件** | 其中约 60 个是机械搬迁，约 140 个需要实质编辑 |

**最大的单项工作不是搬迁，是 UI 文案抽取**：1,074 条（去重后 600–800 key）需要从 184 个文件里逐条抠出来、定 namespace、翻成中文、再接回去。

### 6.2 技术风险（按严重度排序）

**风险 1（高）：SSG 页面数翻倍导致 Vercel 构建超时**

- 现状 ≈1,016 页，双语后 ≈2,032 页
- 本项目每个 `tool/[slug]` 页都要 `JSON.parse` 一份 577 KB 的 `tools.json`，441 个博客页各读一份 JSON —— 构建期 I/O 与内存随页数线性增长
- 已有先兆：`next.config.ts:85-90` 的注释记录了本地构建曾因磁盘空间不足（<6 GB）失败，才引入 `NEXT_DIST_DIR`
- **缓解**：
  1. 阶段 1 先只翻 UI，中文页 `noindex` —— 但**页面照样会生成**。若构建已吃紧，可在阶段 1 把 zh 的 `generateStaticParams` 限制在高价值路由（首页、分类、工具页），博客页走 ISR/按需渲染
  2. 把 `data/tools.json` 改成构建期一次性加载 + `React.cache()` 复用，避免每页重复 parse
  3. 监控 Vercel 构建时长；Hobby/Pro 计划有构建超时上限，超限需联系提额或改增量渲染

**风险 2（高）：`experimental.rootParams` 是实验特性**

- 本项目 Next 16.2.6 < 16.3，`next/root-params` 需显式开启
- 如果开启后行为异常，回退方案是 legacy `setRequestLocale()`，**代价是要在 57 个页面里逐个调用**，且漏一个就退化成动态渲染（SSR），既慢又浪费
- **缓解**：阶段 1 的第一个验收动作就是 `npm run build` 后检查页面标记是 `● (SSG)` 还是 `ƒ (Dynamic)`。若大面积 `ƒ`，立即回退到 `setRequestLocale` 路径

**风险 3（中）：动态渲染退化**

next-intl 文档明确：使用 `useTranslations` 的 Server Component 若未正确配置静态渲染，会退化为动态渲染。2,032 个动态页的 TTFB 和 Vercel 成本都不可接受。**必须在 CI 里加一条检查**：构建输出中 `ƒ (Dynamic)` 的页面数不得超过基线。

**风险 4（中）：内部链接 locale 丢失**

284 处 `<Link>`、176 处 `href="/..."`、28 处 `router.push` 若漏改，用户在中文站点链接会跳回英文站。**缓解**：全部改用 `i18n/navigation.ts` 的包装；用 grep 定期扫描残留的裸 `href="/`。

**风险 5（中）：机器翻译质量与 SEO 反噬**

见 1.4 —— 本站已因薄内容被大规模拒绝索引。**缓解**：严格执行 2.4 的 noindex 分层规则；长文翻译必须人工抽检；绝不一次性投放 441 篇机器翻译博客。

**风险 6（低但别忘了）：`next-auth` 与 Cookie**

`auth.ts` + `app/api/auth/[...nextauth]` 已排除在 proxy matcher 外，风险低。但若日后启用 locale Cookie 协商，需确认与 next-auth 的 session Cookie 不冲突。

**风险 7（低）：Vercel 重定向规则**

`vercel.json` 现有 5 条尾部斜杠 308 规则。加 locale 后若路径形态变化需同步复查（阶段 1 URL 不变，暂不触发）。

### 6.3 更轻量的过渡方案（如果连阶段 1 都嫌重）

| 方案 | 做什么 | 代价 | 评价 |
| --- | --- | --- | --- |
| **L1：只做工具页中文化** | 不建 `[locale]` 路由。给 `tools.json` 加 `description_zh`，用 `?lang=zh` 或 `/zh` 单页渲染工具详情 | 无法做全站 UI 中文化；hreflang 依然别扭 | **不推荐** —— 会重新制造今天这种"半吊子"状态 |
| **L2：先只做 UI 中文化，内容保持英文** | 即阶段 1，内容不动 | 中文页需 `noindex`，短期无中文 SEO 收益 | **这就是阶段 1，已含在主方案里**，且是可上线的正确状态 |
| **L3：先做 `needs_vpn` 差异化** | 不做 i18n，只在英文站把 VPN 徽章改成"China Access: Direct / VPN needed"，或者干脆隐藏 | 极小（1 个组件） | **推荐作为阶段 0 的附带项** —— 1 小时就能让现状不再那么刺眼 |

---

## 7. 我对"是否应该现在做全量双语"的判断

**结论：不应该。应该做到阶段 2 为止，然后停下来看数据。**

理由，直说：

**1. 本站的病不是语言，是内容厚度。**
`lib/toolQuality.ts` 记录得很清楚：623 页 "crawled, not indexed"、408 页 "discovered, not indexed"，impressions 从 2,400/天 跌到 1–2/天。项目已经主动把大部分工具页从 sitemap 里摘掉了 —— 因为**页面本身没有足够的内容**。在这种情况下新增 441 篇机器翻译的中文长文，是把同一种问题复制一份，而且复制到了一个 Google 审核更严的语言市场。

**2. 双语会把本来就吃紧的构建资源再翻一倍。**
≈1,016 页 → ≈2,032 页，而这个仓库的构建已经在为磁盘空间挣扎（`next.config.ts` 里 `NEXT_DIST_DIR` 的注释就是证据）。在流量接近于零的时候承担这个风险，投入产出比很差。

**3. 真正被浪费的资产是 `needs_vpn`，不是 441 篇博客。**
112 条"需梯子"标注是这个站**唯一别人没有的东西**，而且它现在正以英文 "VPN Required" 的形式展示给根本不需要 VPN 的人。把这个字段做对（中文站"免梯子"筛选 + 英文站隐藏），加上 533 条中文工具描述（仅 7.3 万字符，成本极低），就能得到一个**有真实差异化、可索引、不含薄内容**的中文站。这是阶段 2，也是我认为应该到达的终点线。

**4. 阶段 2 的性价比远高于阶段 3。**

| | 投入 | 产出 |
| --- | --- | --- |
| 阶段 2（工具） | 7.3 万字符翻译 + ~60 个文件改造 | **533 个可索引、有独立中文内容的页面** |
| 阶段 3（博客 441 篇） | 39.7 万词翻译 + 大量质检 | 441 篇机器翻译长文 —— 大概率重演 "crawled, not indexed" |

前者的单位投入产出高一个数量级。

**5. 让数据决定要不要继续。**
阶段 2 上线后，观察中文工具页在 GSC 里的索引率和 impression。如果连"533 个有真实中文内容、有免梯子差异化的页面"都拿不到索引，那么翻译 441 篇博客只会更糟，这时候应该掉头去做内容厚度。**不要在没有验证之前就把最大的一块工作量花出去。**

**一句话**：做到「全中文 UI + 533 条中文工具数据 + 免梯子差异化」就够了，这是止境；441 篇博客的翻译是一道需要用数据解锁的闸门，不是计划表上的一行。

---

## 附录：关键事实速查

| 项 | 值 | 位置 |
| --- | --- | --- |
| Next / React | 16.2.6 / 19.2.4 | `package.json` |
| next-intl | ^4.12.0（仅 1 处引用且为死代码） | `app/components/SponsoredBadge.tsx:8` |
| `lang` 属性 | 硬编码 `en` | `app/layout.tsx:109` |
| 无效 hreflang | `zh` → `?lang=zh` | `lib/seo.ts:47-53` |
| 无 middleware / proxy | 确认不存在 | 项目根 |
| `needs_vpn` 渲染处 | `true`→"🪜 VPN Required" / `false`→"✅ Direct Access" | `app/tool/[slug]/ToolSlugClient.tsx:198-207` |
| `needs_vpn` 不在 Prisma | `Tool` model 无此字段 | `prisma/schema.prisma:67-117` |
| 工具数据加载 | 静态 import JSON，非 Prisma | `app/tool/[slug]/page.tsx:3` |
| 中文内容 | **0**（工具 0 条 / 博客 0 篇） | 全仓扫描 |
| SSG 页数 | ≈1,016（双语后 ≈2,032） | 各 `generateStaticParams` 汇总 |
| 旧式内链 | 3,179 处 `/tools/<id>`（已 308 跳转） | `data/blog-posts/*.json` |
