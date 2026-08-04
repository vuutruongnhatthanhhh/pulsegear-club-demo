// src/components/Footer.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Youtube, Facebook, ArrowRight } from "lucide-react";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import { getAllCategories } from "@/lib/categories";
import { getSocialConfig, FALLBACK_SOCIAL_CONFIG } from "@/lib/socialConfig";
import { getMapEmbedUrl, FALLBACK_MAP_EMBED_URL } from "@/lib/mapConfig";
import { getFooterConfig, FALLBACK_FOOTER_CONFIG } from "@/lib/footerConfig";

/* =========================================================
   TOKENS
   ========================================================= */
const BG = "#0A0A0A";
const BG2 = "#0E0E0E";
const ACCENT = "#FF3C00";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT_MUTED = "rgba(255,255,255,0.4)";

function safeLang(lang: Lang): Lang {
  return lang === "vi" || lang === "en" ? lang : "vi";
}

type CategoryLink = { vi: string; en: string; href: string };

// Fallback categories — shown until they load from the DB.
const FALLBACK_CATEGORY_LINKS: CategoryLink[] = [
  { vi: "Đồ Nam", en: "Men", href: "/do-nam" },
  { vi: "Đồ Nữ", en: "Women", href: "/do-nu" },
  { vi: "Liền Mạch", en: "Seamless", href: "/lien-mach" },
  { vi: "Áo Khoác", en: "Jackets", href: "/ao-khoac" },
  { vi: "Quần Short", en: "Shorts", href: "/quan-short" },
  { vi: "Phụ Kiện", en: "Accessories", href: "/phu-kien" },
  { vi: "Giảm Giá", en: "Sale", href: "/giam-gia" },
];

/* =========================================================
   TIKTOK ICON (lucide-react has no TikTok glyph)
   ========================================================= */
function TikTokIcon({ size = 16 }: { size?: number }) {
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

/* =========================================================
   FOOTER HEADING
   ========================================================= */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-[11px] font-black tracking-[0.3em] uppercase text-white">
        {children}
      </h3>
      <div className="mt-2.5 h-[1px] w-8" style={{ backgroundColor: ACCENT }} />
    </div>
  );
}

/* =========================================================
   FOOTER LINK
   ========================================================= */
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-2 text-[13px] transition-colors hover:text-white"
        style={{ color: TEXT_MUTED }}
      >
        <span
          className="inline-block h-[1px] w-3 transition-all group-hover:w-5"
          style={{ backgroundColor: ACCENT }}
        />
        {children}
      </Link>
    </li>
  );
}

/* =========================================================
   FOOTER COMPONENT
   ========================================================= */
