"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Calendar,
  Check,
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
  copied: { vi: "Đã sao chép liên kết!", en: "Link copied!" },
  copyFailed: { vi: "Không thể sao chép liên kết.", en: "Could not copy link." },
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
  const [pageUrl, setPageUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, [article.slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl || window.location.href);
      setCopied(true);
      toast.success(T.copied[lang]);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(T.copyFailed[lang]);
    }
  };

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

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
                         radial-gradient(ellipse 60% 70% at 75% 30%, ${article.accent}20, transparent 70%)`,
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
            <span style={{ color: article.accent }}>{article.category[lang]}</span>
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
          <article
            className="max-w-2xl text-[16px] leading-[1.85] [&_h2]:mb-4 [&_h2]:mt-9 first:[&_h2]:mt-0 [&_h2]:border-l-[3px] [&_h2]:border-[var(--accent)] [&_h2]:pl-3 [&_h2]:text-xl [&_h2]:font-black [&_h2]:tracking-[-0.01em] [&_h2]:text-white [&_h2]:md:text-2xl [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-black [&_h3]:text-white [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-bold [&_strong]:text-white [&_em]:italic [&_a]:underline [&_img]:my-4 [&_img]:w-full [&_img]:max-w-2xl"
            style={{ color: "rgba(255,255,255,0.75)", ["--accent" as string]: article.accent } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: article.content[lang] }}
          />

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
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
                style={{ border: `1px solid ${C.border}` }}
              >
                <Facebook size={16} />
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label={T.copyLink[lang]}
                className="flex h-10 w-10 items-center justify-center transition-colors"
                style={{
                  border: `1px solid ${copied ? C.accent : C.border}`,
                  color: copied ? C.accent : "rgba(255,255,255,0.7)",
                }}
              >
                {copied ? <Check size={16} /> : <LinkIcon size={16} />}
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
                </div>
                <div
                  className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: a.accent }}
                />
                <div
                  className="flex-1 p-5"
                  style={{ backgroundColor: C.bg3 }}
                >
                  <p
                    className="mb-2 text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: a.accent }}
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
