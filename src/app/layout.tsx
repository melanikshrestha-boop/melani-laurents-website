import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";

const franklin = Libre_Franklin({
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
    <html lang="en" className={franklin.variable}>
      <body className={franklin.className}>{children}</body>
    </html>
  );
}
