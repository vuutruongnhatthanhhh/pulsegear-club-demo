"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";
import { getAllDrops, FALLBACK_DROPS, type Drop } from "@/lib/drops";

const C = {
  bg: "#0A0A0A",
  bg2: "#111111",
  bg3: "#161616",
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
  breadcrumbHome: { vi: "Trang chủ", en: "Home" },
  breadcrumbCollections: { vi: "Bộ Sưu Tập", en: "Collections" },
  eyebrow: { vi: "BỘ SƯU TẬP", en: "COLLECTIONS" },
  title1: { vi: "KHÁM PHÁ", en: "EXPLORE OUR" },
  title2: { vi: "BỘ SƯU TẬP", en: "COLLECTIONS" },
  sub: {
    vi: "Từ dòng sản phẩm mới ra mắt đến những bộ sưu tập signature — tìm bộ đồ phù hợp với hành trình của bạn.",
    en: "From the newest arrivals to our signature lines — find the collection that fits your journey.",
  },
  count: { vi: "bộ sưu tập", en: "collections" },
  shopNow: { vi: "MUA NGAY", en: "SHOP NOW" },
};

export default function CollectionsPage() {
  const lang = useI18nStore((s) => s.lang);
  const [drops, setDrops] = useState<Drop[]>(FALLBACK_DROPS);

  useEffect(() => {
    getAllDrops().then((data) => {
      if (data.length > 0) setDrops(data);
    });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: "#fff" }}>
      {/* ════════ HERO ════════ */}
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(/images/home/drop-apex.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,.75) 0%, rgba(0,0,0,.9) 75%, ${C.bg} 100%),
                         radial-gradient(ellipse 60% 70% at 75% 30%, ${C.accent}20, transparent 70%)`,
          }}
        />
        <Noise op={0.04} />

        <div className="relative mx-auto max-w-screen-2xl px-8 pb-14 pt-32 md:px-16 lg:px-24 lg:pt-40">
          <div
            className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Link href="/" className="transition-colors hover:text-white">
              {T.breadcrumbHome[lang]}
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: C.accent }}>
              {T.breadcrumbCollections[lang]}
            </span>
          </div>

          <p
            className="mb-4 text-[11px] font-black tracking-[0.4em] uppercase"
            style={{ color: C.accent }}
          >
            {T.eyebrow[lang]}
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-[-0.02em] text-white">
            {T.title1[lang]}{" "}
            <span style={{ color: C.accent }}>{T.title2[lang]}</span>
          </h1>
          <p
            className="mt-4 max-w-lg text-[15px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {T.sub[lang]}
          </p>
        </div>
      </section>

      {/* ════════ COUNT ════════ */}
      <section
        className="w-full border-b"
        style={{ backgroundColor: C.bg, borderColor: C.border }}
      >
        <div className="mx-auto max-w-screen-2xl px-8 py-5 md:px-16 lg:px-24">
          <p className="text-[13px] font-semibold" style={{ color: C.muted }}>
            {drops.length} {T.count[lang]}
          </p>
        </div>
      </section>

      {/* ════════ GRID ════════ */}
      <section className="w-full" style={{ backgroundColor: C.bg }}>
        <div className="mx-auto max-w-screen-2xl px-8 py-14 md:px-16 lg:px-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drops.map((drop) => (
              <Link
                key={drop.id}
                href={`/bo-suu-tap/${drop.id}`}
                className="group relative flex h-full flex-col overflow-hidden"
                style={{ border: `1px solid ${C.border}` }}
              >
                <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
                  <img
                    src={drop.img}
                    alt={drop.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 55%)",
                    }}
                  />
                </div>
                <div
                  className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: drop.glow }}
                />
                <div
                  className="relative flex flex-1 flex-col p-6"
                  style={{ backgroundColor: C.bg3 }}
                >
                  <p
                    className="mb-1 text-[10px] font-semibold tracking-[0.2em] uppercase"
                    style={{ color: `${drop.glow}99` }}
                  >
                    {drop.tag[lang]}
                  </p>
                  <h3 className="text-xl font-black leading-tight tracking-[-0.02em] text-white">
                    {drop.title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: C.muted }}
                  >
                    {drop.sub[lang]}
                  </p>
                  <div
                    className="mt-auto flex items-center gap-2 pt-5 text-[11px] font-black tracking-[0.2em] uppercase transition-all group-hover:gap-3"
                    style={{ color: drop.glow }}
                  >
                    {T.shopNow[lang]} <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
