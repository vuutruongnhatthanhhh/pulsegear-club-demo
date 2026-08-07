"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";

const C = {
  bg: "#0A0A0A",
  bg2: "#111111",
  bg3: "#161616",
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
  results: { vi: "sản phẩm", en: "products" },
  sortBy: { vi: "Sắp xếp", en: "Sort by" },
  sortDefault: { vi: "Mặc định", en: "Default" },
  sortPriceAsc: { vi: "Giá: Thấp đến cao", en: "Price: Low to High" },
  sortPriceDesc: { vi: "Giá: Cao đến thấp", en: "Price: High to Low" },
};

type SortOption = "default" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: { vi: string; en: string } }[] = [
  { value: "default", label: T.sortDefault },
  { value: "price-asc", label: T.sortPriceAsc },
  { value: "price-desc", label: T.sortPriceDesc },
];

export type Product = {
  id: number;
  slug: string;
  name: { vi: string; en: string };
  price: number;
  oldPrice?: number;
  img: string;
  tag?: { vi: string; en: string } | null;
  rating?: number;
  // Set when this grid mixes products from several real categories (e.g. the
  // "Giảm giá" page) — overrides the page's `slug` prop for this product's
  // link/cart entry so it still points at its real category instead of
  // whatever virtual listing it's being shown on.
  categorySlug?: string;
};

const formatPrice = (n: number) =>
  n.toLocaleString("vi-VN") + "₫";

const PAGE_SIZE = 9;

export default function CategoryPage({
  slug,
  title,
  sub,
  accent,
  heroImage,
  products,
}: {
  slug: string;
  title: { vi: string; en: string };
  sub: { vi: string; en: string };
  accent: string;
  heroImage: string;
  products: Product[];
}) {
  const lang = useI18nStore((s) => s.lang);
  const gridRef = useRef<HTMLDivElement>(null);

  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [sortOpen, setSortOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(e.target as Node) &&
        !sortBtnRef.current?.contains(e.target as Node)
      ) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const sortedProducts =
    sortBy === "price-asc"
      ? [...products].sort((a, b) => a.price - b.price)
      : sortBy === "price-desc"
        ? [...products].sort((a, b) => b.price - a.price)
        : products;

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [products, sortBy]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedProducts = sortedProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const goToPage = (n: number) => {
    if (n < 1 || n > totalPages || n === page) return;
    setPage(n);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: "#fff" }}>
      {/* ════════ HERO ════════ */}
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,.7) 0%, rgba(0,0,0,.88) 75%, ${C.bg} 100%),
                         radial-gradient(ellipse 60% 70% at 75% 30%, ${accent}20, transparent 70%)`,
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
            <span style={{ color: accent }}>{title[lang]}</span>
          </div>

          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-[-0.02em] text-white">
            {title[lang]}
          </h1>
          <p
            className="mt-4 max-w-lg text-[15px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {sub[lang]}
          </p>
        </div>
      </section>

      {/* ════════ TOOLBAR ════════ */}
      <section
        className="w-full border-b"
        style={{ backgroundColor: C.bg, borderColor: C.border }}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-4 px-8 py-5 md:px-16 lg:px-24">
          <p
            className="text-[13px] font-semibold"
            style={{ color: C.muted }}
          >
            {products.length} {T.results[lang]}
          </p>
          <div className="relative">
            <button
              ref={sortBtnRef}
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white"
              style={{ border: `1px solid ${C.border}` }}
            >
              {T.sortBy[lang]}
              <ChevronRight size={13} className="rotate-90" />
            </button>

            {sortOpen && (
              <div
                ref={sortMenuRef}
                className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden py-1 shadow-2xl"
                style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setSortOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[12px] font-semibold transition-colors hover:text-white"
                    style={{ color: sortBy === opt.value ? accent : "rgba(255,255,255,0.7)" }}
                  >
                    {opt.label[lang]}
                    {sortBy === opt.value && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════ PRODUCT GRID ════════ */}
      <section className="w-full" style={{ backgroundColor: C.bg }}>
        <div
          ref={gridRef}
          className="mx-auto max-w-screen-2xl px-8 py-14 md:px-16 lg:px-24"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {paginatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/san-pham/${p.categorySlug ?? slug}/${p.slug}`}
                className="group relative block"
              >
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden"
                  style={{ backgroundColor: C.bg3 }}
                >
                  <img
                    src={p.img}
                    alt={p.name[lang]}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: "rgba(0,0,0,0.25)" }}
                  />
                  {p.tag && (
                    <div
                      className="absolute left-2.5 top-2.5 px-2 py-1 text-[9px] font-black tracking-[0.2em] uppercase"
                      style={{ backgroundColor: accent, color: "#000" }}
                    >
                      {p.tag[lang]}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="text-[13px] font-bold leading-snug text-white">
                    {p.name[lang]}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="text-[14px] font-black"
                      style={{ color: p.oldPrice ? accent : "#fff" }}
                    >
                      {formatPrice(p.price)}
                    </span>
                    {p.oldPrice && (
                      <span
                        className="text-[12px] line-through"
                        style={{ color: C.muted }}
                      >
                        {formatPrice(p.oldPrice)}
                      </span>
                    )}
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
                      ? { backgroundColor: accent, color: "#000" }
                      : {
                          border: `1px solid ${C.border}`,
                          color: C.muted,
                        }
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
