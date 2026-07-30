"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Facebook,
  Link as LinkIcon,
} from "lucide-react";
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
  share: { vi: "CHIA SẺ", en: "SHARE" },
  copyLink: { vi: "Sao chép liên kết", en: "Copy link" },
  related: { vi: "BÀI VIẾT LIÊN QUAN", en: "RELATED ARTICLES" },
  readMore: { vi: "Đọc thêm", en: "Read more" },
  backToNews: { vi: "Xem tất cả tin tức", en: "View all news" },
};

export default function ArticleDetail({
  article,
  related,
}: {
  article: Article;
  related: Article[];
}) {
  const lang = useI18nStore((s) => s.lang);

  return (
    <div style={{ backgroundColor: C.bg, color: "#fff" }}>
      {/* ════════ HERO ════════ */}
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${article.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,.55) 0%, rgba(0,0,0,.92) 85%, ${C.bg} 100%),
                         radial-gradient(ellipse 60% 70% at 75% 30%, ${article.glow}20, transparent 70%)`,
          }}
        />
        <Noise op={0.04} />

        <div className="relative mx-auto flex min-h-[60svh] max-w-screen-xl flex-col justify-end px-8 pb-14 pt-32 md:px-16 lg:px-24">
          <div
            className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <Link href="/" className="transition-colors hover:text-white">
              {T.breadcrumbHome[lang]}
            </Link>
            <ChevronRight size={12} />
            <Link
              href="/tin-tuc"
              className="transition-colors hover:text-white"
            >
              {T.breadcrumbNews[lang]}
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: article.glow }}>{article.category[lang]}</span>
          </div>

          <h1 className="max-w-3xl text-[clamp(1.8rem,4.5vw,3rem)] font-black leading-[1.1] tracking-[-0.02em] text-white">
            {article.title[lang]}
          </h1>

          <div
            className="mt-6 flex flex-wrap items-center gap-5 text-[13px]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <span className="font-bold text-white">{article.author}</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {article.date}
            </span>
          </div>
        </div>
      </section>

      {/* ════════ BODY ════════ */}
      <section className="w-full" style={{ backgroundColor: C.bg }}>
        <div className="mx-auto grid max-w-screen-xl gap-12 px-8 py-14 md:px-16 lg:grid-cols-[1fr_180px] lg:px-24">
          <article className="max-w-2xl">
            {article.sections.map((s, i) => (
              <div key={i} className="mb-8">
                <h2 className="mb-4 flex items-center gap-3 text-xl font-black tracking-[-0.01em] text-white md:text-2xl">
                  <span
                    className="h-5 w-[3px] shrink-0"
                    style={{ backgroundColor: article.glow }}
                  />
                  {s.heading[lang]}
                </h2>
                {s.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className="mb-4 text-[16px] leading-[1.85]"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    {p[lang]}
                  </p>
                ))}
              </div>
            ))}
          </article>

          {/* Share sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p
              className="mb-3 text-[11px] font-black tracking-[0.2em]"
              style={{ color: C.muted }}
            >
              {T.share[lang]}
            </p>
            <div className="flex gap-2 lg:flex-col">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
                style={{ border: `1px solid ${C.border}` }}
              >
                <Facebook size={16} />
              </a>
              <button
                aria-label={T.copyLink[lang]}
                className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
                style={{ border: `1px solid ${C.border}` }}
              >
                <LinkIcon size={16} />
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* ════════ RELATED ════════ */}
      <section
        className="w-full border-t"
        style={{ backgroundColor: C.bg2, borderColor: C.border }}
      >
        <div className="mx-auto max-w-screen-2xl px-8 py-14 md:px-16 lg:px-24">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-[-0.01em] text-white">
              {T.related[lang]}
            </h2>
            <Link
              href="/tin-tuc"
              className="hidden items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white md:flex"
            >
              {T.backToNews[lang]} <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.id}
                href={`/tin-tuc/${a.id}`}
                className="group relative flex h-full flex-col overflow-hidden"
                style={{ border: `1px solid ${C.border}` }}
              >
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
                  <img
                    src={a.img}
                    alt={a.title[lang]}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                <div
                  className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: a.glow }}
                />
                <div
                  className="flex-1 p-5"
                  style={{ backgroundColor: C.bg3 }}
                >
                  <p
                    className="mb-2 text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: a.glow }}
                  >
                    {a.category[lang]}
                  </p>
                  <h3 className="text-[14px] font-black leading-snug text-white">
                    {a.title[lang]}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
