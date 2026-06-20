import type { Metadata } from "next";
import Image from "next/image";
import { ShotByMelaniFooter } from "@/components/photography/ShotByMelaniFooter";
import { ShotByMelaniHeader } from "@/components/photography/ShotByMelaniHeader";
import { ABOUT_PORTRAIT } from "@/lib/photography";

export const metadata: Metadata = {
  title: "About — shotbymelani",
};

export default function PhotographyAboutPage() {
  return (
    <>
      <ShotByMelaniHeader theme="light" />
      <article className="photography-about">
        <div className="photography-about-hero">
          <div className="photography-about-copy">
            <h1>MELANI Shrestha</h1>
            <p>
              I&apos;m Melani Shrestha, a photographer based in Los Angeles,
              California with roots in New York City.
            </p>
            <p>
              My work blends portraits, photojournalism, and scenery photography.
              Portraits are the foundation of my side business — they let me work
              directly with clients, understand their vision, and create images
              that feel true to them. Photojournalism is how I document real
              issues and bring attention to the stories that often go unseen.
              Scenery photography is a personal hobby that grounds me and keeps
              me connected to my surroundings.
            </p>
            <p>
              My Gear: I shoot with a Sony A7III and a Godox V860III flash,
              along with a range of lenses and editing tools in Lightroom and
              Photoshop to ensure high-quality results across different settings.
            </p>
            <p>
              For bookings or collaborations, feel free to DM me on instagram or
              email me directly.
            </p>
            <p>
              Instagram:{" "}
              <a href="https://www.instagram.com/shotbymelanis/">@shotbymelanis</a>
              <br />
              Email:{" "}
              <a href="mailto:melanikshrestha@gmail.com">
                melanikshrestha@gmail.com
              </a>
            </p>
          </div>

          <div className="photography-about-photo">
            <Image
              src={ABOUT_PORTRAIT}
              alt="Melani Shrestha"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 45vw"
              className="photography-about-photo-image"
            />
          </div>
        </div>

        <section id="contact" className="photography-contact">
          <h2>Contact us</h2>
          <p>
            Interested in working together? Fill out some info and we will be in
            touch shortly. We can&apos;t wait to hear from you!
          </p>
          <form
            className="photography-form"
            action="mailto:shotbymelani@gmail.com"
            method="post"
            encType="text/plain"
          >
            <div>
              <label htmlFor="firstName">First Name (required)</label>
              <input id="firstName" name="firstName" required />
            </div>
            <div>
              <label htmlFor="lastName">Last Name (required)</label>
              <input id="lastName" name="lastName" required />
            </div>
            <div>
              <label htmlFor="email">Email (required)</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div className="photography-form-checkbox">
              <input
                id="newsletter"
                name="newsletter"
                type="checkbox"
                value="Sign up for news and updates"
              />
              <label htmlFor="newsletter">Sign up for news and updates</label>
            </div>
            <div>
              <label htmlFor="message">Message (required)</label>
              <textarea id="message" name="message" required />
            </div>
            <button type="submit">Submit</button>
          </form>
        </section>
      </article>
      <ShotByMelaniFooter />
    </>
  );
}
