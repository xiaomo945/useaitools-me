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
      subcategory: '内容写作',
      subcategoryEn: 'Content Writing',
      keywords: ['content writing', 'blog', 'article', 'post', 'long-form'],
      description: '博客文章、长文内容创作工具'
    },
    {
      subcategory: '营销文案',
      subcategoryEn: 'Copywriting',
      keywords: ['copywriting', 'marketing', 'ad', 'advertisement', 'sales', 'conversion'],
      description: '广告文案、营销内容、销售转化文案'
    },
    {
      subcategory: 'SEO写作',
      subcategoryEn: 'SEO Writing',
      keywords: ['seo', 'search engine', 'keyword', 'ranking', 'optimization'],
      description: '搜索引擎优化写作、关键词优化工具'
    },
    {
      subcategory: '邮件写作',
      subcategoryEn: 'Email Writing',
      keywords: ['email', 'newsletter', 'mail', 'outreach'],
      description: '邮件内容、营销邮件、外联邮件撰写'
    },
    {
      subcategory: '创意写作',
      subcategoryEn: 'Creative Writing',
      keywords: ['creative', 'story', 'fiction', 'novel', 'poetry', 'script'],
      description: '故事创作、小说、诗歌、剧本写作'
    },
    {
      subcategory: '学术写作',
      subcategoryEn: 'Academic Writing',
      keywords: ['academic', 'research', 'paper', 'essay', 'study', 'education'],
      description: '学术论文、研究报告、教育内容'
    }
  ],
  Image: [
    {
      subcategory: '图像生成',
      subcategoryEn: 'Image Generation',
      keywords: ['image generation', 'text to image', 'generate image', 'create image'],
      description: '文字生成图像、AI绘画工具'
    },
    {
      subcategory: '照片编辑',
      subcategoryEn: 'Photo Editing',
      keywords: ['photo editing', 'photo enhancement', 'retouch', 'beauty'],
      description: '照片修饰、美化、增强工具'
    },
    {
      subcategory: '设计工具',
      subcategoryEn: 'Design Tools',
      keywords: ['design', 'graphic design', 'layout', 'template'],
      description: '平面设计、图形创作、模板设计'
    },
    {
      subcategory: '品牌设计',
      subcategoryEn: 'Brand Design',
      keywords: ['brand', 'logo', 'identity', 'branding'],
      description: '品牌标识、Logo设计、视觉识别系统'
    },
    {
      subcategory: '艺术生成',
      subcategoryEn: 'Art Generation',
      keywords: ['art', 'artistic', 'painting', 'illustration', 'style'],
      description: '艺术风格创作、插画生成'
    },
    {
      subcategory: '背景移除',
      subcategoryEn: 'Background Removal',
      keywords: ['background removal', 'remove background', 'cutout', 'transparent'],
      description: '背景抠图、透明背景、图像分割'
    }
  ],
  Video: [
    {
      subcategory: '视频编辑',
      subcategoryEn: 'Video Editing',
      keywords: ['video editing', 'edit video', 'video editor', 'cut', 'trim'],
      description: '视频剪辑、后期制作工具'
    },
    {
      subcategory: '视频生成',
      subcategoryEn: 'Video Generation',
      keywords: ['video generation', 'text to video', 'create video', 'generate video'],
      description: '文字生成视频、AI视频创作'
    },
    {
      subcategory: '社交媒体视频',
      subcategoryEn: 'Social Media Video',
      keywords: ['social media', 'tiktok', 'instagram', 'youtube', 'short video', 'reels'],
      description: '短视频、社交平台视频制作'
    },
    {
      subcategory: '视频营销',
      subcategoryEn: 'Video Marketing',
      keywords: ['video marketing', 'advertisement', 'promo', 'commercial'],
      description: '营销视频、广告片、宣传片制作'
    },
    {
      subcategory: '动画制作',
      subcategoryEn: 'Animation',
      keywords: ['animation', 'animated', 'motion', 'cartoon', 'anime'],
      description: '动画创作、动态图形、卡通制作'
    },
    {
      subcategory: '视频特效',
      subcategoryEn: 'Video Effects',
      keywords: ['effects', 'vfx', 'visual effects', 'filter', 'transition'],
      description: '视频特效、视觉特效、滤镜转场'
    }
  ],
  Audio: [
    {
      subcategory: '语音生成',
      subcategoryEn: 'Voice Generation',
      keywords: ['voice generation', 'text to speech', 'tts', 'voiceover', 'speech'],
      description: '文字转语音、AI配音工具'
    },
    {
      subcategory: '音乐创作',
      subcategoryEn: 'Music Creation',
      keywords: ['music', 'compose', 'melody', 'song', 'instrumental'],
      description: '音乐创作、作曲、编曲工具'
    },
    {
      subcategory: '音频编辑',
      subcategoryEn: 'Audio Editing',
      keywords: ['audio editing', 'edit audio', 'mix', 'master'],
      description: '音频剪辑、混音、母带处理'
    },
    {
      subcategory: '播客工具',
      subcategoryEn: 'Podcast Tools',
      keywords: ['podcast', 'episode', 'show', 'broadcast'],
      description: '播客制作、音频节目创作'
    },
    {
      subcategory: '声音设计',
      subcategoryEn: 'Sound Design',
      keywords: ['sound design', 'sound effect', 'sfx', 'foley'],
      description: '音效设计、声音特效创作'
    },
    {
      subcategory: '降噪处理',
      subcategoryEn: 'Noise Reduction',
      keywords: ['noise reduction', 'denoise', 'clean audio', 'enhance'],
      description: '音频降噪、声音增强、清晰度提升'
    }
  ],
  Code: [
    {
      subcategory: '代码助手',
      subcategoryEn: 'Code Assistant',
      keywords: ['code assistant', 'copilot', 'autocomplete', 'suggestion'],
      description: '代码补全、智能提示、编程助手'
    },
    {
      subcategory: '代码生成',
      subcategoryEn: 'Code Generation',
      keywords: ['code generation', 'generate code', 'create code', 'boilerplate'],
      description: '代码生成、模板代码、脚手架工具'
    },
    {
      subcategory: '开发工具',
      subcategoryEn: 'Development Tools',
      keywords: ['development', 'developer', 'debug', 'ide', 'editor'],
      description: '开发环境、调试工具、IDE增强'
    },
    {
      subcategory: '安全工具',
      subcategoryEn: 'Security Tools',
      keywords: ['security', 'vulnerability', 'scan', 'audit', 'protect'],
      description: '代码安全扫描、漏洞检测、安全审计'
    },
    {
      subcategory: '测试工具',
      subcategoryEn: 'Testing Tools',
      keywords: ['testing', 'test', 'unit test', 'qa', 'quality assurance'],
      description: '单元测试、质量保证、自动化测试'
    },
    {
      subcategory: '云开发',
      subcategoryEn: 'Cloud Development',
      keywords: ['cloud', 'serverless', 'deploy', 'infrastructure', 'devops'],
      description: '云端开发、服务器less、部署工具'
    }
  ],
  Productivity: [
    {
      subcategory: '任务管理',
      subcategoryEn: 'Task Management',
      keywords: ['task', 'todo', 'project management', 'workflow'],
      description: '任务清单、项目管理、工作流程'
    },
    {
      subcategory: '团队协作',
      subcategoryEn: 'Team Collaboration',
      keywords: ['team', 'collaboration', 'communication', 'meeting'],
      description: '团队协作、沟通工具、会议管理'
    },
    {
      subcategory: '内容管理',
      subcategoryEn: 'Content Management',
      keywords: ['content management', 'cms', 'organize', 'schedule'],
      description: '内容组织、发布管理、日程安排'
    },
    {
      subcategory: '营销自动化',
      subcategoryEn: 'Marketing Automation',
      keywords: ['marketing automation', 'campaign', 'funnel', 'lead'],
      description: '营销自动化、营销活动、线索管理'
    },
    {
      subcategory: '数据分析',
      subcategoryEn: 'Analytics',
      keywords: ['analytics', 'data analysis', 'insight', 'report', 'metric'],
      description: '数据分析、报表生成、指标追踪'
    },
    {
      subcategory: '社交媒体管理',
      subcategoryEn: 'Social Media Management',
      keywords: ['social media', 'engagement', 'follower', 'post', 'schedule'],
      description: '社交媒体运营、粉丝互动、内容排期'
    }
  ]
};

// 根据工具描述匹配子分类
export function matchSubcategory(category: string, description: string, bestFor?: string[]): string {
  const rules = subcategoryRules[category];
  if (!rules) return '其他';

  const searchText = `${description} ${(bestFor || []).join(' ')}`.toLowerCase();
  
  let bestMatch = '其他';
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
      bestMatch = rule.subcategory;
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
  const rule = rules.find(r => r.subcategory === subcategory);
  return rule?.subcategoryEn || '';
}
