import type { Metadata } from "next";
import Image from "next/image";
import { photographyBooking } from "@/data/photography-meta";
import { PhotographyBookingForm } from "@/components/photography/PhotographyBookingForm";
import { ShotByMelaniFooter } from "@/components/photography/ShotByMelaniFooter";
import { ShotByMelaniHeader } from "@/components/photography/ShotByMelaniHeader";
import {
  ABOUT_PORTRAIT,
  getPhotographyInstagramHandle,
  getPhotographyInstagramHref,
} from "@/lib/photography";

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
              For bookings or collaborations, use the form below or reach out on
              Instagram.
            </p>
            <p>
              Instagram:{" "}
              <a
                href={getPhotographyInstagramHref()}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{getPhotographyInstagramHandle()}
              </a>
              <br />
              Email:{" "}
              <a href={`mailto:${photographyBooking.email}`}>
                {photographyBooking.email}
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

        <section id="book" className="photography-contact">
          <h2>Book a shoot</h2>
          <p>{photographyBooking.contactLead}</p>

          <ol className="photography-booking-steps">
            {photographyBooking.steps.map((step, index) => (
              <li key={step}>
                <span className="photography-booking-step-number">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <PhotographyBookingForm />
        </section>
      </article>
      <ShotByMelaniFooter />
    </>
  );
}
