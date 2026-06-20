"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  readBackgroundAnimationPreference,
  writeBackgroundAnimationPreference,
} from "@/lib/background-animation";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return readBackgroundAnimationPreference();
}

function getServerSnapshot() {
  return false;
}

export function useBackgroundAnimation() {
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback(() => {
    writeBackgroundAnimationPreference(!getSnapshot());
    emitChange();
  }, []);

  return { enabled, toggle, ready };
}
