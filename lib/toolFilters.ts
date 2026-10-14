// 工具筛选：纯函数，可脱离 React 单独测试
// 数据来源完全依赖 data/tools.json 已有字段，不做任何推断/伪造

import type { Tool } from '@/types';

export const CATEGORIES = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];
export const PRICING_OPTIONS = ['Free', 'Freemium', 'Free Trial', 'Paid', 'Open Source', 'Beta'];

export type VpnFilter = 'all' | 'no' | 'yes';

export interface ToolFilterState {
  categories: string[];
  pricing: string[];
  /** 'no' = 免梯子（needs_vpn === false），'yes' = 需梯子 */
  vpn: VpnFilter;
  skillLevels: string[];
  /** 仅看支持中文（languages 含 Chinese）的工具 */
  chineseOnly: boolean;
}

export const DEFAULT_FILTERS: ToolFilterState = {
  categories: [],
  pricing: [],
  vpn: 'all',
  skillLevels: [],
  chineseOnly: false,
};

export const SKILL_LEVEL_OPTIONS = [
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '进阶' },
  { value: 'advanced', label: '专业' },
] as const;

export const VPN_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'no', label: '免梯子' },
  { value: 'yes', label: '需梯子' },
] as const;

export function supportsChinese(tool: Pick<Tool, 'languages'>): boolean {
  return (tool.languages || []).some(l => /chinese|中文/i.test(l));
}

export function matchesFilters(tool: Tool, f: ToolFilterState): boolean {
  if (f.categories.length > 0 && !f.categories.includes(tool.category)) return false;
  if (f.pricing.length > 0 && !f.pricing.includes(tool.pricing)) return false;
  if (f.vpn === 'no' && tool.needs_vpn !== false) return false;
  if (f.vpn === 'yes' && tool.needs_vpn !== true) return false;
  // 63 条工具缺 skill_level，选中该维度时这些工具不参与（不猜测、不补默认值）
  if (f.skillLevels.length > 0 && (!tool.skill_level || !f.skillLevels.includes(tool.skill_level))) return false;
  if (f.chineseOnly && !supportsChinese(tool)) return false;
  return true;
}

export function applyToolFilters<T extends Tool>(tools: readonly T[], f: ToolFilterState): T[] {
  return tools.filter(t => matchesFilters(t, f));
}

export function countActiveFilters(f: ToolFilterState): number {
  return (
    f.categories.length +
    f.pricing.length +
    f.skillLevels.length +
    (f.vpn !== 'all' ? 1 : 0) +
    (f.chineseOnly ? 1 : 0)
  );
}

const CSV_KEYS = ['cat', 'price', 'level'] as const;

/**
 * 从 URL query 还原筛选状态，便于分享/收藏筛选结果
 */
export function parseFiltersFromParams(params: URLSearchParams): ToolFilterState {
  const csv = (key: string): string[] =>
    (params.get(key) || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

  const vpnRaw = params.get('vpn') || 'all';
  const vpn: VpnFilter = vpnRaw === 'no' || vpnRaw === 'yes' ? vpnRaw : 'all';

  return {
    categories: csv('cat'),
    pricing: csv('price'),
    vpn,
    skillLevels: csv('level'),
    chineseOnly: params.get('zh') === '1',
  };
}

/**
 * 把筛选状态写回 URL query（只写非默认值，保持链接干净）
 */
export function writeFiltersToParams(params: URLSearchParams, f: ToolFilterState): URLSearchParams {
  CSV_KEYS.forEach(key => params.delete(key));
  params.delete('vpn');
  params.delete('zh');

  if (f.categories.length > 0) params.set('cat', f.categories.join(','));
  if (f.pricing.length > 0) params.set('price', f.pricing.join(','));
  if (f.skillLevels.length > 0) params.set('level', f.skillLevels.join(','));
  if (f.vpn !== 'all') params.set('vpn', f.vpn);
  if (f.chineseOnly) params.set('zh', '1');

  return params;
}
