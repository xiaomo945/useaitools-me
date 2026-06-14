import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import Analytics from "./components/Analytics";
import "./globals.css";
import Header from "./components/Header";
import PageProgress from "./components/PageProgress";
import BackToTop from "./components/BackToTop";
import MobileNav from "./components/MobileNav";
import ThemeToggle from "./components/ThemeToggle";
import SoundToggle from "./components/SoundToggle";
import { ToastProvider } from "./components/Toast";
import PageTransition from "./components/PageTransition";
import KeyboardNavigation from "./components/KeyboardNavigation";
import GuidedTour from "./components/GuidedTour";
import NetworkStatus from "./components/NetworkStatus";
import ExternalLinkToast from "./components/ExternalLinkToast";
import ErrorBoundary from "./components/ErrorBoundary";
import HolidayBanner from "./components/HolidayBanner";
import WebVitals from "./components/WebVitals";
import AuthProvider from "./components/AuthProvider";
import { ABTestProvider } from "./components/ABTestProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Best AI Tools Directory 2026 – Discover & Compare 1200+ AI Tools",
  description: "Find the best AI tools for writing, image generation, video creation, coding, and more. Compare features, pricing, and alternatives side by side. Updated weekly.",
  keywords: ["AI tools", "AI directory", "AI writing tools", "AI image generators", "AI coding assistants", "AI video tools", "AI audio tools", "AI productivity tools", "best AI tools", "AI tools comparison", "free AI tools", "AI tools 2026"],
  robots: 'index, follow',
  openGraph: {
    title: "Best AI Tools Directory 2026 – Discover & Compare 1200+ AI Tools",
    description: "Find the best AI tools for writing, image generation, video creation, coding, and more. Compare features, pricing, and alternatives side by side. Updated weekly.",
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me',
  },
  icons: [{ url: '/logo.png' }],
  twitter: {
    card: 'summary_large_image',
    title: 'Best AI Tools Directory 2026 – Discover & Compare 1200+ AI Tools',
    description: 'Find the best AI tools for writing, image generation, video creation, coding, and more. Compare features, pricing, and alternatives side by side. Updated weekly.',
    site: '@jiongxiaomo',
    creator: '@jiongxiaomo',
  },
  alternates: {
    canonical: 'https://useaitools.me',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.pexels.com" />
        {/* Microsoft Clarity — privacy-friendly heatmaps & session recordings */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID || ''}");
`
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "WebSite"],
              "name": "Use AI Tools",
              "url": "https://useaitools.me",
              "description": "Handpicked directory of 1200+ AI tools across Writing, Image, Productivity, Code, Audio, and Video. Compare features, pricing, and alternatives side by side.",
              "logo": {
                "@type": "ImageObject",
                "url": "https://useaitools.me/logo.png",
                "width": 200,
                "height": 200
              },
              "sameAs": [
                "https://x.com/jiongxiaomo",
                "https://github.com/xiaomo945"
              ],
              "publisher": {
                "@type": "Organization",
                "name": "Use AI Tools",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://useaitools.me/logo.png"
                }
              },
              "author": {
                "@type": "Organization",
                "name": "Use AI Tools"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://useaitools.me/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col pb-16 md:pb-0">
        <ABTestProvider>
          <AuthProvider>
            <Analytics />
            <a href="#main-content" className="skip-to-main">Skip to main content</a>
          <Suspense fallback={null}>
            <HolidayBanner />
          </Suspense>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <ToastProvider>
            <Suspense fallback={null}>
              <NetworkStatus />
            </Suspense>
            <Suspense fallback={null}>
              <PageProgress />
            </Suspense>
            <ErrorBoundary>
              <PageTransition>{children}</PageTransition>
            </ErrorBoundary>
            <div aria-live="polite" aria-atomic="true" className="sr-only" />
            <VercelAnalytics />
            <Suspense fallback={null}>
              <BackToTop />
            </Suspense>
            <Suspense fallback={null}>
              <MobileNav />
            </Suspense>
            <Suspense fallback={null}>
              <ThemeToggle />
              <div className="fixed bottom-20 left-4 md:bottom-4 md:left-4 z-40">
                <SoundToggle />
              </div>
            </Suspense>
            <KeyboardNavigation />
            <GuidedTour />
            <ExternalLinkToast />
            <WebVitals />
          </ToastProvider>
        </AuthProvider>
        </ABTestProvider>
      </body>
    </html>
  );
}
