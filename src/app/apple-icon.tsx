import { ImageResponse } from "next/og";

/** iOS home-screen icon — same monogram, larger. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 999,
            border: "3px solid #d4af6a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f4f0e6",
            fontSize: 88,
            fontFamily: "Georgia, Times New Roman, serif",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          C
        </div>
      </div>
    ),
    { ...size },
  );
}
