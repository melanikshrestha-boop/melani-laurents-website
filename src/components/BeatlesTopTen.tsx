import { BEATLES_SNIPPET, BEATLES_TOP_TEN } from "@/data/beatles-top-ten";

/** Covers are stills. No href. Click does nothing. */
export function BeatlesTopTen() {
  return (
    <div className="beatles-rank">
      <p className="beatles-rank__snippet">{BEATLES_SNIPPET}</p>
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
