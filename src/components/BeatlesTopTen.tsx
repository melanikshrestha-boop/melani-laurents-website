import { BEATLES_SNIPPET, BEATLES_TOP_TEN } from "@/data/beatles-top-ten";

/** Covers are stills. No href. Click does nothing. */
export function BeatlesTopTen() {
  return (
    <div className="beatles-rank">
      {BEATLES_SNIPPET.map((para) => (
        <p key={para.slice(0, 40)} className="beatles-rank__snippet">
          {para}
        </p>
      ))}
      <ol className="beatles-rank__list">
        {BEATLES_TOP_TEN.map((song) => (
          <li key={song.rank} className="beatles-rank__row">
            <span className="beatles-rank__n">{song.rank}</span>
            <img
              className="beatles-rank__cover"
              src={song.cover}
              alt=""
              width={72}
              height={72}
              draggable={false}
            />
            <span className="beatles-rank__title">{song.title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
