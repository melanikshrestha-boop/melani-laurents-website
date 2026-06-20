/** Void backdrop for ambient site background. */
export const STATIC_BACKGROUND_COLOR = "#030508";

export const BACKGROUND_ANIMATION_STORAGE_KEY = "mk-background-animation";

export function readBackgroundAnimationPreference(): boolean {
  if (typeof window === "undefined") return false;

  const stored = localStorage.getItem(BACKGROUND_ANIMATION_STORAGE_KEY);
  if (stored !== null) return stored === "true";

  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function writeBackgroundAnimationPreference(enabled: boolean): void {
  localStorage.setItem(BACKGROUND_ANIMATION_STORAGE_KEY, String(enabled));
}
