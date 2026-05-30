import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts, type BlogPost } from '@/types';
import ClientBlogDetail from './ClientBlogDetail';

// Extract tool IDs from blog content for recommendation
const extractToolIds = (content: string): number[] => {
  const toolIdRegex = /\[\[link:\/tools\/(\d+)\|/g;
  const ids: number[] = [];
  let match;
  while ((match = toolIdRegex.exec(content)) !== null) {
    ids.push(parseInt(match[1]));
  }
  return [...new Set(ids)];
};

// Extract blog slugs from content for cross-linking
const extractBlogSlugs = (content: string): string[] => {
  const blogLinkRegex = /\[\[link:\/blog\/([^|\]]+)\|/g;
  const slugs: string[] = [];
  let match;
  while ((match = blogLinkRegex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  return [...new Set(slugs)];
};

// Extract FAQ from content
const extractFAQ = (content: string): { question: string; answer: string }[] => {
  const faq: { question: string; answer: string }[] = [];
  
  // Look for heading patterns that can be converted to FAQ
  const lines = content.split('\n');
  
  let currentQuestion: string | null = null;
  let currentAnswer: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for questions
    if (line.startsWith('## ') || line.startsWith('### ')) {
      // If we already have a question, save the previous one
      if (currentQuestion && currentAnswer.length > 0) {
        faq.push({
          question: currentQuestion,
          answer: currentAnswer.join(' ').trim()
        });
      }
      
      // Start new question
      const headingText = line.replace(/^###?\s*/, '');
      if (headingText.length > 5) {
        currentQuestion = headingText;
        currentAnswer = [];
      }
    } 
    // If we're in a question, collect answer
    else if (currentQuestion && line) {
      currentAnswer.push(line);
    }
  }
  
  // Add the last question
  if (currentQuestion && currentAnswer.length > 0) {
    faq.push({
      question: currentQuestion,
      answer: currentAnswer.join(' ').trim()
    });
  }
  
  // If we found less than 3 FAQs, generate some default ones based on content
  if (faq.length < 3) {
    const defaultFAQs = [
      {
        question: 'What are the key features of the tools mentioned?',
        answer: 'The tools discussed in this article offer various features including AI-powered content creation, automation, and more. Each tool has unique capabilities tailored for specific needs.'
      },
      {
        question: 'Is there a free version or trial available?',
        answer: 'Many AI tools offer free versions or trial periods. Check individual tool pages for detailed pricing information.'
      },
      {
        question: 'Which tool is best for beginners?',
        answer: 'The best tool for beginners depends on your specific use case, but many recommended options are highlighted in the article with ease-of-use sections.'
      }
    ];
    
    // Add default FAQs if we don't have enough
    return [...faq, ...defaultFAQs.slice(0, 3 - faq.length)];
  }
  
  // Return first 5 FAQs
  return faq.slice(0, 5);
};

// Enhanced related posts algorithm
const getRelatedPosts = (currentPost: BlogPost, allPosts: BlogPost[]): BlogPost[] => {
  const candidates = allPosts.filter(p => p.slug !== currentPost.slug);
  const currentToolIds = extractToolIds(currentPost.content);
  const currentLinkedSlugs = extractBlogSlugs(currentPost.content);
  
  const scoredPosts = candidates.map(post => {
    let score = 0;
    
    // Same category: +3 points
    if (post.category === currentPost.category) {
      score += 3;
    }
    
    // Linked in current post: +2 points (high cross-reference value)
    if (currentLinkedSlugs.includes(post.slug)) {
      score += 2;
    }
    
    // Cross-links to current post: +1.5 points
    const postLinkedSlugs = extractBlogSlugs(post.content);
    if (postLinkedSlugs.includes(currentPost.slug)) {
      score += 1.5;
    }
    
    // Common tools referenced: +1 point per shared tool
    const postToolIds = extractToolIds(post.content);
    const sharedTools = currentToolIds.filter(id => postToolIds.includes(id));
    score += sharedTools.length * 1;
    
    // Recency bonus: newer posts get slight boost
    const currentDate = new Date(currentPost.date);
    const postDate = new Date(post.date);
    const daysDiff = Math.abs(currentDate.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff < 30) score += 0.5;
    if (daysDiff < 7) score += 0.5;
    
    return { post, score };
  });
  
  // Sort by score descending, then by date descending for same scores
  scoredPosts.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });
  
  return scoredPosts.slice(0, 3).map(sp => sp.post);
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      siteName: 'Use AI Tools',
      type: 'article',
      url: `https://useaitools.me/blog/${slug}`,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ['Use AI Tools'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, blogPosts);

  const processedPost = {
    ...post,
    content: post.content
      .replace(/\{\{AFFILIATE_RYTR\}\}/g, process.env.AFFILIATE_RYTR || 'https://rytr.me')
      .replace(/\{\{AFFILIATE_VEED\}\}/g, process.env.AFFILIATE_VEED || 'https://veed.io')
      .replace(/\{\{AFFILIATE_MURF\}\}/g, process.env.AFFILIATE_MURF || 'https://murf.ai')
      .replace(/\{\{AFFILIATE_PICTORY\}\}/g, process.env.AFFILIATE_PICTORY || 'https://pictory.ai')
      .replace(/\{\{AFFILIATE_ELEVENLABS\}\}/g, process.env.AFFILIATE_ELEVENLABS || 'https://elevenlabs.io'),
  };

  // Check if post has affiliate links and is in high-value category
  const hasAffiliateLinks = /\{\{AFFILIATE_[A-Z]+\}\}/.test(post.content);
  const isHighValueCategory = ['Writing', 'Productivity'].includes(post.category);
  const faqData = isHighValueCategory || hasAffiliateLinks ? extractFAQ(post.content) : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': faqData.length > 0 ? ['Article', 'FAQPage'] : 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'Use AI Tools',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Use AI Tools',
      logo: {
        '@type': 'ImageObject',
        url: 'https://useaitools.me/logo.png',
      },
    },
    url: `https://useaitools.me/blog/${slug}`,
    ...(faqData.length > 0 && {
      mainEntity: faqData.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientBlogDetail post={processedPost} slug={slug} relatedPosts={relatedPosts} />
    </>
  );
}
