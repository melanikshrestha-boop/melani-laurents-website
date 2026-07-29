import { permanentRedirect } from "next/navigation";

export default function PodcastRedirect() {
  permanentRedirect("/youtube");
}
