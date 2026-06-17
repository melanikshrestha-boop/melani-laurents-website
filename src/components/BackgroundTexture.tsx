export function BackgroundTexture() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 texture-grid" aria-hidden>
      <svg
        className="absolute bottom-0 left-0 right-0 h-32 w-full opacity-[0.03]"
        preserveAspectRatio="none"
        viewBox="0 0 1200 120"
      >
        <path
          d="M0,60 Q50,20 100,60 T200,60 T300,40 T400,70 T500,55 T600,65 T700,45 T800,60 T900,50 T1000,62 T1100,58 T1200,60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent"
        />
        <path
          d="M0,70 Q50,90 100,70 T200,75 T300,55 T400,80 T500,68 T600,72 T700,58 T800,75 T900,65 T1000,78 T1100,70 T1200,72"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          className="text-accent"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
