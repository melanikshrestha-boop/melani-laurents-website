"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { writeMotionScrollPreference } from "@/lib/motion-scroll";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

type MotionMode = "camera" | "tilt" | null;

const SCROLL_GAIN = 2.4;
const SCROLL_DAMP = 0.88;
const MAX_SCROLL_STEP = 18;

function smoothScrollBy(delta: number) {
  if (Math.abs(delta) < 0.15) return;
  const step = Math.max(-MAX_SCROLL_STEP, Math.min(MAX_SCROLL_STEP, delta));
  window.scrollBy({ top: step, behavior: "auto" });
}

export function useMotionScroll() {
  const reducedMotion = useReducedMotionPreference();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<MotionMode>(null);
  const [cameraLive, setCameraLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enabledRef = useRef(false);
  const velocityRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const analyzeRafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const neutralBetaRef = useRef<number | null>(null);
  const tiltCleanupRef = useRef<(() => void) | null>(null);

  enabledRef.current = enabled;

  const stopScrollLoop = useCallback(() => {
    if (scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }
    velocityRef.current = 0;
  }, []);

  const stopCamera = useCallback(() => {
    if (analyzeRafRef.current !== null) {
      cancelAnimationFrame(analyzeRafRef.current);
      analyzeRafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    prevFrameRef.current = null;
    setCameraLive(false);
  }, []);

  const stopTilt = useCallback(() => {
    tiltCleanupRef.current?.();
    tiltCleanupRef.current = null;
  }, []);

  const stopAll = useCallback(() => {
    stopScrollLoop();
    stopCamera();
    stopTilt();
    setMode(null);
  }, [stopScrollLoop, stopCamera, stopTilt]);

  const disable = useCallback(() => {
    enabledRef.current = false;
    writeMotionScrollPreference(false);
    setEnabled(false);
    setError(null);
    stopAll();
  }, [stopAll]);

  const runScrollLoop = useCallback(() => {
    const tick = () => {
      if (!enabledRef.current) return;
      velocityRef.current *= SCROLL_DAMP;
      smoothScrollBy(velocityRef.current);
      scrollRafRef.current = requestAnimationFrame(tick);
    };
    stopScrollLoop();
    scrollRafRef.current = requestAnimationFrame(tick);
  }, [stopScrollLoop]);

  const startTilt = useCallback(() => {
    setMode("tilt");
    neutralBetaRef.current = null;

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (!enabledRef.current || e.beta == null) return;
      if (neutralBetaRef.current === null) {
        neutralBetaRef.current = e.beta;
        return;
      }
      const delta = e.beta - neutralBetaRef.current;
      velocityRef.current += delta * 0.06 * SCROLL_GAIN;
    };

    window.addEventListener("deviceorientation", onOrientation);
    tiltCleanupRef.current = () => {
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, []);

  const startCamera = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return false;
    if (!navigator.mediaDevices?.getUserMedia) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 240, height: 180 },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();
      setCameraLive(true);
      setMode("camera");

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return true;

      canvas.width = 160;
      canvas.height = 120;

      const analyze = () => {
        if (!enabledRef.current) return;

        if (video.readyState >= 2) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = frame.data;
          const prev = prevFrameRef.current;

          if (prev && prev.length === data.length) {
            const h = canvas.height;
            const w = canvas.width;
            const bandH = Math.floor(h / 3);
            let top = 0;
            let bottom = 0;

            for (let y = 0; y < h; y++) {
              const band = y < bandH ? "top" : y >= h - bandH ? "bottom" : "mid";
              if (band === "mid") continue;
              for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const diff =
                  Math.abs(data[i] - prev[i]) +
                  Math.abs(data[i + 1] - prev[i + 1]) +
                  Math.abs(data[i + 2] - prev[i + 2]);
                if (band === "top") top += diff;
                else bottom += diff;
              }
            }

            const motionDelta = (bottom - top) / (w * bandH * 3);
            velocityRef.current += motionDelta * 0.35 * SCROLL_GAIN;
          }

          prevFrameRef.current = new Uint8ClampedArray(data);
        }

        analyzeRafRef.current = requestAnimationFrame(analyze);
      };

      analyzeRafRef.current = requestAnimationFrame(analyze);
      return true;
    } catch {
      return false;
    }
  }, []);

  const enable = useCallback(async () => {
    if (reducedMotion) {
      setError("Reduced motion is on");
      return;
    }

    setError(null);
    enabledRef.current = true;
    writeMotionScrollPreference(true);
    setEnabled(true);
    runScrollLoop();

    const cameraOk = await startCamera();
    if (!cameraOk) {
      stopCamera();
      if (typeof DeviceOrientationEvent !== "undefined") {
        startTilt();
        return;
      }
      disable();
      setError("Camera and tilt unavailable");
    }
  }, [reducedMotion, startCamera, startTilt, stopCamera, disable, runScrollLoop]);

  const toggle = useCallback(() => {
    if (enabled) {
      disable();
    } else {
      void enable();
    }
  }, [enabled, disable, enable]);

  useEffect(() => {
    if (reducedMotion && enabled) disable();
  }, [reducedMotion, enabled, disable]);

  useEffect(() => () => stopAll(), [stopAll]);

  return {
    enabled,
    mode,
    cameraLive,
    error,
    reducedMotion,
    toggle,
    disable,
    videoRef,
    canvasRef,
  };
}
