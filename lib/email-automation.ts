/**
 * Email Automation System
 * Welcome sequence + Weekly Picks + automation workflows
 */

export interface EmailTemplate {
  id: string;
  subject: string;
  previewText: string;
  content: string;
  delayHours: number; // Hours after subscription
  type: 'welcome' | 'weekly' | 'recommendation';
}

// Welcome Email Sequence (3 emails)
export const WELCOME_SEQUENCE: EmailTemplate[] = [
  {
    id: 'welcome-1',
    subject: 'Welcome to Use AI Tools! 🎉',
    previewText: 'Your guide to discovering the best AI tools starts here.',
    delayHours: 1,
    type: 'welcome',
    content: `
Hi there!

Welcome to Use AI Tools — your curated directory of 1,300+ AI tools across Writing, Image, Video, Audio, Code & Productivity.

Here's what you can do right now:
• Search & filter tools by category, pricing, or use case
• Compare tools side-by-side to find the perfect fit
• Save your favorites for quick access later

This week's top picks:
1. Rytr — AI writing assistant (30% off with our link)
2. VEED.io — Professional video editing (40% off)
3. Murf AI — Text-to-speech studio

Happy exploring!
The Use AI Tools Team
    `.trim(),
  },
  {
    id: 'welcome-2',
    subject: '5 AI Tools You Should Try This Week',
    previewText: 'Hand-picked tools to boost your productivity.',
    delayHours: 48, // 2 days after first email
    type: 'welcome',
    content: `
Hi there!

Here are 5 AI tools our community loves this week:

1. Jasper — Best for long-form content & marketing copy
   → Try it free: https://useaitools.me/tools/jasper

2. Midjourney — Stunning AI art generation
   → Explore: https://useaitools.me/tools/midjourney

3. Synthesia — Create videos with AI avatars
   → Get started: https://useaitools.me/tools/synthesia

4. Copy.ai — Fast copywriting for any use case
   → Start writing: https://useaitools.me/tools/copy-ai

5. Descript — Edit video & podcast like a doc
   → Try free: https://useaitools.me/tools/descript

Pro tip: Use the Compare feature to see which tool fits your needs best!

Until next week,
The Use AI Tools Team
    `.trim(),
  },
  {
    id: 'welcome-3',
    subject: 'Join Our Community + Exclusive Tips',
    previewText: 'Connect with 1000+ AI tool enthusiasts.',
    delayHours: 120, // 5 days after second email
    type: 'welcome',
    content: `
Hi there!

You've been with us for a week now — here's how to get the most out of Use AI Tools:

🔥 Pro Tips:
• Use keyboard shortcuts (press Alt+/ to see all)
• Filter by "Free" to find no-cost tools
• Check our blog for in-depth tool reviews

📱 Stay Connected:
• Twitter: @jiongxiaomo — daily tool picks
• Dev.to: Technical deep-dives
• Indie Hackers: Build-in-public updates

💡 What's Next:
Every Friday, we send our Weekly Picks — 5 curated tools you won't want to miss.

Have a tool recommendation? Submit it at https://useaitools.me/submit

Cheers,
The Use AI Tools Team
    `.trim(),
  },
];

// Weekly Picks Template
export function generateWeeklyPicks(weekNumber: number, tools: Array<{name: string; description: string; url: string; category: string}>): EmailTemplate {
  const featuredTools = tools.slice(0, 5);
  const deepDive = tools[0];

  return {
    id: `weekly-${weekNumber}`,
    subject: `Weekly Picks: ${featuredTools.map(t => t.name).slice(0, 2).join(' & ')} + More`,
    previewText: `This week's best AI tools, hand-picked for you.`,
    delayHours: 0,
    type: 'weekly',
    content: `
Use AI Tools Weekly — Issue #${weekNumber}

This Week's Top 5 Picks:

${featuredTools.map((tool, i) => `${i + 1}. ${tool.name} (${tool.category})
   ${tool.description.slice(0, 100)}...
   → ${tool.url}`).join('\n\n')}

---

Deep Dive: ${deepDive.name}

${deepDive.description}

Why we love it: This tool stands out for its unique approach to ${deepDive.category.toLowerCase()}. Whether you're a beginner or pro, it offers something valuable.

---

Latest from the Blog:
→ Read more at https://useaitools.me/blog

Until next week,
The Use AI Tools Team

---
Unsubscribe: https://useaitools.me/email-preferences
    `.trim(),
  };
}

/**
 * Calculate next email to send for a subscriber
 */
export function getNextWelcomeEmail(subscribedAt: string, lastEmailSentAt?: string): EmailTemplate | null {
  const subscribedTime = new Date(subscribedAt).getTime();
  const now = Date.now();
  const hoursSinceSubscribe = (now - subscribedTime) / (1000 * 60 * 60);

  for (const email of WELCOME_SEQUENCE) {
    if (hoursSinceSubscribe >= email.delayHours) {
      // Check if this email was already sent
      if (!lastEmailSentAt) {
        return email;
      }
      const lastSentTime = new Date(lastEmailSentAt).getTime();
      const emailShouldBeSentAt = subscribedTime + email.delayHours * 60 * 60 * 1000;
      
      if (lastSentTime < emailShouldBeSentAt) {
        return email;
      }
    }
  }

  return null; // All welcome emails sent
}

/**
 * Check if it's time to send Weekly Picks (every Friday)
 */
export function shouldSendWeeklyPicks(): boolean {
  const now = new Date();
  // Send on Fridays at 9 AM UTC
  return now.getUTCDay() === 5 && now.getUTCHours() >= 9 && now.getUTCHours() < 10;
}
