import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/sponsored-packages - 获取赞助位套餐列表
export async function GET() {
  try {
    const packages = await prisma.sponsoredPackage.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        price: 'asc'
      }
    })

    // 解析 features JSON
    const packagesWithFeatures = packages.map((pkg: any) => ({
      ...pkg,
      features: JSON.parse(pkg.features)
    }))

    return NextResponse.json({
      success: true,
      packages: packagesWithFeatures
    })
  } catch (error) {
    console.error('Failed to fetch sponsored packages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sponsored packages' },
      { status: 500 }
    )
  }
}
