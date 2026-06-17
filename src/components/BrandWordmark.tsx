interface BrandWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-4xl md:text-5xl",
};

/** Melani in Geist (Cursor-adjacent); Kirstein slightly lighter — no serif on the suffix */
export function BrandWordmark({
  className = "",
  size = "md",
}: BrandWordmarkProps) {
  return (
    <span
      className={`font-sans tracking-tight ${sizeClasses[size]} ${className}`}
    >
      <span className="font-semibold text-foreground">Melani</span>
      <span className="font-normal text-foreground/75">Kirstein</span>
    </span>
  );
}
