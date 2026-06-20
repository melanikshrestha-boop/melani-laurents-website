interface BrandWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Optional leading text rendered in the same scale (e.g. "Hi, "). */
  prefix?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-4xl md:text-6xl",
};

export function BrandWordmark({
  className = "",
  size = "md",
  prefix,
}: BrandWordmarkProps) {
  return (
    <span
      className={`font-display font-normal tracking-tight ${sizeClasses[size]} ${className}`}
    >
      {prefix ? <span className="text-foreground">{prefix}</span> : null}
      <span className="text-foreground">Melani</span>
      <span className="text-foreground"> Laurent</span>
      <span className="text-accent"> S.</span>
    </span>
  );
}
