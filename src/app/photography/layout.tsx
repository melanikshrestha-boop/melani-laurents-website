import { Anton, Epilogue } from "next/font/google";
import { PhotographyMode } from "@/components/photography/PhotographyMode";
import { Navigation } from "@/components/Navigation";
import "@/styles/photography.css";

export const metadata = {
  title: {
    default: "shotbyceline",
    template: "%s",
  },
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
        {/* Site primary nav (Art hidden on this surface) */}
        <Navigation />
        <div className="photography-site__body pt-14">{children}</div>
      </div>
    </PhotographyMode>
  );
}
