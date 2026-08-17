import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #4CD9E8 0%, #8B5CF6 100%)",
        borderRadius: 40,
      }}
    >
      <svg width="110" height="110" viewBox="0 0 48 48" fill="none">
        <path d="M26.5 6L14 26.5H21.5L20 42L34 20.5H26L26.5 6Z" fill="white" />
      </svg>
    </div>,
    { ...size },
  );
}
