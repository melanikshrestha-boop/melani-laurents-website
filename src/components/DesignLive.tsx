import Image from "next/image";

type DesignLiveProps = {
  src: string;
  title: string;
  previewImage: string;
};

/** Real site in the card — scroll, click, book. Still sits behind if the embed is slow. */
export function DesignLive({ src, title, previewImage }: DesignLiveProps) {
  return (
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
        className="bs-scholar__live"
        src={src}
        title={title}
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
