import Image from "next/image";
import { ShotByChrome, ShotByFooter } from "@/components/photography/ShotByChrome";
import { SHOTBY_ABOUT_PORTRAIT } from "@/data/shotby-catalog";

export function ShotByAbout() {
  return (
    <div className="shotby-page">
      <ShotByChrome />
      <section className="shotby-about">
        <div className="shotby-about__copy">
          <h1 className="shotby-about__name">MELANI SHRESTHA</h1>
          <p>
            I&apos;m Melani Shrestha, a photographer based in{" "}
            <strong>Los Angeles, California</strong> with roots in New York
            City.
          </p>
          <p>
            My work blends <strong>portraits, photojournalism, and scenery
            photography</strong>. Portraits are the foundation of my side
            business – they let me work directly with clients, understand
            their vision, and create images that feel true to them.
            Photojournalism is how I document real issues and bring attention
            to the stories that often go unseen. Scenery photography is a
            personal hobby that grounds me and keeps me connected to my
            surroundings.
          </p>
          <p>
            <strong>My Gear:</strong> I shoot with a Sony A7III and a Godox
            V860III flash, along with a range of lenses and editing tools in
            Lightroom and Photoshop to ensure high-quality results across
            different settings.
          </p>
          <p>
            For bookings or collaborations, feel free to DM me on instagram or
            email me directly.
          </p>
          <p>
            <strong>Instagram:</strong> @shotbymelanis
          </p>
          <p>
            <strong>Email:</strong> melanikshrestha@gmail.com
          </p>
        </div>
        <div className="shotby-about__still">
          <Image
            src={SHOTBY_ABOUT_PORTRAIT}
            alt=""
            width={900}
            height={1230}
            className="shotby-about__img"
            priority
          />
        </div>
      </section>
      <ShotByFooter />
    </div>
  );
}
