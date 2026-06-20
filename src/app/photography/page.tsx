import { ShotByMelaniFooter } from "@/components/photography/ShotByMelaniFooter";
import { ShotByMelaniHeader } from "@/components/photography/ShotByMelaniHeader";
import { PortfolioIndexField } from "@/components/photography/PortfolioIndexField";
import { getIndexCollections } from "@/lib/photography";

export default function PhotographyPage() {
  const collections = getIndexCollections();

  return (
    <>
      <ShotByMelaniHeader theme="overlay" />
      <PortfolioIndexField collections={collections} />
      <ShotByMelaniFooter />
    </>
  );
}
