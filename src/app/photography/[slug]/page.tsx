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
          <h1 className="portfolio-collection-header__current">
            {collection.title}
          </h1>
        )}
      </header>
      {slug === "sketches" ? (
        <blockquote className="portfolio-sketch-quote">
          <p>
            &ldquo;I made the decision at sixteen or seventeen that what I did, I
            wanted everybody to see I wasn&rsquo;t going after the aestheticism or
            the monastery or the lone artist who supposedly doesn&rsquo;t care what
            people think about his work. I care a lot whether people hate it or
            love it, because it&rsquo;s part of me and it hurts me when they hate
            it, or hate me, and it&rsquo;s pleasing when they like it. But, as many
            public figures have said, &ldquo;The praise is never enough, and the
            criticism always bites deep.&rdquo;&rdquo;
          </p>
          <cite>John Lennon, 1980</cite>
        </blockquote>
      ) : null}
      <PortfolioGallery
        photos={collection.photos}
        layout={
          isScenery ? "scenery" : slug === "sketches" ? "sketches" : "grid"
        }
        showStatement={isPortraits}
        story={slug === "sketches" ? collection.story : undefined}
      />
    </>
  );
}
