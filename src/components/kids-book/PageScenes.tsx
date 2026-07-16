/**
 * Custom full-bleed drawings for each story scene.
 * Pure SVG — no external images — so it loads fast and looks magical.
 */

type SceneProps = {
  accent: string; // bright color from the page
  night?: boolean; // sleep chapter uses cooler stars
};

/** Little Luna character used in many scenes */
function Luna({ x = 40, y = 110, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* hair */}
      <ellipse cx="28" cy="18" rx="22" ry="18" fill="#3d2b1f" />
      <ellipse cx="18" cy="22" rx="10" ry="14" fill="#3d2b1f" />
      <ellipse cx="38" cy="22" rx="10" ry="14" fill="#3d2b1f" />
      {/* face */}
      <circle cx="28" cy="28" r="16" fill="#f6c7a1" />
      {/* eyes */}
      <circle cx="22" cy="27" r="2.2" fill="#1a1a1a" />
      <circle cx="34" cy="27" r="2.2" fill="#1a1a1a" />
      <circle cx="22.7" cy="26.3" r="0.7" fill="#fff" />
      <circle cx="34.7" cy="26.3" r="0.7" fill="#fff" />
      {/* smile */}
      <path d="M22 34c3 3 9 3 12 0" fill="none" stroke="#c45c26" strokeWidth="1.6" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="17" cy="32" r="2.4" fill="#ff8fab" opacity="0.55" />
      <circle cx="39" cy="32" r="2.4" fill="#ff8fab" opacity="0.55" />
      {/* body / dress */}
      <path d="M16 46c2-8 22-8 24 0l4 28H12l4-28z" fill="#7b2cbf" />
      <circle cx="28" cy="46" r="5" fill="#f6c7a1" />
      {/* spark friend near her */}
      <g className="kids-scene__spark-buddy">
        <circle cx="52" cy="20" r="5" fill="#ffd166" />
        <circle cx="52" cy="20" r="8" fill="#ffd166" opacity="0.25" />
      </g>
    </g>
  );
}

export function PageScene({ scene, accent, night }: SceneProps & { scene: string }) {
  // Pick the right drawing for this chapter
  switch (scene) {
    case "cover":
      return <CoverScene accent={accent} />;
    case "shrink":
      return <ShrinkScene accent={accent} />;
    case "neurons":
      return <NeuronsScene accent={accent} />;
    case "spark":
      return <SparkScene accent={accent} />;
    case "synapse":
      return <SynapseScene accent={accent} />;
    case "senses":
      return <SensesScene accent={accent} />;
    case "feelings":
      return <FeelingsScene accent={accent} />;
    case "memory":
      return <MemoryScene accent={accent} />;
    case "pathways":
      return <PathwaysScene accent={accent} />;
    case "sleep":
      return <SleepScene accent={accent} night={night} />;
    case "kindness":
      return <KindnessScene accent={accent} />;
    case "hero":
      return <HeroScene accent={accent} />;
    case "again":
      return <AgainScene accent={accent} />;
    default:
      return <CoverScene accent={accent} />;
  }
}

function CoverScene({ accent }: SceneProps) {
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      <defs>
        <radialGradient id="coverGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2a1f4d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="220" fill="url(#coverGlow)" />
      {/* open book */}
      <path d="M40 60c40-20 80-10 120 10v110c-40-20-80-30-120-10V60z" fill="#fff8f0" opacity="0.95" />
      <path d="M280 60c-40-20-80-10-120 10v110c40-20 80-30 120-10V60z" fill="#ffe8d6" opacity="0.95" />
      <path d="M160 70v110" stroke="#c9a27e" strokeWidth="3" />
      {/* brain on cover */}
      <ellipse cx="160" cy="105" rx="36" ry="28" fill="#ff8fab" />
      <ellipse cx="145" cy="100" rx="18" ry="16" fill="#ffb3c6" />
      <ellipse cx="175" cy="100" rx="18" ry="16" fill="#ffb3c6" />
      <path d="M130 105c10 8 20 8 30 0M160 105c10 8 20 8 30 0" stroke="#c9184a" strokeWidth="2" fill="none" opacity="0.5" />
      {/* floating keys hint */}
      <g className="kids-scene__float">
        <rect x="70" y="150" width="28" height="22" rx="4" fill="#222" />
        <text x="84" y="165" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="system-ui">A</text>
      </g>
      <g className="kids-scene__float kids-scene__float--2">
        <rect x="220" y="145" width="28" height="22" rx="4" fill="#222" />
        <text x="234" y="160" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="system-ui">Z</text>
      </g>
      <Luna x={230} y={40} scale={0.85} />
    </svg>
  );
}

