// 初始化会员计划
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始初始化会员计划...')

  // 清理旧数据
  await prisma.membershipPlan.deleteMany()
  console.log('✅ 已清理旧会员计划')

  // 创建会员计划
  const plans = [
    {
      name: 'free',
      displayName: '免费版',
      description: '基础功能，适合个人用户',
      price: 0,
      currency: 'USD',
      interval: 'monthly',
      features: JSON.stringify([
        '访问所有工具列表',
        '基础搜索功能',
        '收藏工具（最多10个）',
        '查看工具详情'
      ]),
      isPopular: false,
      isActive: true
    },
    {
      name: 'pro',
      displayName: '专业版',
      description: '高级功能，适合专业用户',
      price: 9.99,
      currency: 'USD',
      interval: 'monthly',
      features: JSON.stringify([
        '免费版所有功能',
        '无限收藏工具',
        '高级筛选和排序',
        '工具对比功能',
        '优先客服支持',
        '无广告体验'
      ]),
      isPopular: true,
      isActive: true
    },
    {
      name: 'enterprise',
      displayName: '企业版',
      description: '完整功能，适合团队和企业',
      price: 29.99,
      currency: 'USD',
      interval: 'monthly',
      features: JSON.stringify([
        '专业版所有功能',
        '团队协作功能',
        'API 访问权限',
        '自定义工具推荐',
        '数据导出功能',
        '专属客户经理',
        '定制化报告'
      ]),
      isPopular: false,
      isActive: true
    }
  ]

  for (const plan of plans) {
    await prisma.membershipPlan.create({ data: plan })
    console.log(`✅ 创建会员计划: ${plan.displayName}`)
  }

  console.log('🎉 会员计划初始化完成！')
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
