# Email Automation Setup Guide

## Overview
This guide explains how to set up and use the email automation system for Use AI Tools.

## Features Implemented
✅ Welcome email sequence (sent automatically on subscription)
✅ Weekly Picks newsletter template
✅ Resend integration for reliable email delivery
✅ Supabase storage for subscribers (with local JSON fallback)

## Setup Steps

### 1. Configure Resend API Key
1. Sign up at [Resend](https://resend.com)
2. Get your API key from the dashboard
3. Add to Vercel environment variables:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```

### 2. Configure Supabase (Optional but Recommended)
1. Create a Supabase project
2. Create a `subscribers` table:
   ```sql
   create table subscribers (
     id bigint serial primary key,
     email text unique not null,
     subscribed_at timestamp with time zone default now()
   );
   ```
3. Add environment variables:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJxxxxx
   ```

### 3. Set Up Weekly Picks Cron Job
1. Add to `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/weekly-picks",
       "schedule": "0 14 * * 5"
     }]
   }
   ```
   This runs every Friday at 2:00 PM UTC (9:00 AM EST)

2. Add CRON_SECRET to environment variables:
   ```
   CRON_SECRET=your-secret-here
   ```

### 4. Test the System
1. Subscribe with your email at https://useaitools.me
2. Check your inbox for the welcome email
3. Manually trigger weekly picks:
   ```bash
   curl -X POST https://useaitools.me/api/weekly-picks \
     -H "Authorization: Bearer your-cron-secret"
   ```

## Email Templates

### Welcome Email
- Sent automatically when user subscribes
- Introduces the newsletter value proposition
- Includes CTA to explore the directory

### Weekly Picks
- Sent every Friday at 9:00 AM EST
- Features 5 handpicked AI tools
- Includes tool descriptions and direct links

## Metrics to Track
- Open rate (target: >30%)
- Click-through rate (target: >5%)
- Unsubscribe rate (target: <1%)
- Subscriber growth rate

## Future Enhancements
- [ ] Personalized recommendations based on user preferences
- [ ] A/B testing for email subject lines
- [ ] Automated re-engagement campaigns
- [ ] Email analytics dashboard
