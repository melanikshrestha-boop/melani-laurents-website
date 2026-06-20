/** Shared neurotech palette — dark void (archive) + light editorial (hub/intro). */
export const NEURO = {
  cream: "#f0ede5",
  ink: "#000000",
  inkRgb: "0, 0, 0",
  lineRgb: "52, 50, 46",
  grayRgb: "107, 99, 88",
  accent: "#EF4423",
  accentRgb: "239, 68, 35",
  navy: "#1A2B3C",
  navyRgb: "26, 43, 60",
  void: "#030508",
  ice: "#7eb8da",
  amber: "#d4bc82",
  gold: "#c9a962",
  synapse: "#3a3834",
  synapseLight: "#6b6358",
  iceRgb: "126, 184, 218",
  amberRgb: "212, 188, 130",
  goldRgb: "201, 169, 98",
  synapseRgb: "58, 56, 52",
} as const;

export interface BrainNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulse: number;
  anchorX: number;
  anchorY: number;
}

/** Anatomical anchor regions — bilateral hemispheres + brainstem. */
const BRAIN_REGIONS: { x: number; y: number; spread: number }[] = [
  { x: 0.36, y: 0.28, spread: 0.06 },
  { x: 0.64, y: 0.28, spread: 0.06 },
  { x: 0.3, y: 0.38, spread: 0.055 },
  { x: 0.7, y: 0.38, spread: 0.055 },
  { x: 0.34, y: 0.48, spread: 0.05 },
  { x: 0.66, y: 0.48, spread: 0.05 },
  { x: 0.28, y: 0.56, spread: 0.045 },
  { x: 0.72, y: 0.56, spread: 0.045 },
  { x: 0.42, y: 0.58, spread: 0.04 },
  { x: 0.58, y: 0.58, spread: 0.04 },
  { x: 0.5, y: 0.34, spread: 0.035 },
  { x: 0.5, y: 0.44, spread: 0.03 },
  { x: 0.5, y: 0.52, spread: 0.025 },
  { x: 0.5, y: 0.62, spread: 0.03 },
];

export function createBrainNodes(count: number): BrainNode[] {
  const nodes: BrainNode[] = [];
  for (let i = 0; i < count; i++) {
    const region = BRAIN_REGIONS[i % BRAIN_REGIONS.length];
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * region.spread;
    const ax = region.x + Math.cos(angle) * dist;
    const ay = region.y + Math.sin(angle) * dist * 0.85;
    nodes.push({
      x: ax,
      y: ay,
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00025,
      pulse: Math.random() * Math.PI * 2,
      anchorX: region.x,
      anchorY: region.y,
    });
  }
  return nodes;
}

export function drawVoidBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): void {
  ctx.fillStyle = NEURO.void;
  ctx.fillRect(0, 0, w, h);
}

export function drawCreamBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): void {
  ctx.fillStyle = NEURO.cream;
  ctx.fillRect(0, 0, w, h);
}

export function drawBrainGlow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  breathe: number,
  intensity = 1,
  /** When > 0, tighten glow to brain proportions instead of a wide circle. */
  brainForm = 0,
  lightMode = false,
): void {
  const form = Math.min(1, Math.max(0, brainForm));
  const rx = w * (0.22 - form * 0.02) * breathe;
  const ry = h * (0.2 - form * 0.04) * breathe;
  const grad = ctx.createRadialGradient(cx, cy - h * 0.04 * form, 0, cx, cy - h * 0.02, Math.max(rx, ry));
  if (lightMode) {
    grad.addColorStop(0, `rgba(${NEURO.navyRgb}, ${0.025 * intensity})`);
    grad.addColorStop(0.5, `rgba(${NEURO.grayRgb}, ${0.012 * intensity})`);
    grad.addColorStop(0.85, `rgba(${NEURO.grayRgb}, ${0.004 * intensity})`);
  } else {
    grad.addColorStop(0, `rgba(${NEURO.amberRgb}, ${0.06 * intensity})`);
    grad.addColorStop(0.4, `rgba(${NEURO.iceRgb}, ${0.05 * intensity})`);
    grad.addColorStop(0.75, `rgba(${NEURO.iceRgb}, ${0.02 * intensity})`);
  }
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h * 1.1);
}

