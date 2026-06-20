import { Anton, Epilogue } from "next/font/google";
import { PhotographyMode } from "@/components/photography/PhotographyMode";
import "@/styles/photography.css";

export const metadata = {
  title: {
    default: "shotbymelani",
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
        {children}
      </div>
    </PhotographyMode>
  );
}
