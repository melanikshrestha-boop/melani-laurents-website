"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { focusTechnoAudio } from "@/lib/focus-techno-audio";

const STORAGE_KEY = "mls-soundtrack";

interface CinemaContextValue {
  soundtrackOn: boolean;
  promptVisible: boolean;
  toggleSoundtrack: () => void;
  enableSoundtrack: () => void;
  dismissPrompt: () => void;
}

const CinemaContext = createContext<CinemaContextValue | null>(null);

export function CinemaProvider({ children }: { children: React.ReactNode }) {
  const [soundtrackOn, setSoundtrackOn] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saved = localStorage.getItem(STORAGE_KEY);
    setReady(true);

    if (reduced) return;

    if (saved === "on") {
      setSoundtrackOn(true);
      void focusTechnoAudio.start();
    } else if (sessionStorage.getItem("mls-intro-seen") === "1") {
      setPromptVisible(true);
    }
  }, []);

  useEffect(() => {
    const onIntroDone = () => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setPromptVisible(true);
      }
    };

    window.addEventListener("mls-intro-complete", onIntroDone);
    return () => window.removeEventListener("mls-intro-complete", onIntroDone);
  }, []);

  const enableSoundtrack = useCallback(async () => {
    await focusTechnoAudio.start();
    setSoundtrackOn(true);
    setPromptVisible(false);
    localStorage.setItem(STORAGE_KEY, "on");
  }, []);

  const toggleSoundtrack = useCallback(async () => {
    if (soundtrackOn) {
      await focusTechnoAudio.stop();
      setSoundtrackOn(false);
      localStorage.setItem(STORAGE_KEY, "off");
    } else {
      await enableSoundtrack();
    }
  }, [enableSoundtrack, soundtrackOn]);

  const dismissPrompt = useCallback(() => {
    setPromptVisible(false);
    localStorage.setItem(STORAGE_KEY, "off");
  }, []);

  const value = useMemo(
    () => ({
      soundtrackOn,
      promptVisible: ready && promptVisible && !soundtrackOn,
      toggleSoundtrack,
      enableSoundtrack,
      dismissPrompt,
    }),
    [
      dismissPrompt,
      enableSoundtrack,
      promptVisible,
      ready,
      soundtrackOn,
      toggleSoundtrack,
    ],
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
