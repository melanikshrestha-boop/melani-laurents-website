export function SchematicDiagram() {
  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md text-muted"
      aria-label="System schematic diagram"
    >
      <rect
        x="20"
        y="100"
        width="80"
        height="60"
        rx="4"
        stroke="currentColor"
        strokeWidth="1"
        className="opacity-40"
      />
      <text x="35" y="135" fill="currentColor" fontSize="10" className="font-mono opacity-60">
        Signal
      </text>

      <rect
        x="160"
        y="80"
        width="80"
        height="100"
        rx="4"
        stroke="currentColor"
        strokeWidth="1"
        className="text-accent opacity-60"
      />
      <text x="172" y="135" fill="currentColor" fontSize="10" className="font-mono opacity-80">
        Process
      </text>

      <rect
        x="300"
        y="100"
        width="80"
        height="60"
        rx="4"
        stroke="currentColor"
        strokeWidth="1"
        className="opacity-40"
      />
      <text x="318" y="135" fill="currentColor" fontSize="10" className="font-mono opacity-60">
        Output
      </text>

      <line x1="100" y1="130" x2="160" y2="130" stroke="currentColor" strokeWidth="1" className="opacity-30" />
      <line x1="240" y1="130" x2="300" y2="130" stroke="currentColor" strokeWidth="1" className="opacity-30" />

      <circle cx="130" cy="130" r="3" fill="currentColor" className="text-accent opacity-80" />
      <circle cx="270" cy="130" r="3" fill="currentColor" className="text-accent opacity-80" />

      <rect
        x="120"
        y="200"
        width="160"
        height="40"
        rx="4"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeDasharray="4 4"
        className="opacity-25"
      />
      <text x="155" y="225" fill="currentColor" fontSize="9" className="font-mono opacity-40">
        validation layer
      </text>

      <line x1="200" y1="180" x2="200" y2="200" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" className="opacity-25" />
    </svg>
  );
}
