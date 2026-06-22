import {
  getPhotographyInstagramHandle,
  getPhotographyInstagramHref,
} from "@/lib/photography";
import { ListeningNote } from "@/components/ListeningNote";

export function ShotByMelaniFooter() {
  const instagramHref = getPhotographyInstagramHref();
  const instagramHandle = getPhotographyInstagramHandle();

  return (
    <footer className="photography-footer">
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
          <p className="photography-footer-text">
            Based in Los Angeles, California
          </p>
        </div>
        <div>
          <h4 className="photography-footer-label">Contact</h4>
          <p className="photography-footer-text">
            <a href="mailto:shotbymelani@gmail.com">shotbymelani@gmail.com</a>
            <br />
            <a href="tel:+13475464259">(347) 546-4259</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
