'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface MembershipPlan {
  id: string
  name: string
  displayName: string
  description: string | null
  price: number
  currency: string
  interval: string
  features: string[]
  isPopular: boolean
}

interface UserMembership {
  id: string
  planName: string
  planLevel: string
  startDate: Date
  endDate: Date
  status: string
}

export default function MembershipPage() {
  const { data: session } = useSession()
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [userMembership, setUserMembership] = useState<UserMembership | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    fetchMembership()
  }, [])

  const fetchMembership = async () => {
    try {
      const res = await fetch('/api/membership')
      const data = await res.json()
      setPlans(data.plans)
      setUserMembership(data.userMembership)
    } catch (error) {
      console.error('Failed to fetch membership:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      alert('请先登录')
      return
    }

    setSubscribing(true)
    try {
      const res = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, paymentMethod: 'demo' })
      })

      const data = await res.json()

      if (res.ok) {
        alert('订阅成功！')
        fetchMembership()
      } else {
        alert(data.error || '订阅失败')
      }
    } catch (error) {
      console.error('Failed to subscribe:', error)
      alert('订阅失败')
    } finally {
      setSubscribing(false)
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
            会员计划
          </h1>
          <p className="text-xl text-gray-600">
            选择适合您的计划，解锁更多高级功能
          </p>
        </div>

        {/* Current Membership */}
        {userMembership && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    当前会员：{userMembership.planName}
                  </h2>
                  <p className="text-blue-100">
                    有效期至：{new Date(userMembership.endDate).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {userMembership.status === 'active' ? '✓ 活跃' : userMembership.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.isPopular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold">
                  推荐
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.displayName}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">
                    /{plan.interval === 'monthly' ? '月' : '年'}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
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

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={subscribing || (userMembership !== null && userMembership.planLevel === plan.name)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    userMembership && userMembership.planLevel === plan.name
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : plan.isPopular
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {userMembership && userMembership.planLevel === plan.name
                    ? '当前计划'
                    : plan.price === 0
                    ? '免费开始'
                    : '立即订阅'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            功能对比
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    功能
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    免费版
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    专业版
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    企业版
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">工具列表访问</td>
                  <td className="px-6 py-4 text-center text-green-500">✓</td>
                  <td className="px-6 py-4 text-center text-green-500">✓</td>
                  <td className="px-6 py-4 text-center text-green-500">✓</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">收藏数量</td>
                  <td className="px-6 py-4 text-center text-gray-600">10个</td>
                  <td className="px-6 py-4 text-center text-gray-600">无限</td>
                  <td className="px-6 py-4 text-center text-gray-600">无限</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">工具对比</td>
                  <td className="px-6 py-4 text-center text-red-500">✗</td>
                  <td className="px-6 py-4 text-center text-green-500">✓</td>
                  <td className="px-6 py-4 text-center text-green-500">✓</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">API 访问</td>
                  <td className="px-6 py-4 text-center text-red-500">✗</td>
                  <td className="px-6 py-4 text-center text-red-500">✗</td>
                  <td className="px-6 py-4 text-center text-green-500">✓</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">团队协作</td>
                  <td className="px-6 py-4 text-center text-red-500">✗</td>
                  <td className="px-6 py-4 text-center text-red-500">✗</td>
                  <td className="px-6 py-4 text-center text-green-500">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
