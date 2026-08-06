"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Landmark,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";
import { useCartStore, cartSubtotal } from "@/lib/cart/store";
import { getShippingFee, FALLBACK_SHIPPING_FEE } from "@/lib/shippingConfig";
import { useAuthStore } from "@/lib/auth/store";
import { getProfile } from "@/lib/profile";
import { createOrder } from "@/lib/orders";

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
  breadcrumbCheckout: { vi: "Thanh toán", en: "Checkout" },
  title: { vi: "THANH TOÁN", en: "CHECKOUT" },
  shippingInfo: { vi: "THÔNG TIN GIAO HÀNG", en: "SHIPPING INFORMATION" },
  fullName: { vi: "Họ và tên", en: "Full name" },
  phone: { vi: "Số điện thoại", en: "Phone number" },
  address: { vi: "Địa chỉ giao hàng", en: "Shipping address" },
  note: { vi: "Ghi chú (không bắt buộc)", en: "Note (optional)" },
  noteHint: {
    vi: "Ví dụ: giao giờ hành chính, gọi trước khi giao...",
    en: "e.g. deliver during business hours, call before arrival...",
  },
  paymentMethod: { vi: "PHƯƠNG THỨC THANH TOÁN", en: "PAYMENT METHOD" },
  cod: { vi: "Thanh toán khi nhận hàng (COD)", en: "Cash on delivery (COD)" },
  bank: { vi: "Chuyển khoản ngân hàng", en: "Bank transfer" },
  orderSummary: { vi: "ĐƠN HÀNG CỦA BẠN", en: "YOUR ORDER" },
  subtotal: { vi: "Tạm tính", en: "Subtotal" },
  shipping: { vi: "Phí vận chuyển", en: "Shipping" },
  free: { vi: "Miễn phí", en: "Free" },
  total: { vi: "Tổng cộng", en: "Total" },
  placeOrder: { vi: "ĐẶT HÀNG", en: "PLACE ORDER" },
  emptyTitle: { vi: "Giỏ hàng của bạn đang trống", en: "Your cart is empty" },
  emptySub: {
    vi: "Thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.",
    en: "Add products to your cart before checking out.",
  },
  shopNow: { vi: "MUA SẮM NGAY", en: "SHOP NOW" },
  orderSuccess: {
    vi: "Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại PULSEGEAR.CLUB",
    en: "Order placed successfully! Thanks for shopping with PULSEGEAR.CLUB",
  },
  orderSuccessSub: {
    vi: "Đang chuyển về trang chủ...",
    en: "Redirecting you to the homepage...",
  },
  loading: { vi: "Đang tải...", en: "Loading..." },
  submitting: { vi: "ĐANG ĐẶT HÀNG...", en: "PLACING ORDER..." },
  loginRequired: {
    vi: "Vui lòng đăng nhập để tiến hành đặt hàng",
    en: "Please sign in to place your order",
  },
};

const formatPrice = (n: number) => n.toLocaleString("vi-VN") + "₫";

const PAYMENT_METHODS = [
  { id: "cod", icon: Truck },
  { id: "bank", icon: Landmark },
] as const;

