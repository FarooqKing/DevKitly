import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/site.config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sans={variable:""},mono={variable:""};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: { type: "website", siteName: siteConfig.name },
  twitter: { card: "summary", site: siteConfig.twitter },
  robots: { index: true, follow: true },
};

// Theme flash rokne ke liye: paint se pehle class set
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
