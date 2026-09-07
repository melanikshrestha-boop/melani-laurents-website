import { Anton, Epilogue } from "next/font/google";
import { PhotographyMode } from "@/components/photography/PhotographyMode";
import { erenTabIcons } from "@/lib/eren-tab";
import "@/styles/photography.css";

export const metadata = {
  title: {
    default: "shotbyCeline",
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

export default function ShotByCelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PhotographyMode>
      <div className={`photography-site ${anton.variable} ${epilogue.variable}`}>
        {children}
      </div>
    </PhotographyMode>
  );
}
