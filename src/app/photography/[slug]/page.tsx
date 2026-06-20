import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioGallery } from "@/components/photography/PortfolioGallery";
import { PortfolioPagination } from "@/components/photography/PortfolioPagination";
import { ShotByMelaniFooter } from "@/components/photography/ShotByMelaniFooter";
import { ShotByMelaniHeader } from "@/components/photography/ShotByMelaniHeader";
import {
  getAdjacentCollections,
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
  if (!collection) return { title: "shotbymelani" };
  return {
    title: `${collection.title} — shotbymelani`,
  };
}

export default async function PhotographyCollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getPhotoCollection(slug);
  if (!collection) notFound();

  const { prev, next } = getAdjacentCollections(slug);

  return (
    <>
      <ShotByMelaniHeader theme="light" />
      <PortfolioGallery photos={collection.photos} />
      <PortfolioPagination prev={prev} next={next} />
      <ShotByMelaniFooter />
    </>
  );
}
