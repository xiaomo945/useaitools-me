This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google Search Console Auto-Submit

Submit new blog articles to Google Search Console for faster indexing.

### Setup (one-time)

1. Create a service account in [Google Cloud Console](https://console.cloud.google.com/):
   - Enable the "Indexing API"
   - Create a service account and download the JSON key
   - Add the service account email as a site owner in [GSC](https://search.google.com/search-console)

2. Run the setup wizard:
   ```bash
   node scripts/setup-gsc.js
   ```
   This creates `credentials.json` at the project root (already in `.gitignore`).

### Submit articles

```bash
# Submit articles from the last 1 day
bash scripts/run-gsc-submit.sh --days 1

# Submit articles from the last 7 days
bash scripts/run-gsc-submit.sh --days 7

# Dry run (preview without submitting)
python3 scripts/auto-submit-gsc.py --days 1 --dry-run
```

## Performance

Optimizations applied to meet Core Web Vitals targets (LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1):

- **Font loading**: All Google Fonts loaded via `next/font` with `display: "swap"` to prevent FOIT and reduce CLS
- **Preconnect**: `<link rel="preconnect">` added for `fonts.googleapis.com`, `fonts.gstatic.com`, and `cdn.jsdelivr.net`
- **Lazy components**: `BackToTop` and `MobileNav` wrapped in `React.Suspense` for progressive hydration
- **Image optimization**: Logo uses `loading="eager"` (above fold), all other images use `loading="lazy"`
- **Touch targets**: All interactive elements meet WCAG 2.5.5 minimum 44×44px touch target size
- **Code splitting**: Non-critical components wrapped in `React.Suspense` for progressive hydration
