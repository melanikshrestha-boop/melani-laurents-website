export const MOTION_SCROLL_STORAGE_KEY = "mk-motion-scroll";

export function readMotionScrollPreference(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MOTION_SCROLL_STORAGE_KEY) === "true";
}

export function writeMotionScrollPreference(enabled: boolean): void {
  localStorage.setItem(MOTION_SCROLL_STORAGE_KEY, String(enabled));
}
