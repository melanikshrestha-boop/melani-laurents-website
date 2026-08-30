import { ImageResponse } from "next/og";

/** Browser tab — cream paper, serif C. Never a copyright ring. */
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
          background: "#f7f1e7",
          borderRadius: 6,
          color: "#171717",
          fontSize: 22,
          fontWeight: 600,
          fontFamily: "Georgia, Times New Roman, serif",
          lineHeight: 1,
        }}
      >
        C
      </div>
    ),
    { ...size },
  );
}
