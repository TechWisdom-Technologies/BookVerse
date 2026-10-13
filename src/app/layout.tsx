import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Merriweather, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { AppLayout } from "@/components/layout/AppLayout";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-serif",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BookVerse - Read, Write, Connect",
    template: "%s | BookVerse",
  },
  description:
    "Read free books, publish original stories, and build your personal library. BookVerse is an open platform for readers and writers worldwide.",
  keywords: [
    "books",
    "reading",
    "stories",
    "writing",
    "ebooks",
    "free books",
    "online library",
    "fan fiction",
    "novels",
    "authors",
  ],
  authors: [{ name: "BookVerse Team" }],
  creator: "BookVerse",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL?.replace("https://bookversebd.site", "https://www.bookversebd.site") || "https://www.bookversebd.site"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "BookVerse",
    title: "BookVerse - Read, Write, Connect",
    description: "Read free books, publish original stories, and build your personal library.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookVerse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookVerse - Read, Write, Connect",
    description: "Read free books, publish original stories, and build your personal library.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-N9BFT8XP";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${plusJakarta.variable} ${merriweather.variable} ${hindSiliguri.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body
        className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-[family-name:var(--font-sans)] dark:bg-zinc-950 dark:text-zinc-50"
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
        <Script id="service-worker-registration" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('ServiceWorker registration successful');
                }, function(err) {
                  console.log('ServiceWorker registration failed: ', err);
                });
              });
            }
          `
        }} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
