// 模糊搜索工具函数

/**
 * 计算两个字符串的 Levenshtein 距离
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  // 创建动态规划表
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  
  // 初始化边界条件
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // 填充动态规划表
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // 删除
          dp[i][j - 1],     // 插入
          dp[i - 1][j - 1]  // 替换
        );
      }
    }
  }
  
  return dp[m][n];
}

/**
 * 计算模糊匹配得分（0-1之间，1为完全匹配）
 */
export function fuzzyMatchScore(query: string, target: string): number {
  const queryLower = query.toLowerCase().trim();
  const targetLower = target.toLowerCase();
  
  // 完全匹配
  if (targetLower === queryLower) return 1.0;
  
  // 包含匹配
  if (targetLower.includes(queryLower)) {
    // 开头匹配得分更高
    if (targetLower.startsWith(queryLower)) {
      return 0.95;
    }
    return 0.85;
  }
  
  // 单词级别匹配
  const queryWords = queryLower.split(/\s+/);
  const targetWords = targetLower.split(/\s+/);
  
  let matchedWords = 0;
  for (const qw of queryWords) {
    if (targetWords.some(tw => tw.includes(qw) || qw.includes(tw))) {
      matchedWords++;
    }
  }
  
  if (matchedWords === queryWords.length) {
    return 0.75;
  }
  
  // Levenshtein 距离匹配（用于拼写纠错）
  const distance = levenshteinDistance(queryLower, targetLower);
  const maxLength = Math.max(queryLower.length, targetLower.length);
  const similarity = 1 - distance / maxLength;
  
  // 只有相似度超过阈值才返回分数
  if (similarity > 0.6) {
    return similarity * 0.7; // 降低模糊匹配权重
  }
  
  return 0;
}

/**
 * 高亮搜索词
 */
export function highlightSearchTerm(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const queryLower = query.toLowerCase().trim();
  const textLower = text.toLowerCase();
  
  // 查找匹配位置
  const index = textLower.indexOf(queryLower);
  if (index === -1) return text;
  
  // 高亮匹配部分
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  
  return `${before}<mark class="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">${match}</mark>${after}`;
}

/**
 * 搜索建议生成器
 */
export function generateSearchSuggestions(
  query: string,
  tools: any[],
  blogPosts: any[],
  maxSuggestions: number = 8
): Array<{
  type: 'tool' | 'blog' | 'category' | 'suggestion';
  name: string;
  description?: string;
  category?: string;
  id?: number;
  score: number;
}> {
  const suggestions: any[] = [];
  const queryLower = query.toLowerCase().trim();
  
  if (!queryLower) return [];
  
  // 工具搜索
  tools.forEach(tool => {
    const nameScore = fuzzyMatchScore(queryLower, tool.name);
    const descScore = fuzzyMatchScore(queryLower, tool.description || '') * 0.5;
    const categoryScore = fuzzyMatchScore(queryLower, tool.category || '') * 0.3;
    
    const score = Math.max(nameScore, descScore, categoryScore);
    
    if (score > 0.3) {
      suggestions.push({
        type: 'tool',
        name: tool.name,
        description: tool.one_line_description || tool.description,
        category: tool.category,
        id: tool.id,
        score
      });
    }
  });
  
  // 博客搜索
  blogPosts.forEach(post => {
    const titleScore = fuzzyMatchScore(queryLower, post.title);
    const descScore = fuzzyMatchScore(queryLower, post.excerpt || '') * 0.5;
    
    const score = Math.max(titleScore, descScore);
    
    if (score > 0.3) {
      suggestions.push({
        type: 'blog',
        name: post.title,
        description: post.excerpt,
        category: post.category,
        id: post.id,
        score
      });
    }
  });
  
  // 分类建议
  const categories = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];
  categories.forEach(cat => {
    const score = fuzzyMatchScore(queryLower, cat);
    if (score > 0.5) {
      suggestions.push({
        type: 'category',
        name: cat,
        score
      });
    }
  });
  
  // 排序并返回前N个
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions);
}

/**
 * 拼写纠错建议
 */
export function getSpellingSuggestions(
  query: string,
  allTerms: string[]
): string[] {
  const queryLower = query.toLowerCase().trim();
  
  // 如果查询词已经足够短或已经匹配，不需要纠错
  if (queryLower.length < 3) return [];
  
  const suggestions: Array<{ term: string; score: number }> = [];
  
  allTerms.forEach(term => {
    const score = fuzzyMatchScore(queryLower, term);
    if (score > 0.6 && score < 1.0) {
      suggestions.push({ term, score });
    }
  });
  
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.term);
}
