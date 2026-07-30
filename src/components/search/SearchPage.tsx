"use client";

import { useMemo, type MouseEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, Search, SearchX, ShoppingBag } from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";
import { CATEGORY_META, PRODUCTS_BY_CATEGORY } from "@/lib/products";
import { useCartStore } from "@/lib/cart/store";
import { flyToCart } from "@/lib/cart/flyStore";

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
  breadcrumbSearch: { vi: "Tìm kiếm", en: "Search" },
  eyebrow: { vi: "TÌM KIẾM", en: "SEARCH" },
  resultsFor: { vi: "Kết quả tìm kiếm cho", en: "Search results for" },
  searchAnything: { vi: "Tìm sản phẩm...", en: "Search products..." },
  placeholder: { vi: "Nhập tên sản phẩm...", en: "Type a product name..." },
  results: { vi: "kết quả", en: "results" },
  addToCart: { vi: "Thêm vào giỏ", en: "Add to cart" },
  emptyTitle: {
    vi: "Không tìm thấy sản phẩm nào",
    en: "No products found",
  },
  emptySub: {
    vi: "Thử tìm với từ khóa khác hoặc khám phá các bộ sưu tập của chúng tôi.",
    en: "Try a different keyword or explore our collections instead.",
  },
  browseCollections: { vi: "XEM BỘ SƯU TẬP", en: "BROWSE COLLECTIONS" },
  emptyPromptTitle: {
    vi: "Bạn đang tìm gì?",
    en: "What are you looking for?",
  },
  emptyPromptSub: {
    vi: "Nhập từ khóa vào ô tìm kiếm phía trên để bắt đầu.",
    en: "Type a keyword in the search box above to get started.",
  },
};

const formatPrice = (n: number) => n.toLocaleString("vi-VN") + "₫";

type SearchResult = {
  id: number;
  slug: string;
  accent: string;
  name: { vi: string; en: string };
  price: number;
  oldPrice?: number;
  img: string;
  tag?: { vi: string; en: string } | null;
  rating?: number;
};

export default function SearchPage() {
  const lang = useI18nStore((s) => s.lang);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const addItem = useCartStore((s) => s.addItem);

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const all: SearchResult[] = [];
    for (const slug of Object.keys(PRODUCTS_BY_CATEGORY)) {
      const meta = CATEGORY_META[slug];
      for (const p of PRODUCTS_BY_CATEGORY[slug]) {
        const haystack = `${p.name.vi} ${p.name.en}`.toLowerCase();
        if (haystack.includes(q)) {
          all.push({ ...p, slug, accent: meta?.accent || C.accent });
        }
      }
    }
    return all;
  }, [query]);

  const handleAddToCart = (
    e: MouseEvent<HTMLButtonElement>,
    p: SearchResult
  ) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      key: `${p.slug}-${p.id}`,
      category: p.slug,
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
    <div
      className="min-h-screen"
      style={{ backgroundColor: C.bg, color: "#fff" }}
    >
      {/* ════════ HERO ════════ */}
      <section
        className="relative w-full overflow-hidden border-b"
        style={{ borderColor: C.border }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 70% at 75% 30%, ${C.accent}14, transparent 70%)`,
          }}
        />
        <Noise op={0.03} />

        <div className="relative mx-auto max-w-screen-2xl px-8 pb-14 pt-32 md:px-16 lg:px-24 lg:pt-40">
          <div
            className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Link href="/" className="transition-colors hover:text-white">
              {T.breadcrumbHome[lang]}
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: C.accent }}>{T.breadcrumbSearch[lang]}</span>
          </div>

          <p
            className="mb-4 text-[11px] font-black tracking-[0.4em] uppercase"
            style={{ color: C.accent }}
          >
            {T.eyebrow[lang]}
          </p>

          {query ? (
            <h1 className="text-[clamp(1.6rem,4vw,2.75rem)] font-black leading-[1.1] tracking-[-0.02em] text-white">
              {T.resultsFor[lang]} &ldquo;
              <span style={{ color: C.accent }}>{query}</span>&rdquo;
            </h1>
          ) : (
            <h1 className="text-[clamp(1.6rem,4vw,2.75rem)] font-black leading-[1.1] tracking-[-0.02em] text-white">
              {T.searchAnything[lang]}
            </h1>
          )}

          <form
            action="/search"
            method="get"
            className="mt-8 flex h-12 w-full max-w-xl items-stretch overflow-hidden"
            style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
          >
            <input
              name="q"
              defaultValue={query}
              placeholder={T.placeholder[lang]}
              className="w-full bg-transparent px-4 text-sm text-white placeholder-white/25 outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="flex w-12 shrink-0 items-center justify-center transition-opacity hover:opacity-80"
              style={{ backgroundColor: C.accent }}
              aria-label="Search"
            >
              <Search size={16} className="text-black" />
            </button>
          </form>
        </div>
      </section>

      {/* ════════ RESULTS ════════ */}
      {query ? (
        results.length > 0 ? (
          <>
            <section
              className="w-full border-b"
              style={{ backgroundColor: C.bg, borderColor: C.border }}
            >
              <div className="mx-auto max-w-screen-2xl px-8 py-5 md:px-16 lg:px-24">
                <p className="text-[13px] font-semibold" style={{ color: C.muted }}>
                  {results.length} {T.results[lang]}
                </p>
              </div>
            </section>

            <section className="w-full" style={{ backgroundColor: C.bg }}>
              <div className="mx-auto max-w-screen-2xl px-8 py-14 md:px-16 lg:px-24">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {results.map((p) => (
                    <Link
                      key={`${p.slug}-${p.id}`}
                      href={`/san-pham/${p.slug}/${p.id}`}
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
                            style={{ backgroundColor: p.accent, color: "#000" }}
                          >
                            {p.tag[lang]}
                          </div>
                        )}
                        <button
                          onClick={(e) => handleAddToCart(e, p)}
                          className="absolute inset-x-2.5 bottom-2.5 flex translate-y-2 items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                          style={{ backgroundColor: p.accent }}
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
                            style={{ color: p.oldPrice ? p.accent : "#fff" }}
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
              </div>
            </section>
          </>
        ) : (
          <section className="w-full" style={{ backgroundColor: C.bg }}>
            <div className="mx-auto flex max-w-screen-2xl flex-col items-center px-8 py-24 text-center md:px-16 lg:px-24">
              <div
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}
              >
                <SearchX size={26} style={{ color: C.muted }} />
              </div>
              <h2 className="text-xl font-black tracking-[-0.01em] text-white">
                {T.emptyTitle[lang]}
              </h2>
              <p
                className="mt-2 max-w-sm text-sm leading-relaxed"
                style={{ color: C.muted }}
              >
                {T.emptySub[lang]}
              </p>
              <Link
                href="/bo-suu-tap"
                className="mt-8 flex items-center gap-2 px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-90"
                style={{ backgroundColor: C.accent }}
              >
                {T.browseCollections[lang]}
              </Link>
            </div>
          </section>
        )
      ) : (
        <section className="w-full" style={{ backgroundColor: C.bg }}>
          <div className="mx-auto flex max-w-screen-2xl flex-col items-center px-8 py-24 text-center md:px-16 lg:px-24">
            <div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}
            >
              <Search size={26} style={{ color: C.muted }} />
            </div>
            <h2 className="text-xl font-black tracking-[-0.01em] text-white">
              {T.emptyPromptTitle[lang]}
            </h2>
            <p
              className="mt-2 max-w-sm text-sm leading-relaxed"
              style={{ color: C.muted }}
            >
              {T.emptyPromptSub[lang]}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
