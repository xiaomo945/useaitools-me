// 工具子分类映射规则
// 根据工具描述和特征自动分配子分类

export interface SubcategoryRule {
  subcategory: string;
  subcategoryEn: string;
  keywords: string[];
  description: string;
}

export const subcategoryRules: Record<string, SubcategoryRule[]> = {
  Writing: [
    {
      subcategory: 'Content Writing',
      subcategoryEn: 'Content Writing',
      keywords: ['content writing', 'blog', 'article', 'post', 'long-form'],
      description: 'Tools for blog posts and long-form content creation'
    },
    {
      subcategory: 'Copywriting',
      subcategoryEn: 'Copywriting',
      keywords: ['copywriting', 'marketing', 'ad', 'advertisement', 'sales', 'conversion'],
      description: 'Ad copy, marketing content, and sales conversion copywriting'
    },
    {
      subcategory: 'SEO Writing',
      subcategoryEn: 'SEO Writing',
      keywords: ['seo', 'search engine', 'keyword', 'ranking', 'optimization'],
      description: 'SEO writing and keyword optimization tools'
    },
    {
      subcategory: 'Email Writing',
      subcategoryEn: 'Email Writing',
      keywords: ['email', 'newsletter', 'mail', 'outreach'],
      description: 'Email content, marketing emails, and outreach messages'
    },
    {
      subcategory: 'Creative Writing',
      subcategoryEn: 'Creative Writing',
      keywords: ['creative', 'story', 'fiction', 'novel', 'poetry', 'script'],
      description: 'Story, fiction, poetry, and script writing'
    },
    {
      subcategory: 'Academic Writing',
      subcategoryEn: 'Academic Writing',
      keywords: ['academic', 'research', 'paper', 'essay', 'study', 'education'],
      description: 'Academic papers, research reports, and educational content'
    }
  ],
  Image: [
    {
      subcategory: 'Image Generation',
      subcategoryEn: 'Image Generation',
      keywords: ['image generation', 'text to image', 'generate image', 'create image'],
      description: 'Text-to-image generation and AI painting tools'
    },
    {
      subcategory: 'Photo Editing',
      subcategoryEn: 'Photo Editing',
      keywords: ['photo editing', 'photo enhancement', 'retouch', 'beauty'],
      description: 'Photo retouching, beautification, and enhancement tools'
    },
    {
      subcategory: 'Design Tools',
      subcategoryEn: 'Design Tools',
      keywords: ['design', 'graphic design', 'layout', 'template'],
      description: 'Graphic design, visual creation, and template design'
    },
    {
      subcategory: 'Brand Design',
      subcategoryEn: 'Brand Design',
      keywords: ['brand', 'logo', 'identity', 'branding'],
      description: 'Brand identity, logo design, and visual identity systems'
    },
    {
      subcategory: 'Art Generation',
      subcategoryEn: 'Art Generation',
      keywords: ['art', 'artistic', 'painting', 'illustration', 'style'],
      description: 'Artistic style creation and illustration generation'
    },
    {
      subcategory: 'Background Removal',
      subcategoryEn: 'Background Removal',
      keywords: ['background removal', 'remove background', 'cutout', 'transparent'],
      description: 'Background cutout, transparent backgrounds, and image segmentation'
    }
  ],
  Video: [
    {
      subcategory: 'Video Editing',
      subcategoryEn: 'Video Editing',
      keywords: ['video editing', 'edit video', 'video editor', 'cut', 'trim'],
      description: 'Video editing and post-production tools'
    },
    {
      subcategory: 'Video Generation',
      subcategoryEn: 'Video Generation',
      keywords: ['video generation', 'text to video', 'create video', 'generate video'],
      description: 'Text-to-video generation and AI video creation'
    },
    {
      subcategory: 'Social Media Video',
      subcategoryEn: 'Social Media Video',
      keywords: ['social media', 'tiktok', 'instagram', 'youtube', 'short video', 'reels'],
      description: 'Short-form and social platform video production'
    },
    {
      subcategory: 'Video Marketing',
      subcategoryEn: 'Video Marketing',
      keywords: ['video marketing', 'advertisement', 'promo', 'commercial'],
      description: 'Marketing videos, ad spots, and promotional clips'
    },
    {
      subcategory: 'Animation',
      subcategoryEn: 'Animation',
      keywords: ['animation', 'animated', 'motion', 'cartoon', 'anime'],
      description: 'Animation, motion graphics, and cartoon production'
    },
    {
      subcategory: 'Video Effects',
      subcategoryEn: 'Video Effects',
      keywords: ['effects', 'vfx', 'visual effects', 'filter', 'transition'],
      description: 'Video effects, visual effects, filters, and transitions'
    }
  ],
  Audio: [
    {
      subcategory: 'Voice Generation',
      subcategoryEn: 'Voice Generation',
      keywords: ['voice generation', 'text to speech', 'tts', 'voiceover', 'speech'],
      description: 'Text-to-speech and AI voiceover tools'
    },
    {
      subcategory: 'Music Creation',
      subcategoryEn: 'Music Creation',
      keywords: ['music', 'compose', 'melody', 'song', 'instrumental'],
      description: 'Music composition, songwriting, and arrangement tools'
    },
    {
      subcategory: 'Audio Editing',
      subcategoryEn: 'Audio Editing',
      keywords: ['audio editing', 'edit audio', 'mix', 'master'],
      description: 'Audio editing, mixing, and mastering'
    },
    {
      subcategory: 'Podcast Tools',
      subcategoryEn: 'Podcast Tools',
      keywords: ['podcast', 'episode', 'show', 'broadcast'],
      description: 'Podcast production and audio show creation'
    },
    {
      subcategory: 'Sound Design',
      subcategoryEn: 'Sound Design',
      keywords: ['sound design', 'sound effect', 'sfx', 'foley'],
      description: 'Sound effect design and audio effects creation'
    },
    {
      subcategory: 'Noise Reduction',
      subcategoryEn: 'Noise Reduction',
      keywords: ['noise reduction', 'denoise', 'clean audio', 'enhance'],
      description: 'Audio noise reduction, sound enhancement, and clarity improvement'
    }
  ],
  Code: [
    {
      subcategory: 'Code Assistant',
      subcategoryEn: 'Code Assistant',
      keywords: ['code assistant', 'copilot', 'autocomplete', 'suggestion'],
      description: 'Code completion, smart suggestions, and coding assistance'
    },
    {
      subcategory: 'Code Generation',
      subcategoryEn: 'Code Generation',
      keywords: ['code generation', 'generate code', 'create code', 'boilerplate'],
      description: 'Code generation, template code, and scaffolding tools'
    },
    {
      subcategory: 'Development Tools',
      subcategoryEn: 'Development Tools',
      keywords: ['development', 'developer', 'debug', 'ide', 'editor'],
      description: 'Development environments, debugging tools, and IDE enhancements'
    },
    {
      subcategory: 'Security Tools',
      subcategoryEn: 'Security Tools',
      keywords: ['security', 'vulnerability', 'scan', 'audit', 'protect'],
      description: 'Code security scanning, vulnerability detection, and security audits'
    },
    {
      subcategory: 'Testing Tools',
      subcategoryEn: 'Testing Tools',
      keywords: ['testing', 'test', 'unit test', 'qa', 'quality assurance'],
      description: 'Unit testing, quality assurance, and automated testing'
    },
    {
      subcategory: 'Cloud Development',
      subcategoryEn: 'Cloud Development',
      keywords: ['cloud', 'serverless', 'deploy', 'infrastructure', 'devops'],
      description: 'Cloud development, serverless, and deployment tools'
    }
  ],
  Productivity: [
    {
      subcategory: 'Task Management',
      subcategoryEn: 'Task Management',
      keywords: ['task', 'todo', 'project management', 'workflow'],
      description: 'Task lists, project management, and workflows'
    },
    {
      subcategory: 'Team Collaboration',
      subcategoryEn: 'Team Collaboration',
      keywords: ['team', 'collaboration', 'communication', 'meeting'],
      description: 'Team collaboration, communication tools, and meeting management'
    },
    {
      subcategory: 'Content Management',
      subcategoryEn: 'Content Management',
      keywords: ['content management', 'cms', 'organize', 'schedule'],
      description: 'Content organization, publishing management, and scheduling'
    },
    {
      subcategory: 'Marketing Automation',
      subcategoryEn: 'Marketing Automation',
      keywords: ['marketing automation', 'campaign', 'funnel', 'lead'],
      description: 'Marketing automation, campaigns, and lead management'
    },
    {
      subcategory: 'Analytics',
      subcategoryEn: 'Analytics',
      keywords: ['analytics', 'data analysis', 'insight', 'report', 'metric'],
      description: 'Data analysis, report generation, and metric tracking'
    },
    {
      subcategory: 'Social Media Management',
      subcategoryEn: 'Social Media Management',
      keywords: ['social media', 'engagement', 'follower', 'post', 'schedule'],
      description: 'Social media management, audience engagement, and content scheduling'
    }
  ]
};

// 根据工具描述匹配子分类
export function matchSubcategory(category: string, description: string, bestFor?: string[]): string {
  const rules = subcategoryRules[category];
  if (!rules) return 'Other';

  const searchText = `${description} ${(bestFor || []).join(' ')}`.toLowerCase();

  let bestMatch = 'Other';
  let maxScore = 0;

  for (const rule of rules) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      // Return the English label: this value is persisted into tool data.
      bestMatch = rule.subcategoryEn;
    }
  }

  return bestMatch;
}

// 获取分类下的所有子分类
export function getSubcategories(category: string): SubcategoryRule[] {
  return subcategoryRules[category] || [];
}

// 获取子分类的英文标识
export function getSubcategoryEn(category: string, subcategory: string): string {
  const rules = subcategoryRules[category];
  if (!rules) return '';
  // Accept either the Chinese label or the English label as the lookup key.
  const rule = rules.find(r => r.subcategory === subcategory || r.subcategoryEn === subcategory);
  return rule?.subcategoryEn || subcategory;
}
