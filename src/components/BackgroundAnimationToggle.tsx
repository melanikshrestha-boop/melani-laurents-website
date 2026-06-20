"use client";

type BackgroundAnimationToggleProps = {
  enabled: boolean;
  onToggle: () => void;
  visible?: boolean;
};

export function BackgroundAnimationToggle({
  enabled,
  onToggle,
  visible = true,
}: BackgroundAnimationToggleProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed right-4 top-1/2 z-40 -translate-y-1/2 sm:right-6"
      aria-live="polite"
    >
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={enabled ? "Turn animation off" : "Turn animation on"}
        onClick={onToggle}
        className="glass-panel group flex items-center gap-3 rounded-full border border-border px-3 py-2 text-left transition-colors hover:border-accent/30 sm:px-4 sm:py-2.5"
      >
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase sm:text-[11px]">
          Animation
        </span>
        <span
          className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200 ${
            enabled
              ? "border-accent/40 bg-accent/20"
              : "border-border bg-surface-elevated/80"
          }`}
          aria-hidden
        >
          <span
            className={`absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full transition-transform duration-200 ${
              enabled
                ? "translate-x-4 bg-accent shadow-[0_0_8px_var(--accent-glow)]"
                : "translate-x-0 bg-muted"
            }`}
          />
        </span>
        <span className="sr-only">{enabled ? "On" : "Off"}</span>
      </button>
    </div>
  );
}