export function drawBrainSilhouette(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  t: number,
  alpha: number,
): void {
  const pulse = 0.92 + Math.sin(t * 0.9) * 0.05;
  ctx.save();
  ctx.translate(cx, cy);

  ctx.strokeStyle = `rgba(${NEURO.goldRgb}, ${0.18 * alpha})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-w * 0.02, h * 0.1);
  ctx.bezierCurveTo(
    -w * 0.24 * pulse,
    h * 0.02,
    -w * 0.26 * pulse,
    -h * 0.12,
    -w * 0.14 * pulse,
    -h * 0.16,
  );
  ctx.bezierCurveTo(
    -w * 0.06 * pulse,
    -h * 0.2,
    w * 0.06 * pulse,
    -h * 0.2,
    w * 0.14 * pulse,
    -h * 0.16,
  );
  ctx.bezierCurveTo(
    w * 0.26 * pulse,
    -h * 0.12,
    w * 0.24 * pulse,
    h * 0.02,
    w * 0.02,
    h * 0.1,
  );
  ctx.stroke();

  ctx.strokeStyle = `rgba(${NEURO.iceRgb}, ${0.08 * alpha})`;
  ctx.setLineDash([3, 6]);
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.18);
  ctx.lineTo(0, h * 0.12);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = `rgba(${NEURO.iceRgb}, ${0.06 * alpha})`;
  ctx.beginPath();
  ctx.moveTo(-w * 0.12 * pulse, -h * 0.08);
  ctx.quadraticCurveTo(-w * 0.08 * pulse, h * 0.02, -w * 0.14 * pulse, h * 0.06);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.12 * pulse, -h * 0.08);
  ctx.quadraticCurveTo(w * 0.08 * pulse, h * 0.02, w * 0.14 * pulse, h * 0.06);
  ctx.stroke();
  ctx.restore();
}

export function drawBCILabels(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  alpha: number,
): void {
  const labels = [
    { text: "BCI-α", x: 0.04, y: 0.06 },
    { text: "SNR 24dB", x: 0.82, y: 0.05 },
    { text: "EEG CH-01", x: 0.04, y: 0.92 },
    { text: "SYNC", x: 0.88, y: 0.9 },
  ];

  ctx.save();
  ctx.font = "500 9px ui-monospace, monospace";
  ctx.textBaseline = "top";

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const flicker = 0.55 + Math.sin(t * 1.4 + i * 2.1) * 0.25;
    ctx.fillStyle = `rgba(${NEURO.iceRgb}, ${flicker * 0.35 * alpha})`;
    ctx.fillText(label.text, w * label.x, h * label.y);
  }
  ctx.restore();
}

export function drawElectrodeGrid(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  t: number,
  alpha: number,
): void {
  const cols = 7;
  const rows = 5;
  const gridW = w * 0.28;
  const gridH = h * 0.16;
  const startX = cx - gridW / 2;
  const startY = cy - gridH / 2;

  ctx.strokeStyle = `rgba(${NEURO.iceRgb}, ${0.06 * alpha})`;
  ctx.lineWidth = 0.5;
  for (let c = 0; c <= cols; c++) {
    const x = startX + (gridW / cols) * c;
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.lineTo(x, startY + gridH);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    const y = startY + (gridH / rows) * r;
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(startX + gridW, y);
    ctx.stroke();
  }

  for (let c = 0; c <= cols; c++) {
    for (let r = 0; r <= rows; r++) {
      const x = startX + (gridW / cols) * c;
      const y = startY + (gridH / rows) * r;
      const glow = 0.4 + Math.sin(t * 2 + c * 0.7 + r * 0.9) * 0.35;
      ctx.fillStyle = `rgba(${NEURO.amberRgb}, ${glow * 0.35 * alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function drawEEGTraces(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  alpha: number,
  channels = 4,
  bandY = 0.88,
  lightMode = false,
): void {
  const baseY = h * bandY;
  const traceH = h * 0.04;
  const spacing = traceH * 1.4;
  const traceRgb = lightMode ? NEURO.navyRgb : NEURO.iceRgb;

  for (let ch = 0; ch < channels; ch++) {
    const y0 = baseY - ch * spacing;
    ctx.strokeStyle = `rgba(${traceRgb}, ${(0.38 - ch * 0.05) * alpha})`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 3) {
      const phase = t * (1.2 + ch * 0.15) + x * 0.012;
      const spike =
        Math.sin(phase * 3.7) * 0.3 +
        Math.sin(phase * 7.1 + ch) * 0.15 +
        (Math.sin(phase * 1.1) > 0.92 ? Math.sin(phase * 40) * 0.8 : 0);
      const y = y0 + spike * traceH;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

export function hubCenterFade(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
): number {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return Math.min(1, Math.hypot(dx, dy) ** 1.4);
}

export interface NeuronEdge {
  a: number;
  b: number;
  /** Pulse travel speed along the axon. */
  speed: number;
  /** Phase offset so pulses don't fire in lockstep. */
  offset: number;
}

/** Synaptic path geometry — axon terminal → cleft gap → dendrite. */
const SYNAPSE = {
  boutonEnd: 0.78,
  cleftStart: 0.8,
  cleftEnd: 0.86,
} as const;

function edgeDist(
  nodes: BrainNode[],
  i: number,
  j: number,
  w: number,
  h: number,
): number {
  const dx = (nodes[i].x - nodes[j].x) * w;
  const dy = (nodes[i].y - nodes[j].y) * h;
  return Math.hypot(dx, dy);
}

function pathPoint(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  t: number,
): { x: number; y: number } {
  const clamped = Math.min(1, Math.max(0, t));
  if (clamped <= SYNAPSE.boutonEnd) {
    const p = clamped / SYNAPSE.boutonEnd;
    return { x: ax + (bx - ax) * p * SYNAPSE.boutonEnd, y: ay + (by - ay) * p * SYNAPSE.boutonEnd };
  }
  if (clamped < SYNAPSE.cleftEnd) {
    const gapT = (clamped - SYNAPSE.cleftStart) / (SYNAPSE.cleftEnd - SYNAPSE.cleftStart);
    const x0 = ax + (bx - ax) * SYNAPSE.cleftStart;
    const y0 = ay + (by - ay) * SYNAPSE.cleftStart;
    const x1 = ax + (bx - ax) * SYNAPSE.cleftEnd;
    const y1 = ay + (by - ay) * SYNAPSE.cleftEnd;
    return { x: x0 + (x1 - x0) * gapT, y: y0 + (y1 - y0) * gapT };
  }
  const dendriteT = (clamped - SYNAPSE.cleftEnd) / (1 - SYNAPSE.cleftEnd);
  const x0 = ax + (bx - ax) * SYNAPSE.cleftEnd;
  const y0 = ay + (by - ay) * SYNAPSE.cleftEnd;
  return { x: x0 + (bx - x0) * dendriteT, y: y0 + (by - y0) * dendriteT };
}

/** Kruskal MST + nearby edges — fully connected neural mesh, no floating clusters. */
export function buildNeuralMesh(
  nodes: BrainNode[],
  w: number,
  h: number,
  opts: { maxDistPx?: number; maxDistNorm?: number; extraNeighbors?: number } = {},
): NeuronEdge[] {
  const n = nodes.length;
  if (n < 2) return [];

  const maxDist =
    opts.maxDistPx ??
    (opts.maxDistNorm ?? 0.13) * Math.min(w, h);
  const extraNeighbors = opts.extraNeighbors ?? 2;
  const edgeKeys = new Set<string>();
  const edges: NeuronEdge[] = [];

  const addEdge = (a: number, b: number) => {
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const key = `${lo}-${hi}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({
      a: lo,
      b: hi,
      speed: 0.5 + Math.random() * 0.75,
      offset: Math.random(),
    });
  };

  const candidates: { a: number; b: number; dist: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dist = edgeDist(nodes, i, j, w, h);
      if (dist <= maxDist) candidates.push({ a: i, b: j, dist });
    }
  }
  candidates.sort((a, b) => a.dist - b.dist);

  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (a: number, b: number): boolean => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent[ra] = rb;
    return true;
  };

  for (const c of candidates) {
    if (union(c.a, c.b)) addEdge(c.a, c.b);
  }

  for (let i = 0; i < n; i++) {
    const near = candidates
      .filter((c) => c.a === i || c.b === i)
      .slice(0, extraNeighbors + 2);
    for (const c of near) addEdge(c.a, c.b);
  }

  return edges;
}

/** @deprecated Use buildNeuralMesh — kept for intro callers. */
export function buildNeuronEdges(nodes: BrainNode[], maxDist = 0.13): NeuronEdge[] {
  const w = 1000;
  const h = 800;
  return buildNeuralMesh(nodes, w, h, {
    maxDistNorm: maxDist,
    extraNeighbors: 3,
  });
}

function connectionAlpha(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  fade: { cx: number; cy: number; rx: number; ry: number } | undefined,
  w: number,
  h: number,
  alphaMul: number,
): number {
  const mx = (ax + bx) * 0.5;
  const my = (ay + by) * 0.5;
  let alpha = alphaMul;
  if (fade) {
    alpha *= hubCenterFade(mx / w, my / h, fade.cx, fade.cy, fade.rx, fade.ry);
  }
  return alpha;
}

function drawSynapticWire(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  lineRgb: string,
  alpha: number,
  lineWidth: number,
  drawCleft = true,
  embedded = false,
): void {
  if (alpha < 0.02) return;

  const boutonX = ax + (bx - ax) * SYNAPSE.boutonEnd;
  const boutonY = ay + (by - ay) * SYNAPSE.boutonEnd;
  const cleftA = { x: ax + (bx - ax) * SYNAPSE.cleftStart, y: ay + (by - ay) * SYNAPSE.cleftStart };
  const cleftB = { x: ax + (bx - ax) * SYNAPSE.cleftEnd, y: ay + (by - ay) * SYNAPSE.cleftEnd };

  ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`;
  ctx.lineWidth = embedded ? lineWidth * 0.85 : lineWidth;
  ctx.lineCap = "round";

  if (embedded) {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(boutonX, boutonY);
  ctx.stroke();

  if (drawCleft) {
    ctx.strokeStyle = `rgba(${NEURO.iceRgb}, ${alpha * 0.35})`;
    ctx.lineWidth = lineWidth * 0.55;
    ctx.beginPath();
    ctx.moveTo(cleftA.x, cleftA.y);
    ctx.lineTo(cleftB.x, cleftB.y);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(${lineRgb}, ${alpha * 0.82})`;
  ctx.lineWidth = lineWidth * 0.9;
  ctx.beginPath();
  ctx.moveTo(cleftB.x, cleftB.y);
  ctx.lineTo(bx, by);
  ctx.stroke();

  ctx.fillStyle = `rgba(${NEURO.amberRgb}, ${alpha * 0.55})`;
  ctx.beginPath();
  ctx.arc(boutonX, boutonY, lineWidth * 1.1, 0, Math.PI * 2);
  ctx.fill();
}

function drawPotentialPacket(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  pathT: number,
  alpha: number,
  radius: number,
  lightMode = false,
): void {
  const pos = pathPoint(ax, ay, bx, by, pathT);
  const inCleft = pathT >= SYNAPSE.cleftStart && pathT <= SYNAPSE.cleftEnd;
  const fade = inCleft
    ? 0.35 + Math.sin(((pathT - SYNAPSE.cleftStart) / (SYNAPSE.cleftEnd - SYNAPSE.cleftStart)) * Math.PI) * 0.65
    : Math.sin(pathT * Math.PI) * 0.55 + 0.45;

  const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
  if (lightMode) {
    grad.addColorStop(0, `rgba(255, 255, 255, ${0.85 * alpha * fade})`);
    grad.addColorStop(0.35, `rgba(${NEURO.accentRgb}, ${0.75 * alpha * fade})`);
    grad.addColorStop(0.7, `rgba(${NEURO.accentRgb}, ${0.22 * alpha * fade})`);
  } else {
    grad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * alpha * fade})`);
    grad.addColorStop(0.35, `rgba(206, 236, 255, ${0.7 * alpha * fade})`);
    grad.addColorStop(0.7, `rgba(${NEURO.iceRgb}, ${0.28 * alpha * fade})`);
  }
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/** Connected synapse web — wires, clefts, somas, and path-bound action potentials. */
export function drawConnectedSynapseNetwork(
  ctx: CanvasRenderingContext2D,
  nodes: BrainNode[],
  edges: NeuronEdge[],
  w: number,
  h: number,
  opts: {
    alpha?: number;
    lineWidth?: number;
    lineRgb?: string;
    t?: number;
    showPotentials?: boolean;
    centerFade?: { cx: number; cy: number; rx: number; ry: number };
    scale?: number;
    lightMode?: boolean;
    /** Tissue-embedded synapses — thin wires, tiny junctions, no glowing orbs. */
    embedded?: boolean;
  } = {},
): void {
  const alphaMul = opts.alpha ?? 1;
  const lineWidth = (opts.lineWidth ?? 0.8) / (opts.scale ?? 1);
  const lineRgb = opts.lineRgb ?? (opts.lightMode ? NEURO.synapseRgb : NEURO.iceRgb);
  const fade = opts.centerFade;
  const t = opts.t ?? 0;
  const showPotentials = opts.showPotentials ?? true;
  const lightMode = opts.lightMode ?? false;
  const embedded = opts.embedded ?? false;

  for (const edge of edges) {
    const a = nodes[edge.a];
    const b = nodes[edge.b];
    const ax = a.x * w;
    const ay = a.y * h;
    const bx = b.x * w;
    const by = b.y * h;
    const alpha = connectionAlpha(ax, ay, bx, by, fade, w, h, alphaMul);
    drawSynapticWire(ctx, ax, ay, bx, by, lineRgb, alpha, lineWidth, true, embedded);

    if (showPotentials && alpha >= 0.04 && !embedded) {
      const p = (t * edge.speed + edge.offset) % 1;
      const pr = (3.2 / (opts.scale ?? 1)) * (0.55 + Math.sin(p * Math.PI) * 0.45);
      drawPotentialPacket(ctx, ax, ay, bx, by, p, alpha, pr, lightMode);
      drawPotentialPacket(ctx, ax, ay, bx, by, (1 - p + 0.5) % 1, alpha * 0.72, pr * 0.82, lightMode);
    } else if (showPotentials && alpha >= 0.04 && embedded) {
      /* Embedded tissue — wires only, no glowing packets. */
    }
  }

  if (embedded) return;

  for (const node of nodes) {
    const nx = node.x * w;
    const ny = node.y * h;
    let nodeAlpha = alphaMul * 0.72;
    if (fade) {
      nodeAlpha *= hubCenterFade(node.x, node.y, fade.cx, fade.cy, fade.rx, fade.ry);
    }
    if (nodeAlpha < 0.03) continue;
    const core = embedded
      ? (0.75 / (opts.scale ?? 1)) * (0.8 + Math.sin(node.pulse) * 0.1)
      : (1.6 / (opts.scale ?? 1)) * (0.85 + Math.sin(node.pulse) * 0.15);
    if (lightMode) {
      ctx.fillStyle = `rgba(${NEURO.inkRgb}, ${nodeAlpha * (embedded ? 0.38 : 0.55)})`;
      ctx.beginPath();
      ctx.arc(nx, ny, core, 0, Math.PI * 2);
      ctx.fill();
      if (!embedded) {
        ctx.fillStyle = `rgba(${NEURO.accentRgb}, ${nodeAlpha * 0.18})`;
        ctx.beginPath();
        ctx.arc(nx, ny, core * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = `rgba(255, 241, 214, ${nodeAlpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(nx, ny, core, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${NEURO.iceRgb}, ${nodeAlpha * 0.22})`;
      ctx.beginPath();
      ctx.arc(nx, ny, core * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** @deprecated Use drawConnectedSynapseNetwork with buildNeuralMesh edges. */
export function drawSynapseNetwork(
  ctx: CanvasRenderingContext2D,
  nodes: BrainNode[],
  w: number,
  h: number,
  opts: {
    edges?: NeuronEdge[];
    maxDist?: number;
    minDist?: number;
    alpha?: number;
    lineWidth?: number;
    lineRgb?: string;
    t?: number;
    centerFade?: { cx: number; cy: number; rx: number; ry: number };
    lightMode?: boolean;
  } = {},
): void {
  const edges =
    opts.edges ??
    buildNeuralMesh(nodes, w, h, { maxDistPx: opts.maxDist ?? 110 });
  drawConnectedSynapseNetwork(ctx, nodes, edges, w, h, {
    alpha: opts.alpha,
    lineWidth: opts.lineWidth,
    lineRgb: opts.lineRgb,
    t: opts.t,
    centerFade: opts.centerFade,
    showPotentials: true,
    lightMode: opts.lightMode,
  });
}

/** @deprecated Somas are drawn inside drawConnectedSynapseNetwork. */
export function drawSynapseNodes(
  ctx: CanvasRenderingContext2D,
  nodes: BrainNode[],
  w: number,
  h: number,
  alpha = 1,
  opts: {
    centerFade?: { cx: number; cy: number; rx: number; ry: number };
  } = {},
): void {
  const fade = opts.centerFade;
  for (const node of nodes) {
    const nx = node.x * w;
    const ny = node.y * h;
    let nodeAlpha = alpha * 0.72;
    if (fade) {
      nodeAlpha *= hubCenterFade(node.x, node.y, fade.cx, fade.cy, fade.rx, fade.ry);
    }
    if (nodeAlpha < 0.03) continue;
    ctx.fillStyle = `rgba(255, 241, 214, ${nodeAlpha * 0.9})`;
    ctx.beginPath();
    ctx.arc(nx, ny, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

export interface SparkBurst {
  x: number;
  y: number;
  t: number;
  maxT: number;
}

/** Rare synapse spark — variable reward burst between nodes. */
export function maybeSpawnSparkBurst(
  bursts: SparkBurst[],
  nodes: BrainNode[],
  chance = 0.0018,
): void {
  if (Math.random() > chance || bursts.length > 2 || nodes.length < 2) return;
  const a = nodes[Math.floor(Math.random() * nodes.length)];
  const b = nodes[Math.floor(Math.random() * nodes.length)];
  bursts.push({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    t: 0,
    maxT: 40 + Math.floor(Math.random() * 16),
  });
}

export function tickSparkBursts(bursts: SparkBurst[]): SparkBurst[] {
  return bursts
    .map((burst) => ({ ...burst, t: burst.t + 1 }))
    .filter((burst) => burst.t < burst.maxT);
}

export function drawSparkBursts(
  ctx: CanvasRenderingContext2D,
  bursts: SparkBurst[],
  w: number,
  h: number,
  alpha = 1,
  centerFade?: { cx: number; cy: number; rx: number; ry: number },
  lightMode = false,
): void {
  for (const burst of bursts) {
    const p = burst.t / burst.maxT;
    const fadeMul = centerFade
      ? hubCenterFade(burst.x, burst.y, centerFade.cx, centerFade.cy, centerFade.rx, centerFade.ry)
      : 1;
    if (fadeMul < 0.05) continue;

    const radius = burst.t * 3.2;
    const ringAlpha = (1 - p) * 0.55 * alpha * fadeMul;
    const ringRgb = lightMode ? NEURO.accentRgb : NEURO.goldRgb;
    ctx.strokeStyle = `rgba(${ringRgb}, ${ringAlpha})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(burst.x * w, burst.y * h, radius, 0, Math.PI * 2);
    ctx.stroke();

    const flashAlpha = (1 - p) ** 2 * 0.7 * alpha * fadeMul;
    const flashRgb = lightMode ? NEURO.accentRgb : NEURO.amberRgb;
    ctx.strokeStyle = `rgba(${flashRgb}, ${flashAlpha})`;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI / 2) * i + burst.t * 0.08;
      const len = radius * 0.65;
      const bx = burst.x * w;
      const by = burst.y * h;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(angle) * len, by + Math.sin(angle) * len);
      ctx.stroke();
    }
  }
}

/** Corner electrode pads — peripheral only, keeps title center clear. */
export function drawPeripheralElectrodeGrids(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  alpha: number,
  lightMode = false,
): void {
  const pads: { x: number; y: number }[] = [
    { x: w * 0.12, y: h * 0.18 },
    { x: w * 0.88, y: h * 0.18 },
    { x: w * 0.1, y: h * 0.78 },
    { x: w * 0.9, y: h * 0.78 },
  ];

  for (const pad of pads) {
    const cols = 4;
    const rows = 3;
    const gridW = w * 0.09;
    const gridH = h * 0.07;
    const startX = pad.x - gridW / 2;
    const startY = pad.y - gridH / 2;

    ctx.strokeStyle = `rgba(${lightMode ? NEURO.grayRgb : NEURO.iceRgb}, ${(lightMode ? 0.12 : 0.08) * alpha})`;
    ctx.lineWidth = 0.45;
    for (let c = 0; c <= cols; c++) {
      const x = startX + (gridW / cols) * c;
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + gridH);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      const y = startY + (gridH / rows) * r;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + gridW, y);
      ctx.stroke();
    }

    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        const x = startX + (gridW / cols) * c;
        const y = startY + (gridH / rows) * r;
        const glow = 0.35 + Math.sin(t * 1.8 + c * 0.9 + r * 1.1 + pad.x) * 0.3;
        ctx.fillStyle = `rgba(${lightMode ? NEURO.accentRgb : NEURO.amberRgb}, ${glow * (lightMode ? 0.22 : 0.28) * alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * Cinema intro — XVIVO-style neuron close-up that zooms OUT into a brain.
 * Self-contained; does not touch the archive/hub field draws above.
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Glowing synapse field rendered additively, scaled around (cx, cy).
 * High `scale` = extreme neuron close-up; scale → 1 reveals the whole field.
 */
export function drawCinemaNeurons(
  ctx: CanvasRenderingContext2D,
  nodes: BrainNode[],
  edges: NeuronEdge[],
  w: number,
  h: number,
  opts: {
    cx: number;
    cy: number;
    scale: number;
    t: number;
    intensity: number;
    /** Clip synapse field to brain silhouette once outline is visible. */
    brainForm?: number;
    lightMode?: boolean;
  },
): void {
  const { cx, cy, scale, t, intensity, brainForm = 0, lightMode = false } = opts;
  const closeUp = scale > 2.2;

  ctx.save();

  if (brainForm > 0.05) {
    const breathe = 0.985 + Math.sin(t * 0.75) * 0.015;
    clipBrainSilhouette(ctx, cx, cy, w, h, breathe);
  }

  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);

  if (!lightMode) {
    ctx.globalCompositeOperation = "lighter";
  }

  const dendriteRgb = lightMode ? NEURO.navyRgb : "206, 236, 255";
  const dendriteAlpha = (closeUp ? 0.3 : 0.16) * intensity * (lightMode ? 0.85 : 1);
  ctx.strokeStyle = `rgba(${dendriteRgb}, ${dendriteAlpha})`;
  ctx.lineWidth = (closeUp ? 0.72 : 0.46) / scale;
  for (const node of nodes) {
    const nx = node.x * w;
    const ny = node.y * h;
    const branches = closeUp ? 5 : 3;
    for (let b = 0; b < branches; b++) {
      const angle = node.pulse * 1.7 + b * ((Math.PI * 2) / branches) + t * 0.22;
      const len = (closeUp ? 26 : 16) + Math.sin(t * 3.1 + node.pulse + b) * 5;
      const scaledLen = len / scale;
      const midLen = scaledLen * 0.58;
      const ex = nx + Math.cos(angle) * scaledLen;
      const ey = ny + Math.sin(angle) * scaledLen;
      const mx = nx + Math.cos(angle + 0.42) * midLen;
      const my = ny + Math.sin(angle + 0.42) * midLen;

      ctx.beginPath();
      ctx.moveTo(nx, ny);
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.stroke();

      const fork = scaledLen * 0.34;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + Math.cos(angle + 0.62) * fork, ey + Math.sin(angle + 0.62) * fork);
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + Math.cos(angle - 0.58) * fork, ey + Math.sin(angle - 0.58) * fork);
      ctx.stroke();
    }
  }

  // Axons + the electrical pulses travelling along them.
  for (const edge of edges) {
    const a = nodes[edge.a];
    const b = nodes[edge.b];
    const ax = a.x * w;
    const ay = a.y * h;
    const bx = b.x * w;
    const by = b.y * h;

    const grad = ctx.createLinearGradient(ax, ay, bx, by);
    const wireRgb = lightMode ? NEURO.synapseRgb : NEURO.iceRgb;
    grad.addColorStop(0, `rgba(${wireRgb}, ${0.22 * intensity})`);
    grad.addColorStop(0.5, `rgba(${wireRgb}, ${0.08 * intensity})`);
    grad.addColorStop(1, `rgba(${wireRgb}, ${0.22 * intensity})`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = (closeUp ? 1.05 : 0.85) / scale;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // Action potentials travel in both directions like blue-white electrical signals.
    const p = (t * edge.speed + edge.offset) % 1;
    const fade = Math.sin(p * Math.PI);
    const pulsePositions = [p, 1 - ((p + 0.38) % 1)];
    for (const pulseP of pulsePositions) {
      const px = ax + (bx - ax) * pulseP;
      const py = ay + (by - ay) * pulseP;
      const pr = ((closeUp ? 5.6 : 3.6) / scale) * (0.5 + fade);
      const pulse = ctx.createRadialGradient(px, py, 0, px, py, pr);
      if (lightMode) {
        pulse.addColorStop(0, `rgba(255, 255, 255, ${0.9 * intensity * fade})`);
        pulse.addColorStop(0.34, `rgba(${NEURO.accentRgb}, ${0.72 * intensity * fade})`);
        pulse.addColorStop(0.68, `rgba(${NEURO.accentRgb}, ${0.28 * intensity * fade})`);
      } else {
        pulse.addColorStop(0, `rgba(255, 255, 255, ${0.96 * intensity * fade})`);
        pulse.addColorStop(0.34, `rgba(206, 236, 255, ${0.72 * intensity * fade})`);
        pulse.addColorStop(0.68, `rgba(${NEURO.iceRgb}, ${0.3 * intensity * fade})`);
      }
      pulse.addColorStop(1, "transparent");
      ctx.fillStyle = pulse;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Synaptic vesicle flash at terminal.
    if (fade > 0.72) {
      const termX = p > 0.5 ? bx : ax;
      const termY = p > 0.5 ? by : ay;
      ctx.fillStyle = lightMode
        ? `rgba(${NEURO.accentRgb}, ${0.55 * intensity * (fade - 0.72) * 3.5})`
        : `rgba(255, 241, 214, ${0.65 * intensity * (fade - 0.72) * 3.5})`;
      ctx.beginPath();
      ctx.arc(termX, termY, (2.2 / scale) * fade, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Neuron cell bodies — tiny junctions when embedded in formed tissue.
  const massDamp = brainForm > 0.25 ? 0.35 + (1 - brainForm) * 0.4 : 1;
  const nodeScale = closeUp ? 0.55 : 0.38;
  for (const node of nodes) {
    const nx = node.x * w;
    const ny = node.y * h;
    const glow = 0.35 + Math.sin(node.pulse + t * 2) * 0.35;
    const halo = ((closeUp ? 6 : 4) / scale) * (0.35 + glow * 0.35) * massDamp;
    if (halo > 1.2 && !closeUp) {
      const haloGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, halo);
      if (lightMode) {
        haloGrad.addColorStop(0, `rgba(${NEURO.inkRgb}, ${0.06 * intensity * glow * massDamp})`);
        haloGrad.addColorStop(0.5, `rgba(${NEURO.navyRgb}, ${0.03 * intensity * glow * massDamp})`);
      } else {
        haloGrad.addColorStop(0, `rgba(255, 255, 255, ${0.18 * intensity * glow * massDamp})`);
        haloGrad.addColorStop(0.5, `rgba(${NEURO.iceRgb}, ${0.06 * intensity * glow * massDamp})`);
      }
      haloGrad.addColorStop(1, "transparent");
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(nx, ny, halo, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = lightMode
      ? `rgba(${NEURO.inkRgb}, ${0.32 * intensity * (0.55 + glow * 0.35) * massDamp})`
      : `rgba(255, 241, 214, ${0.55 * intensity * (0.55 + glow * 0.35) * massDamp})`;
    ctx.beginPath();
    ctx.arc(nx, ny, ((closeUp ? 1.4 : 0.95) / scale) * nodeScale * (0.8 + glow * 0.25), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
}

/** Shared anatomical brain outline — left lateral profile, occipital right, frontal left. */
export function traceBrainSilhouettePath(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
): void {
  ctx.beginPath();
  // Frontal pole (left) → precentral gyrus → parietal dome → occipital (right) → temporal → cerebellum.
  ctx.moveTo(-W * 0.94, H * 0.06);
  ctx.bezierCurveTo(-W * 0.98, -H * 0.08, -W * 0.96, -H * 0.52, -W * 0.78, -H * 0.86);
  ctx.bezierCurveTo(-W * 0.62, -H * 1.02, -W * 0.34, -H * 1.1, -W * 0.06, -H * 1.06);
  ctx.bezierCurveTo(W * 0.18, -H * 1.02, W * 0.42, -H * 0.92, W * 0.62, -H * 0.76);
  ctx.bezierCurveTo(W * 0.82, -H * 0.58, W * 0.96, -H * 0.32, W * 0.94, -H * 0.04);
  ctx.bezierCurveTo(W * 0.92, H * 0.14, W * 0.78, H * 0.32, W * 0.58, H * 0.44);
  ctx.bezierCurveTo(W * 0.42, H * 0.52, W * 0.24, H * 0.54, W * 0.06, H * 0.48);
  ctx.bezierCurveTo(-W * 0.1, H * 0.42, -W * 0.22, H * 0.34, -W * 0.38, H * 0.26);
  ctx.bezierCurveTo(-W * 0.56, H * 0.16, -W * 0.74, H * 0.1, -W * 0.88, H * 0.08);
  ctx.bezierCurveTo(-W * 0.92, H * 0.07, -W * 0.94, H * 0.06, -W * 0.94, H * 0.06);
  ctx.closePath();
}

/** Clip drawing to anatomical brain silhouette at (cx, cy). Caller must wrap in save/restore. */
export function clipBrainSilhouette(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  breathe = 1,
): void {
  const W = w * 0.36 * breathe;
  const H = h * 0.32 * breathe;
  ctx.translate(cx, cy);
  traceBrainSilhouettePath(ctx, W, H);
  ctx.clip();
  ctx.translate(-cx, -cy);
}

/** Cortical fold paths — sulci and gyri drawn inside the brain shell. */
function drawBrainSulciAndGyri(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  reveal: number,
  lightMode = false,
): void {
  const foldRgb = lightMode ? NEURO.inkRgb : NEURO.goldRgb;
  const sulcusRgb = lightMode ? NEURO.navyRgb : NEURO.iceRgb;
  const gyriRgb = lightMode ? NEURO.grayRgb : NEURO.amberRgb;

  // Longitudinal fissure — divides hemispheres along superior surface.
  ctx.strokeStyle = `rgba(${foldRgb}, ${(lightMode ? 0.32 : 0.42) * reveal})`;
  ctx.lineWidth = 1.65;
  ctx.beginPath();
  ctx.moveTo(-W * 0.02, -H * 0.98);
  ctx.bezierCurveTo(-W * 0.04, -H * 0.62, -W * 0.08, -H * 0.18, -W * 0.2, H * 0.32);
  ctx.stroke();

  // Interhemispheric shadow — medial depth on superior face.
  ctx.strokeStyle = `rgba(${sulcusRgb}, ${(lightMode ? 0.18 : 0.24) * reveal})`;
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(W * 0.02, -H * 0.92);
  ctx.bezierCurveTo(W * 0.04, -H * 0.48, W * 0.06, -H * 0.04, W * 0.1, H * 0.28);
  ctx.stroke();

  // Central sulcus (rolandic) — frontal/parietal boundary.
  ctx.strokeStyle = `rgba(${sulcusRgb}, ${(lightMode ? 0.28 : 0.38) * reveal})`;
  ctx.lineWidth = 1.35;
  ctx.beginPath();
  ctx.moveTo(-W * 0.16, -H * 0.72);
  ctx.bezierCurveTo(W * 0.02, -H * 0.58, W * 0.2, -H * 0.38, W * 0.32, -H * 0.1);
  ctx.stroke();

  // Lateral (Sylvian) fissure — temporal lobe separation.
  ctx.strokeStyle = `rgba(${sulcusRgb}, ${(lightMode ? 0.32 : 0.48) * reveal})`;
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.moveTo(-W * 0.32, -H * 0.12);
  ctx.bezierCurveTo(-W * 0.06, H * 0.06, W * 0.22, H * 0.16, W * 0.52, H * 0.2);
  ctx.bezierCurveTo(W * 0.66, H * 0.22, W * 0.78, H * 0.28, W * 0.74, H * 0.38);
  ctx.stroke();

  // Parietal + frontal gyri — short curved ridges.
  ctx.strokeStyle = `rgba(${gyriRgb}, ${(lightMode ? 0.2 : 0.28) * reveal})`;
  ctx.lineWidth = 0.95;
  const gyri: [number, number, number, number, number, number][] = [
    [-W * 0.68, -H * 0.64, -W * 0.44, -H * 0.48, -W * 0.28, -H * 0.58],
    [-W * 0.54, -H * 0.34, -W * 0.24, -H * 0.18, -W * 0.08, -H * 0.28],
    [-W * 0.76, -H * 0.4, -W * 0.62, -H * 0.22, -W * 0.52, -H * 0.32],
    [W * 0.1, -H * 0.74, W * 0.3, -H * 0.6, W * 0.46, -H * 0.68],
    [W * 0.26, -H * 0.44, W * 0.5, -H * 0.28, W * 0.6, -H * 0.4],
    [W * 0.38, -H * 0.16, W * 0.54, -H * 0.04, W * 0.62, -H * 0.12],
    [-W * 0.78, -H * 0.12, -W * 0.58, H * 0.06, -W * 0.44, -H * 0.02],
    [W * 0.16, H * 0.12, W * 0.4, H * 0.26, W * 0.56, H * 0.18],
    [-W * 0.36, -H * 0.76, -W * 0.24, -H * 0.62, -W * 0.14, -H * 0.7],
    [W * 0.58, -H * 0.52, W * 0.7, -H * 0.38, W * 0.76, -H * 0.48],
    [-W * 0.48, -H * 0.52, -W * 0.32, -H * 0.4, -W * 0.22, -H * 0.48],
    [W * 0.48, -H * 0.24, W * 0.64, -H * 0.12, W * 0.7, -H * 0.2],
    [-W * 0.62, -H * 0.24, -W * 0.48, -H * 0.1, -W * 0.38, -H * 0.18],
  ];
  for (const [x0, y0, x1, y1, x2, y2] of gyri) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    ctx.stroke();
  }

  // Occipital lobe + temporal horn.
  ctx.strokeStyle = `rgba(${foldRgb}, ${(lightMode ? 0.12 : 0.18) * reveal})`;
  ctx.lineWidth = 0.85;
  ctx.beginPath();
  ctx.moveTo(-W * 0.8, -H * 0.44);
  ctx.quadraticCurveTo(-W * 0.9, -H * 0.1, -W * 0.74, H * 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W * 0.54, H * 0.24);
  ctx.bezierCurveTo(W * 0.7, H * 0.4, W * 0.6, H * 0.54, W * 0.44, H * 0.5);
  ctx.stroke();

  // Cerebellum lobules beneath occipital/temporal junction.
  ctx.strokeStyle = `rgba(${sulcusRgb}, ${(lightMode ? 0.22 : 0.38) * reveal})`;
  ctx.lineWidth = 0.95;
  ctx.beginPath();
  ctx.moveTo(-W * 0.44, H * 0.44);
  ctx.bezierCurveTo(-W * 0.3, H * 0.64, W * 0.04, H * 0.74, W * 0.3, H * 0.66);
  ctx.bezierCurveTo(W * 0.44, H * 0.6, W * 0.5, H * 0.5, W * 0.4, H * 0.44);
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const gx = -W * 0.34 + i * W * 0.14;
    ctx.beginPath();
    ctx.moveTo(gx, H * 0.5);
    ctx.quadraticCurveTo(gx + W * 0.06, H * 0.6, gx + W * 0.12, H * 0.52);
    ctx.stroke();
  }

  // Brainstem hint.
  ctx.strokeStyle = `rgba(${foldRgb}, ${(lightMode ? 0.16 : 0.24) * reveal})`;
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(-W * 0.1, H * 0.54);
  ctx.lineTo(-W * 0.08, H * 0.74);
  ctx.stroke();
}

/** Anatomical 3/4 brain — lateral profile with gyri, sulci, cerebellum. form 0→1. */
export function drawDetailedBrain(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  t: number,
  form: number,
  lightMode = false,
): void {
  if (form <= 0.001) return;

  const breathe = 0.985 + Math.sin(t * 0.75) * 0.015;
  const W = w * 0.36 * breathe;
  const H = h * 0.32 * breathe;
  const reveal = Math.min(1, form * 1.12);
  const tissueReveal = Math.min(1, Math.max(0, (form - 0.04) / 0.88));

  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Silhouette clip immediately — tissue forms inside anatomical shell, not a circle.
  ctx.save();
  traceBrainSilhouettePath(ctx, W, H);
  ctx.clip();

  // Top-down sweep reveal within brain shape.
  const sweepTop = -H * 1.15;
  const sweepBottom = sweepTop + H * 2.4 * tissueReveal;
  ctx.beginPath();
  ctx.rect(-W * 1.2, sweepTop, W * 2.4, sweepBottom - sweepTop);
  ctx.clip();

  if (!lightMode) {
    ctx.globalCompositeOperation = "lighter";
  }

  // Cortical tissue mass — reads as folded gray matter on cream.
  traceBrainSilhouettePath(ctx, W, H);
  const fillGrad = ctx.createLinearGradient(-W * 0.5, -H * 0.9, W * 0.4, H * 0.5);
  if (lightMode) {
    fillGrad.addColorStop(0, `rgba(${NEURO.navyRgb}, ${0.14 * reveal})`);
    fillGrad.addColorStop(0.35, `rgba(${NEURO.inkRgb}, ${0.1 * reveal})`);
    fillGrad.addColorStop(0.68, `rgba(${NEURO.grayRgb}, ${0.07 * reveal})`);
    fillGrad.addColorStop(1, `rgba(${NEURO.grayRgb}, ${0.04 * reveal})`);
  } else {
    fillGrad.addColorStop(0, `rgba(${NEURO.amberRgb}, ${0.14 * reveal})`);
    fillGrad.addColorStop(0.35, `rgba(${NEURO.goldRgb}, ${0.09 * reveal})`);
    fillGrad.addColorStop(0.68, `rgba(${NEURO.goldRgb}, ${0.05 * reveal})`);
    fillGrad.addColorStop(1, `rgba(${NEURO.iceRgb}, ${0.03 * reveal})`);
  }
  ctx.fillStyle = fillGrad;
  ctx.fill();

  const sulciReveal = Math.min(1, Math.max(0, (tissueReveal - 0.12) / 0.72));
  drawBrainSulciAndGyri(ctx, W, H, sulciReveal * reveal, lightMode);
  ctx.restore();

  // Cortical rim — stroke-dash draws outline as tissue finishes forming.
  const rimProgress = Math.min(1, Math.max(0, (form - 0.28) / 0.62));
  if (rimProgress > 0.02) {
    const rimRgb = lightMode ? NEURO.inkRgb : NEURO.goldRgb;
    traceBrainSilhouettePath(ctx, W, H);
    const pathLen = W * 5.8;
    ctx.setLineDash([pathLen, pathLen]);
    ctx.lineDashOffset = pathLen * (1 - rimProgress);
    ctx.shadowColor = lightMode
      ? `rgba(${NEURO.inkRgb}, ${0.06 * rimProgress})`
      : `rgba(${NEURO.goldRgb}, ${0.18 * rimProgress})`;
    ctx.shadowBlur = lightMode ? 3 : 10;
    ctx.strokeStyle = `rgba(${rimRgb}, ${(lightMode ? 0.48 : 0.72) * rimProgress * reveal})`;
    ctx.lineWidth = lightMode ? 1.5 : 2.05;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  }

  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
}

/** @deprecated Use drawDetailedBrain — kept as alias for callers. */
export function drawCinemaBrainOutline(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  t: number,
  form: number,
  lightMode = false,
): void {
  drawDetailedBrain(ctx, cx, cy, w, h, t, form, lightMode);
}

export function updateBrainNodes(
  nodes: BrainNode[],
  w: number,
  h: number,
  cx: number,
  cy: number,
  mouse: { x: number; y: number; down?: boolean },
  scrollVel = 0,
  hubMode = false,
): void {
  const mouseX = mouse.x * w;
  const mouseY = mouse.y * h;
  const repelRadius = mouse.down ? (hubMode ? 110 : 90) : hubMode ? 140 : 120;
  const attractRadius = hubMode ? 260 : 220;

  for (const node of nodes) {
    const nx = node.x * w;
    const ny = node.y * h;
    const dx = nx - mouseX;
    const dy = ny - mouseY;
    const distMouse = Math.hypot(dx, dy);

    const repelForce = hubMode ? 0.00135 : 0.001;
    const attractForce = hubMode ? 0.00024 : 0.00018;

    if (distMouse > 0 && distMouse < repelRadius) {
      const force = (repelRadius - distMouse) / repelRadius;
      node.vx += (dx / distMouse) * force * repelForce;
      node.vy += (dy / distMouse) * force * repelForce;
    } else if (distMouse < attractRadius && distMouse > repelRadius) {
      const force = (attractRadius - distMouse) / attractRadius;
      node.vx -= (dx / distMouse) * force * attractForce;
      node.vy -= (dy / distMouse) * force * attractForce;
    }

    const ax = node.anchorX * w;
    const ay = node.anchorY * h;
    const dax = ax - nx;
    const day = ay - ny;
    const distAnchor = Math.hypot(dax, day) || 1;
    node.vx += (dax / distAnchor) * 0.00008;
    node.vy += (day / distAnchor) * 0.00008;

    node.x += node.vx;
    node.y += node.vy + scrollVel * 0.0001;
    node.vx *= 0.985;
    node.vy *= 0.985;
    node.pulse += 0.045 + scrollVel * 0.02;

    const distCenter = Math.hypot(node.x * w - cx, node.y * h - cy);
    if (distCenter > w * 0.32) {
      const angle = Math.atan2(node.y * h - cy, node.x * w - cx);
      node.x = (cx + Math.cos(angle) * w * 0.3) / w;
      node.y = (cy + Math.sin(angle) * w * 0.3 * 0.6) / h;
    }
  }
}
