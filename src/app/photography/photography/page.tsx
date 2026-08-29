import type { Metadata } from "next";
import { PortfolioIndexField } from "@/components/photography/PortfolioIndexField";
import { getPhotoCollection } from "@/lib/photography";

export const metadata: Metadata = {
  title: "Photography — shotbyceline",
};

export default function PhotographyCollectionsPage() {
  const collections = ["portraits", "scenery"].flatMap((slug) => {
    const collection = getPhotoCollection(slug);
    return collection ? [collection] : [];
  });

  return <PortfolioIndexField collections={collections} mode="photography" />;
}
