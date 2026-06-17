// 定义 affiliate 函数需要的最小工具类型
type AffiliateTool = {
  name: string;
  affiliate_link?: string;
  url?: string;
};

/**
 * 检查工具是否有联盟链接
 */
export function hasAffiliateLink(tool: AffiliateTool): boolean {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  
  if (tool.name.includes('Rytr')) shortEnvVarName = 'AFFILIATE_RYTR';
  else if (tool.name.includes('VEED')) shortEnvVarName = 'AFFILIATE_VEED';
  else if (tool.name.includes('Murf')) shortEnvVarName = 'AFFILIATE_MURF';
  else if (tool.name.includes('Pictory')) shortEnvVarName = 'AFFILIATE_PICTORY';
  else if (tool.name.includes('Grammarly')) shortEnvVarName = 'AFFILIATE_GRAMMARLY';
  
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return !!(envLink || tool.affiliate_link);
}

/**
 * 获取工具的联盟链接
 */
export function getAffiliateLink(tool: AffiliateTool): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  
  if (tool.name.includes('Rytr')) shortEnvVarName = 'AFFILIATE_RYTR';
  else if (tool.name.includes('VEED')) shortEnvVarName = 'AFFILIATE_VEED';
  else if (tool.name.includes('Murf')) shortEnvVarName = 'AFFILIATE_MURF';
  else if (tool.name.includes('Pictory')) shortEnvVarName = 'AFFILIATE_PICTORY';
  else if (tool.name.includes('Grammarly')) shortEnvVarName = 'AFFILIATE_GRAMMARLY';
  
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return envLink || tool.affiliate_link || tool.url || '';
}
