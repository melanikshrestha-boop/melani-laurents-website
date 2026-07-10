import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lunara Glow Beauty Salon",
  description:
    "Elegance, glass-skin glow, and clear prices — book fast, feel seen.",
  metadataBase: new URL("https://lunaraglow.com"),
  openGraph: {
    title: "Lunara Glow Beauty Salon",
    description:
      "Elegance, glass-skin glow, and clear prices — book fast, feel seen.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lunara Glow Beauty Salon",
    description:
      "Elegance, glass-skin glow, and clear prices — book fast, feel seen.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
