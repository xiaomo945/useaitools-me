import { PrismaClient } from '@prisma/client'
import toolsData from '../data/tools.json'
import path from 'path'

// 使用绝对路径确保数据库连接正确
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const DATABASE_URL = `file:${dbPath}`

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function mapPricing(pricing: string): 'FREE' | 'FREEMIUM' | 'PAID' {
  const p = pricing.toLowerCase()
  if (p === 'free') return 'FREE'
  if (p === 'freemium') return 'FREEMIUM'
  return 'PAID'
}

async function main() {
  console.log('开始迁移工具数据...')
  console.log(`共 ${toolsData.length} 个工具`)

  let successCount = 0
  let errorCount = 0

  for (const tool of toolsData) {
    try {
      const slug = slugify(tool.name)
      
      // 检查是否已存在
      const existing = await prisma.tool.findUnique({
        where: { slug }
      })

      if (existing) {
        console.log(`跳过已存在的工具: ${tool.name}`)
        continue
      }

      // 转换 JSON 字段为字符串
      const screenshotUrls = tool.examples ? JSON.stringify(tool.examples) : null
      const features = tool.rating_breakdown ? JSON.stringify(tool.rating_breakdown) : null
      const tags = tool.best_for ? JSON.stringify(tool.best_for) : null

      await prisma.tool.create({
        data: {
          name: tool.name,
          slug,
          description: tool.description,
          longDescription: tool.description_en || tool.description,
          categoryName: tool.category,
          url: tool.url,
          affiliateUrl: tool.affiliate_link || null,
          iconUrl: tool.icon_url || null,
          screenshotUrls,
          pricing: mapPricing(tool.pricing),
          rating: tool.rating || 0,
          reviewCount: tool.rating_count || 0,
          viewCount: 0,
          clickCount: 0,
          isActive: true,
          isFeatured: false,
          isStaffPick: false,
          features,
          tags,
          pros: null,
          cons: null,
        }
      })

      successCount++
      console.log(`✓ 成功迁移: ${tool.name}`)
    } catch (error) {
      errorCount++
      console.error(`✗ 迁移失败: ${tool.name}`, error)
    }
  }

  console.log('\n迁移完成!')
  console.log(`成功: ${successCount}`)
  console.log(`失败: ${errorCount}`)
  console.log(`总计: ${toolsData.length}`)
}

main()
  .catch((e) => {
    console.error('迁移过程中发生错误:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