function ShrinkScene({ accent }: SceneProps) {
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      <circle cx="160" cy="110" r="90" fill={accent} opacity="0.15" className="kids-scene__pulse" />
      <circle cx="160" cy="110" r="60" fill={accent} opacity="0.2" className="kids-scene__pulse kids-scene__pulse--2" />
      {/* spiral tunnel */}
      <path
        d="M160 40c40 0 70 30 70 70s-30 70-70 70-70-30-70-70"
        fill="none"
        stroke={accent}
        strokeWidth="3"
        opacity="0.5"
        className="kids-scene__spin-path"
      />
      <path
        d="M160 60c28 0 50 22 50 50s-22 50-50 50-50-22-50-50"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity="0.35"
      />
      <Luna x={132} y={78} scale={1} />
      {/* shrinking rings of light roads */}
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx="160"
          cy="110"
          r={20 + i * 18}
          fill="none"
          stroke="#fff"
          strokeWidth="1"
          opacity={0.2 + i * 0.08}
          strokeDasharray="4 6"
          className="kids-scene__orbit"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </svg>
  );
}

function NeuronsScene({ accent }: SceneProps) {
  // Star-shaped neuron friends
  const stars = [
    [60, 70],
    [160, 50],
    [250, 75],
    [90, 140],
    [210, 145],
    [155, 120],
  ] as const;
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      {/* connection lines */}
      <g stroke={accent} strokeWidth="1.5" opacity="0.45">
        <line x1="60" y1="70" x2="160" y2="50" className="kids-scene__link" />
        <line x1="160" y1="50" x2="250" y2="75" className="kids-scene__link" />
        <line x1="60" y1="70" x2="90" y2="140" className="kids-scene__link" />
        <line x1="160" y1="50" x2="155" y2="120" className="kids-scene__link" />
        <line x1="155" y1="120" x2="210" y2="145" className="kids-scene__link" />
        <line x1="250" y1="75" x2="210" y2="145" className="kids-scene__link" />
        <line x1="90" y1="140" x2="155" y2="120" className="kids-scene__link" />
      </g>
      {stars.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} className="kids-scene__neuron" style={{ animationDelay: `${i * 0.15}s` }}>
          <circle r="14" fill={accent} opacity="0.9" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="0"
              x2={Math.cos((deg * Math.PI) / 180) * 24}
              y2={Math.sin((deg * Math.PI) / 180) * 24}
              stroke={accent}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
          <circle r="5" fill="#fff" />
          <circle cx="-3" cy="-2" r="1.2" fill="#222" />
          <circle cx="3" cy="-2" r="1.2" fill="#222" />
          <path d="M-3 3c2 2 4 2 6 0" fill="none" stroke="#222" strokeWidth="1" />
        </g>
      ))}
      <Luna x={250} y={150} scale={0.7} />
    </svg>
  );
}

function SparkScene({ accent }: SceneProps) {
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      {/* axon path */}
      <path
        d="M30 160 C80 40, 160 200, 290 50"
        fill="none"
        stroke="#9b5de5"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M30 160 C80 40, 160 200, 290 50"
        fill="none"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="10 8"
        className="kids-scene__dash-run"
      />
      {/* racing spark */}
      <circle r="10" fill={accent} className="kids-scene__race-spark">
        <animateMotion dur="2.2s" repeatCount="indefinite" path="M30 160 C80 40, 160 200, 290 50" />
      </circle>
      <circle r="18" fill={accent} opacity="0.3" className="kids-scene__race-spark">
        <animateMotion dur="2.2s" repeatCount="indefinite" path="M30 160 C80 40, 160 200, 290 50" />
      </circle>
      {/* neuron body start */}
      <circle cx="30" cy="160" r="18" fill="#7b2cbf" />
      <circle cx="290" cy="50" r="16" fill="#7b2cbf" />
      <Luna x={120} y={20} scale={0.75} />
    </svg>
  );
}

function SynapseScene({ accent }: SceneProps) {
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      {/* left neuron arm */}
      <path d="M20 110 H130" stroke="#7b2cbf" strokeWidth="10" strokeLinecap="round" />
      <circle cx="20" cy="110" r="22" fill="#9b5de5" />
      {/* right neuron arm */}
      <path d="M190 110 H300" stroke="#7b2cbf" strokeWidth="10" strokeLinecap="round" />
      <circle cx="300" cy="110" r="22" fill="#9b5de5" />
      {/* gap fireflies */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={140 + i * 10}
          cy={100 + (i % 2 === 0 ? -12 : 14)}
          r="5"
          fill={accent}
          className="kids-scene__firefly"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
      <text x="160" y="175" textAnchor="middle" fill={accent} fontSize="14" fontWeight="700" fontFamily="system-ui">
        synapse
      </text>
      <Luna x={130} y={20} scale={0.7} />
    </svg>
  );
}

