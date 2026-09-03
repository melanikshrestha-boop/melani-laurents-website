import { relativeTime } from "@/lib/linkree/relative-time";
import { getLatestYoutube } from "@/lib/linkree/youtube";

/** Server-rendered. Never paint a loading tile — empty feed used to flash a cream square then vanish. */
export async function YoutubeLatest() {
  const data = await getLatestYoutube();
  if ("empty" in data) return null;

  return (
    <a
      className="yt-latest"
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      data-link-id="youtube-latest"
    >
      <span className="yt-latest-thumb">
        <img src={data.thumb} alt="" width={480} height={270} />
        <span className="yt-latest-play" aria-hidden="true" />
      </span>
      <span className="yt-latest-copy">
        <span className="yt-latest-label">latest video</span>
        <span className="yt-latest-title">{data.title}</span>
        <span className="yt-latest-date">{relativeTime(data.publishedAt)}</span>
      </span>
    </a>
  );
}
