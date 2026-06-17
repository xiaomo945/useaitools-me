import { NextRequest, NextResponse } from 'next/server';

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  type: string;
}

// 内存存储用于开发环境（生产环境应使用数据库）
const errorsStore: ErrorReport[] = [];
const MAX_STORE_SIZE = 1000;

export async function POST(request: NextRequest) {
  try {
    const report: ErrorReport = await request.json();

    // 验证数据
    if (!report.message || !report.type) {
      return NextResponse.json(
        { error: 'Invalid error report' },
        { status: 400 }
      );
    }

    // 开发环境：存储到内存
    if (process.env.NODE_ENV === 'development') {
      errorsStore.push(report);
      
      // 限制存储大小
      if (errorsStore.length > MAX_STORE_SIZE) {
        errorsStore.shift();
      }

      console.error('[ErrorTracker]', {
        type: report.type,
        message: report.message,
        url: report.url,
      });
    }

    // 生产环境：可以集成到外部监控服务
    // 例如：Sentry, LogRocket, Datadog 等
    if (process.env.NODE_ENV === 'production') {
      // TODO: 集成外部错误监控服务
      // await sendToSentry(report);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking API error:', error);
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    );
  }
}

// GET 端点用于查看收集的错误（仅开发环境）
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  // 按类型分组统计
  const stats = errorsStore.reduce((acc, error) => {
    if (!acc[error.type]) {
      acc[error.type] = {
        count: 0,
        messages: new Set<string>(),
      };
    }
    acc[error.type].count++;
    acc[error.type].messages.add(error.message);
    return acc;
  }, {} as Record<string, any>);

  // 转换为数组
  const summary = Object.entries(stats).map(([type, data]: [string, any]) => ({
    type,
    count: data.count,
    uniqueMessages: data.messages.size,
  }));

  return NextResponse.json({
    total: errorsStore.length,
    summary,
    recent: errorsStore.slice(-50),
  });
}
