/**
 * 联盟营销佣金优先级工具
 * 用于识别高佣金工具并优先展示
 */

// 已知的高佣金联盟计划（佣金率 > 25%）
export const HIGH_COMMISSION_TOOLS = new Set([
  'RYTR',           // 30% 循环佣金（12个月）
  'VEED',           // 40% 佣金（单笔最高 $50）
  'MURF',           // 高佣金计划
  'PICTORY',        // 高佣金计划
  'GRAMMARLY',      // 联盟计划
]);

// 佣金率映射（用于排序权重）
export const COMMISSION_RATES: Record<string, number> = {
  'VEED': 40,        // 40%
  'RYTR': 30,        // 30% 循环
  'MURF': 30,        // 估计 30%
  'PICTORY': 30,     // 估计 30%
  'GRAMMARLY': 20,   // 估计 20%
};

/**
 * 检查工具是否有联盟链接（高佣金）
 */
export function hasHighCommission(tool: any): boolean {
  const toolName = (tool.name || '').toUpperCase();
  
  // 检查是否在已知高佣金列表中
  for (const highCommTool of HIGH_COMMISSION_TOOLS) {
    if (toolName.includes(highCommTool)) {
      return true;
    }
  }
  
  // 检查是否有环境变量联盟链接
  const envVarName = `AFFILIATE_${toolName.replace(/\s+/g, '_')}`;
  if (process.env[envVarName]) {
    return true;
  }
  
  // 检查工具数据中的 affiliate_link 字段
  if (tool.affiliate_link && tool.affiliate_link.trim() !== '') {
    return true;
  }
  
  return false;
}

/**
 * 获取工具的佣金率（用于排序权重）
 */
export function getCommissionRate(tool: any): number {
  const toolName = (tool.name || '').toUpperCase();
  
  for (const [name, rate] of Object.entries(COMMISSION_RATES)) {
    if (toolName.includes(name)) {
      return rate;
    }
  }
  
  // 有联盟链接但未知佣金率，默认 15%
  if (hasHighCommission(tool)) {
    return 15;
  }
  
  return 0;
}

/**
 * 计算工具的推荐分数（综合考虑评分、佣金率、点击率）
 */
export function calculateRecommendationScore(tool: any): number {
  const rating = tool.rating || 4.0;
  const ratingCount = tool.rating_count || 0;
  const commissionRate = getCommissionRate(tool);
  const hasAffiliate = hasHighCommission(tool) ? 1 : 0;
  
  // 基础分 = 评分 * 100 + 评价数 * 0.1
  const baseScore = rating * 100 + Math.min(ratingCount * 0.1, 50);
  
  // 佣金加成 = 佣金率 * 2（最高 80 分）
  const commissionBonus = Math.min(commissionRate * 2, 80);
  
  // 联盟链接加成 = 20 分
  const affiliateBonus = hasAffiliate * 20;
  
  return baseScore + commissionBonus + affiliateBonus;
}

/**
 * 按佣金优先级排序工具列表
 */
export function sortByCommissionPriority<T extends any>(tools: T[]): T[] {
  return [...tools].sort((a, b) => {
    const scoreA = calculateRecommendationScore(a);
    const scoreB = calculateRecommendationScore(b);
    return scoreB - scoreA;
  });
}

/**
 * 获取工具的环境变量联盟链接
 */
export function getAffiliateLinkFromEnv(tool: any): string {
  const toolName = (tool.name || '').toUpperCase().replace(/\s+/g, '_');
  const envVarName = `AFFILIATE_${toolName}`;
  
  // 短变量名映射
  const shortVarMap: Record<string, string> = {
    'RYTR': 'AFFILIATE_RYTR',
    'VEED': 'AFFILIATE_VEED',
    'MURF': 'AFFILIATE_MURF',
    'PICTORY': 'AFFILIATE_PICTORY',
    'GRAMMARLY': 'AFFILIATE_GRAMMARLY',
  };
  
  for (const [key, envVar] of Object.entries(shortVarMap)) {
    if (toolName.includes(key) && process.env[envVar]) {
      return process.env[envVar]!;
    }
  }
  
  return process.env[envVarName] || tool.affiliate_link || '';
}
