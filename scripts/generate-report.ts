import { prisma } from '@/lib/prisma'
import { format, subDays, startOfDay, endOfDay, subMonths } from 'date-fns'

export type ReportType = 'weekly' | 'monthly' | 'seo' | 'tools' | 'content'

export interface ReportInput {
  type: ReportType
  periodStart?: Date
  periodEnd?: Date
  generatedBy?: string
}

export interface ReportData {
  summary: {
    periodStart: string
    periodEnd: string
    type: ReportType
    generatedAt: string
  }
  tools: {
    total: number
    newInPeriod: number
    byCategory: Record<string, number>
    topByReviews: Array<{ name: string; slug: string; reviewCount: number; rating: number }>
    totalClickCount: number
  }
  blog: {
    total: number
    publishedInPeriod: number
    byCategory: Record<string, number>
    topByViews: Array<{ title: string; slug: string; viewCount: number }>
  }
  categories: {
    total: number
    engagement: Array<{ category: string; toolCount: number; reviewCount: number; bookmarkCount: number }>
  }
  affiliateLinks: {
    totalToolsWithAffiliate: number
    totalClicks: number
  }
}

function parseArgs(): ReportInput {
  const args = process.argv.slice(2)
  let type: ReportType = 'weekly'
  let periodStart: Date | undefined
  let periodEnd: Date | undefined

  for (const arg of args) {
    if (arg.startsWith('--type=')) {
      const value = arg.slice('--type='.length)
      if (['weekly', 'monthly', 'seo', 'tools', 'content'].includes(value)) {
        type = value as ReportType
      } else {
        throw new Error(`Invalid --type: ${value}. Must be one of weekly, monthly, seo, tools, content.`)
      }
    } else if (arg.startsWith('--start=')) {
      const value = arg.slice('--start='.length)
      periodStart = new Date(value)
    } else if (arg.startsWith('--end=')) {
      const value = arg.slice('--end='.length)
      periodEnd = new Date(value)
    }
  }

  return { type, periodStart, periodEnd }
}

function computeDefaultPeriod(type: ReportType): { start: Date; end: Date } {
  const now = new Date()
  const end = endOfDay(now)
  let start: Date
  switch (type) {
    case 'monthly':
      start = startOfDay(subMonths(now, 1))
      break
    case 'weekly':
    default:
      start = startOfDay(subDays(now, 7))
      break
  }
  return { start, end }
}

export async function generateReport(input: ReportInput): Promise<ReportData> {
  const { type } = input
  const defaultPeriod = computeDefaultPeriod(type)
  const periodStart = input.periodStart ?? defaultPeriod.start
  const periodEnd = input.periodEnd ?? defaultPeriod.end

  const totalTools = await prisma.tool.count()
  const newToolsCount = await prisma.tool.count({
    where: { createdAt: { gte: periodStart, lte: periodEnd } }
  })

  const rawByCategory = await prisma.tool.groupBy({
    by: ['category'],
    _count: { id: true }
  })
  const byCategory: Record<string, number> = {}
  for (const row of rawByCategory) {
    byCategory[row.category] = row._count.id
  }

  const topByReviews = await prisma.tool.findMany({
    where: { reviewCount: { gt: 0 } },
    orderBy: [{ reviewCount: 'desc' }, { rating: 'desc' }],
    take: 10,
    select: { name: true, slug: true, reviewCount: true, rating: true }
  })

  const toolClickCounts = await prisma.tool.aggregate({
    _sum: { clickCount: true }
  })
  const totalClickCount = toolClickCounts._sum.clickCount ?? 0

  const totalBlogPosts = await prisma.blogPost.count()
  const publishedBlogCount = await prisma.blogPost.count({
    where: { isPublished: true, publishedAt: { gte: periodStart, lte: periodEnd } }
  })

  const rawBlogByCategory = await prisma.blogPost.groupBy({
    by: ['categoryId'],
    _count: { id: true }
  })
  const blogByCategory: Record<string, number> = {}
  const categoryIds = rawBlogByCategory.map((row) => row.categoryId)
  const blogCategories = await prisma.blogCategory.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true }
  })
  const categoryNameById: Record<string, string> = {}
  for (const cat of blogCategories) categoryNameById[cat.id] = cat.name
  for (const row of rawBlogByCategory) {
    const name = categoryNameById[row.categoryId] || row.categoryId
    blogByCategory[name] = (blogByCategory[name] || 0) + row._count.id
  }

  const topBlogByViews = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { viewCount: 'desc' },
    take: 10,
    select: { title: true, slug: true, viewCount: true }
  })

  const totalCategories = await prisma.category.count({ where: { isActive: true } })

  const toolStatsByCategory = await prisma.tool.groupBy({
    by: ['category'],
    _count: { id: true },
    _sum: { reviewCount: true }
  })

  const engagement: Array<{ category: string; toolCount: number; reviewCount: number; bookmarkCount: number }> = []
  for (const row of toolStatsByCategory) {
    const bookmarkCount = await prisma.bookmark.count({
      where: { tool: { category: row.category } }
    })
    engagement.push({
      category: row.category,
      toolCount: row._count.id,
      reviewCount: row._sum.reviewCount ?? 0,
      bookmarkCount
    })
  }
  engagement.sort((a, b) => b.toolCount - a.toolCount)

  const totalToolsWithAffiliate = await prisma.tool.count({
    where: { affiliateUrl: { not: null } }
  })

  const report: ReportData = {
    summary: {
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      type,
      generatedAt: new Date().toISOString()
    },
    tools: {
      total: totalTools,
      newInPeriod: newToolsCount,
      byCategory,
      topByReviews,
      totalClickCount
    },
    blog: {
      total: totalBlogPosts,
      publishedInPeriod: publishedBlogCount,
      byCategory: blogByCategory,
      topByViews: topBlogByViews
    },
    categories: {
      total: totalCategories,
      engagement
    },
    affiliateLinks: {
      totalToolsWithAffiliate,
      totalClicks: totalClickCount
    }
  }

  return report
}

