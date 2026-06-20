"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { IntroScene } from "./IntroScene";
import {
  INTRO_DURATION_MS,
  getIntroState,
} from "./intro-timeline";

interface IntroCanvasProps {
  onReady: () => void;
  onComplete: () => void;
  onShowBranding: () => void;
}

function CanvasFallback() {
  return null;
}

export default function IntroCanvas({
  onReady,
  onComplete,
  onShowBranding,
}: IntroCanvasProps) {
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number | null>(null);
  const brandingSent = useRef(false);
  const completeSent = useRef(false);

  useEffect(() => {
    onReady();
    let raf = 0;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / INTRO_DURATION_MS, 1);
      setProgress(t);

      if (t >= 0.78 && !brandingSent.current) {
        brandingSent.current = true;
        onShowBranding();
      }

      if (t >= 1) {
        if (!completeSent.current) {
          completeSent.current = true;
          onComplete();
        }
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete, onReady, onShowBranding]);

  const state = getIntroState(progress);

  return (
    <>
      <Canvas
        className="h-full w-full"
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ fov: 42, near: 0.1, far: 50, position: [3.2, 1.65, 4.4] }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000");
          gl.toneMappingExposure = 1.05;
        }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 6, 14]} />
        <Suspense fallback={<CanvasFallback />}>
          <IntroScene progress={progress} getState={getIntroState} />
        </Suspense>
      </Canvas>

      <div
        className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: 1 - state.sceneOpacity }}
      />

      {state.impactFlash > 0 && (
        <div
          className="pointer-events-none absolute inset-0 bg-[#030508]"
          style={{ opacity: state.impactFlash * 0.22 }}
        />
      )}

      {state.vignette > 0 && (
        <div
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: state.vignette * 0.85 }}
        />
      )}
    </>
  );
}
