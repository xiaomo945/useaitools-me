export interface BlogImage {
  url: string;
  alt: string;
  caption: string;
  position?: string;
  prompt?: string;
  image_url?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  style?: string;
  category: string;
  author?: string;
  reading_time?: string;
  featured?: boolean;
  images: BlogImage[];
  content: string;
  tldr?: string; // TL;DR summary shown at the top (conclusion-first format)
  canonical_slug?: string; // Canonical slug for duplicate posts (SEO)
}

export interface ToolExample {
  prompt: string;
  image_url: string;
}

export interface RatingBreakdown {
  ease_of_use: {
    score: number;
    note: string;
  };
  output_quality: {
    score: number;
    note: string;
  };
  features: {
    score: number;
    note: string;
  };
  value_for_money: {
    score: number;
    note: string;
  };
  stability: {
    score: number;
    note: string;
  };
  support: {
    score: number;
    note: string;
  };
}

export interface UseCase {
  title: string;
  detail: string;
}

export interface ProsCons {
  pros: string[];
  cons: string[];
}

export interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  examples: ToolExample[];
  needs_vpn: boolean;
  languages: string[];
  description_en?: string;
  rating?: number;
  rating_count?: number;
  rating_breakdown?: RatingBreakdown;
  use_cases?: UseCase[];
  pros_cons?: ProsCons;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  best_for?: string[];
  commission_rate?: number; // Affiliate commission rate (0-100)
  commission_type?: 'recurring' | 'one-time'; // Commission type
  commission_duration?: number; // Duration in months for recurring (e.g., 12)
}

// Tool submission types
export type SubmissionTier = 'free' | 'expedited' | 'sponsored';
export type SubmissionStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'sponsored_active';

export interface ToolSubmission {
  id: number;
  name: string;
  url: string;
  category: string;
  description: string;
  pricing: string;
  needs_vpn: boolean;
  submittedAt: string;
  tier: SubmissionTier;
  status: SubmissionStatus;
  paymentId?: string; // Stripe/LemonSqueezy payment ID
  sponsoredUntil?: string; // For sponsored tier, when it expires
  contactEmail?: string; // For notifications
}

// Social sharing and points system
export type ShareAction = 'tool' | 'blog' | 'referral';
export type PointsAction = 'share_tool' | 'share_blog' | 'referral_signup';

export interface PointsRecord {
  id: number;
  userId: string; // Anonymous user ID or email
  action: PointsAction;
  points: number;
  createdAt: string;
  targetType?: string; // 'tool' | 'blog'
  targetId?: number;
}

export interface UserPoints {
  userId: string;
  totalPoints: number;
  shareCount: number;
  referralCount: number;
  lastUpdated: string;
}
