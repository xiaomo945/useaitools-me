import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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

    // 从 JSON 文件加载博客文章
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json')
    let allPosts: any[] = []
    
    if (fs.existsSync(blogPostsPath)) {
      const data = fs.readFileSync(blogPostsPath, 'utf-8')
      allPosts = JSON.parse(data)
    }

    // 过滤已发布的文章
    let filteredPosts = allPosts.filter(post => post.isPublished !== false)

    // 分类筛选
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category?.toLowerCase() === category.toLowerCase()
      )
    }

    // 标签筛选
    if (tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase())
      )
    }

    // 搜索
    if (search) {
      const searchLower = search.toLowerCase()
      filteredPosts = filteredPosts.filter(post =>
        post.title?.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower)
      )
    }

    // 按发布日期排序（最新优先）
    filteredPosts.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.date || 0).getTime()
      const dateB = new Date(b.publishedAt || b.date || 0).getTime()
      return dateB - dateA
    })

    // 分页
    const total = filteredPosts.length
    const skip = (page - 1) * limit
    const posts = filteredPosts.slice(skip, skip + limit)

    // 提取所有标签
    const tagCounts = new Map<string, number>()
    allPosts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((t: string) => {
          tagCounts.set(t, (tagCounts.get(t) || 0) + 1)
        })
      }
    })

    const tags = Array.from(tagCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      success: true,
      data: {
        posts,
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
