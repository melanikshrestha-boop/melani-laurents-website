import { ImageResponse } from "next/og";

/** Browser tab + PWA icon — Celine Nova monogram (not the Vercel triangle). */
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
          borderRadius: 8,
        }}
      >
        {/* Gold ring + open C — readable tiny in the tab */}
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 999,
            border: "1.5px solid #d4af6a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f4f0e6",
            fontSize: 15,
            fontFamily: "Georgia, Times New Roman, serif",
            fontWeight: 500,
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