function SensesScene({ accent }: SceneProps) {
  const senses = [
    { label: "see", x: 50, icon: "eye" },
    { label: "hear", x: 110, icon: "ear" },
    { label: "smell", x: 170, icon: "nose" },
    { label: "taste", x: 230, icon: "tongue" },
    { label: "touch", x: 290, icon: "hand" },
  ];
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      <circle cx="160" cy="120" r="40" fill={accent} opacity="0.85" className="kids-scene__pulse" />
      <text x="160" y="126" textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="800" fontFamily="system-ui">
        BRAIN
      </text>
      {senses.map((s, i) => (
        <g key={s.label} className="kids-scene__sense" style={{ animationDelay: `${i * 0.12}s` }}>
          <line x1={s.x} y1="50" x2="160" y2="100" stroke="#fff" strokeWidth="2" opacity="0.5" />
          <circle cx={s.x} cy="42" r="20" fill="#fff" opacity="0.95" />
          <text x={s.x} y="46" textAnchor="middle" fontSize="11" fontWeight="700" fill="#333" fontFamily="system-ui">
            {s.label}
          </text>
        </g>
      ))}
      <Luna x={20} y={140} scale={0.75} />
    </svg>
  );
}

function FeelingsScene({ accent }: SceneProps) {
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      {/* weather blobs */}
      <ellipse cx="80" cy="90" rx="50" ry="36" fill="#ffd166" opacity="0.85" className="kids-scene__blob" />
      <ellipse cx="180" cy="70" rx="45" ry="32" fill="#90e0ef" opacity="0.85" className="kids-scene__blob kids-scene__blob--2" />
      <ellipse cx="240" cy="130" rx="48" ry="34" fill="#ff8fab" opacity="0.85" className="kids-scene__blob kids-scene__blob--3" />
      <ellipse cx="120" cy="150" rx="40" ry="28" fill="#bdb2ff" opacity="0.85" className="kids-scene__blob kids-scene__blob--4" />
      <text x="80" y="95" textAnchor="middle" fontSize="13" fontWeight="800" fill="#5c4a00" fontFamily="system-ui">
        happy
      </text>
      <text x="180" y="75" textAnchor="middle" fontSize="13" fontWeight="800" fill="#023e8a" fontFamily="system-ui">
        calm
      </text>
      <text x="240" y="135" textAnchor="middle" fontSize="13" fontWeight="800" fill="#6a040f" fontFamily="system-ui">
        brave
      </text>
      <text x="120" y="155" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3c096c" fontFamily="system-ui">
        excited
      </text>
      <Luna x={250} y={150} scale={0.65} />
      <circle cx="300" cy="40" r="8" fill={accent} className="kids-scene__firefly" />
    </svg>
  );
}

function MemoryScene({ accent }: SceneProps) {
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      {/* shelves */}
      <rect x="30" y="50" width="260" height="12" rx="3" fill="#c9a27e" />
      <rect x="30" y="120" width="260" height="12" rx="3" fill="#c9a27e" />
      <rect x="30" y="180" width="260" height="12" rx="3" fill="#c9a27e" />
      {/* glowing books */}
      {[
        [50, 58, "#ff6b6b", "bike"],
        [90, 58, "#4ecdc4", "soup"],
        [130, 58, accent, "song"],
        [180, 58, "#ffe66d", "hug"],
        [230, 58, "#bdb2ff", "star"],
        [60, 128, "#90e0ef", "run"],
        [110, 128, "#ff8fab", "laugh"],
        [170, 128, "#f4a261", "book"],
        [230, 128, "#80ed99", "home"],
      ].map(([x, y, color, label], i) => (
        <g key={i} className="kids-scene__book" style={{ animationDelay: `${i * 0.1}s` }}>
          <rect x={x as number} y={y as number} width="28" height="55" rx="3" fill={color as string} />
          <text
            x={(x as number) + 14}
            y={(y as number) + 32}
            textAnchor="middle"
            fill="#1a1a1a"
            fontSize="7"
            fontWeight="700"
            fontFamily="system-ui"
            opacity="0.7"
          >
            {label as string}
          </text>
        </g>
      ))}
      <Luna x={250} y={145} scale={0.7} />
    </svg>
  );
}

