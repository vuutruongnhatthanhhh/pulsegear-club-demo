import { ImageResponse } from "next/og";
import config from "@/config";

export const runtime = "edge";
export const alt = config.companyName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          backgroundImage:
            "radial-gradient(circle at 28% 24%, rgba(255,60,0,0.28), transparent 55%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 9999,
              backgroundColor: "#FF3C00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 900,
              color: "#000",
            }}
          >
            P
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: -1,
            }}
          >
            PULSEGEAR<span style={{ color: "#FF3C00" }}>.CLUB</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "rgba(255,255,255,0.65)",
            fontWeight: 600,
          }}
        >
          Trang phục &amp; phụ kiện thể thao hiệu suất cao
        </div>
      </div>
    ),
    { ...size }
  );
}
