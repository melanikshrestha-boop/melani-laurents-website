"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

interface CinemaContextValue {
  soundtrackOn: boolean;
  promptVisible: boolean;
  toggleSoundtrack: () => void;
  enableSoundtrack: () => void;
  dismissPrompt: () => void;
}

const CinemaContext = createContext<CinemaContextValue | null>(null);

/** Audio disabled site-wide — no auto-play, no prompts, no creepy soundscape. */
export function CinemaProvider({ children }: { children: React.ReactNode }) {
  const noop = useCallback(() => {}, []);

  const value = useMemo(
    () => ({
      soundtrackOn: false,
      promptVisible: false,
      toggleSoundtrack: noop,
      enableSoundtrack: noop,
      dismissPrompt: noop,
    }),
    [noop],
  );

  return (
    <CinemaContext.Provider value={value}>{children}</CinemaContext.Provider>
  );
}

export function useCinema() {
  const ctx = useContext(CinemaContext);
  if (!ctx) throw new Error("useCinema must be used within CinemaProvider");
  return ctx;
}
