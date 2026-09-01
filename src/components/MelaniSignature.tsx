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
  /** Art nav: quoted autograph, slightly heavier stroke. */
  quoted?: boolean;
}

const variantClass: Record<NonNullable<MelaniSignatureProps["variant"]>, string> = {
  ink: "melani-signature--ink",
  light: "melani-signature--light",
  gold: "melani-signature--gold",
};

/** Readable Celine Nova autograph. */
export function MelaniSignature({
  className = "",
  linked = true,
  variant = "ink",
  quoted = false,
}: MelaniSignatureProps) {
  const signature = (
    <span
      className={`melani-signature ${variantClass[variant]}${className ? ` ${className}` : ""}`}
      aria-hidden={linked}
      role={linked ? undefined : "img"}
      aria-label={linked ? undefined : "Celine Nova"}
    >
      {!linked ? <span className="sr-only">Celine Nova</span> : null}
      <svg
        className="melani-signature__mark"
        viewBox={quoted ? "0 0 540 130" : "0 0 460 130"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        role="img"
      >
        <title>Celine Nova</title>
        <text
          x={quoted ? 10 : 18}
          y="94"
          className={allura.className}
          fontFamily={allura.style.fontFamily}
          fontSize="92"
          fill="currentColor"
          stroke={quoted ? "currentColor" : undefined}
          strokeWidth={quoted ? "2.1" : undefined}
          paintOrder={quoted ? "stroke fill" : undefined}
        >
          {quoted ? "\u201CCeline Nova\u201D" : "Celine Nova"}
        </text>
      </svg>
    </span>
  );

  if (linked) {
    return (
      <Link
        href="/"
        className="melani-signature-link"
        aria-label="Celine Nova — home"
      >
        {signature}
      </Link>
    );
  }

  return signature;
}
