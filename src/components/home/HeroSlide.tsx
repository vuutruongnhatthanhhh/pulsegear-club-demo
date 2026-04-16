"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import type { Slide, I18N } from "@/services/SlideService";

const PRIMARY = "#08476D";

// ✅ 5 màu tương đồng với tone xanh navy gốc
const SLIDE_COLORS = [
  "#08476D", // navy gốc
  "#0C3A4A", // deep teal
  "#111827", // charcoal
  // "#0B5D8A", // blue ocean
  // "#0E7C86", // teal
  // "#0B6B3A", // emerald
  // "#6B1D5A", // plum
  "#9B1C1C", // ruby red
  // "#7A2E0E", // burnt orange
  "#3B2E7E", // royal indigo
  // "#1F3A5F", // deep slate blue

  "#8A6A12", // gold-ish brown
];
function safeLang(lang: Lang) {
  return lang === "vi" || lang === "en" ? lang : ("vi" as Lang);
}

function i18nText(v?: I18N | null, lang: Lang = "vi") {
  if (!v) return "";
  const L = safeLang(lang);
  return ((v?.[L] ?? v?.vi ?? v?.en ?? "") as string).trim();
}

function LeftPattern({
  variant,
}: {
  variant: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}) {
  const Base = () => (
    <>
      <div
        className="absolute inset-0 opacity-[0.02] md:opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );

  const Hairlines = ({ opacity }: { opacity: string }) => (
    <>
      <div
        className={`absolute left-[10%] top-[22%] h-px w-[56%] rotate-12 ${opacity}`}
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,.48), rgba(255,255,255,.18), transparent)",
        }}
      />
      <div
        className={`absolute left-[14%] top-[28%] h-px w-[46%] rotate-12 ${opacity}`}
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,.32), transparent)",
        }}
      />
    </>
  );

  const Sparkles = ({ opacity }: { opacity: string }) => (
    <>
      <div
        className={`absolute left-[14%] top-[18%] h-1 w-1 rounded-full bg-white ${opacity}`}
      />
      <div
        className={`absolute left-[22%] top-[36%] h-1 w-1 rounded-full bg-white/80 ${opacity}`}
      />
      <div
        className={`absolute left-[30%] top-[58%] h-1 w-1 rounded-full bg-white/70 ${opacity}`}
      />
      <div
        className={`absolute left-[18%] top-[72%] h-1 w-1 rounded-full bg-white/60 ${opacity}`}
      />
    </>
  );

  /* =========================
     Variant 0 – Luxury arcs
  ========================= */
  if (variant === 0) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Base />
        <div className="absolute -left-[26%] top-[12%] h-[520px] w-[520px] rounded-full border border-white/20 opacity-[0.12] md:opacity-[0.38]" />
        <div className="absolute -left-[10%] top-[26%] h-[620px] w-[620px] rounded-full border border-white/18 opacity-[0.10] md:opacity-[0.30]" />
        <div className="absolute left-[10%] top-[44%] h-[420px] w-[420px] rounded-full border border-white/14 opacity-[0.08] md:opacity-[0.22]" />
        <Hairlines opacity="opacity-[0.10] md:opacity-[0.32]" />
        <Sparkles opacity="opacity-[0.55] md:opacity-[0.85]" />
      </div>
    );
  }

  /* =========================
     Variant 1 – Halftone dots
  ========================= */
  if (variant === 1) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Base />
        <div
          className="absolute inset-y-0 left-0 w-[62%] opacity-[0.10] md:opacity-[0.36]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,.42) 0 2px, transparent 3px)",
            backgroundSize: "18px 18px",
            maskImage:
              "radial-gradient(720px 540px at 25% 55%, black 0%, black 55%, transparent 82%)",
            WebkitMaskImage:
              "radial-gradient(720px 540px at 25% 55%, black 0%, black 55%, transparent 82%)",
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[62%] opacity-[0.07] md:opacity-[0.24]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,.28) 0 1px, transparent 2px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(760px 520px at 18% 40%, black 0%, black 55%, transparent 82%)",
            WebkitMaskImage:
              "radial-gradient(760px 520px at 18% 40%, black 0%, black 55%, transparent 82%)",
          }}
        />
        <div className="absolute -left-[16%] top-[18%] h-[560px] w-[560px] rounded-full border border-white/18 opacity-[0.10] md:opacity-[0.28]" />
        <Hairlines opacity="opacity-[0.08] md:opacity-[0.28]" />
        <Sparkles opacity="opacity-[0.50] md:opacity-[0.82]" />
      </div>
    );
  }

  /* =========================
     Variant 2 – Dotted rings
  ========================= */
  if (variant === 2) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Base />
        <div className="absolute -left-[24%] top-[8%] h-[720px] w-[720px] rounded-full border border-white/20 opacity-[0.10] md:opacity-[0.34]" />
        <div className="absolute -left-[6%] top-[28%] h-[560px] w-[560px] rounded-full border border-white/16 opacity-[0.08] md:opacity-[0.26]" />
        <div
          className="absolute -left-[2%] top-[18%] h-[520px] w-[520px] rounded-full opacity-[0.06] md:opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,.32) 0 1px, transparent 2px)",
            backgroundSize: "18px 18px",
            maskImage:
              "radial-gradient(closest-side, black 0%, black 65%, transparent 82%)",
            WebkitMaskImage:
              "radial-gradient(closest-side, black 0%, black 65%, transparent 82%)",
          }}
        />
        <Hairlines opacity="opacity-[0.08] md:opacity-[0.30]" />
        <Sparkles opacity="opacity-[0.48] md:opacity-[0.80]" />
      </div>
    );
  }

  /* =========================
     Variant 3 – Diamond grid
  ========================= */
  if (variant === 3) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Base />

        {/* Diamond shapes */}
        <div
          className="absolute left-0 top-0 h-full w-[70%] opacity-[0.08] md:opacity-[0.25]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, transparent 48%, rgba(255,255,255,.4) 49%, rgba(255,255,255,.4) 51%, transparent 52%), linear-gradient(-45deg, transparent 48%, rgba(255,255,255,.4) 49%, rgba(255,255,255,.4) 51%, transparent 52%)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(650px 500px at 20% 50%, black 0%, black 50%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(650px 500px at 20% 50%, black 0%, black 50%, transparent 78%)",
          }}
        />

        {/* Diagonal lines */}
        <div
          className="absolute left-[5%] top-[15%] h-px w-[50%] -rotate-45 opacity-[0.12] md:opacity-[0.35]"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,.6), transparent)",
          }}
        />
        <div
          className="absolute left-[8%] top-[35%] h-px w-[45%] -rotate-45 opacity-[0.10] md:opacity-[0.28]"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,.5), transparent)",
          }}
        />

        <Sparkles opacity="opacity-[0.52] md:opacity-[0.82]" />
      </div>
    );
  }

  /* =========================
     Variant 5 – Mesh glow (gradient blob)
  ========================= */
  if (variant === 5) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Base />
        <div
          className="absolute -left-[18%] top-[8%] h-[520px] w-[520px] rounded-full opacity-[0.14] md:opacity-[0.38]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,.55), rgba(255,255,255,0) 60%)",
          }}
        />
        <div
          className="absolute left-[10%] top-[46%] h-[420px] w-[420px] rounded-full opacity-[0.10] md:opacity-[0.30]"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(255,255,255,.40), rgba(255,255,255,0) 62%)",
          }}
        />
        <div className="absolute -left-[10%] top-[22%] h-[640px] w-[640px] rounded-full border border-white/14 opacity-[0.10] md:opacity-[0.26]" />
        <Hairlines opacity="opacity-[0.10] md:opacity-[0.30]" />
        <Sparkles opacity="opacity-[0.55] md:opacity-[0.85]" />
      </div>
    );
  }

  /* =========================
     Variant 6 – Spotlight + vignette edge
  ========================= */
  if (variant === 6) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Base />
        <div
          className="absolute inset-0 opacity-[0.18] md:opacity-[0.42]"
          style={{
            background:
              "radial-gradient(620px 520px at 20% 45%, rgba(255,255,255,.55), rgba(255,255,255,0) 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.14] md:opacity-[0.30]"
          style={{
            background:
              "radial-gradient(780px 620px at 18% 55%, rgba(255,255,255,.25), rgba(255,255,255,0) 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.10] md:opacity-[0.20]"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,.18), transparent 55%)",
          }}
        />
        <Hairlines opacity="opacity-[0.10] md:opacity-[0.32]" />
        <Sparkles opacity="opacity-[0.45] md:opacity-[0.78]" />
      </div>
    );
  }

  /* =========================
     Variant 7 – Confetti sprinkles
  ========================= */
  if (variant === 7) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Base />
        <div
          className="absolute inset-y-0 left-0 w-[70%] opacity-[0.10] md:opacity-[0.30]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,.55) 0 1px, transparent 2px), radial-gradient(circle, rgba(255,255,255,.35) 0 1px, transparent 2px)",
            backgroundSize: "22px 22px, 34px 34px",
            backgroundPosition: "0 0, 10px 14px",
            maskImage:
              "radial-gradient(720px 560px at 22% 52%, black 0%, black 55%, transparent 82%)",
            WebkitMaskImage:
              "radial-gradient(720px 560px at 22% 52%, black 0%, black 55%, transparent 82%)",
          }}
        />
        <div className="absolute -left-[22%] top-[14%] h-[560px] w-[560px] rounded-full border border-white/16 opacity-[0.10] md:opacity-[0.26]" />
        <Hairlines opacity="opacity-[0.08] md:opacity-[0.28]" />
        <Sparkles opacity="opacity-[0.60] md:opacity-[0.90]" />
      </div>
    );
  }

  /* =========================
     Variant 8 – Hex grid
  ========================= */
  if (variant === 8) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Base />
        <div
          className="absolute inset-y-0 left-0 w-[72%] opacity-[0.08] md:opacity-[0.24]"
          style={{
            backgroundImage:
              "linear-gradient(30deg, rgba(255,255,255,.35) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.35) 87.5%, rgba(255,255,255,.35)), linear-gradient(150deg, rgba(255,255,255,.35) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.35) 87.5%, rgba(255,255,255,.35)), linear-gradient(90deg, rgba(255,255,255,.20) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.20) 87.5%, rgba(255,255,255,.20))",
            backgroundSize: "48px 84px",
            backgroundPosition: "0 0, 0 0, 0 0",
            maskImage:
              "radial-gradient(700px 560px at 20% 50%, black 0%, black 52%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(700px 560px at 20% 50%, black 0%, black 52%, transparent 80%)",
          }}
        />
        <Hairlines opacity="opacity-[0.08] md:opacity-[0.26]" />
        <Sparkles opacity="opacity-[0.50] md:opacity-[0.82]" />
      </div>
    );
  }

  /* =========================
     Variant 9 – Diagonal stripes
  ========================= */
  if (variant === 9) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Base />
        <div
          className="absolute inset-y-0 left-0 w-[72%] opacity-[0.08] md:opacity-[0.22]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,.55) 0 1px, transparent 1px 14px)",
            maskImage:
              "radial-gradient(720px 560px at 22% 50%, black 0%, black 52%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(720px 560px at 22% 50%, black 0%, black 52%, transparent 80%)",
          }}
        />
        <div className="absolute -left-[18%] top-[18%] h-[560px] w-[560px] rounded-full border border-white/14 opacity-[0.10] md:opacity-[0.26]" />
        <Hairlines opacity="opacity-[0.10] md:opacity-[0.30]" />
        <Sparkles opacity="opacity-[0.48] md:opacity-[0.80]" />
      </div>
    );
  }

  /* =========================
     Variant 4 – Wave lines
  ========================= */
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Base />

      {/* Wave pattern */}
      <div
        className="absolute inset-y-0 left-0 w-[68%] opacity-[0.09] md:opacity-[0.30]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 30, 50 50 T 100 50' stroke='rgba(255,255,255,0.6)' fill='none' stroke-width='1'/%3E%3Cpath d='M0 70 Q 25 50, 50 70 T 100 70' stroke='rgba(255,255,255,0.4)' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(700px 550px at 22% 48%, black 0%, black 52%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(700px 550px at 22% 48%, black 0%, black 52%, transparent 80%)",
        }}
      />

      {/* Curved arcs */}
      <div className="absolute -left-[18%] top-[20%] h-[480px] w-[480px] rounded-full border border-white/16 opacity-[0.10] md:opacity-[0.32]" />
      <div className="absolute left-[2%] top-[38%] h-[380px] w-[380px] rounded-full border border-white/12 opacity-[0.08] md:opacity-[0.24]" />

      <Hairlines opacity="opacity-[0.09] md:opacity-[0.30]" />
      <Sparkles opacity="opacity-[0.50] md:opacity-[0.78]" />
    </div>
  );
}

