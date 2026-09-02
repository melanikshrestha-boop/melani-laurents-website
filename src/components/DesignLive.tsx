"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type DesignLiveProps = {
  src: string;
  title: string;
  previewImage: string;
};

/** Real site in the card. ← reloads the original URL after in-frame clicks. */
export function DesignLive({ src, title, previewImage }: DesignLiveProps) {
  const [gen, setGen] = useState(0);

  const backToOriginal = useCallback(() => {
    setGen((n) => n + 1);
  }, []);

  return (
    <>
      <div className="bs-scholar__page bs-scholar__page--site bs-scholar__page--live">
      <div className="bs-scholar__window">
        <Image
          src={previewImage}
          alt=""
          width={1440}
          height={900}
          sizes="(max-width: 560px) calc(100vw - 2rem), 92vw"
          loading="eager"
          unoptimized
          className="bs-scholar__preview bs-scholar__preview--fallback"
        />
        <iframe
          key={gen}
          className="bs-scholar__live"
          src={src}
          title={title}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      </div>
      <div className="bs-scholar__open">
        <button
          type="button"
          className="bs-scholar__back"
          onClick={backToOriginal}
          aria-label={`Back to ${title}`}
        >
          ←
        </button>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title} ↗`}
        >
          ↗
        </a>
      </div>
    </>
  );
}
