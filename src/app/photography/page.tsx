import { ShotByMelaniFooter } from "@/components/photography/ShotByMelaniFooter";
import { ShotByMelaniHeader } from "@/components/photography/ShotByMelaniHeader";
import { PortfolioIndex } from "@/components/photography/PortfolioIndex";
import { getIndexCollections } from "@/lib/photography";

export default function PhotographyPage() {
  const collections = getIndexCollections();

  return (
    <>
      <ShotByMelaniHeader theme="overlay" />
      <PortfolioIndex collections={collections} />
      <ShotByMelaniFooter />
    </>
  );
}
