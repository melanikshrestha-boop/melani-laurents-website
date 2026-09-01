import type { Metadata } from "next";
import {
  Geist,
  Instrument_Serif,
  Source_Serif_4,
  IBM_Plex_Mono,
  Share_Tech_Mono,
  Syne,
  Oswald,
  Archivo_Narrow,
  JetBrains_Mono,
  Inter,
} from "next/font/google";
import { siteConfig } from "@/config/site";
import { LayoutEditor } from "@/components/LayoutEditor";
import "./globals.css";
import "@/styles/daily-pulse.css";
import "@/styles/builds-folio.css";
import "@/styles/layout-editor.css";

/*
 * Display face. johnlennon.com sets its headings in Helvetica LT Std Bold,
 * which is a licensed commercial webfont we can't redistribute — but macOS
 * and iOS ship Helvetica, so --font-display prefers the real thing locally
 * and falls back to Inter (loaded here) everywhere else. See --font-display
 * in globals.css.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

/* Bookshelf manifesto body — social hover notes use this too */
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["700"],
});

const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: {
    // Square Eren only. Never a C. Never a gold ring. Path changes when Chrome caches a C.
    icon: [
      { url: "/eren-stay11.png?v=stay11", type: "image/png", sizes: "256x256" },
      { url: "/eren-stay11.png?v=stay11", type: "image/png", sizes: "48x48" },
      { url: "/eren-stay11.png?v=stay11", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      {
        url: "/eren-stay11.png?v=stay11",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [{ url: "/eren-stay11.png?v=stay11", type: "image/png" }],
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${geistSans.variable} ${instrumentSerif.variable} ${sourceSerif.variable} ${ibmPlexMono.variable} ${shareTechMono.variable} ${syne.variable} ${oswald.variable} ${archivoNarrow.variable} ${jetbrainsMono.variable} ${inter.variable} h-full`}
      /* Browser extensions (Grammarly, etc.) inject attrs on <html>/<body>
         and trigger false hydration mismatches without this. */
      suppressHydrationWarning
    >
      <body
        className="relative flex min-h-full flex-col bg-black font-sans antialiased"
        suppressHydrationWarning
      >
        {children}
        <LayoutEditor />
      </body>
    </html>
  );
}