export default function HeroSlide({ slides }: { slides: Slide[] }) {
  const lang = useI18nStore((s) => s.lang);
  const L = safeLang(lang);

  const [index, setIndex] = useState(0);

  // ✅ Dùng thẳng slides từ DB, không nhân bản
  const slideList = slides && slides.length > 0 ? slides : [];

  const total = slideList.length;

  // ✅ Nếu không có slides nào, không render gì
  if (total === 0) {
    return null;
  }

  const slide = slideList[index];
  const VARIANT_COUNT = 10;
  const variant = (index % VARIANT_COUNT) as
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9;
  const currentColor = SLIDE_COLORS[index % SLIDE_COLORS.length];

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  // ✅ Lấy text từ DB theo ngôn ngữ
  const title =
    i18nText(slide.title, L) || (L === "vi" ? "Chưa có tiêu đề" : "No title");
  const desc =
    i18nText(slide.content, L) ||
    (L === "vi" ? "Chưa có nội dung" : "No content");
  const author = i18nText(slide.author, L) || "";

  return (
    <section
      className="relative w-full overflow-hidden text-white transition-colors duration-700"
      style={{ backgroundColor: currentColor }}
    >
      <div className="relative mx-auto flex min-h-[520px] max-w-screen-xl 2xl:max-w-screen-2xl items-center px-4 md:min-h-[600px] md:px-6 overflow-hidden">
        <div className="grid w-full items-center gap-4 md:grid-cols-[0.95fr_1.05fr] md:gap-6">
          {/* LEFT: Pattern */}
          <div className="relative hidden h-[420px] w-full md:block overflow-hidden">
            <LeftPattern variant={variant} />
          </div>

          {/* RIGHT: Content */}
          <div className="relative z-10 max-w-xl md:justify-self-start">
            <div className="pointer-events-none absolute -inset-6 -z-10 md:hidden overflow-hidden">
              <LeftPattern variant={variant} />
            </div>

            <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
              {title}
            </h2>

            <div className="my-4 h-[2px] w-20 bg-white" />

            <p className="whitespace-pre-line text-lg leading-relaxed opacity-90 text-justify">
              {desc}
            </p>

            {author && (
              <div className="mt-4 text-sm font-semibold opacity-90">
                {author}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute z-[2000] flex items-center justify-center rounded-full border border-white/50 p-2 transition hover:bg-white/15 left-2 md:left-4 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 pointer-events-auto"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={next}
        className="absolute z-[2000] flex items-center justify-center rounded-full border border-white/50 p-2 transition hover:bg-white/15 right-2 md:right-4 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 pointer-events-auto"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 right-4 md:right-8 z-[999] flex gap-2 pointer-events-auto">
        {slideList.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
