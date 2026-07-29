"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  HomeSlideStage,
  HomeSlideToolbar,
  SlidePiece,
  useHomeSlideLayout,
} from "./HomeSlideEditor";
import { InteractiveTitleLetters } from "./InteractiveTitleLetters";
import { MelaniSignature } from "./MelaniSignature";
import { MotionScrollToggle } from "./MotionScrollToggle";
import { SocialIcons } from "./SocialIcons";

/** Carlo Doroff–style editorial hub — free drag layout like Google Slides while editing. */
export function HomeHub() {
  const {
    layout,
    setLayout,
    reset,
    editMode,
    setEditMode,
    selected,
    setSelected,
    setScale,
  } = useHomeSlideLayout();

  const selectedScale = selected ? layout[selected].scale : 1;

  return (
    <section className={`hub-page${editMode ? " hub-page--slide-edit" : ""}`}>
      <HomeSlideStage
        editMode={editMode}
        selected={selected}
        layout={layout}
        onSelect={setSelected}
        onLayoutChange={setLayout}
      >
        <SlidePiece id="brand">
          <div className="hub-page__brand hub-page__brand--slide">
            <MelaniSignature variant="light" linked={!editMode} />
            <p className="hub-page__brand-loc">
              <span className="hub-page__dot-inline" aria-hidden />
              LA / SF / NYC
            </p>
          </div>
        </SlidePiece>

        <SlidePiece id="socials">
          <nav className="hub-page__socials hub-page__socials--slide" aria-label="Social links">
            <SocialIcons size="hub" className="hub-page__social-icons" />
          </nav>
        </SlidePiece>

        <SlidePiece id="title">
          <InteractiveTitleLetters
            variant="hub"
            className="hub-page__title"
            lineClassName="hub-page__title-line"
            interactive={!editMode}
          />
        </SlidePiece>

        <SlidePiece id="tagline">
          <p className="hub-page__tagline">open sourcing my mind.</p>
        </SlidePiece>

        <SlidePiece id="nav">
          <nav className="hub-page__nav hub-page__nav--slide" aria-label="Sections">
            {siteConfig.hubPortals.map((portal, i) => (
              <span key={portal.href} className="hub-page__nav-item">
                {i > 0 ? <span className="hub-page__sep"> · </span> : null}
                {"external" in portal && portal.external ? (
                  <a
                    href={portal.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => {
                      if (editMode) event.preventDefault();
                    }}
                  >
                    {portal.label}
                  </a>
                ) : (
                  <Link
                    href={portal.href}
                    onClick={(event) => {
                      if (editMode) event.preventDefault();
                    }}
                  >
                    {portal.label}
                  </Link>
                )}
              </span>
            ))}
            <span className="hub-page__nav-item hub-page__nav-item--contact">
              <span className="hub-page__sep"> · </span>
              <Link
                href="/contact"
                className="hub-page__nav-contact"
                onClick={(event) => {
                  if (editMode) event.preventDefault();
                }}
              >
                Contact
              </Link>
            </span>
          </nav>
        </SlidePiece>
      </HomeSlideStage>

      <MotionScrollToggle />
      <HomeSlideToolbar
        editMode={editMode}
        onToggleEdit={() => setEditMode((v) => !v)}
        onReset={reset}
        selected={selected}
        scale={selectedScale}
        onScale={setScale}
      />
    </section>
  );
}
