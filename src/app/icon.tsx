import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #4CD9E8 0%, #8B5CF6 100%)",
        borderRadius: 8,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
        <path d="M26.5 6L14 26.5H21.5L20 42L34 20.5H26L26.5 6Z" fill="white" />
      </svg>
    </div>,
    { ...size },
  );
}