export function buildMarkdownSummary(report: ReportData): string {
  const { summary, tools, blog, categories, affiliateLinks } = report
  const periodLabel = `${format(new Date(summary.periodStart), 'yyyy-MM-dd')} ~ ${format(new Date(summary.periodEnd), 'yyyy-MM-dd')}`
  const typeLabel = {
    weekly: '周度',
    monthly: '月度',
    seo: 'SEO',
    tools: '工具',
    content: '内容'
  }[summary.type]

  const topCategoryEntries = Object.entries(tools.byCategory).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const topBlogCategoryEntries = Object.entries(blog.byCategory).sort((a, b) => b[1] - a[1]).slice(0, 5)

  let md = `# ${typeLabel}报告 (${periodLabel})\n\n`
  md += `生成时间: ${format(new Date(summary.generatedAt), 'yyyy-MM-dd HH:mm')}\n\n`

  md += `## 工具概览\n`
  md += `- 工具总数: **${tools.total}**\n`
  md += `- 本周期新增: **${tools.newInPeriod}**\n`
  md += `- 联盟链接点击总数: **${tools.totalClickCount}**\n\n`

  if (topCategoryEntries.length) {
    md += `### 工具分类 Top 5\n`
    for (const [name, count] of topCategoryEntries) {
      md += `- ${name}: ${count}\n`
    }
    md += `\n`
  }

  if (tools.topByReviews.length) {
    md += `### 评价数 Top 工具\n`
    for (const tool of tools.topByReviews) {
      md += `- ${tool.name} (${tool.slug}) - 评价 ${tool.reviewCount}, 评分 ${tool.rating.toFixed(1)}\n`
    }
    md += `\n`
  }

  md += `## 博客内容\n`
  md += `- 博客总数: **${blog.total}**\n`
  md += `- 本周期发布: **${blog.publishedInPeriod}**\n\n`

  if (topBlogCategoryEntries.length) {
    md += `### 博客分类 Top 5\n`
    for (const [name, count] of topBlogCategoryEntries) {
      md += `- ${name}: ${count}\n`
    }
    md += `\n`
  }

  if (blog.topByViews.length) {
    md += `### 浏览量 Top 博客\n`
    for (const post of blog.topByViews) {
      md += `- ${post.title} (${post.slug}) - ${post.viewCount} 浏览\n`
    }
    md += `\n`
  }

  md += `## 分类与互动\n`
  md += `- 活跃分类数: **${categories.total}**\n\n`

  if (categories.engagement.length) {
    md += `### 分类互动概览 (按工具数排序)\n`
    for (const row of categories.engagement.slice(0, 10)) {
      md += `- ${row.category}: ${row.toolCount} 个工具 / ${row.reviewCount} 条评价 / ${row.bookmarkCount} 次收藏\n`
    }
    md += `\n`
  }

  md += `## 联盟链接\n`
  md += `- 带联盟链接的工具数: **${affiliateLinks.totalToolsWithAffiliate}**\n`
  md += `- 联盟链接点击总量: **${affiliateLinks.totalClicks}**\n`

  return md
}

export async function saveReport(input: ReportInput): Promise<{ id: string; report: ReportData; markdown: string }> {
  const report = await generateReport(input)
  const markdown = buildMarkdownSummary(report)
  const saved = await prisma.contentReport.create({
    data: {
      reportType: report.summary.type,
      periodStart: new Date(report.summary.periodStart),
      periodEnd: new Date(report.summary.periodEnd),
      data: JSON.stringify(report),
      summary: markdown,
      generatedBy: input.generatedBy ?? 'system'
    }
  })
  return { id: saved.id, report, markdown }
}

async function main() {
  const input = parseArgs()
  const { report, markdown, id } = await saveReport(input)
  console.log(JSON.stringify(report, null, 2))
  console.log('\n--- MARKDOWN SUMMARY ---\n')
  console.log(markdown)
  console.log(`\n报告已保存: ${id}`)
  await prisma.$disconnect()
}

if (require.main === module || process.argv[1]?.includes('generate-report')) {
  main().catch((error) => {
    console.error('生成报告失败:', error)
    process.exit(1)
  })
}
