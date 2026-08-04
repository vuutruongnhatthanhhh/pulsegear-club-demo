"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Send,
  Facebook,
  Youtube,
  Instagram,
} from "lucide-react";
import { toast } from "sonner";
import { useI18nStore } from "@/lib/i18n/store";
import config from "@/config";
import { getSocialConfig, FALLBACK_SOCIAL_CONFIG } from "@/lib/socialConfig";
import { getMapEmbedUrl, FALLBACK_MAP_EMBED_URL } from "@/lib/mapConfig";
import { getContactHeroSection, FALLBACK_CONTACT_HERO } from "@/lib/contactHero";

/* ─── TOKENS ─── */
const C = {
  bg: "#0A0A0A",
  bg2: "#111111",
  bg3: "#161616",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

function TikTokIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

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

/* ═══════════════════════════════════════════
   COPY
═══════════════════════════════════════════ */
const T = {
  breadcrumbHome: { vi: "Trang chủ", en: "Home" },
  breadcrumbContact: { vi: "Liên hệ", en: "Contact" },

  phone: { vi: "Điện thoại", en: "Phone" },
  email: { vi: "Email", en: "Email" },

  formEyebrow: { vi: "GỬI TIN NHẮN", en: "SEND A MESSAGE" },
  formTitle: { vi: "CHÚNG TÔI LẮNG NGHE BẠN", en: "WE'RE LISTENING" },
  formSub: {
    vi: "Điền thông tin bên dưới, đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ.",
    en: "Fill in the form below and our team will get back to you within 24 hours.",
  },
  fullName: { vi: "Họ và tên", en: "Full name" },
  fullNamePh: { vi: "Nguyễn Văn A", en: "John Doe" },
  emailPh: { vi: "xyz@email.com", en: "you@email.com" },
  phonePh: { vi: "0912 345 678", en: "+1 234 567 890" },
  subject: { vi: "Chủ đề", en: "Subject" },
  subjectPh: { vi: "Bạn cần hỗ trợ về vấn đề gì?", en: "What's this about?" },
  message: { vi: "Nội dung", en: "Message" },
  messagePh: {
    vi: "Nhập nội dung tin nhắn của bạn...",
    en: "Type your message here...",
  },
  send: { vi: "GỬI TIN NHẮN", en: "SEND MESSAGE" },
  sending: { vi: "ĐANG GỬI...", en: "SENDING..." },
  toastSuccess: {
    vi: "Đã gửi tin nhắn! Chúng tôi sẽ phản hồi sớm nhất.",
    en: "Message sent! We'll get back to you shortly.",
  },
  toastRateLimited: {
    vi: "Bạn đã gửi quá nhiều lần, vui lòng thử lại sau ít phút.",
    en: "You've sent too many messages — please try again in a few minutes.",
  },
  toastError: {
    vi: "Gửi tin nhắn thất bại, vui lòng thử lại sau.",
    en: "Failed to send your message, please try again later.",
  },

  followUs: { vi: "THEO DÕI CHÚNG TÔI", en: "FOLLOW US" },
  mapEyebrow: { vi: "VỊ TRÍ CỬA HÀNG", en: "FIND US" },
  mapDirections: {
    vi: "Nhấn để mở chỉ đường",
    en: "Click to get directions",
  },

  faqEyebrow: { vi: "GIẢI ĐÁP NHANH", en: "QUICK ANSWERS" },
  faqTitle: { vi: "CÂU HỎI THƯỜNG GẶP", en: "FREQUENTLY ASKED" },
};

const FAQS = [
  {
    q: {
      vi: "Thời gian giao hàng mất bao lâu?",
      en: "How long does shipping take?",
    },
    a: {
      vi: "Đơn hàng nội thành giao trong 1–2 ngày làm việc. Các tỉnh thành khác từ 2–5 ngày làm việc.",
      en: "Orders within the city arrive in 1–2 business days. Other provinces take 2–5 business days.",
    },
  },
  {
    q: {
      vi: "Tôi có thể đổi trả sản phẩm không?",
      en: "Can I return or exchange a product?",
    },
    a: {
      vi: "Có, chúng tôi hỗ trợ đổi trả miễn phí trong vòng 30 ngày kể từ ngày nhận hàng, không cần lý do.",
      en: "Yes, we offer free returns and exchanges within 30 days of delivery, no questions asked.",
    },
  },
  {
    q: { vi: "Làm sao để theo dõi đơn hàng?", en: "How do I track my order?" },
    a: {
      vi: "Sau khi đơn hàng được xác nhận, bạn sẽ nhận mã vận đơn qua email để theo dõi trực tiếp.",
      en: "Once your order is confirmed, you'll receive a tracking code via email to follow it live.",
    },
  },
  {
    q: {
      vi: "PULSEGEAR.CLUB có cửa hàng offline không?",
      en: "Does PULSEGEAR.CLUB have physical stores?",
    },
    a: {
      vi: "Hiện tại chúng tôi có showroom tại TP.HCM, xem vị trí chi tiết ở bản đồ bên dưới.",
      en: "We currently have a showroom in Ho Chi Minh City — see the map below for details.",
    },
  },
];

const CONTACT_CARDS = [
  { Icon: MapPin, key: "address" as const },
  { Icon: Phone, key: "phone" as const },
  { Icon: Mail, key: "email" as const },
  { Icon: Clock, key: "hours" as const },
];


export default function ContactPage() {
  const lang = useI18nStore((s) => s.lang);
  const [submitting, setSubmitting] = useState(false);
  const [social, setSocial] = useState(FALLBACK_SOCIAL_CONFIG);
  useEffect(() => {
    getSocialConfig().then((data) => {
      if (data) setSocial(data);
    });
  }, []);
  const [mapEmbedSrc, setMapEmbedSrc] = useState(FALLBACK_MAP_EMBED_URL);
  useEffect(() => {
    getMapEmbedUrl().then((url) => {
      if (url) setMapEmbedSrc(url);
    });
  }, []);

  const [hero, setHero] = useState(FALLBACK_CONTACT_HERO);
  useEffect(() => {
    getContactHeroSection().then((data) => {
      if (data) setHero(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });

      if (res.ok) {
        toast.success(T.toastSuccess[lang]);
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(
          body.error === "rate_limited" ? T.toastRateLimited[lang] : T.toastError[lang],
        );
      }
    } catch {
      toast.error(T.toastError[lang]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: C.bg, color: "#fff" }}>
      {/* ════════ HERO ════════ */}
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${hero.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,.8) 0%, rgba(0,0,0,.9) 60%, ${C.bg} 100%),
                         radial-gradient(ellipse 60% 70% at 75% 30%, ${C.accent}20, transparent 70%)`,
          }}
        />
        <Noise op={0.04} />

        <div className="relative mx-auto max-w-screen-2xl px-8 pb-20 pt-36 md:px-16 lg:px-24 lg:pt-44">
          <div
            className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Link href="/" className="transition-colors hover:text-white">
              {T.breadcrumbHome[lang]}
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: C.accent }}>{T.breadcrumbContact[lang]}</span>
          </div>

          <div
            className="mb-6 inline-flex w-fit items-center gap-2 px-3 py-1.5 text-[10px] font-black tracking-[0.4em] uppercase"
            style={{
              backgroundColor: `${C.accent}22`,
              border: `1px solid ${C.accent}45`,
              color: C.accent,
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ backgroundColor: C.accent }}
            />
            {hero.eyebrow[lang]}
          </div>

          <h1 className="max-w-3xl text-[clamp(2.2rem,5.5vw,4.8rem)] font-black leading-[1.1] tracking-[-0.02em]">
            <span className="block text-white">{hero.title1[lang]}</span>
            <span
              className="block"
              style={{ color: C.accent, textShadow: `0 0 80px ${C.accent}35` }}
            >
              {hero.title2[lang]}
            </span>
          </h1>

          <p
            className="mt-6 max-w-lg text-[17px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {hero.subtitle[lang]}
          </p>
        </div>
      </section>

      {/* ════════ CONTACT INFO CARDS ════════ */}
      <section className="relative w-full" style={{ backgroundColor: C.bg }}>
        <div className="relative mx-auto max-w-screen-2xl px-8 py-14 md:px-16 lg:px-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACT_CARDS.map(({ Icon, key }, i) => {
              const cardLabel = {
                address: hero.addressLabel,
                phone: hero.phoneLabel,
                email: hero.emailLabel,
                hours: hero.hoursLabel,
              }[key];
              return (
              <div
                key={i}
                className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: C.bg3,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: C.accent }}
                />
                <div
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center"
                  style={{
                    backgroundColor: `${C.accent}15`,
                    border: `1px solid ${C.accent}30`,
                    color: C.accent,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div
                  className="mb-1 text-[13px] font-black tracking-[0.2em] uppercase"
                  style={{ color: C.muted }}
                >
                  {cardLabel[lang]}
                </div>
                {key === "address" && (
                  <p className="text-[14px] leading-snug text-white">
                    {hero.addressValue[lang]}
                  </p>
                )}
                {key === "phone" && (
                  <a
                    href={`tel:${config.companyPhone}`}
                    className="text-[14px] font-semibold text-white transition-colors hover:text-white/80"
                  >
                    {config.companyPhone}
                  </a>
                )}
                {key === "email" && (
                  <a
                    href={`mailto:${config.companyEmail}`}
                    className="break-all text-[14px] font-semibold text-white transition-colors hover:text-white/80"
                  >
                    {config.companyEmail}
                  </a>
                )}
                {key === "hours" && (
                  <p className="text-[14px] leading-snug text-white">
                    {hero.hoursValue[lang]}
                  </p>
                )}
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ FORM + MAP ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: C.bg2 }}
      >
        <Noise op={0.025} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 55% 80% at 15% 30%,${C.accent}12,transparent 65%)`,
          }}
        />
        <div className="relative mx-auto max-w-screen-2xl px-8 py-20 md:px-16 lg:px-24">
          <div className="grid gap-14 lg:grid-cols-2">
            {/* Form */}
            <div>
              <p
                className="mb-4 text-[13px] font-black tracking-[0.3em] uppercase"
                style={{ color: C.accent }}
              >
                {T.formEyebrow[lang]}
              </p>
              <h2 className="mb-3 text-3xl font-black leading-tight tracking-[-0.02em] text-white md:text-4xl">
                {T.formTitle[lang]}
              </h2>
              <p
                className="mb-8 max-w-md text-[16px] leading-relaxed"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {T.formSub[lang]}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                      style={{ color: C.muted }}
                    >
                      {T.fullName[lang]}
                    </label>
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder={T.fullNamePh[lang]}
                      className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
                      style={{
                        border: `1px solid ${C.border}`,
                        backgroundColor: "#141414",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                      style={{ color: C.muted }}
                    >
                      {T.email[lang]}
                    </label>
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder={T.emailPh[lang]}
                      className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
                      style={{
                        border: `1px solid ${C.border}`,
                        backgroundColor: "#141414",
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                      style={{ color: C.muted }}
                    >
                      {T.phone[lang]}
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder={T.phonePh[lang]}
                      className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
                      style={{
                        border: `1px solid ${C.border}`,
                        backgroundColor: "#141414",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                      style={{ color: C.muted }}
                    >
                      {T.subject[lang]}
                    </label>
                    <input
                      name="subject"
                      type="text"
                      placeholder={T.subjectPh[lang]}
                      className="w-full bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
                      style={{
                        border: `1px solid ${C.border}`,
                        backgroundColor: "#141414",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em]"
                    style={{ color: C.muted }}
                  >
                    {T.message[lang]}
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    placeholder={T.messagePh[lang]}
                    className="w-full resize-none bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none"
                    style={{
                      border: `1px solid ${C.border}`,
                      backgroundColor: "#141414",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative flex items-center gap-3 overflow-hidden px-9 py-4 text-[12px] font-black tracking-[0.25em] uppercase text-black transition-transform hover:scale-[1.02] active:scale-[0.97] disabled:opacity-60"
                  style={{ backgroundColor: C.accent }}
                >
                  <span className="relative z-10">
                    {submitting ? T.sending[lang] : T.send[lang]}
                  </span>
                  <Send size={14} className="relative z-10" />
                  <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                </button>
              </form>
            </div>

            {/* Map + Social */}
            <div>
              <p
                className="mb-4 text-[12px] font-black tracking-[0.45em] uppercase"
                style={{ color: C.accent }}
              >
                {T.mapEyebrow[lang]}
              </p>
              <div
                className="overflow-hidden"
                style={{ border: `1px solid ${C.border}` }}
              >
                <div className="relative aspect-[4/3] w-full">
                  <iframe
                    title="Map"
                    src={mapEmbedSrc}
                    className="absolute inset-0 h-full w-full grayscale invert opacity-70"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ filter: "grayscale(1) invert(0.9) contrast(0.8)" }}
                  />
                </div>
                <div
                  className="px-4 py-3 text-[12px] font-semibold tracking-wide"
                  style={{ color: C.muted, borderTop: `1px solid ${C.border}` }}
                >
                  {T.mapDirections[lang]}
                </div>
              </div>

              <div
                className="mt-8 p-6"
                style={{
                  backgroundColor: C.bg3,
                  border: `1px solid ${C.border}`,
                }}
              >
                <p
                  className="mb-4 text-[11px] font-black tracking-[0.3em] uppercase"
                  style={{ color: C.muted }}
                >
                  {T.followUs[lang]}
                </p>
                <div className="flex items-center gap-3">
                  {[
                    { href: social.facebook || "#", Icon: Facebook },
                    { href: social.instagram || "#", Icon: Instagram },
                    { href: social.youtube || "#", Icon: Youtube },
                    { href: social.tiktok || "#", Icon: TikTokIcon },
                  ].map(({ href, Icon }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center transition-all hover:scale-110"
                      style={{
                        border: `1px solid ${C.border}`,
                        color: C.muted,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          C.accent;
                        (e.currentTarget as HTMLElement).style.color = C.accent;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          C.border;
                        (e.currentTarget as HTMLElement).style.color = C.muted;
                      }}
                    >
                      <Icon size={17} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="relative w-full" style={{ backgroundColor: C.bg }}>
        <Noise op={0.025} />
        <div className="relative mx-auto max-w-screen-xl px-8 py-24 md:px-16">
          <div className="mb-12 text-center">
            <p
              className="mb-3 text-[13px] font-black tracking-[0.3em] uppercase"
              style={{ color: C.accent }}
            >
              {T.faqEyebrow[lang]}
            </p>
            <h2 className="text-3xl font-black tracking-[-0.02em] text-white md:text-4xl">
              {T.faqTitle[lang]}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {FAQS.map((f, i) => (
              <div
                key={i}
                className="p-6"
                style={{
                  backgroundColor: C.bg3,
                  border: `1px solid ${C.border}`,
                }}
              >
                <h3 className="mb-2 text-[17px] font-black text-white">
                  {f.q[lang]}
                </h3>
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: C.muted }}
                >
                  {f.a[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
