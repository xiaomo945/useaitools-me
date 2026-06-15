import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始初始化赞助套餐...')

  // 清理旧数据
  await prisma.sponsoredPackage.deleteMany()
  console.log('✅ 已清理旧赞助套餐')

  // 创建赞助套餐
  const packages = [
    {
      name: 'basic',
      displayName: '基础版',
      description: '适合个人开发者和小型项目',
      price: 50,
      currency: 'USD',
      duration: 30,
      position: 'sidebar',
      features: JSON.stringify([
        '侧边栏展示 30 天',
        '每月 10,000+ 曝光',
        '点击数据统计',
        '基础支持'
      ]),
      isActive: true
    },
    {
      name: 'pro',
      displayName: '专业版',
      description: '适合成长型公司和产品推广',
      price: 150,
      currency: 'USD',
      duration: 30,
      position: 'header',
      features: JSON.stringify([
        '首页顶部展示 30 天',
        '每月 50,000+ 曝光',
        '点击数据统计',
        '优先展示位置',
        '专属客服支持'
      ]),
      isActive: true
    },
    {
      name: 'premium',
      displayName: '高级版',
      description: '适合企业级客户和大型推广',
      price: 300,
      currency: 'USD',
      duration: 30,
      position: 'inline',
      features: JSON.stringify([
        '内容流嵌入展示 30 天',
        '每月 100,000+ 曝光',
        '点击数据统计',
        '最佳展示位置',
        '专属客户经理',
        '定制化报告',
        '多位置展示'
      ]),
      isActive: true
    }
  ]

  for (const pkg of packages) {
    await prisma.sponsoredPackage.create({ data: pkg })
    console.log(`✅ 创建赞助套餐: ${pkg.displayName}`)
  }

  console.log('🎉 赞助套餐初始化完成！')
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
