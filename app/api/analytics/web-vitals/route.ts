import { NextRequest, NextResponse } from 'next/server';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
  url: string;
  timestamp: string;
}

// 内存存储用于开发环境（生产环境应使用数据库）
const metricsStore: WebVitalMetric[] = [];
const MAX_STORE_SIZE = 10000;

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json();

    // 验证数据
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }

    // 开发环境：存储到内存
    if (process.env.NODE_ENV === 'development') {
      metricsStore.push(metric);
      
      // 限制存储大小
      if (metricsStore.length > MAX_STORE_SIZE) {
        metricsStore.shift();
      }

      console.log('[Web Vitals]', {
        metric: metric.name,
        value: metric.value.toFixed(2),
        rating: metric.rating,
        url: metric.url,
      });
    }

    // 生产环境：可以集成到外部监控服务
    // 例如：Vercel Analytics, Datadog, New Relic 等
    if (process.env.NODE_ENV === 'production') {
      // TODO: 集成外部监控服务
      // await sendToExternalService(metric);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Web Vitals API error:', error);
    return NextResponse.json(
      { error: 'Failed to process metric' },
      { status: 500 }
    );
  }
}

// GET 端点用于查看收集的指标（仅开发环境）
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  // 按指标名称分组统计
  const stats = metricsStore.reduce((acc, metric) => {
    if (!acc[metric.name]) {
      acc[metric.name] = {
        count: 0,
        sum: 0,
        good: 0,
        'needs-improvement': 0,
        poor: 0,
      };
    }
    acc[metric.name].count++;
    acc[metric.name].sum += metric.value;
    acc[metric.name][metric.rating]++;
    return acc;
  }, {} as Record<string, any>);

  // 计算平均值
  const summary = Object.entries(stats).map(([name, data]: [string, any]) => ({
    name,
    count: data.count,
    avg: data.sum / data.count,
    good: data.good,
    needsImprovement: data['needs-improvement'],
    poor: data.poor,
  }));

  return NextResponse.json({
    total: metricsStore.length,
    summary,
    recent: metricsStore.slice(-50),
  });
}
