import { HomeHub } from "@/components/HomeHub";
import { HomeRecentArchive } from "@/components/HomeRecentArchive";
import { HomeSectionsShell } from "@/components/HomeSectionsShell";

export default function Home() {
  return (
    <HomeSectionsShell>
      <HomeHub />
      <HomeRecentArchive />
    </HomeSectionsShell>
  );
}
