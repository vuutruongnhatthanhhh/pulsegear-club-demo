"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, PackageOpen } from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";
import { useAuthStore } from "@/lib/auth/store";
import { getMyOrders, type OrderRecord, type OrderStatus } from "@/lib/orders";

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
  breadcrumbAccount: { vi: "Tài khoản", en: "Account" },
  breadcrumbOrders: { vi: "Lịch sử đơn hàng", en: "Order history" },
  title: { vi: "LỊCH SỬ ĐƠN HÀNG", en: "ORDER HISTORY" },
  loading: { vi: "Đang tải...", en: "Loading..." },
  emptyTitle: { vi: "Chưa có đơn hàng nào", en: "No orders yet" },
  emptySub: {
    vi: "Các đơn hàng bạn đặt sẽ hiển thị ở đây.",
    en: "Orders you place will show up here.",
  },
  shopNow: { vi: "MUA SẮM NGAY", en: "SHOP NOW" },
  paymentMethod: {
    cod: { vi: "Thanh toán khi nhận hàng", en: "Cash on delivery" },
    bank: { vi: "Chuyển khoản ngân hàng", en: "Bank transfer" },
  },
  total: { vi: "Tổng cộng", en: "Total" },
  backToAccount: { vi: "Quay lại thông tin cá nhân", en: "Back to account" },
  shippingInfo: { vi: "Thông tin giao hàng", en: "Shipping information" },
  fullName: { vi: "Họ và tên", en: "Full name" },
  phone: { vi: "Số điện thoại", en: "Phone" },
  address: { vi: "Địa chỉ", en: "Address" },
  note: { vi: "Ghi chú", en: "Note" },
};

const STATUS_META: Record<OrderStatus, { label: { vi: string; en: string }; className: string }> = {
  pending: {
    label: { vi: "Chờ xác nhận", en: "Pending confirmation" },
    className: "bg-amber-500/15 text-amber-400",
  },
  confirmed: {
    label: { vi: "Đã xác nhận", en: "Confirmed" },
    className: "bg-blue-500/15 text-blue-400",
  },
  shipping: {
    label: { vi: "Đang giao", en: "Shipping" },
    className: "bg-purple-500/15 text-purple-400",
  },
  delivered: {
    label: { vi: "Đã giao", en: "Delivered" },
    className: "bg-green-500/15 text-green-400",
  },
  cancelled: {
    label: { vi: "Đã hủy", en: "Cancelled" },
    className: "bg-red-500/15 text-red-400",
  },
};

const formatPrice = (n: number) => n.toLocaleString("vi-VN") + "₫";
const formatDate = (iso: string, lang: "vi" | "en") =>
  new Date(iso).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function DonHangPage() {
  const lang = useI18nStore((s) => s.lang);
  const router = useRouter();
  const { user, loading } = useAuthStore();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/dang-nhap");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    getMyOrders(user.id).then((data) => {
      setOrders(data);
      setOrdersLoaded(true);
    });
  }, [user]);

  if (loading || !user || !ordersLoaded) {
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
        <div className="mx-auto max-w-screen-lg px-8 pb-10 pt-32 md:px-16">
          <div
            className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Link href="/" className="transition-colors hover:text-white">
              {T.breadcrumbHome[lang]}
            </Link>
            <ChevronRight size={12} />
            <Link href="/tai-khoan" className="transition-colors hover:text-white">
              {T.breadcrumbAccount[lang]}
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: C.accent }}>{T.breadcrumbOrders[lang]}</span>
          </div>
          <h1 className="text-[clamp(1.6rem,4vw,2.5rem)] font-black leading-[1.1] tracking-[-0.02em] text-white">
            {T.title[lang]}
          </h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <section className="w-full" style={{ backgroundColor: C.bg }}>
          <div className="mx-auto flex max-w-screen-lg flex-col items-center px-8 py-24 text-center md:px-16">
            <div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}
            >
              <PackageOpen size={26} style={{ color: C.muted }} />
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
              {T.shopNow[lang]}
            </Link>
          </div>
        </section>
      ) : (
        <section className="w-full" style={{ backgroundColor: C.bg }}>
          <div className="mx-auto max-w-screen-lg px-8 py-12 md:px-16">
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5"
                  style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: C.border }}>
                    <div>
                      <p className="text-[13px] font-bold text-white">
                        #{order.id} · {formatDate(order.createdAt, lang)}
                      </p>
                      <p className="mt-0.5 text-[12px]" style={{ color: C.muted }}>
                        {T.paymentMethod[order.paymentMethod]?.[lang] ?? order.paymentMethod}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${STATUS_META[order.status].className}`}
                    >
                      {STATUS_META[order.status].label[lang]}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 py-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div
                          className="h-12 w-10 shrink-0 overflow-hidden"
                          style={{ backgroundColor: C.bg3 }}
                        >
                          <img
                            src={item.image}
                            alt={item.name[lang]}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="flex-1 text-[12px] font-semibold leading-snug text-white">
                          {item.name[lang]}{" "}
                          <span style={{ color: C.muted }}>
                            {[item.size, item.color].filter(Boolean).join(" · ")}
                            {(item.size || item.color) && " · "}×{item.qty}
                          </span>
                        </p>
                        <span className="text-[12px] font-bold text-white">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpanded(order.id)}
                    className="flex w-full items-center justify-between gap-2 border-t py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white"
                    style={{ borderColor: C.border }}
                  >
                    {T.shippingInfo[lang]}
                    <ChevronDown
                      size={14}
                      className="shrink-0 transition-transform"
                      style={{
                        transform: expanded.has(order.id) ? "rotate(180deg)" : "none",
                      }}
                    />
                  </button>

                  {expanded.has(order.id) && (
                    <div
                      className="flex flex-col gap-1 pb-4 text-[12px] leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      <p>
                        <span style={{ color: C.muted }}>{T.fullName[lang]}: </span>
                        {order.fullName}
                      </p>
                      <p>
                        <span style={{ color: C.muted }}>{T.phone[lang]}: </span>
                        {order.phone}
                      </p>
                      <p>
                        <span style={{ color: C.muted }}>{T.address[lang]}: </span>
                        {order.address}
                      </p>
                      {order.note && (
                        <p>
                          <span style={{ color: C.muted }}>{T.note[lang]}: </span>
                          {order.note}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: C.border }}>
                    <span className="text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: C.muted }}>
                      {T.total[lang]}
                    </span>
                    <span className="text-base font-black" style={{ color: C.accent }}>
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/tai-khoan"
              className="mt-8 block text-center text-[13px] font-semibold underline underline-offset-4 transition-colors hover:text-white"
              style={{ color: C.muted }}
            >
              {T.backToAccount[lang]}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
