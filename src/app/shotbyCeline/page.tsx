import { ShotByHome } from "@/components/photography/ShotByHome";
import { erenTabIcons } from "@/lib/eren-tab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "shotbyCeline",
  icons: erenTabIcons,
};

export default function ShotByCelinePage() {
  return <ShotByHome />;
}
