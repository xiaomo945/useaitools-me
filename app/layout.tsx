import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import PageProgress from "./components/PageProgress";
import BackToTop from "./components/BackToTop";

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
  title: "Use AI Tools – Discover 50+ Best AI Tools in 2026",
  description: "Handpicked directory of 50+ AI tools across Writing, Image, Productivity, Code, Audio, and Video. Find the perfect AI tool for your workflow.",
  keywords: ["AI tools", "AI directory", "AI writing tools", "AI image generators", "AI coding assistants"],
  robots: 'index, follow',
  openGraph: {
    title: "Use AI Tools – Discover 50+ Best AI Tools in 2026",
    description: "Handpicked directory of 50+ AI tools across Writing, Image, Productivity, Code, Audio, and Video. Find the perfect AI tool for your workflow.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Use AI Tools",
              "url": "https://useaitools.me",
              "description": "Handpicked directory of 50+ AI tools across Writing, Image, Productivity, Code, Audio, and Video.",
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
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <PageProgress />
        </Suspense>
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
