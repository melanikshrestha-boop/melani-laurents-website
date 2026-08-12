import { ImageResponse } from "next/og";

/** Browser tab icon — void plate, open C, gold pin (not Vercel / not app-store chrome). */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: 7,
        }}
      >
        {/* Open C via CSS arc — cleaner than a text “C” at 16–32px */}
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 999,
            border: "3px solid #f3efe6",
            borderRightColor: "transparent",
            transform: "rotate(-25deg)",
            display: "flex",
            position: "relative",
          }}
        />
        {/* Gold pin in the C opening */}
        <div
          style={{
            position: "absolute",
            width: 4,
            height: 4,
            borderRadius: 999,
            background: "#c9a962",
            right: 7,
            top: 14,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
