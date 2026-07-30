import {
  getPhotographyInstagramHandle,
  getPhotographyInstagramHref,
} from "@/lib/photography";
import { siteConfig } from "@/config/site";

/**
 * Photography footer — Instagram, location, contact.
 * Spotify / ListeningNote removed (commit: remove photo Spotify footer).
 */
export function ShotByMelaniFooter() {
  const instagramHref = getPhotographyInstagramHref();
  const instagramHandle = getPhotographyInstagramHandle();

  return (
    <footer className="photography-footer">
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
          <p className="photography-footer-text">
            Mostly in Los Angeles — sometimes SF or NYC.
          </p>
        </div>
        <div>
          <h4 className="photography-footer-label">Contact</h4>
          <p className="photography-footer-text">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
