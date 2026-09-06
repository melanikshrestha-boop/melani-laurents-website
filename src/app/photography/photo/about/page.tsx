import { ShotByAbout } from "@/components/photography/ShotByAbout";
import { erenTabIcons } from "@/lib/eren-tab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — shotbymelani",
  icons: erenTabIcons,
};

export default function ShotByAboutPage() {
  return <ShotByAbout />;
}
