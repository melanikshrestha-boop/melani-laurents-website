export const INTRO_DURATION_MS = 5000;
export const INTRO_KEY = "mls-intro-seen";

/** Re-export cinematic intro timing — see NeuralCinemaIntro.tsx */
export {
  INTRO_TIMELINE,
  INTRO_HANDOFF_START_EVENT,
  INTRO_COMPLETE_EVENT,
} from "@/components/cinema/NeuralCinemaIntro";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function easeInQuad(t: number) {
  return t * t;
}

export function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export interface IntroState {
  sceneOpacity: number;
  appleY: number;
  appleRot: number;
  appleOnBranch: boolean;
  impactFlash: number;
  headLookUp: number;
  transformProgress: number;
  logoProgress: number;
  neuralProgress: number;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  appleScale: number;
  appleMetal: number;
  hideNature: number;
  vignette: number;
}

export function getIntroState(t: number): IntroState {
  const sceneOpacity = easeOutCubic(clamp(t / 0.1, 0, 1));

  const headLookUp =
    t < 0.38
      ? easeInOutCubic(clamp((t - 0.15) / 0.18, 0, 1)) * 0.55
      : 0.55 + easeOutCubic(clamp((t - 0.58) / 0.08, 0, 1)) * 0.25;

  let appleY = 2.05;
  let appleRot = 0;
  let appleOnBranch = true;

  if (t >= 0.38 && t < 0.58) {
    appleOnBranch = false;
    const fall = (t - 0.38) / 0.2;
    const eased = easeInQuad(fall);
    appleY = 2.05 - eased * 1.55;
    appleRot = eased * Math.PI * 4;
  } else if (t >= 0.58) {
    appleOnBranch = false;
    appleY = 0.5;
    appleRot = Math.PI * 4;
  }

  let impactFlash = 0;
  if (t >= 0.58 && t < 0.66) {
    impactFlash = 1 - (t - 0.58) / 0.08;
  }

  const transformProgress = easeInOutCubic(clamp((t - 0.64) / 0.24, 0, 1));
  const logoProgress = easeOutCubic(clamp((transformProgress - 0.12) / 0.88, 0, 1));
  const neuralProgress = easeOutCubic(
    clamp((transformProgress - 0.45) / 0.55, 0, 1),
  );

  const hideNature = easeInOutCubic(clamp((transformProgress - 0.05) / 0.45, 0, 1));

  let appleScale = 1;
  let appleMetal = 0;
  if (transformProgress > 0) {
    appleScale = 1 + transformProgress * 0.35;
    appleMetal = clamp(transformProgress * 1.4, 0, 1);
    if (transformProgress > 0.2) {
      appleY = 0.5 + transformProgress * 0.85;
    }
  }

  let cameraPos: [number, number, number] = [3.2, 1.65, 4.4];
  let cameraTarget: [number, number, number] = [0.15, 0.75, 0];

  if (t < 0.38) {
    const reveal = easeOutCubic(clamp(t / 0.22, 0, 1));
    cameraPos = [
      3.6 - reveal * 0.35,
      1.85 - reveal * 0.15,
      4.8 - reveal * 0.35,
    ];
  } else if (t < 0.58) {
    const push = (t - 0.38) / 0.2;
    cameraPos = [
      3.25 - push * 0.45,
      1.7 - push * 0.08,
      4.45 - push * 0.35,
    ];
    cameraTarget = [0.15, 0.75 + push * 0.15, 0];
  } else if (t < 0.64) {
    cameraPos = [2.8, 1.62, 4.1];
    cameraTarget = [0.2, 0.82, 0];
  } else {
    const orbit = transformProgress;
    const angle = orbit * Math.PI * 0.35;
    const radius = 3.4 - orbit * 0.9;
    cameraPos = [
      Math.sin(angle) * radius,
      1.35 + orbit * 0.55,
      Math.cos(angle) * radius,
    ];
    cameraTarget = [0, 0.95 + orbit * 0.35, 0];
  }

  const vignette = t > 0.88 ? clamp((t - 0.88) / 0.12, 0, 1) : 0;

  return {
    sceneOpacity,
    appleY,
    appleRot,
    appleOnBranch,
    impactFlash,
    headLookUp,
    transformProgress,
    logoProgress,
    neuralProgress,
    cameraPos,
    cameraTarget,
    appleScale,
    appleMetal,
    hideNature,
    vignette,
  };
}
