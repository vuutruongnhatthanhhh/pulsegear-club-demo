"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";
import { getAllCategories, type Category } from "@/lib/categories";
import { CategoryTile } from "@/components/home/CategoryTile";

const C = {
  bg: "#0A0A0A",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

const T = {
  breadcrumbHome: { vi: "Trang chủ", en: "Home" },
  breadcrumbCategories: { vi: "Danh Mục", en: "Categories" },
  eyebrow: { vi: "TẤT CẢ DANH MỤC", en: "ALL CATEGORIES" },
  title1: { vi: "MUA THEO", en: "SHOP BY" },
  title2: { vi: "DANH MỤC", en: "CATEGORY" },
  sub: {
    vi: "Từ trang phục tập luyện đến phụ kiện hằng ngày — tìm đúng danh mục dành cho bạn.",
    en: "From training gear to everyday accessories — find the category that's right for you.",
  },
  count: { vi: "danh mục", en: "categories" },
};

export default function DanhMucPageClient() {
  const lang = useI18nStore((s) => s.lang);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: "#fff" }}>
      {/* ════════ HEADER ════════ */}
      <section className="w-full" style={{ backgroundColor: C.bg }}>
        <div className="mx-auto max-w-screen-2xl px-8 pb-10 pt-32 md:px-16 lg:px-24 lg:pt-40">
          <div
            className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Link href="/" className="transition-colors hover:text-white">
              {T.breadcrumbHome[lang]}
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: C.accent }}>
              {T.breadcrumbCategories[lang]}
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
            className="mt-4 max-w-lg text-[17px] leading-relaxed"
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
            {categories.length} {T.count[lang]}
          </p>
        </div>
      </section>

      {/* ════════ GRID ════════ */}
      <section className="w-full" style={{ backgroundColor: C.bg }}>
        <div className="mx-auto max-w-screen-2xl px-8 py-14 md:px-16 lg:px-24">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => (
              <CategoryTile
                key={cat.id}
                cat={cat}
                lang={lang}
                isWide={i === 0 || i === 1}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
