import { PhotographyMode } from "@/components/photography/PhotographyMode";
import "@/styles/photography.css";

export const metadata = {
  title: {
    default: "shotbymelani",
    template: "%s",
  },
};


export default function PhotographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PhotographyMode>
      <div className="photography-site">
        {children}
      </div>
    </PhotographyMode>
  );
}
