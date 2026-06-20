/** Shared Halley's Comet renderer — gold head, blue-white ion tail. */

const GOLD = { r: 255, g: 195, b: 72 };
const GOLD_CORE = { r: 255, g: 220, b: 120 };
const ION = { r: 180, g: 220, b: 255 };

export interface CometState {
  /** Normalized head position 0–1 across viewport */
  headX: number;
  headY: number;
  /** Tail angle in radians */
  angle: number;
  /** Brightness boost from scroll / pointer */
  intensity: number;
}

export interface CometDrawOptions {
  w: number;
  h: number;
  t: number;
  scrollBoost: number;
  mouseX: number;
  mouseY: number;
  /** 0–1 visibility — archive full, hub subtle */
  opacity?: number;
}

export function computeCometState(
  t: number,
  scrollBoost: number,
  mouseX: number,
  mouseY: number,
): CometState {
  const orbit = t * 0.22 + scrollBoost * 0.08;
  const headX = 0.12 + ((Math.sin(orbit * 0.7) + 1) / 2) * 0.76;
  const headY = 0.18 + ((Math.cos(orbit * 0.55 + 0.4) + 1) / 2) * 0.52;
  const angle =
    Math.PI * 0.72 +
    Math.sin(orbit * 0.9) * 0.35 +
    (mouseX - 0.5) * 0.5 +
    scrollBoost * 0.12;
  const intensity = Math.min(
    1,
    0.55 + scrollBoost * 0.35 + Math.abs(mouseY - 0.5) * 0.4,
  );

  return { headX, headY, angle, intensity };
}

export function drawHalleyComet(
  ctx: CanvasRenderingContext2D,
  state: CometState,
  opts: CometDrawOptions,
) {
  const { w, h, t, scrollBoost, opacity = 1 } = opts;
  if (opacity <= 0.01) return;

  const hx = state.headX * w;
  const hy = state.headY * h;
  const tailLen = w * (0.28 + state.intensity * 0.18 + scrollBoost * 0.06);
  const tailW = h * 0.045;

  const tx = hx - Math.cos(state.angle) * tailLen;
  const ty = hy - Math.sin(state.angle) * tailLen;

  ctx.save();
  ctx.globalAlpha = opacity;

  // Ion tail — layered blue-white streaks
  for (let layer = 0; layer < 5; layer++) {
    const spread = (layer - 2) * tailW * 0.35;
    const perpX = Math.sin(state.angle) * spread;
    const perpY = -Math.cos(state.angle) * spread;
    const layerAlpha = (0.22 - layer * 0.035) * state.intensity;

    const grad = ctx.createLinearGradient(hx, hy, tx + perpX, ty + perpY);
    grad.addColorStop(0, `rgba(${ION.r}, ${ION.g}, ${ION.b}, ${layerAlpha * 1.4})`);
    grad.addColorStop(0.35, `rgba(${ION.r}, ${ION.g}, ${ION.b}, ${layerAlpha * 0.6})`);
    grad.addColorStop(1, "transparent");

    ctx.strokeStyle = grad;
    ctx.lineWidth = tailW * (0.55 - layer * 0.08);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(hx, hy);

    const cp1x = hx - Math.cos(state.angle) * tailLen * 0.35 + perpX * 0.5;
    const cp1y = hy - Math.sin(state.angle) * tailLen * 0.35 + perpY * 0.5;
    const endX = tx + perpX + Math.sin(t * 2 + layer) * 8;
    const endY = ty + perpY + Math.cos(t * 1.6 + layer) * 6;

    ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
    ctx.stroke();
  }

  // Dust tail — warm amber secondary
  const dustGrad = ctx.createLinearGradient(hx, hy, tx, ty);
  dustGrad.addColorStop(0, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${0.35 * state.intensity})`);
  dustGrad.addColorStop(0.5, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${0.12 * state.intensity})`);
  dustGrad.addColorStop(1, "transparent");

  ctx.strokeStyle = dustGrad;
  ctx.lineWidth = tailW * 0.7;
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  const dustAngle = state.angle + Math.sin(t * 0.8) * 0.15;
  ctx.lineTo(
    hx - Math.cos(dustAngle) * tailLen * 0.65,
    hy - Math.sin(dustAngle) * tailLen * 0.65,
  );
  ctx.stroke();

  // Coma glow
  const comaR = 18 + state.intensity * 14 + scrollBoost * 6;
  const comaGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, comaR * 2.2);
  comaGrad.addColorStop(0, `rgba(${GOLD_CORE.r}, ${GOLD_CORE.g}, ${GOLD_CORE.b}, ${0.95 * state.intensity})`);
  comaGrad.addColorStop(0.25, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${0.55 * state.intensity})`);
  comaGrad.addColorStop(0.6, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${0.15 * state.intensity})`);
  comaGrad.addColorStop(1, "transparent");
  ctx.fillStyle = comaGrad;
  ctx.beginPath();
  ctx.arc(hx, hy, comaR * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Nucleus
  ctx.fillStyle = `rgba(255, 240, 200, ${0.92 * state.intensity})`;
  ctx.beginPath();
  ctx.arc(hx, hy, 3.5 + state.intensity * 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
