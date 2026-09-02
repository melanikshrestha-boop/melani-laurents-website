import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioGallery } from "@/components/photography/PortfolioGallery";
import { PortraitBooker } from "@/components/photography/PortraitBooker";
import { SceneryPrints } from "@/components/photography/SceneryPrints";
import {
  getPhotoCollection,
  getPhotoCollectionSlugs,
} from "@/lib/photography";
import { erenTabIcons } from "@/lib/eren-tab";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPhotoCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getPhotoCollection(slug);
  if (!collection) return { title: "shotbyceline", icons: erenTabIcons };
  return {
    title: `${collection.title} | shotbyceline`,
    icons: erenTabIcons,
  };
}

export default async function PhotographyCollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getPhotoCollection(slug);
  if (!collection) notFound();

  const isScenery = slug === "scenery";
  const isPortraits = slug === "portraits";
  const isEditorialArchive = ["sketches", "film", "poem"].includes(slug);
  const isPhotographyCollection = isScenery || isPortraits;

  return (
    <>
      <header
        className={`portfolio-collection-header${
          isEditorialArchive ? " portfolio-collection-header--editorial" : ""
        }`}
      >
        {isPhotographyCollection ? (
          <nav
            className="portfolio-collection-header__pager"
            aria-label="Photography collections"
          >
            {isScenery ? (
              <h1 className="portfolio-collection-header__current">
                <span aria-hidden>←</span> Scenery
              </h1>
            ) : (
              <Link
                href="/photography/scenery"
                className="portfolio-collection-header__peer"
              >
                <span aria-hidden>←</span> Scenery
              </Link>
            )}
            <div className="portfolio-collection-header__mid">
              {isPortraits ? <PortraitBooker /> : null}
              {isScenery ? <SceneryPrints /> : null}
            </div>
            {isPortraits ? (
              <h1 className="portfolio-collection-header__current">
                Portraits <span aria-hidden>→</span>
              </h1>
            ) : (
              <Link
                href="/photography/portraits"
                className="portfolio-collection-header__peer"
              >
                Portraits <span aria-hidden>→</span>
              </Link>
            )}
          </nav>
        ) : (
          <div className="portfolio-collection-header__copy">
            <h1 className="portfolio-collection-header__current">
              {collection.title}
            </h1>
            {slug === "poem" ? (
              <p className="portfolio-collection-header__category">
                Short Stories
              </p>
            ) : null}
          </div>
        )}
      </header>
      <PortfolioGallery
        photos={collection.photos}
        layout={
          isScenery
            ? "scenery"
            : isPortraits
              ? "portraits"
              : slug === "sketches" || slug === "poem"
                ? "sketches"
                : "grid"
        }
        story={slug === "sketches" ? collection.story : undefined}
      />
    </>
  );
}
