import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import PageProgress from "./components/PageProgress";
import BackToTop from "./components/BackToTop";
import MobileNav from "./components/MobileNav";
import ThemeToggle from "./components/ThemeToggle";
import { ToastProvider } from "./components/Toast";

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
  title: "Best AI Tools Directory 2026 – Discover & Compare 200+ AI Tools",
  description: "Find the best AI tools for writing, image generation, video creation, coding, and more. Compare features, pricing, and alternatives side by side. Updated weekly.",
  keywords: ["AI tools", "AI directory", "AI writing tools", "AI image generators", "AI coding assistants", "AI video tools", "AI audio tools", "AI productivity tools", "best AI tools", "AI tools comparison", "free AI tools", "AI tools 2026"],
  robots: 'index, follow',
  openGraph: {
    title: "Best AI Tools Directory 2026 – Discover & Compare 200+ AI Tools",
    description: "Find the best AI tools for writing, image generation, video creation, coding, and more. Compare features, pricing, and alternatives side by side. Updated weekly.",
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me',
  },
  icons: [{ url: '/logo.png' }],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "WebSite"],
              "name": "Use AI Tools",
              "url": "https://useaitools.me",
              "description": "Handpicked directory of 50+ AI tools across Writing, Image, Productivity, Code, Audio, and Video.",
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
        <ToastProvider>
          <Suspense fallback={null}>
            <PageProgress />
          </Suspense>
          {children}
          <Analytics />
          <Suspense fallback={null}>
            <BackToTop />
          </Suspense>
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
          <Suspense fallback={null}>
            <ThemeToggle />
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
