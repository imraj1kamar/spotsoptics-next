import { Geist, Geist_Mono } from "next/font/google";
import Preloader from "@/components/common/Preloader";
import BootstrapClient from "@/components/BootstrapClient";
import CookieConsent from '@/components/CookieConsentClient';
import ScrollToTop from '@/components/common/ScrollToTop';
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import Navbar from '@/components/layout/Navbar';
import siteData from "@/data/site.json"; 
import FooterSection from "@/components/layout/FooterSection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: siteData.site.theme_color,
};

export const metadata = {
  metadataBase: new URL(siteData.site.url),
  title: {
    default: siteData.site.name, 
    template: `%s | ${siteData.site.name}`, 
  },
  description: siteData.site.description,
  alternates: {
    canonical: '/',
  },
  keywords: siteData.site.keywords,
  authors: [{ name: siteData.site.name }],
  applicationName: siteData.site.name,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/assets/icons/favicon.png",
    shortcut: "/assets/icons/favicon.png",
    apple: "/assets/icons/favicon.png",
  },
  openGraph: {
    type: "website",
    url: siteData.site.url,
    title: siteData.site.name,
    description: siteData.site.description,
    siteName: siteData.site.name,
    images: [
      {
        url: siteData.site.logo,
        width: 1200,
        height: 630,
        alt: siteData.site.name,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@spotoptics", 
    title: siteData.site.name,
    description: siteData.site.description,
    images: [siteData.site.logo],
  },
  verification: {
    google: 'zfGMJWWfmqta-PoYRCh0EgMgWcbYelP9cBj4wFcaGcY', 
  },
};

export default function RootLayout({ children }) {
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteData.organization.name,
    description: siteData.organization.description,
    url: siteData.organization.url,
    logo: siteData.organization.logo,
    contactPoint: siteData.organization.contactPoint,
    address: siteData.organization.address,
    sameAs: siteData.organization.sameAs || [], 
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteData.site.name,
    url: siteData.site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteData.site.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={siteData.site.language} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <link 
          rel="preload" 
          as="image" 
          href="/assets/images/hero-image.png" 
          fetchPriority="high" 
        />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <BootstrapClient />
        <Preloader />
        <CookieConsent />       
        <Navbar />        
        <main className="flex-grow">
            {children}
        </main>            
        <FooterSection/>        
        <ScrollToTop />
      </body>
    </html>
  );
}