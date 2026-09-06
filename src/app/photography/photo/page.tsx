import { ShotByHome } from "@/components/photography/ShotByHome";
import { erenTabIcons } from "@/lib/eren-tab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "shotbymelani",
  icons: erenTabIcons,
};

export default function ShotByPhotoPage() {
  return <ShotByHome />;
}
