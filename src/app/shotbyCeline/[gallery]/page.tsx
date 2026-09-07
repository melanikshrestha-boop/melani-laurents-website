import { notFound } from "next/navigation";
import { ShotByGallery } from "@/components/photography/ShotByGallery";
import { SHOTBY_GALLERIES, type ShotByGalleryId } from "@/data/shotby-catalog";
import { erenTabIcons } from "@/lib/eren-tab";
import type { Metadata } from "next";

const IDS = SHOTBY_GALLERIES.map((g) => g.id);

export function generateStaticParams() {
  return IDS.map((gallery) => ({ gallery }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gallery: string }>;
}): Promise<Metadata> {
  const { gallery } = await params;
  const found = SHOTBY_GALLERIES.find((g) => g.id === gallery);
  if (!found) return { title: "shotbyCeline", icons: erenTabIcons };
  return { title: `${found.label} — shotbyCeline`, icons: erenTabIcons };
}

export default async function ShotByCelineGalleryPage({
  params,
}: {
  params: Promise<{ gallery: string }>;
}) {
  const { gallery } = await params;
  if (!IDS.includes(gallery as ShotByGalleryId)) notFound();
  return <ShotByGallery id={gallery as ShotByGalleryId} />;
}
