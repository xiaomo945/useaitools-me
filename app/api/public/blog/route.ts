import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 公开 API - 获取博客文章列表
 * GET /api/public/blog
 * 
 * 查询参数：
 * - page: 页码（默认 1）
 * - limit: 每页数量（默认 20，最大 100）
 * - category: 分类筛选
 * - tag: 标签筛选
 * - search: 搜索关键词
 * 
 * 示例：
 * GET /api/public/blog?page=1&limit=10&category=writing&search=ai
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {
      isPublished: true
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (tag) {
      where.tags = {
        contains: tag
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } }
      ]
    }

    // 获取博客文章列表
    const posts = await prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        publishedAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        coverImageAlt: true,
        publishedAt: true,
        readingTime: true,
        viewCount: true,
        tags: true,
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        author: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    // 获取总数
    const total = await prisma.blogPost.count({ where })

    // 获取所有标签（用于筛选）
    const allPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { tags: true }
    })

    const tagCounts = new Map<string, number>()
    allPosts.forEach(post => {
      if (post.tags) {
        const tags = post.tags.split(',').map(t => t.trim()).filter(t => t)
        tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
        })
      }
    })

    const tags = Array.from(tagCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      success: true,
      data: {
        posts: posts.map(post => ({
          ...post,
          tags: post.tags ? post.tags.split(',').map(t => t.trim()).filter(t => t) : []
        })),
        tags,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })
  } catch (error) {
    console.error('公开 API 获取博客列表失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取博客列表失败',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
