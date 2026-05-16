import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import PageProgress from "./components/PageProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Use AI Tools – Discover 50+ Best AI Tools in 2026",
  description: "Handpicked directory of 50+ AI tools across Writing, Image, Productivity, Code, Audio, and Video. Find the perfect AI tool for your workflow.",
  keywords: ["AI tools", "AI directory", "AI writing tools", "AI image generators", "AI coding assistants"],
  openGraph: {
    title: "Use AI Tools – Discover 50+ Best AI Tools in 2026",
    description: "Handpicked directory of 50+ AI tools across Writing, Image, Productivity, Code, Audio, and Video. Find the perfect AI tool for your workflow.",
  },
  icons: [{ url: '/logo.svg' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
      </body>
    </html>
  );
}
