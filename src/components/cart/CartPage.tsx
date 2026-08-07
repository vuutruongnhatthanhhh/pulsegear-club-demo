"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";
import { useCartStore, cartSubtotal } from "@/lib/cart/store";
import { getShippingFee, FALLBACK_SHIPPING_FEE } from "@/lib/shippingConfig";
import { useAuthStore } from "@/lib/auth/store";

const C = {
  bg: "#0A0A0A",
  bg2: "#111111",
  bg3: "#161616",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

const T = {
  breadcrumbHome: { vi: "Trang chủ", en: "Home" },
  breadcrumbCart: { vi: "Giỏ hàng", en: "Cart" },
  title: { vi: "GIỎ HÀNG CỦA BẠN", en: "YOUR CART" },
  itemCount: { vi: "sản phẩm", en: "items" },
  size: { vi: "Size", en: "Size" },
  color: { vi: "Màu", en: "Color" },
  remove: { vi: "Xóa", en: "Remove" },
  clearCart: { vi: "Xóa toàn bộ giỏ hàng", en: "Clear cart" },
  confirmClearTitle: { vi: "Xóa toàn bộ giỏ hàng?", en: "Clear entire cart?" },
  confirmClearSub: {
    vi: "Tất cả sản phẩm trong giỏ hàng sẽ bị xóa. Hành động này không thể hoàn tác.",
    en: "All items in your cart will be removed. This action cannot be undone.",
  },
  cancel: { vi: "HỦY", en: "CANCEL" },
  confirmClear: { vi: "XÓA GIỎ HÀNG", en: "CLEAR CART" },
  orderSummary: { vi: "TÓM TẮT ĐƠN HÀNG", en: "ORDER SUMMARY" },
  subtotal: { vi: "Tạm tính", en: "Subtotal" },
  shipping: { vi: "Phí vận chuyển", en: "Shipping" },
  free: { vi: "Miễn phí", en: "Free" },
  total: { vi: "Tổng cộng", en: "Total" },
  checkout: { vi: "TIẾN HÀNH THANH TOÁN", en: "PROCEED TO CHECKOUT" },
  loginRequired: {
    vi: "Vui lòng đăng nhập để tiến hành đặt hàng",
    en: "Please sign in to place your order",
  },
  continueShopping: { vi: "Tiếp tục mua sắm", en: "Continue shopping" },
  emptyTitle: { vi: "Giỏ hàng của bạn đang trống", en: "Your cart is empty" },
  emptySub: {
    vi: "Khám phá các bộ sưu tập của chúng tôi và tìm món đồ tập luyện phù hợp với bạn.",
    en: "Explore our collections and find the training gear that fits you.",
  },
  shopNow: { vi: "MUA SẮM NGAY", en: "SHOP NOW" },
};

const formatPrice = (n: number) => n.toLocaleString("vi-VN") + "₫";

export default function CartPage() {
  const lang = useI18nStore((s) => s.lang);
  const { user } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [shippingFee, setShippingFee] = useState(FALLBACK_SHIPPING_FEE);

  useEffect(() => {
    document.body.style.overflow = confirmOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [confirmOpen]);

  useEffect(() => {
    getShippingFee().then((fee) => {
      if (fee !== null) setShippingFee(fee);
    });
  }, []);

  const handleConfirmClear = () => {
    clear();
    setConfirmOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const subtotal = cartSubtotal(items);

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: "#fff" }}>
      {/* ════════ HEADER ════════ */}
      <div
        className="w-full border-b"
        style={{ borderColor: C.border, backgroundColor: C.bg }}
      >
        <div className="mx-auto max-w-screen-xl px-8 pb-10 pt-32 md:px-16 lg:px-24">
          <div
            className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Link href="/" className="transition-colors hover:text-white">
              {T.breadcrumbHome[lang]}
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: C.accent }}>{T.breadcrumbCart[lang]}</span>
          </div>
          <h1 className="text-[clamp(1.6rem,4vw,2.5rem)] font-black leading-[1.1] tracking-[-0.02em] text-white">
            {T.title[lang]}
          </h1>
          {items.length > 0 && (
            <p className="mt-3 text-[13px] font-semibold" style={{ color: C.muted }}>
              {items.reduce((s, i) => s + i.qty, 0)} {T.itemCount[lang]}
            </p>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <section className="w-full" style={{ backgroundColor: C.bg }}>
          <div className="mx-auto flex max-w-screen-xl flex-col items-center px-8 py-24 text-center md:px-16 lg:px-24">
            <div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}
            >
              <ShoppingBag size={26} style={{ color: C.muted }} />
            </div>
            <h2 className="text-xl font-black tracking-[-0.01em] text-white">
              {T.emptyTitle[lang]}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: C.muted }}>
              {T.emptySub[lang]}
            </p>
            <Link
              href="/bo-suu-tap"
              className="mt-8 flex items-center gap-2 px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-90"
              style={{ backgroundColor: C.accent }}
            >
              {T.shopNow[lang]} <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      ) : (
        <section className="w-full" style={{ backgroundColor: C.bg }}>
          <div className="mx-auto grid max-w-screen-xl gap-10 px-8 py-12 md:px-16 lg:grid-cols-[1fr_340px] lg:px-24 lg:py-16">
            {/* Items */}
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-4 p-4"
                  style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}
                >
                  <Link
                    href={`/san-pham/${item.category}/${item.slug}`}
                    className="relative h-24 w-20 shrink-0 overflow-hidden sm:h-28 sm:w-24"
                    style={{ backgroundColor: C.bg3 }}
                  >
                    <img
                      src={item.img}
                      alt={item.name[lang]}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/san-pham/${item.category}/${item.slug}`}
                          className="text-[14px] font-bold leading-snug text-white transition-colors hover:text-white/80"
                        >
                          {item.name[lang]}
                        </Link>
                        {(item.size || item.color) && (
                          <p
                            className="mt-1 flex items-center gap-3 text-[11px]"
                            style={{ color: C.muted }}
                          >
                            {item.size && (
                              <span>
                                {T.size[lang]}: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="flex items-center gap-1">
                                {T.color[lang]}:
                                <span
                                  className="h-3 w-3 rounded-full"
                                  style={{
                                    backgroundColor: item.color,
                                    border: "1px solid rgba(255,255,255,0.3)",
                                  }}
                                />
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.key)}
                        aria-label={T.remove[lang]}
                        className="shrink-0 text-white/40 transition-colors hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div
                        className="flex h-9 items-center"
                        style={{ border: `1px solid ${C.border}` }}
                      >
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="flex h-9 w-9 items-center justify-center text-[13px] font-bold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[15px] font-black text-white">
                          {formatPrice(item.price * item.qty)}
                        </span>
                        {item.qty > 1 && (
                          <p className="text-[11px]" style={{ color: C.muted }}>
                            {formatPrice(item.price)} x {item.qty}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setConfirmOpen(true)}
                className="mt-2 self-start text-[11px] font-bold uppercase tracking-[0.15em] transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                {T.clearCart[lang]}
              </button>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div
                className="p-6"
                style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}
              >
                <p
                  className="mb-5 text-[11px] font-black tracking-[0.2em]"
                  style={{ color: C.muted }}
                >
                  {T.orderSummary[lang]}
                </p>

                <div className="flex items-center justify-between text-[13px]">
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>
                    {T.subtotal[lang]}
                  </span>
                  <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[13px]">
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>
                    {T.shipping[lang]}
                  </span>
                  <span className="font-bold" style={{ color: C.accent }}>
                    {shippingFee > 0 ? formatPrice(shippingFee) : T.free[lang]}
                  </span>
                </div>

                <div className="my-5 h-px w-full" style={{ backgroundColor: C.border }} />

                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-white">
                    {T.total[lang]}
                  </span>
                  <span className="text-xl font-black" style={{ color: C.accent }}>
                    {formatPrice(subtotal + shippingFee)}
                  </span>
                </div>

                <Link
                  href={user ? "/thanh-toan" : "/dang-nhap"}
                  className="mt-6 flex w-full items-center justify-center gap-2 py-4 text-center text-[12px] font-black tracking-[0.2em] uppercase text-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
                  style={{ backgroundColor: C.accent }}
                >
                  {user ? T.checkout[lang] : T.loginRequired[lang]}
                  {user && <ArrowRight size={14} />}
                </Link>

                <Link
                  href="/bo-suu-tap"
                  className="mt-4 block text-center text-[11px] font-bold uppercase tracking-[0.15em] transition-colors hover:text-white"
                  style={{ color: C.muted }}
                >
                  {T.continueShopping[lang]}
                </Link>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* ════════ CONFIRM CLEAR MODAL ════════ */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-[3000] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
              onClick={() => setConfirmOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-sm p-7"
              style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${C.accent}1A`, border: `1px solid ${C.accent}45` }}
              >
                <TriangleAlert size={20} style={{ color: C.accent }} />
              </div>
              <h3 className="text-lg font-black tracking-[-0.01em] text-white">
                {T.confirmClearTitle[lang]}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed" style={{ color: C.muted }}>
                {T.confirmClearSub[lang]}
              </p>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 py-3 text-[11px] font-black tracking-[0.15em] text-white/70 transition-colors hover:text-white"
                  style={{ border: `1px solid ${C.border}` }}
                >
                  {T.cancel[lang]}
                </button>
                <button
                  onClick={handleConfirmClear}
                  className="flex-1 py-3 text-[11px] font-black tracking-[0.15em] text-black transition-opacity hover:opacity-90"
                  style={{ backgroundColor: C.accent }}
                >
                  {T.confirmClear[lang]}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
