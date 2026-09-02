import { Anton, Epilogue } from "next/font/google";
import { PhotographyMode } from "@/components/photography/PhotographyMode";
import { Navigation } from "@/components/Navigation";
import { erenTabIcons } from "@/lib/eren-tab";
import "@/styles/photography.css";

export const metadata = {
  title: {
    default: "shotbyceline",
    template: "%s",
  },
  icons: erenTabIcons,
};

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function PhotographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PhotographyMode>
      <div className={`photography-site ${anton.variable} ${epilogue.variable}`}>
        {/* Transparent site nav over full-bleed art — no cream bar, no pt-14 gap */}
        <Navigation />
        <div className="photography-site__body">{children}</div>
      </div>
    </PhotographyMode>
  );
}
