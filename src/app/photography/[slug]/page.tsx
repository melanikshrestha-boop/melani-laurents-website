import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioGallery } from "@/components/photography/PortfolioGallery";
import {
  getPhotoCollection,
  getPhotoCollectionSlugs,
} from "@/lib/photography";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPhotoCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getPhotoCollection(slug);
  if (!collection) return { title: "shotbyceline" };
  return {
    title: `${collection.title} | shotbyceline`,
  };
}

export default async function PhotographyCollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getPhotoCollection(slug);
  if (!collection) notFound();

  const isScenery = slug === "scenery";
  const isPortraits = slug === "portraits";
  const peer = isScenery
    ? { href: "/photography/portraits", label: "Portraits" }
    : isPortraits
      ? { href: "/photography/scenery", label: "Scenery" }
      : null;

  return (
    <>
      <header className="portfolio-collection-header">
        <div className="portfolio-collection-header__copy">
          <p className="portfolio-collection-header__kicker">
            {isScenery
              ? "Scenery prints"
              : isPortraits
                ? "Portrait archive"
                : "Celine Nova"}
          </p>
          <h1>{collection.title}</h1>
        </div>
        {peer ? (
          <Link href={peer.href} className="portfolio-collection-header__peer">
            {peer.label} ↗
          </Link>
        ) : null}
      </header>
      <PortfolioGallery
        photos={collection.photos}
        layout={isScenery ? "scenery" : "grid"}
        showStatement={isPortraits}
      />
    </>
  );
}
