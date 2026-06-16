export type Tool = {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  examples?: { prompt: string; image_url: string }[];
  needs_vpn: boolean;
  languages: string[];
  rating?: number;
  rating_count?: number;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  best_for?: string[];
  commission_rate?: number;
  commission_type?: 'recurring' | 'one-time';
  commission_duration?: number;
};

// CTA A/B test variants
export const ctaVariants = {
  A: 'Get Started for Free',
  B: 'Get Started for Free',
};

// Helper function to check if a tool has affiliate link (environment variable or JSON field)
export const hasAffiliateLink = (tool: Tool): boolean => {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'Rytr') {
    shortEnvVarName = 'AFFILIATE_RYTR';
  } else if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return !!(envLink || tool.affiliate_link);
};

// Helper function to get affiliate link for a tool with UTM parameters
export const getAffiliateLink = (tool: Tool): string => {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'Rytr') {
    shortEnvVarName = 'AFFILIATE_RYTR';
  } else if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  const baseLink = envLink || tool.affiliate_link;
  
  if (!baseLink) return '';
  
  try {
    const url = new URL(baseLink);
    url.searchParams.set('utm_source', 'useaitools');
    url.searchParams.set('utm_medium', 'referral');
    url.searchParams.set('utm_campaign', 'staff_pick');
    return url.toString();
  } catch {
    return baseLink;
  }
};

// Sort tools by commission value (high-commission first)
export const sortByCommissionValue = (tools: Tool[]): Tool[] => {
  return [...tools].sort((a, b) => {
    const aHasAffiliate = hasAffiliateLink(a);
    const bHasAffiliate = hasAffiliateLink(b);
    
    // If both have affiliate links, sort by commission rate
    if (aHasAffiliate && bHasAffiliate) {
      const aRate = a.commission_rate || 0;
      const bRate = b.commission_rate || 0;
      
      // Calculate effective value: rate * duration (for recurring) or just rate (for one-time)
      const aValue = a.commission_type === 'recurring' 
        ? aRate * (a.commission_duration || 1)
        : aRate;
      const bValue = b.commission_type === 'recurring'
        ? bRate * (b.commission_duration || 1)
        : bRate;
      
      return bValue - aValue;
    }
    
    // Affiliate tools come before non-affiliate tools
    if (aHasAffiliate && !bHasAffiliate) return -1;
    if (!aHasAffiliate && bHasAffiliate) return 1;
    
    // Neither has affiliate, maintain original order
    return 0;
  });
};

export const getCategoryColors = (category: string) => {
  switch (category) {
    case 'Writing':
      return {
        bg: 'bg-blue-500',
        bgDark: 'bg-blue-500/20',
        text: 'text-blue-300',
        textLight: 'text-blue-600',
        border: 'border-blue-300',
        ring: 'hover:shadow-blue-500/20',
        shadow: 'rgba(59, 130, 246, 0.4)',
      };
    case 'Image':
      return {
        bg: 'bg-violet-500',
        bgDark: 'bg-violet-500/20',
        text: 'text-violet-300',
        textLight: 'text-violet-600',
        border: 'border-violet-300',
        ring: 'hover:shadow-violet-500/20',
        shadow: 'rgba(139, 92, 246, 0.4)',
      };
    case 'Productivity':
      return {
        bg: 'bg-teal-500',
        bgDark: 'bg-teal-500/20',
        text: 'text-teal-300',
        textLight: 'text-teal-600',
        border: 'border-teal-300',
        ring: 'hover:shadow-teal-500/20',
        shadow: 'rgba(20, 184, 166, 0.4)',
      };
    case 'Code':
      return {
        bg: 'bg-orange-500',
        bgDark: 'bg-orange-500/20',
        text: 'text-orange-300',
        textLight: 'text-orange-600',
        border: 'border-orange-300',
        ring: 'hover:shadow-orange-500/20',
        shadow: 'rgba(249, 115, 22, 0.4)',
      };
    case 'Audio':
      return {
        bg: 'bg-pink-500',
        bgDark: 'bg-pink-500/20',
        text: 'text-pink-300',
        textLight: 'text-pink-600',
        border: 'border-pink-300',
        ring: 'hover:shadow-pink-500/20',
        shadow: 'rgba(236, 72, 153, 0.4)',
      };
    case 'Video':
      return {
        bg: 'bg-indigo-500',
        bgDark: 'bg-indigo-500/20',
        text: 'text-indigo-300',
        textLight: 'text-indigo-600',
        border: 'border-indigo-300',
        ring: 'hover:shadow-indigo-500/20',
        shadow: 'rgba(99, 102, 241, 0.4)',
      };
    default:
      return {
        bg: 'bg-slate-500',
        bgDark: 'bg-slate-500/20',
        text: 'text-slate-300',
        textLight: 'text-slate-600',
        border: 'border-slate-300',
        ring: 'hover:shadow-slate-500/20',
        shadow: 'rgba(100, 116, 139, 0.4)',
      };
  }
};

