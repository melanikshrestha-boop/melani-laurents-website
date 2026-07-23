import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

/* Display: editorial like spa menus · Body: clean UI type */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lunara Glow Beauty Salon · Astoria",
  description:
    "Brows, lashes, waxing, and facials at 38-02 Broadway, Astoria. Clear prices. Book online or walk in.",
  metadataBase: new URL("https://lunaraglow.com"),
  openGraph: {
    title: "Lunara Glow Beauty Salon",
    description:
      "Brows, lashes, waxing, and facials in Astoria. Clear prices. Book online or walk in.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className={body.className}>{children}</body>
    </html>
  );
}
