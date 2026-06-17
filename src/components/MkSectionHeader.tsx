interface MkSectionHeaderProps {
  id: string;
  label: string;
  title?: string;
  description?: string;
  align?: "left" | "right";
}

export function MkSectionHeader({
  id,
  label,
  title,
  description,
  align = "left",
}: MkSectionHeaderProps) {
  return (
    <header
      id={id}
      className={`scroll-mt-24 mb-10 lg:mb-12 ${
        align === "right" ? "lg:text-right" : ""
      }`}
    >
      <p className="font-mono-label text-accent mb-2">{label}</p>
      {title && (
        <h2 className="font-sans text-2xl font-semibold text-foreground md:text-3xl">
          {title}
        </h2>
      )}
      {description && (
        <p
          className={`mt-3 max-w-md text-sm text-muted leading-relaxed ${
            align === "right" ? "lg:ml-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </header>
  );
}
