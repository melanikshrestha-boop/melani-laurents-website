import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