function PathwaysScene({ accent }: SceneProps) {
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      {/* thin path becoming thick */}
      <path d="M20 180 C80 180, 80 40, 160 40 S240 180, 300 40" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
      <path
        d="M20 180 C80 180, 80 40, 160 40 S240 180, 300 40"
        fill="none"
        stroke={accent}
        strokeWidth="10"
        strokeLinecap="round"
        className="kids-scene__path-grow"
      />
      {/* practice markers */}
      <circle cx="20" cy="180" r="10" fill="#fff" />
      <circle cx="160" cy="40" r="12" fill="#fff" />
      <circle cx="300" cy="40" r="14" fill={accent} className="kids-scene__pulse" />
      <text x="160" y="200" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="system-ui" opacity="0.85">
        practice → stronger path
      </text>
      <Luna x={200} y={80} scale={0.75} />
    </svg>
  );
}

function SleepScene({ accent }: SceneProps) {
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      {/* moon */}
      <circle cx="250" cy="50" r="28" fill={accent} />
      <circle cx="262" cy="44" r="22" fill="#0b1026" />
      {/* stars */}
      {[
        [40, 40],
        [80, 70],
        [120, 30],
        [180, 55],
        [60, 120],
        [200, 100],
        [280, 120],
        [140, 90],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 2 === 0 ? 2 : 3}
          fill="#fff"
          className="kids-scene__star"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
      {/* cleaner clouds */}
      <ellipse cx="90" cy="160" rx="40" ry="18" fill="#c7d2fe" opacity="0.55" className="kids-scene__cloud" />
      <ellipse cx="160" cy="170" rx="50" ry="20" fill="#a5b4fc" opacity="0.5" className="kids-scene__cloud kids-scene__cloud--2" />
      <ellipse cx="230" cy="155" rx="36" ry="16" fill="#c7d2fe" opacity="0.55" className="kids-scene__cloud kids-scene__cloud--3" />
      <Luna x={120} y={90} scale={0.9} />
      <text x="160" y="30" textAnchor="middle" fill={accent} fontSize="14" fontFamily="system-ui" opacity="0.8">
        z z z
      </text>
    </svg>
  );
}

function KindnessScene({ accent }: SceneProps) {
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      {/* two figures sharing a heart spark */}
      <Luna x={50} y={80} scale={1} />
      <g transform="translate(200 80)">
        {/* friend */}
        <ellipse cx="28" cy="18" rx="20" ry="16" fill="#2b2d42" />
        <circle cx="28" cy="28" r="15" fill="#e0aaff" />
        <circle cx="22" cy="27" r="2" fill="#1a1a1a" />
        <circle cx="34" cy="27" r="2" fill="#1a1a1a" />
        <path d="M22 34c3 3 9 3 12 0" fill="none" stroke="#7b2cbf" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 46c2-8 24-8 28 0l3 28H11l3-28z" fill="#4cc9f0" />
      </g>
      {/* heart sparks between them */}
      <g className="kids-scene__hearts">
        <path d="M160 90c-8-12-28-4-20 12 8 14 20 22 20 22s12-8 20-22c8-16-12-24-20-12z" fill={accent} />
        <circle cx="130" cy="70" r="4" fill={accent} className="kids-scene__firefly" />
        <circle cx="190" cy="65" r="5" fill={accent} className="kids-scene__firefly" style={{ animationDelay: "0.3s" }} />
        <circle cx="160" cy="50" r="3" fill="#fff" className="kids-scene__firefly" style={{ animationDelay: "0.6s" }} />
      </g>
    </svg>
  );
}

function HeroScene({ accent }: SceneProps) {
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="100" r="90" fill="url(#heroGlow)" className="kids-scene__pulse" />
      {/* constellation brain outline */}
      <ellipse cx="160" cy="95" rx="55" ry="42" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
      <ellipse cx="140" cy="90" rx="28" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.4" />
      <ellipse cx="180" cy="90" rx="28" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.4" />
      {[
        [120, 80],
        [145, 70],
        [175, 68],
        [200, 82],
        [130, 110],
        [160, 120],
        [190, 108],
        [160, 85],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={accent} className="kids-scene__star" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
      <Luna x={132} y={130} scale={0.95} />
    </svg>
  );
}

function AgainScene({ accent }: SceneProps) {
  return (
    <svg className="kids-scene" viewBox="0 0 320 220" aria-hidden>
      <circle cx="160" cy="110" r="55" fill="none" stroke={accent} strokeWidth="8" strokeDasharray="20 12" className="kids-scene__spin-path" />
      <circle cx="160" cy="110" r="35" fill={accent} opacity="0.25" />
      <path d="M160 75 l12 20 h-24z" fill={accent} transform="rotate(40 160 110)" />
      <text x="160" y="118" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800" fontFamily="system-ui">
        again!
      </text>
      <Luna x={230} y={140} scale={0.8} />
      <g className="kids-scene__float">
        <rect x="40" y="40" width="36" height="28" rx="5" fill="#111" />
        <text x="58" y="58" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="system-ui">
          KEY
        </text>
      </g>
    </svg>
  );
}
