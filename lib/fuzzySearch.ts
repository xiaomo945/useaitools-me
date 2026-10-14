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
 * 工具检索：分词 + 大小写不敏感 + 拼写容错
 * 检索范围：name / description / description_en / category / best_for / examples
 */

// 按非字母数字切词（保留拉丁扩展字符与 CJK）
const TOKEN_SPLIT = /[^a-z0-9À-ɏ一-鿿]+/g;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(TOKEN_SPLIT)
    .filter(Boolean);
}

interface ToolIndex {
  tool: any;
  nameTokens: string[];
  textTokens: string[];
  textTokenSet: Set<string>;
}

let indexCacheKey: readonly any[] | null = null;
let indexCache: ToolIndex[] | null = null;

function getIndex(tools: readonly any[]): ToolIndex[] {
  if (indexCacheKey === tools && indexCache) return indexCache;

  indexCache = tools.map(tool => {
    const nameTokens = tokenize(tool.name || '');
    const textTokens = tokenize(
      [
        tool.description || '',
        tool.description_en || '',
        tool.category || '',
        (tool.best_for || []).join(' '),
        (tool.examples || []).map((e: any) => e?.prompt || '').join(' '),
      ].join(' ')
    );
    return { tool, nameTokens, textTokens, textTokenSet: new Set(textTokens) };
  });
  indexCacheKey = tools;
  return indexCache;
}

/** 允许的编辑距离：短词更严格，避免误召回 */
function allowedDistance(tokenLength: number): number {
  if (tokenLength <= 4) return 1;
  if (tokenLength <= 8) return 1;
  return 2;
}

/** 单个查询词在一批 token 上的最佳得分 */
function scoreToken(qt: string, tokens: string[], isName: boolean): number {
  for (const t of tokens) {
    if (t === qt) return isName ? 12 : 5;
  }
  if (qt.length >= 2) {
    for (const t of tokens) {
      if (t.startsWith(qt)) return isName ? 9 : 4;
    }
  }
  // 拼写容错：只比较首字母相同、长度接近的 token
  const maxDist = allowedDistance(qt.length);
  let best = 0;
  for (const t of tokens) {
    if (t[0] !== qt[0]) continue;
    if (Math.abs(t.length - qt.length) > maxDist) continue;
    if (levenshteinDistance(qt, t) <= maxDist) {
      best = Math.max(best, isName ? 6 : 2);
      break;
    }
  }
  return best;
}

export interface ToolSearchResult {
  tools: any[];
  /** true 表示没有全部命中，已放宽为「命中任一词」的部分匹配 */
  relaxed: boolean;
}

/**
 * 检索工具：多查询词默认要求全部命中（AND），
 * 全部命中为空时自动放宽为部分命中（OR），保证不会一搜就空。
 */
export function searchTools(tools: readonly any[], query: string): ToolSearchResult {
  const q = (query || '').trim();
  if (!q) return { tools: [...tools], relaxed: false };

  const queryTokens = tokenize(q);
  if (queryTokens.length === 0) return { tools: [...tools], relaxed: false };

  const index = getIndex(tools);
  const scored: Array<{ tool: any; score: number; hits: number }> = [];

  for (const entry of index) {
    let score = 0;
    let hits = 0;
    for (const qt of queryTokens) {
      const nameScore = scoreToken(qt, entry.nameTokens, true);
      const textScore = nameScore > 0 ? 0 : scoreToken(qt, entry.textTokens, false);
      const best = Math.max(nameScore, textScore);
      if (best > 0) {
        hits += 1;
        score += best;
      }
    }
    if (hits > 0) scored.push({ tool: entry.tool, score, hits });
  }

  const full = scored.filter(s => s.hits === queryTokens.length);
  const pool = full.length > 0 ? full : scored;
  const relaxed = full.length === 0 && scored.length > 0 && queryTokens.length > 1;

  pool.sort((a, b) => b.score - a.score || (a.tool.name || '').localeCompare(b.tool.name || ''));
  return { tools: pool.map(s => s.tool), relaxed };
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
