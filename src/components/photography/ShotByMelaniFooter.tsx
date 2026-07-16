import {
  getPhotographyInstagramHandle,
  getPhotographyInstagramHref,
} from "@/lib/photography";
import { ListeningNote } from "@/components/ListeningNote";
import { siteConfig } from "@/config/site";

export function ShotByMelaniFooter() {
  const instagramHref = getPhotographyInstagramHref();
  const instagramHandle = getPhotographyInstagramHandle();

  return (
    <footer className="photography-footer">
      {/* Same soft body font as “While I was writing this…” via ListeningNote + footer styles */}
      <ListeningNote context="art" />
      <div className="photography-footer-grid">
        <div>
          <h2 className="photography-footer-title">
            <a href={instagramHref} target="_blank" rel="noopener noreferrer">
              @{instagramHandle}
            </a>
          </h2>
        </div>
        <div>
          <h4 className="photography-footer-label">Location</h4>
          {/* Casual — not corporate “Based in…” */}
          <p className="photography-footer-text">
            Mostly in Los Angeles — sometimes SF or NYC.
          </p>
        </div>
        <div>
          <h4 className="photography-footer-label">Contact</h4>
          {/* Email only — never show a phone number */}
          <p className="photography-footer-text">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
