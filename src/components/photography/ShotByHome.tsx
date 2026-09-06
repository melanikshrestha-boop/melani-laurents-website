import Image from "next/image";
import Link from "next/link";
import { ShotByChrome, ShotByFooter } from "@/components/photography/ShotByChrome";
import { SHOTBY_GALLERIES, SHOTBY_HERO } from "@/data/shotby-catalog";

export function ShotByHome() {
  return (
    <div className="shotby-home">
      <div className="shotby-home__stage">
        <Image
          src={SHOTBY_HERO}
          alt=""
          fill
          priority
          sizes="100vw"
          className="shotby-home__still"
          style={{ objectFit: "cover", objectPosition: "center 58%" }}
        />
        <ShotByChrome overlay />
        <ul className="shotby-home__list">
          {SHOTBY_GALLERIES.map((gallery) => (
            <li key={gallery.id}>
              <Link href={gallery.href} className="shotby-home__item">
                <span className="shotby-home__title">{gallery.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ShotByFooter />
    </div>
  );
}
