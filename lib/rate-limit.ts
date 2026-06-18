/**
 * 通用速率限制工具（内存版，适用于单实例）
 *
 * 生产环境多实例部署建议改用 Upstash Redis 或 Vercel Edge Config。
 * 当前实现：滑动窗口算法，每 IP 独立计数。
 */

const RATE_LIMIT_MAP = new Map<string, number[]>();

interface RateLimitOptions {
  /** 时间窗口（毫秒），默认 60 秒 */
  windowMs?: number;
  /** 窗口内最大请求数，默认 5 */
  max?: number;
}

/**
 * 检查 IP 是否超过速率限制
 * @returns { allowed: boolean; remaining: number }
 */
export function checkRateLimit(
  ip: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number } {
  const windowMs = options.windowMs ?? 60 * 1000;
  const max = options.max ?? 5;
  const now = Date.now();
  const requests = RATE_LIMIT_MAP.get(ip) || [];

  // 清理过期记录
  const recentRequests = requests.filter((ts) => now - ts < windowMs);

  if (recentRequests.length >= max) {
    return { allowed: false, remaining: 0 };
  }

  recentRequests.push(now);
  RATE_LIMIT_MAP.set(ip, recentRequests);
  return { allowed: true, remaining: max - recentRequests.length };
}

/**
 * 从 Request 提取客户端 IP
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || 'unknown';
}

/**
 * 验证 URL 格式
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 验证字符串长度
 */
export function isValidLength(
  value: string,
  min: number,
  max: number
): boolean {
  return typeof value === 'string' && value.length >= min && value.length <= max;
}
