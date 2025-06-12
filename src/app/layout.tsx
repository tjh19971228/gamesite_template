import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/hooks/use-theme";
import { getSiteInfo } from "@/lib/siteConfig";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 使用 siteInfo 设置全局元数据
export const metadata: Metadata = {
  title: {
    template: `%s | ${getSiteInfo().title}`,
    default: getSiteInfo().title,
  },
  description: getSiteInfo().description,
  keywords: getSiteInfo().keywords,
  metadataBase: new URL(getSiteInfo().url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: getSiteInfo().siteName,
    title: getSiteInfo().title,
    description: getSiteInfo().description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: getSiteInfo().title,
    description: getSiteInfo().description,
    creator: getSiteInfo().twitterUsername,
  },
  applicationName: getSiteInfo().shortName,
  generator: getSiteInfo().creator,
  referrer: 'origin-when-cross-origin',
  authors: [{ name: getSiteInfo().creator.replace('@', '') }],
  creator: getSiteInfo().creator.replace('@', ''),
  publisher: getSiteInfo().creator.replace('@', ''),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={getSiteInfo().language} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* 结构化数据会被注入到这里，通过SchemaOrg组件 */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light" storageKey="site-theme">
          {children}
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
