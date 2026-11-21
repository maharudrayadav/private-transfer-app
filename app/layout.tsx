import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";

const outfit = Inter({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.privatetransfers.ie"),
  title: {
    default: "Dublin Airport Transfers & Chauffeur Services Ireland | PrivateTransfers",
    template: "%s | PrivateTransfers",
  },
  description: "Private airport transfers and chauffeur services across Ireland. Travel comfortably to hotels, business destinations and holiday locations with professional drivers. Request your quote today.",
  keywords: [
    "Dublin Airport Transfers",
    "Airport Transfers Ireland",
    "Private Chauffeur Services Ireland",
    "Private Airport Transfers",
    "Hotel Transfers Ireland",
    "Luxury Chauffeur Service Ireland",
    "Chauffeur Service Ireland",
    "Private Transfer Ireland",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://www.privatetransfers.ie",
  },
  openGraph: {
    title: "Dublin Airport Transfers & Chauffeur Services Ireland | PrivateTransfers",
    description: "Private airport transfers and chauffeur services across Ireland. Travel comfortably to hotels, business destinations and holiday locations with professional drivers. Request your quote today.",
    url: "https://www.privatetransfers.ie",
    siteName: "PrivateTransfers.ie",
    locale: "en_IE",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 682,
        alt: "PrivateTransfers Ireland Logo",
      },
    ],
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
      className={`${outfit.variable} ${playfair.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Explicit Favicon links for Google Search & Web Crawlers */}
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        {/* Google Analytics 4 (GA4) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-967MEC7475"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-967MEC7475', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
