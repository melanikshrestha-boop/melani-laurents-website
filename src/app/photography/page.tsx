import { PortfolioIndexField } from "@/components/photography/PortfolioIndexField";
import { getIndexCollections } from "@/lib/photography";

export default function PhotographyPage() {
  const collections = getIndexCollections();

  return <PortfolioIndexField collections={collections} />;
}
