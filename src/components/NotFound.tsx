"use client";

import Link from "next/link";
import { ArrowRight, Home, Search } from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";

const C = {
  bg: "#0A0A0A",
  bg2: "#111111",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

function Noise({ op = 0.03 }: { op?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: op,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

const T = {
  eyebrow: { vi: "LỖI 404", en: "ERROR 404" },
  title1: { vi: "LẠC", en: "OFF" },
  title2: { vi: "ĐƯỜNG RỒI", en: "THE TRACK" },
  sub: {
    vi: "Trang bạn tìm không tồn tại, đã bị xoá, hoặc đã đổi đường dẫn. Quay lại vạch xuất phát thôi.",
    en: "The page you're looking for doesn't exist, was removed, or moved. Let's get you back on track.",
  },
  home: { vi: "VỀ TRANG CHỦ", en: "BACK HOME" },
  shop: { vi: "TIẾP TỤC MUA SẮM", en: "KEEP SHOPPING" },
};

export default function NotFound() {
  const lang = useI18nStore((s) => s.lang);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-24 text-center"
      style={{ backgroundColor: C.bg, color: "#fff" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 40%, ${C.accent}1c, transparent 70%)`,
        }}
      />
      <Noise op={0.03} />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg,rgba(255,60,0,.8) 0 1px,transparent 1px 70px)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <Link href="/" className="mb-10 flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Pulsegear.Club"
            className="h-11 w-11 object-contain"
          />
          <span className="text-sm font-black tracking-[0.1em] text-white">
            PULSEGEAR.CLUB
          </span>
        </Link>

        <p
          className="mb-3 text-[11px] font-black tracking-[0.5em] uppercase"
          style={{ color: C.accent }}
        >
          {T.eyebrow[lang]}
        </p>

        <div
          className="select-none text-[clamp(6rem,22vw,13rem)] font-black leading-none tracking-[-0.03em]"
          style={{
            color: C.bg2,
            WebkitTextStroke: `2px ${C.accent}`,
            textShadow: `0 0 90px ${C.accent}40`,
          }}
        >
          404
        </div>

        <h1 className="mt-2 text-3xl font-black leading-tight tracking-[-0.02em] text-white md:text-4xl">
          {T.title1[lang]} <span style={{ color: C.accent }}>{T.title2[lang]}</span>
        </h1>

        <p
          className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed"
          style={{ color: C.muted }}
        >
          {T.sub[lang]}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/">
            <button
              className="group relative flex items-center gap-2 overflow-hidden px-9 py-4 text-[12px] font-black tracking-[0.25em] uppercase text-black transition-transform hover:scale-[1.03] active:scale-[0.97]"
              style={{ backgroundColor: C.accent }}
            >
              <Home size={14} className="relative z-10" />
              <span className="relative z-10">{T.home[lang]}</span>
              <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          </Link>
          <Link href="/">
            <button
              className="group flex items-center gap-2 px-9 py-4 text-[12px] font-black tracking-[0.25em] uppercase text-white/70 transition-all hover:text-white"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}
            >
              {T.shop[lang]}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