const Footer = () => {
  const year = new Date().getFullYear();
  const lang = useI18nStore((s) => s.lang);
  const L = safeLang(lang);

  const [config, setConfig] = useState(FALLBACK_SOCIAL_CONFIG);
  useEffect(() => {
    getSocialConfig().then((data) => {
      if (data) setConfig(data);
    });
  }, []);

  const [mapEmbedSrc, setMapEmbedSrc] = useState(FALLBACK_MAP_EMBED_URL);
  useEffect(() => {
    getMapEmbedUrl().then((url) => {
      if (url) setMapEmbedSrc(url);
    });
  }, []);

  const [categoryLinks, setCategoryLinks] = useState<CategoryLink[]>(FALLBACK_CATEGORY_LINKS);
  useEffect(() => {
    getAllCategories().then((data) => {
      if (data.length > 0) {
        setCategoryLinks(data.map((c) => ({ vi: c.label.vi, en: c.label.en, href: c.href })));
      }
    });
  }, []);

  const [footerInfo, setFooterInfo] = useState(FALLBACK_FOOTER_CONFIG);
  useEffect(() => {
    getFooterConfig().then((data) => {
      if (data) setFooterInfo(data);
    });
  }, []);

  const staticLinks = [
    { href: "/gioi-thieu", vi: "Giới thiệu", en: "About Us" },
    { href: "/lien-he", vi: "Liên hệ", en: "Contact" },
    { href: "/tin-tuc", vi: "Tin tức", en: "News & Updates" },
    { href: "/bo-suu-tap", vi: "Bộ sưu tập", en: "Collections" },
    { href: "/gio-hang", vi: "Giỏ hàng", en: "Cart" },
  ];

  const socialLinks = [
    {
      href: config.facebook || "#",
      icon: <Facebook size={16} />,
      label: "Facebook",
    },
    {
      href: config.instagram || "#",
      icon: <Instagram size={16} />,
      label: "Instagram",
    },
    {
      href: config.youtube || "#",
      icon: <Youtube size={16} />,
      label: "YouTube",
    },
    {
      href: config.tiktok || "#",
      icon: <TikTokIcon size={16} />,
      label: "TikTok",
    },
  ];

  return (
    <footer
      className="w-full text-white border-t"
      style={{ backgroundColor: BG, borderColor: BORDER }}
    >
      {/* CTA Banner */}
      <div
        className="relative overflow-hidden border-b py-14"
        style={{ borderColor: BORDER, backgroundColor: BG2 }}
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-10"
          style={{
            background: `radial-gradient(ellipse at 80% 50%, ${ACCENT}, transparent 70%)`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div
                className="mb-2 text-[11px] font-black tracking-[0.35em] uppercase"
                style={{ color: ACCENT }}
              >
                PULSEGEAR.CLUB
              </div>
              <h2 className="text-3xl font-black leading-tight tracking-[-0.02em] text-white md:text-4xl">
                {L === "vi" ? (
                  <>
                    THAM GIA <span style={{ color: ACCENT }}>PHONG TRÀO</span>
                  </>
                ) : (
                  <>
                    JOIN THE <span style={{ color: ACCENT }}>MOVEMENT</span>
                  </>
                )}
              </h2>
              <p className="mt-2 text-[17px]" style={{ color: TEXT_MUTED }}>
                {L === "vi"
                  ? "Nhận thông tin sớm nhất về hàng mới, ưu đãi độc quyền & mẹo tập luyện."
                  : "Get early access to new drops, exclusive offers & training tips."}
              </p>
            </div>

            <Link
              href="/lien-he"
              className="group flex items-center gap-3 px-8 py-4 text-sm font-black tracking-[0.2em] uppercase text-black transition-all hover:scale-[1.02] shrink-0"
              style={{ backgroundColor: ACCENT }}
            >
              {L === "vi" ? "Liên hệ ngay" : "Contact Us"}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Pulsegear.Club"
                className="h-12 w-12 object-contain"
              />
              <div className="leading-tight">
                <div className="text-base font-black tracking-[0.06em] text-white">
                  PULSEGEAR
                </div>
                <div
                  className="text-[11px] font-bold tracking-[0.3em]"
                  style={{ color: ACCENT }}
                >
                  .CLUB
                </div>
              </div>
            </Link>

            <div
              className="space-y-2 text-[13px] leading-relaxed"
              style={{ color: TEXT_MUTED }}
            >
              <p>📍 {footerInfo.address}</p>
              <p>📞 {footerInfo.phone}</p>
              <p>✉️ {footerInfo.email}</p>
            </div>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center transition-all hover:scale-110"
                  style={{
                    border: `1px solid ${BORDER}`,
                    color: TEXT_MUTED,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = ACCENT;
                    (e.currentTarget as HTMLElement).style.color = ACCENT;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = BORDER;
                    (e.currentTarget as HTMLElement).style.color = TEXT_MUTED;
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick links */}
          <div>
            <FooterHeading>
              {L === "vi" ? "Liên kết" : "Quick Links"}
            </FooterHeading>
            <ul className="space-y-3">
              {staticLinks.map((l) => (
                <FooterLink key={l.en} href={l.href}>
                  {L === "vi" ? l.vi : l.en}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <FooterHeading>{L === "vi" ? "Danh mục" : "Categories"}</FooterHeading>
            <ul className="space-y-3">
              {categoryLinks.map((cat) => (
                <FooterLink key={cat.href} href={cat.href}>
                  {L === "vi" ? cat.vi : cat.en}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Col 4: Map */}
          <div>
            <FooterHeading>{L === "vi" ? "Vị trí" : "Location"}</FooterHeading>
            <div
              className="overflow-hidden border"
              style={{ borderColor: BORDER }}
            >
              <div className="relative aspect-[16/11] w-full">
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
                className="px-4 py-2.5 text-[11px] font-semibold tracking-wide"
                style={{ color: TEXT_MUTED, borderTop: `1px solid ${BORDER}` }}
              >
                {L === "vi"
                  ? "Nhấn để mở chỉ đường"
                  : "Click to get directions"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-7xl px-6 py-5 md:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p
              className="text-[11px] tracking-[0.18em] uppercase"
              style={{ color: TEXT_MUTED }}
            >
              © {year} PULSEGEAR.CLUB — All rights reserved
            </p>
            <a
              href="https://tjzenn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.15em] uppercase underline underline-offset-4 transition-colors hover:text-white"
              style={{ color: TEXT_MUTED }}
            >
              Web Design: TJZenn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
