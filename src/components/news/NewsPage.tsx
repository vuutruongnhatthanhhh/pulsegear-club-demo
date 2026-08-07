"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";
import type { Article } from "@/lib/articles";

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
  breadcrumbNews: { vi: "Tin Tức", en: "News" },
  eyebrow: { vi: "BLOG PULSEGEAR", en: "PULSEGEAR BLOG" },
  title1: { vi: "TIN TỨC &", en: "NEWS &" },
  title2: { vi: "CẢM HỨNG", en: "INSPIRATION" },
  sub: {
    vi: "Mẹo tập luyện, câu chuyện vận động viên và tin tức mới nhất từ PULSEGEAR.CLUB.",
    en: "Training tips, athlete stories, and the latest from PULSEGEAR.CLUB.",
  },
  readMore: { vi: "Đọc thêm", en: "Read more" },
  featured: { vi: "NỔI BẬT", en: "FEATURED" },
};

const PAGE_SIZE = 10;

export default function NewsPage({ articles }: { articles: Article[] }) {
  const lang = useI18nStore((s) => s.lang);
  const [featured, ...rest] = articles;
  const gridRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [articles]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (n: number) => {
    if (n < 1 || n > totalPages || n === page) return;
    setPage(n);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ backgroundColor: C.bg, color: "#fff" }}>
      {/* ════════ HERO ════════ */}
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(/images/home/hero-1.jpg)`,
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
            <span style={{ color: C.accent }}>{T.breadcrumbNews[lang]}</span>
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

      {/* ════════ FEATURED ════════ */}
      {featured && page === 1 && (
        <section className="w-full" style={{ backgroundColor: C.bg }}>
          <div className="mx-auto max-w-screen-2xl px-8 pt-14 md:px-16 lg:px-24">
            <Link
              href={`/tin-tuc/${featured.slug}`}
              className="group relative grid overflow-hidden lg:grid-cols-2"
              style={{ border: `1px solid ${C.border}` }}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto">
                <img
                  src={featured.img}
                  alt={featured.title[lang]}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div
                  className="absolute left-4 top-4 px-3 py-1.5 text-[10px] font-black tracking-[0.25em] uppercase"
                  style={{ backgroundColor: featured.accent, color: "#000" }}
                >
                  {T.featured[lang]}
                </div>
              </div>
              <div
                className="flex flex-col justify-center p-8 md:p-12"
                style={{ backgroundColor: C.bg3 }}
              >
                <p
                  className="mb-3 text-[11px] font-black tracking-[0.25em] uppercase"
                  style={{ color: featured.accent }}
                >
                  {featured.category[lang]}
                </p>
                <h2 className="text-2xl font-black leading-tight tracking-[-0.02em] text-white md:text-3xl">
                  {featured.title[lang]}
                </h2>
                <p
                  className="mt-4 text-[14px] leading-relaxed"
                  style={{ color: C.muted }}
                >
                  {featured.excerpt[lang]}
                </p>
                <div
                  className="mt-6 flex items-center gap-4 text-[12px]"
                  style={{ color: C.muted }}
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {featured.date}
                  </span>
                </div>
                <div
                  className="group/link mt-6 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-white"
                >
                  {T.readMore[lang]}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ════════ GRID ════════ */}
      <section className="w-full" style={{ backgroundColor: C.bg }}>
        <div
          ref={gridRef}
          className="mx-auto max-w-screen-2xl px-8 py-14 md:px-16 lg:px-24"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((a) => (
              <Link
                key={a.id}
                href={`/tin-tuc/${a.slug}`}
                className="group relative flex h-full flex-col overflow-hidden"
                style={{ border: `1px solid ${C.border}` }}
              >
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
                  <img
                    src={a.img}
                    alt={a.title[lang]}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 55%)",
                    }}
                  />
                </div>
                <div
                  className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: a.accent }}
                />
                <div
                  className="flex flex-1 flex-col p-6"
                  style={{ backgroundColor: C.bg3 }}
                >
                  <div
                    className="mb-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em]"
                    style={{ color: a.accent }}
                  >
                    <span>{a.category[lang]}</span>
                    <span style={{ color: C.border }}>|</span>
                    <span style={{ color: C.muted }} className="font-medium normal-case tracking-normal">
                      {a.date}
                    </span>
                  </div>
                  <h3 className="text-base font-black leading-snug text-white">
                    {a.title[lang]}
                  </h3>
                  <p
                    className="mt-2 text-[13px] leading-relaxed"
                    style={{ color: C.muted }}
                  >
                    {a.excerpt[lang]}
                  </p>
                  <div className="mt-auto flex items-center gap-2 pt-4 text-[11px] font-black uppercase tracking-[0.2em] text-white">
                    {T.readMore[lang]}
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="flex h-10 w-10 items-center justify-center text-white/60 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-white/60"
                style={{ border: `1px solid ${C.border}` }}
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => goToPage(n)}
                  className="flex h-10 w-10 items-center justify-center text-[12px] font-bold transition-colors"
                  style={
                    n === page
                      ? { backgroundColor: C.accent, color: "#000" }
                      : { border: `1px solid ${C.border}`, color: C.muted }
                  }
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="flex h-10 w-10 items-center justify-center text-white/60 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-white/60"
                style={{ border: `1px solid ${C.border}` }}
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
