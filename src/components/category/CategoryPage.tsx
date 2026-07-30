"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronRight, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";
import { useCartStore } from "@/lib/cart/store";
import { flyToCart } from "@/lib/cart/flyStore";

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
  filter: { vi: "Bộ lọc", en: "Filter" },
  addToCart: { vi: "Thêm vào giỏ", en: "Add to cart" },
};

export type Product = {
  id: number;
  name: { vi: string; en: string };
  price: number;
  oldPrice?: number;
  img: string;
  tag?: { vi: string; en: string } | null;
  rating?: number;
};

const formatPrice = (n: number) =>
  n.toLocaleString("vi-VN") + "₫";

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
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, p: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      key: `${slug}-${p.id}`,
      category: slug,
      id: p.id,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice,
      img: p.img,
    });
    const imgEl = e.currentTarget.parentElement?.querySelector("img");
    if (imgEl) flyToCart(p.img, imgEl);
    toast.success(
      lang === "vi"
        ? `Đã thêm "${p.name.vi}" vào giỏ hàng`
        : `Added "${p.name.en}" to cart`
    );
  };

  return (
    <div style={{ backgroundColor: C.bg, color: "#fff" }}>
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
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white"
              style={{ border: `1px solid ${C.border}` }}
            >
              <SlidersHorizontal size={13} />
              {T.filter[lang]}
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white"
              style={{ border: `1px solid ${C.border}` }}
            >
              {T.sortBy[lang]}
              <ChevronRight size={13} className="rotate-90" />
            </button>
          </div>
        </div>
      </section>

      {/* ════════ PRODUCT GRID ════════ */}
      <section className="w-full" style={{ backgroundColor: C.bg }}>
        <div className="mx-auto max-w-screen-2xl px-8 py-14 md:px-16 lg:px-24">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/san-pham/${slug}/${p.id}`}
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
                  <button
                    onClick={(e) => handleAddToCart(e, p)}
                    className="absolute inset-x-2.5 bottom-2.5 flex translate-y-2 items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ backgroundColor: accent }}
                  >
                    <ShoppingBag size={12} />
                    {T.addToCart[lang]}
                  </button>
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
          <div className="mt-14 flex items-center justify-center gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className="flex h-10 w-10 items-center justify-center text-[12px] font-bold transition-colors"
                style={
                  n === 1
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
              className="flex h-10 w-10 items-center justify-center text-white/60 transition-colors hover:text-white"
              style={{ border: `1px solid ${C.border}` }}
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
