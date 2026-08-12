import { ImageResponse } from "next/og";

/** iOS home-screen — same monogram, larger. */
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
          position: "relative",
        }}
      >
        <div
          style={{
            width: 108,
            height: 108,
            borderRadius: 999,
            border: "14px solid #f3efe6",
            borderRightColor: "transparent",
            transform: "rotate(-25deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 16,
            height: 16,
            borderRadius: 999,
            background: "#c9a962",
            right: 48,
            top: 82,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
