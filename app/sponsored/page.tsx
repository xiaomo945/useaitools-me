'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface SponsoredPackage {
  id: string
  name: string
  displayName: string
  description: string | null
  price: number
  currency: string
  duration: number
  position: string
  features: string[]
}

interface SponsoredOrder {
  id: string
  title: string
  status: string
  startDate: string
  endDate: string
  amount: number
  clickCount: number
  viewCount: number
  package: {
    name: string
    position: string
  }
}

export default function SponsoredPage() {
  const { data: session } = useSession()
  const [packages, setPackages] = useState<SponsoredPackage[]>([])
  const [orders, setOrders] = useState<SponsoredOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetUrl: '',
    imageUrl: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [packagesRes, ordersRes] = await Promise.all([
        fetch('/api/sponsored-packages'),
        session ? fetch('/api/sponsored-orders') : Promise.resolve(null)
      ])

      const packagesData = await packagesRes.json()
      setPackages(packagesData.packages || [])

      if (ordersRes) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert('请先登录')
      return
    }
    if (!selectedPackage) {
      alert('请选择赞助套餐')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/sponsored-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          title: formData.title,
          description: formData.description,
          targetUrl: formData.targetUrl,
          imageUrl: formData.imageUrl || null
        })
      })

      const data = await res.json()
      if (res.ok) {
        alert('赞助订单创建成功！')
        setShowForm(false)
        setFormData({ title: '', description: '', targetUrl: '', imageUrl: '' })
        setSelectedPackage('')
        fetchData()
      } else {
        alert(data.error || '创建失败')
      }
    } catch (error) {
      console.error('Failed to submit:', error)
      alert('提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            赞助位销售
          </h1>
          <p className="text-xl text-gray-600">
            推广您的 AI 工具，触达数万精准用户
          </p>
        </div>

        {/* My Orders */}
        {session && orders.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              我的赞助订单
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      套餐
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      有效期
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      数据
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.package.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'active' ? 'bg-green-100 text-green-800' :
                          order.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'active' ? '活跃' :
                           order.status === 'expired' ? '已过期' : order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.startDate && new Date(order.startDate).toLocaleDateString('zh-CN')}
                        {' - '}
                        {order.endDate && new Date(order.endDate).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        点击: {order.clickCount} | 浏览: {order.viewCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Packages */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              赞助套餐
            </h2>
            {session && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {showForm ? '取消' : '购买赞助位'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                  pkg.name === 'pro' ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {pkg.name === 'pro' && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold">
                    推荐
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.displayName}
                  </h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${pkg.price}
                    </span>
                    <span className="text-gray-600">
                      /{pkg.duration}天
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm font-semibold text-gray-700">
                      展示位置：{pkg.position}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {session && showForm && (
                    <button
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        selectedPackage === pkg.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {selectedPackage === pkg.id ? '已选择' : '选择此套餐'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Form */}
        {session && showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              填写赞助信息
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  赞助标题 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：最佳 AI 写作工具"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  赞助描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="简要描述您的产品或服务"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标链接 *
                </label>
                <input
                  type="url"
                  required
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-website.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图片链接
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-website.com/logo.png"
                />
              </div>

              {selectedPackage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    已选择套餐：<span className="font-semibold">{packages.find(p => p.id === selectedPackage)?.displayName}</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !selectedPackage}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? '提交中...' : '确认购买'}
              </button>
            </form>
          </div>
        )}

        {!session && (
          <div className="text-center bg-white rounded-lg shadow p-12">
            <p className="text-xl text-gray-600 mb-6">
              请先登录查看您的赞助订单
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
