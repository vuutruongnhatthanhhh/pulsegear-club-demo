"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";
import type { CategoryMeta, Product } from "@/lib/products";
import { useCartStore } from "@/lib/cart/store";
import { flyToCart } from "@/lib/cart/flyStore";

const C = {
  bg: "#0A0A0A",
  bg2: "#111111",
  bg3: "#161616",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SWATCHES = ["#0A0A0A", "#FFFFFF", "#888888"];

const formatPrice = (n: number) => n.toLocaleString("vi-VN") + "₫";

const T = {
  breadcrumbHome: { vi: "Trang chủ", en: "Home" },
  size: { vi: "KÍCH CỠ", en: "SIZE" },
  color: { vi: "MÀU SẮC", en: "COLOR" },
  quantity: { vi: "SỐ LƯỢNG", en: "QUANTITY" },
  addToCart: { vi: "THÊM VÀO GIỎ", en: "ADD TO CART" },
  descTitle: { vi: "MÔ TẢ SẢN PHẨM", en: "PRODUCT DESCRIPTION" },
  careTitle: { vi: "CHẤT LIỆU & BẢO QUẢN", en: "MATERIAL & CARE" },
  shipping: { vi: "Miễn phí vận chuyển", en: "Free shipping" },
  shippingSub: {
    vi: "Đơn hàng trên 2.000.000₫",
    en: "On orders over 2,000,000₫",
  },
  returns: { vi: "Đổi trả 30 ngày", en: "30-day returns" },
  returnsSub: { vi: "Không cần lý do", en: "No questions asked" },
  guarantee: { vi: "Cam kết chất lượng", en: "Quality guarantee" },
  guaranteeSub: { vi: "Bền bỉ hoặc hoàn tiền", en: "Built to last" },
  related: { vi: "SẢN PHẨM LIÊN QUAN", en: "YOU MAY ALSO LIKE" },
  careItems: {
    vi: [
      "Giặt máy ở nhiệt độ thường, không dùng chất tẩy",
      "Không sấy ở nhiệt độ cao, phơi trong bóng râm",
      "Không ủi trực tiếp lên hình in hoặc logo",
      "Vải co giãn 4 chiều, thoáng khí và thấm hút mồ hôi",
    ],
    en: [
      "Machine wash cold, do not bleach",
      "Do not tumble dry high, dry in shade",
      "Do not iron directly on prints or logo",
      "4-way stretch fabric, breathable and moisture-wicking",
    ],
  },
};

export default function ProductDetail({
  product,
  category,
  related,
}: {
  product: Product;
  category: CategoryMeta;
  related: Product[];
}) {
  const lang = useI18nStore((s) => s.lang);
  const [size, setSize] = useState("M");
  const [color, setColor] = useState(0);
  const [qty, setQty] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(
      {
        key: `${category.slug}-${product.id}-${size}-${SWATCHES[color]}`,
        category: category.slug,
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        img: product.img,
        size,
        color: SWATCHES[color],
      },
      qty
    );
    if (imgRef.current) flyToCart(product.img, imgRef.current);
    toast.success(
      lang === "vi"
        ? `Đã thêm "${product.name.vi}" vào giỏ hàng`
        : `Added "${product.name.en}" to cart`
    );
  };

  const descText =
    lang === "vi"
      ? `${product.name.vi} được thiết kế cho những buổi tập cường độ cao — chất liệu co giãn 4 chiều, thoáng khí và giữ dáng bền bỉ qua hàng trăm lần giặt. Đường may gia cố ở các điểm chịu lực, form dáng ôm vừa phải giúp bạn tự do chuyển động mà không lo vướng víu.`
      : `${product.name.en} is built for high-intensity training — 4-way stretch fabric, breathable, and holds its shape through hundreds of washes. Reinforced stitching at stress points, with a fit that moves freely without ever getting in the way.`;

  return (
    <div style={{ backgroundColor: C.bg, color: "#fff" }}>
      {/* ════════ BREADCRUMB ════════ */}
      <div
        className="w-full border-b"
        style={{ borderColor: C.border, backgroundColor: C.bg }}
      >
        <div
          className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-2 px-8 py-6 text-[11px] font-bold uppercase tracking-[0.15em] md:px-16 lg:px-24"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <Link href="/" className="transition-colors hover:text-white">
            {T.breadcrumbHome[lang]}
          </Link>
          <ChevronRight size={12} />
          <Link
            href={`/${category.slug}`}
            className="transition-colors hover:text-white"
          >
            {category.title[lang]}
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: category.accent }}>{product.name[lang]}</span>
        </div>
      </div>

      {/* ════════ MAIN ════════ */}
      <section className="w-full" style={{ backgroundColor: C.bg }}>
        <div className="mx-auto grid max-w-screen-2xl gap-12 px-8 py-12 md:px-16 lg:grid-cols-2 lg:px-24 lg:py-16">
          {/* Image */}
          <div
            className="relative aspect-[3/4] w-full overflow-hidden"
            style={{ backgroundColor: C.bg3 }}
          >
            <img
              ref={imgRef}
              src={product.img}
              alt={product.name[lang]}
              className="h-full w-full object-cover"
            />
            {product.tag && (
              <div
                className="absolute left-4 top-4 px-3 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase"
                style={{ backgroundColor: category.accent, color: "#000" }}
              >
                {product.tag[lang]}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-black leading-tight tracking-[-0.02em] text-white md:text-3xl">
              {product.name[lang]}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span
                className="text-2xl font-black"
                style={{ color: product.oldPrice ? category.accent : "#fff" }}
              >
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span
                  className="text-base line-through"
                  style={{ color: C.muted }}
                >
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            <p
              className="mt-6 max-w-md text-[15px] leading-relaxed"
              style={{ color: C.muted }}
            >
              {descText}
            </p>

            <div
              className="my-8 h-px w-full"
              style={{ backgroundColor: C.border }}
            />

            {/* Color */}
            <div className="mb-6">
              <p
                className="mb-3 text-[11px] font-black tracking-[0.2em]"
                style={{ color: C.muted }}
              >
                {T.color[lang]}
              </p>
              <div className="flex items-center gap-2.5">
                {SWATCHES.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setColor(i)}
                    aria-label={`Color ${i + 1}`}
                    className="h-8 w-8 rounded-full transition-all"
                    style={{
                      backgroundColor: c,
                      border:
                        color === i
                          ? `2px solid ${category.accent}`
                          : `1px solid ${C.border}`,
                      outline: color === i ? `2px solid ${C.bg}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <p
                className="mb-3 text-[11px] font-black tracking-[0.2em]"
                style={{ color: C.muted }}
              >
                {T.size[lang]}
              </p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="flex h-11 min-w-11 items-center justify-center px-3 text-[12px] font-bold transition-all"
                    style={
                      size === s
                        ? { backgroundColor: category.accent, color: "#000" }
                        : {
                            border: `1px solid ${C.border}`,
                            color: "rgba(255,255,255,0.7)",
                          }
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p
                className="mb-3 text-[11px] font-black tracking-[0.2em]"
                style={{ color: C.muted }}
              >
                {T.quantity[lang]}
              </p>
              <div
                className="flex w-fit items-center"
                style={{ border: `1px solid ${C.border}` }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-white/70 transition-colors hover:text-white"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="flex h-11 w-12 items-center justify-center text-[14px] font-bold">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-white/70 transition-colors hover:text-white"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden py-4 text-[12px] font-black tracking-[0.2em] uppercase text-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
                style={{ backgroundColor: category.accent }}
              >
                <ShoppingBag size={15} className="relative z-10" />
                <span className="relative z-10">{T.addToCart[lang]}</span>
                <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            </div>

            {/* Perks */}
            <div
              className="mt-10 grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-3"
              style={{ borderColor: C.border }}
            >
              {[
                { Icon: Truck, title: T.shipping, sub: T.shippingSub },
                { Icon: RotateCcw, title: T.returns, sub: T.returnsSub },
                { Icon: Shield, title: T.guarantee, sub: T.guaranteeSub },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.Icon size={18} style={{ color: category.accent }} />
                  <div>
                    <p className="text-[13px] font-bold text-white">
                      {item.title[lang]}
                    </p>
                    <p className="text-[11px]" style={{ color: C.muted }}>
                      {item.sub[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ DESCRIPTION / CARE ════════ */}
      <section
        className="w-full border-t"
        style={{ backgroundColor: C.bg2, borderColor: C.border }}
      >
        <div className="mx-auto grid max-w-screen-2xl gap-10 px-8 py-14 md:px-16 lg:grid-cols-2 lg:px-24">
          <div>
            <h2 className="mb-4 text-sm font-black tracking-[0.2em] text-white">
              {T.descTitle[lang]}
            </h2>
            <p
              className="text-[15px] leading-relaxed"
              style={{ color: C.muted }}
            >
              {descText}
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-black tracking-[0.2em] text-white">
              {T.careTitle[lang]}
            </h2>
            <ul className="space-y-2.5">
              {T.careItems[lang].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[15px] leading-relaxed"
                  style={{ color: C.muted }}
                >
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: category.accent }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ════════ RELATED ════════ */}
      {related.length > 0 && (
        <section className="w-full" style={{ backgroundColor: C.bg }}>
          <div className="mx-auto max-w-screen-2xl px-8 py-14 md:px-16 lg:px-24">
            <h2 className="mb-8 text-xl font-black tracking-[-0.01em] text-white">
              {T.related[lang]}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/san-pham/${category.slug}/${p.id}`}
                  className="group block"
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
                  </div>
                  <div className="mt-3">
                    <h3 className="text-[13px] font-bold leading-snug text-white">
                      {p.name[lang]}
                    </h3>
                    <span className="mt-1 block text-[14px] font-black text-white">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
