import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Merriweather } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { AppLayout } from "@/components/layout/AppLayout";
import Script from "next/script";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://bookverse.app"),
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
    icon: "/bookverse.png",
    shortcut: "/bookverse.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${plusJakarta.variable} ${merriweather.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-[family-name:var(--font-sans)] dark:bg-zinc-950 dark:text-zinc-50"
        suppressHydrationWarning
      >
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
        {process.env.NODE_ENV === "production" ? (
          <Script
            id="service-worker-registration"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
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
              `,
            }}
          />
        ) : (
          <Script
            id="service-worker-dev-cleanup"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    registrations.forEach(function(registration) {
                      registration.unregister();
                    });
                  });
                }
                if ('caches' in window) {
                  caches.keys().then(function(keys) {
                    keys.forEach(function(key) {
                      caches.delete(key);
                    });
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
