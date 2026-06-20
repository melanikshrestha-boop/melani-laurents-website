import { Allura } from "next/font/google";
import Link from "next/link";

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
});

interface MelaniSignatureProps {
  className?: string;
  /** Link signature to home. */
  linked?: boolean;
  /** ink = pitch black on cream hub; light = white on cinema nav; gold = glowing gold treatment */
  variant?: "ink" | "light" | "gold";
}

const variantClass: Record<NonNullable<MelaniSignatureProps["variant"]>, string> = {
  ink: "melani-signature--ink",
  light: "melani-signature--light",
  gold: "melani-signature--gold",
};

/** Readable Melani-only autograph. */
export function MelaniSignature({
  className = "",
  linked = true,
  variant = "ink",
}: MelaniSignatureProps) {
  const signature = (
    <span
      className={`melani-signature ${variantClass[variant]}${className ? ` ${className}` : ""}`}
      aria-hidden={linked}
      role={linked ? undefined : "img"}
      aria-label={linked ? undefined : "Melani"}
    >
      {!linked ? <span className="sr-only">Melani</span> : null}
      <svg
        className="melani-signature__mark"
        viewBox="0 0 320 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        role="img"
      >
        <title>Melani</title>
        <text
          x="18"
          y="94"
          className={allura.className}
          fontFamily={allura.style.fontFamily}
          fontSize="104"
          fill="currentColor"
        >
          Melani
        </text>
      </svg>
    </span>
  );

  if (linked) {
    return (
      <Link
        href="/"
        className="melani-signature-link"
        aria-label="Melani — home"
      >
        {signature}
      </Link>
    );
  }

  return signature;
}