export const getPricingColors = (pricing: string) => {
  switch (pricing) {
    case 'Free':
      return {
        bg: 'bg-green-500',
        text: 'text-white',
      };
    case 'Freemium':
      return {
        bg: 'bg-emerald-500',
        text: 'text-white',
      };
    case 'Free Trial':
      return {
        bg: 'bg-blue-500',
        text: 'text-white',
      };
    case 'Paid':
      return {
        bg: 'bg-orange-500',
        text: 'text-white',
      };
    case 'Open Source':
      return {
        bg: 'bg-purple-500',
        text: 'text-white',
      };
    default:
      return {
        bg: 'bg-slate-500',
        text: 'text-white',
      };
  }
};

export const getSkillLevelColors = (level: 'beginner' | 'intermediate' | 'advanced') => {
  switch (level) {
    case 'beginner':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        label: 'Beginner Friendly',
      };
    case 'intermediate':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        label: 'Intermediate',
      };
    case 'advanced':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        label: 'Advanced',
      };
    default:
      return {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-600 dark:text-slate-300',
        label: 'All Levels',
      };
  }
};

// Synonym map for search enhancement
export const searchSynonyms: Record<string, string[]> = {
  'photo': ['image', 'picture', 'visual'],
  'picture': ['image', 'photo', 'visual'],
  'image': ['photo', 'picture', 'visual'],
  'video': ['movie', 'film', 'animation'],
  'audio': ['music', 'sound', 'voice', 'speech'],
  'voice': ['audio', 'speech', 'tts'],
  'writing': ['text', 'content', 'copy', 'writer'],
  'writer': ['writing', 'text', 'content'],
  'code': ['programming', 'developer', 'coding'],
  'coding': ['code', 'programming', 'developer'],
  'text': ['writing', 'content', 'writer'],
  'music': ['audio', 'sound'],
  'art': ['image', 'design', 'creative'],
  'design': ['image', 'art', 'creative'],
};

// Levenshtein distance for typo tolerance
export const levenshtein = (a: string, b: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i-1] === a[j-1]
        ? matrix[i-1][j-1]
        : Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
    }
  }
  return matrix[b.length][a.length];
};

// Enhanced search matching
export const fuzzyMatch = (text: string, query: string): { match: boolean; score: number } => {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  if (lowerText.includes(lowerQuery)) {
    const index = lowerText.indexOf(lowerQuery);
    return { match: true, score: index === 0 ? 100 : 80 };
  }
  
  const synonyms = searchSynonyms[lowerQuery];
  if (synonyms) {
    for (const syn of synonyms) {
      if (lowerText.includes(syn)) {
        return { match: true, score: 60 };
      }
    }
  }
  
  const words = lowerText.split(/\s+/);
  for (const word of words) {
    if (word.length >= 3 && lowerQuery.length >= 3) {
      const dist = levenshtein(word.substring(0, lowerQuery.length + 2), lowerQuery);
      if (dist <= 1) {
        return { match: true, score: 40 };
      }
    }
  }
  
  return { match: false, score: 0 };
};
