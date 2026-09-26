import { createSeedClient } from './seed-client'

const prisma = createSeedClient()

async function main() {
  console.log('🌱 开始初始化赞助套餐...')

  // 清理旧数据
  await prisma.sponsoredPackage.deleteMany()
  console.log('✅ 已清理旧赞助套餐')

  // 创建赞助套餐
  const packages = [
    {
      name: 'basic',
      displayName: 'Essential',
      description: 'For indie developers and side projects',
      price: 50,
      currency: 'USD',
      duration: 30,
      position: 'sidebar',
      features: JSON.stringify([
        'Sidebar placement for 30 days',
        '10,000+ impressions per month',
        'Click-through tracking',
        'Email support'
      ]),
      isActive: true
    },
    {
      name: 'pro',
      displayName: 'Featured',
      description: 'For growing teams launching a product',
      price: 150,
      currency: 'USD',
      duration: 30,
      position: 'header',
      features: JSON.stringify([
        'Homepage hero placement for 30 days',
        '50,000+ impressions per month',
        'Click-through tracking',
        'Priority positioning',
        'Priority email support'
      ]),
      isActive: true
    },
    {
      name: 'premium',
      displayName: 'Enterprise',
      description: 'For companies running a serious launch',
      price: 300,
      currency: 'USD',
      duration: 30,
      position: 'inline',
      features: JSON.stringify([
        'In-content placement for 30 days',
        '100,000+ impressions per month',
        'Click-through tracking',
        'Best available positioning',
        'Dedicated account contact',
        'Custom performance report',
        'Multi-placement coverage'
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
