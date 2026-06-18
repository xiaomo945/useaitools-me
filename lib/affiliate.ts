/**
 * 联盟链接统一管理模块（单一来源）
 *
 * 消除 HomeClient/ToolCard/ToolSlugClient/ToolDetailClient/TopTools/scenes 等
 * 7+ 处重复实现的 hasAffiliateLink / getAffiliateLink 逻辑。
 *
 * 优先级：环境变量短名 > 环境变量全名 > tool.affiliate_link 字段
 */

/**
 * 最小工具接口 — 只包含联盟链接所需字段
 * 各组件可传入自己的 Tool 类型，只要包含 name 和 affiliate_link 即可
 */
export interface AffiliateTool {
  name: string;
  affiliate_link: string | null | undefined;
}

/**
 * 工具名 → 环境变量短名映射（处理包含关系，如 "Rytr Pro" → AFFILIATE_RYTR）
 */
const SHORT_NAME_RULES: Array<{ test: (name: string) => boolean; envVar: string }> = [
  { test: (n) => n.includes('Rytr'), envVar: 'AFFILIATE_RYTR' },
  { test: (n) => n.includes('VEED'), envVar: 'AFFILIATE_VEED' },
  { test: (n) => n.includes('Murf'), envVar: 'AFFILIATE_MURF' },
  { test: (n) => n.includes('Pictory'), envVar: 'AFFILIATE_PICTORY' },
  { test: (n) => n.includes('Grammarly'), envVar: 'AFFILIATE_GRAMMARLY' },
  { test: (n) => n.includes('Synthesia'), envVar: 'AFFILIATE_SYNTHESIA' },
  { test: (n) => n.includes('Descript'), envVar: 'AFFILIATE_DESCRIPT' },
  { test: (n) => n.includes('Notion'), envVar: 'AFFILIATE_NOTION' },
  { test: (n) => n.includes('QuillBot'), envVar: 'AFFILIATE_QUILLBOT' },
  { test: (n) => n.includes('ElevenLabs'), envVar: 'AFFILIATE_ELEVENLABS' },
  { test: (n) => n.includes('Jasper'), envVar: 'AFFILIATE_JASPER' },
  { test: (n) => n.includes('Copy.ai'), envVar: 'AFFILIATE_COPYAI' },
];

function getShortEnvVar(toolName: string): string {
  for (const rule of SHORT_NAME_RULES) {
    if (rule.test(toolName)) return rule.envVar;
  }
  return '';
}

function getFullEnvVar(toolName: string): string {
  return `AFFILIATE_${toolName.toUpperCase().replace(/\s+/g, '_')}`;
}

/**
 * 解析联盟链接原始值（不含 UTM）
 * 优先级：短名环境变量 > 全名环境变量 > tool.affiliate_link
 */
export function resolveAffiliateLink(tool: AffiliateTool): string {
  const shortVar = getShortEnvVar(tool.name);
  const fullVar = getFullEnvVar(tool.name);
  const envLink =
    (shortVar && process.env[shortVar]) || process.env[fullVar] || '';
  return envLink || tool.affiliate_link || '';
}

/**
 * 判断工具是否配置了联盟链接
 */
export function hasAffiliateLink(tool: AffiliateTool): boolean {
  return !!resolveAffiliateLink(tool);
}

/**
 * 获取带 UTM 追踪参数的联盟链接
 */
export function getAffiliateLink(tool: AffiliateTool): string {
  const baseLink = resolveAffiliateLink(tool);
  if (!baseLink) return '';

  try {
    const url = new URL(baseLink);
    url.searchParams.set('utm_source', 'useaitools');
    url.searchParams.set('utm_medium', 'referral');
    url.searchParams.set('utm_campaign', 'staff_pick');
    return url.toString();
  } catch {
    // baseLink 不是合法 URL（如相对路径），原样返回
    return baseLink;
  }
}

/**
 * 根据定价模型动态生成 CTA 文案
 */
export function getDynamicCTA(pricing: string, hasAffiliate: boolean): string {
  if (!hasAffiliate) return 'Visit Website';

  const pricingLower = pricing.toLowerCase();
  if (pricingLower.includes('free') || pricingLower.includes('open source')) {
    return 'Try Free';
  }
  if (pricingLower.includes('freemium')) {
    return 'Start Free Trial';
  }
  if (pricingLower.includes('paid') || pricingLower.includes('$')) {
    return 'View Pricing';
  }
  return 'Try It Free';
}