export default function CheckoutPage() {
  const lang = useI18nStore((s) => s.lang);
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const subtotal = cartSubtotal(items);

  const [payment, setPayment] = useState<"cod" | "bank">("cod");
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingFee, setShippingFee] = useState(FALLBACK_SHIPPING_FEE);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then((data) => {
      setFullName(data?.fullName || (user.user_metadata?.full_name as string | undefined) || "");
      setPhone(data?.phone ?? "");
      setAddress(data?.address ?? "");
      setProfileLoaded(true);
    });
  }, [user]);

  useEffect(() => {
    getShippingFee().then((fee) => {
      if (fee !== null) setShippingFee(fee);
    });
  }, []);

  const canSubmit =
    !!user &&
    !submitting &&
    fullName.trim() !== "" &&
    phone.trim() !== "" &&
    address.trim() !== "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/dang-nhap");
      return;
    }
    if (items.length === 0 || !canSubmit) return;
    setSubmitting(true);

    const result = await createOrder({
      userId: user.id,
      items,
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      note: note.trim(),
      paymentMethod: payment,
      subtotal,
      shippingFee,
    });

    if (result.error) {
      setSubmitting(false);
      toast.error(result.error);
      return;
    }

    fetch("/api/orders/notify-new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: result.orderId }),
    }).catch(() => {});

    setOrderPlaced(true);
    toast.success(T.orderSuccess[lang]);
    clear();
    setTimeout(() => router.push("/"), 1600);
  };

  if (authLoading || (user && !profileLoaded)) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center"
        style={{ backgroundColor: C.bg, color: C.muted }}
      >
        {T.loading[lang]}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: "#fff" }}>
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
            <Link href="/gio-hang" className="transition-colors hover:text-white">
              {T.breadcrumbCart[lang]}
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: C.accent }}>{T.breadcrumbCheckout[lang]}</span>
          </div>
          <h1 className="text-[clamp(1.6rem,4vw,2.5rem)] font-black leading-[1.1] tracking-[-0.02em] text-white">
            {T.title[lang]}
          </h1>
        </div>
      </div>

      {orderPlaced ? (
        <section className="w-full" style={{ backgroundColor: C.bg }}>
          <div className="mx-auto flex max-w-screen-xl flex-col items-center px-8 py-24 text-center md:px-16 lg:px-24">
            <div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${C.accent}1A`, border: `1px solid ${C.accent}` }}
            >
              <CheckCircle2 size={30} style={{ color: C.accent }} />
            </div>
            <h2 className="text-xl font-black tracking-[-0.01em] text-white">
              {T.orderSuccess[lang]}
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>
              {T.orderSuccessSub[lang]}
            </p>
          </div>
        </section>
      ) : items.length === 0 ? (
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
          <form
            onSubmit={handleSubmit}
            className="mx-auto grid max-w-screen-xl gap-10 px-8 py-12 md:px-16 lg:grid-cols-[1fr_340px] lg:px-24 lg:py-16"
          >
            {/* Shipping + Payment */}
            <div className="flex flex-col gap-8">
              <div>
                <p
                  className="mb-4 text-[11px] font-black tracking-[0.2em]"
                  style={{ color: C.muted }}
                >
                  {T.shippingInfo[lang]}
                </p>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      required={!!user}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={T.fullName[lang]}
                      className="h-12 w-full bg-transparent px-4 text-[13px] text-white placeholder-white/25 outline-none"
                      style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
                    />
                    <input
                      required={!!user}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={T.phone[lang]}
                      className="h-12 w-full bg-transparent px-4 text-[13px] text-white placeholder-white/25 outline-none"
                      style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
                    />
                  </div>
                  <input
                    required={!!user}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={T.address[lang]}
                    className="h-12 w-full bg-transparent px-4 text-[13px] text-white placeholder-white/25 outline-none"
                    style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
                  />
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={T.noteHint[lang]}
                    rows={3}
                    className="w-full resize-none bg-transparent px-4 py-3 text-[13px] text-white placeholder-white/25 outline-none"
                    style={{ border: `1px solid ${C.border}`, backgroundColor: "#141414" }}
                  />
                </div>
              </div>

              <div>
                <p
                  className="mb-4 text-[11px] font-black tracking-[0.2em]"
                  style={{ color: C.muted }}
                >
                  {T.paymentMethod[lang]}
                </p>
                <div className="flex flex-col gap-3">
                  {PAYMENT_METHODS.map(({ id, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPayment(id)}
                      className="flex items-center gap-3 px-4 py-3.5 text-left text-[13px] font-semibold transition-colors"
                      style={{
                        border: `1px solid ${payment === id ? C.accent : C.border}`,
                        backgroundColor: payment === id ? `${C.accent}0F` : "transparent",
                        color: payment === id ? "#fff" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: C.bg3 }}
                      >
                        <Icon size={15} style={{ color: payment === id ? C.accent : C.muted }} />
                      </span>
                      {T[id][lang]}
                      <span
                        className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                        style={{ border: `1px solid ${payment === id ? C.accent : C.border}` }}
                      >
                        {payment === id && (
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: C.accent }}
                          />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
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

                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div key={item.key} className="flex items-center gap-3">
                      <div
                        className="h-12 w-10 shrink-0 overflow-hidden"
                        style={{ backgroundColor: C.bg3 }}
                      >
                        <img
                          src={item.img}
                          alt={item.name[lang]}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="flex-1 text-[12px] font-semibold leading-snug text-white">
                        {item.name[lang]}{" "}
                        <span style={{ color: C.muted }}>×{item.qty}</span>
                      </p>
                      <span className="text-[12px] font-bold text-white">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="my-5 h-px w-full" style={{ backgroundColor: C.border }} />

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

                <button
                  type="submit"
                  disabled={!!user && !canSubmit}
                  className="mt-6 flex w-full items-center justify-center gap-2 py-4 text-center text-[12px] font-black tracking-[0.2em] uppercase text-black transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundColor: C.accent }}
                >
                  {!user
                    ? T.loginRequired[lang]
                    : submitting
                      ? T.submitting[lang]
                      : T.placeOrder[lang]}
                  {user && !submitting && <ArrowRight size={14} />}
                </button>
              </div>
            </aside>
          </form>
        </section>
      )}
    </div>
  );
}
