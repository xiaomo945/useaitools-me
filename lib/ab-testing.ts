/**
 * 简易 A/B 测试框架
 * 基于 cookie 持久化的 variant 分配，确保用户始终看到同一个变体
 * 集成到 Plausible/Umami 等分析工具追踪事件
 */

import { cookies } from 'next/headers';

export type Experiment = {
  id: string;
  description: string;
  variants: string[];
};

export const experiments: Record<string, Experiment> = {
  cta_text: {
    id: 'cta_text',
    description: '工具卡片 CTA 按钮文案 A/B 测试',
    variants: ['visit_website', 'try_free', 'get_started'],
  },
  cta_color: {
    id: 'cta_color',
    description: '工具卡片 CTA 按钮颜色 A/B 测试',
    variants: ['emerald', 'indigo', 'slate'],
  },
};

// 简单的哈希函数：基于用户 ID 生成稳定的 variant 索引
function hashVariant(userId: string, variantsCount: number): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % variantsCount;
}

function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const COOKIE_NAME = 'ab_user_id';

/**
 * 在 Server Component 中获取或生成用户 ID
 */
export async function getOrCreateUserId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME);
  if (existing?.value) {
    return existing.value;
  }
  const newId = generateUserId();
  cookieStore.set(COOKIE_NAME, newId, {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  return newId;
}

/**
 * 为用户分配一个实验变体
 * @param experimentId 实验 ID
 * @returns 变体名称
 */
export async function getVariant(experimentId: string): Promise<string> {
  const experiment = experiments[experimentId];
  if (!experiment) {
    console.warn(`[A/B] Experiment "${experimentId}" not found`);
    return 'control';
  }
  const userId = await getOrCreateUserId();
  const variantIndex = hashVariant(userId, experiment.variants.length);
  return experiment.variants[variantIndex];
}

/**
 * 获取 CTA 按钮文案变体
 */
export async function getCtaText(): Promise<string> {
  const variant = await getVariant('cta_text');
  const ctaMap: Record<string, string> = {
    visit_website: 'Visit Website',
    try_free: 'Try It Free',
    get_started: 'Get Started',
  };
  return ctaMap[variant] || ctaMap.visit_website;
}

/**
 * 获取 CTA 按钮颜色变体
 */
export async function getCtaColor(): Promise<string> {
  const variant = await getVariant('cta_color');
  const colorMap: Record<string, { bg: string; hover: string }> = {
    emerald: { bg: 'bg-gradient-to-r from-emerald-500 to-teal-500', hover: 'hover:shadow-emerald-500/30' },
    indigo: { bg: 'bg-gradient-to-r from-indigo-500 to-violet-500', hover: 'hover:shadow-indigo-500/30' },
    slate: { bg: 'bg-gradient-to-r from-slate-700 to-slate-900', hover: 'hover:shadow-slate-500/30' },
  };
  return JSON.stringify(colorMap[variant] || colorMap.emerald);
}
