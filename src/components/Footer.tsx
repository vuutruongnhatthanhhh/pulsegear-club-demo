// src/components/Footer.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Youtube, Facebook, ArrowRight } from "lucide-react";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import {
  getAllCategoriesService,
  type CategoryService,
} from "@/services/CategoriesService";
import {
  getAllCompanyInfos,
  type CompanyInfo,
} from "@/services/CompanyInfoService";
import { getAllPolicies, type Policy } from "@/services/PolicyService";
import { getMainPrice, type Price } from "@/services/PriceService";
import config from "@/config";

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

  const [categories, setCategories] = useState<CategoryService[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [mainPrice, setMainPrice] = useState<Price | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllCategoriesService({
          page: 1,
          limit: 1000,
          level: 1,
        });
        setCategories(res.data.reverse());
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllCompanyInfos({ page: 1, limit: 1 });
        if (res.data.length > 0) setCompanyInfo(res.data[0]);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllPolicies({ page: 1, limit: 100 });
        setPolicies(res.data);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setMainPrice(await getMainPrice());
      } catch {}
    })();
  }, []);

  const getCategoryName = (cat: CategoryService) =>
    cat.name[lang] || cat.name.vi || cat.name.en || "";

  const getPolicyName = (policy: Policy) =>
    policy.title?.[L] || policy.title?.vi || policy.title?.en || "";

  const mainPriceHref = mainPrice?.url
    ? `/bang-gia/${mainPrice.url}`
    : mainPrice?.id
      ? `/bang-gia/${mainPrice.id}`
      : null;

  const mapEmbedSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4879.504307635821!2d106.6964218!3d10.7393764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f7cd686d175%3A0x7b325abcaf954a51!2sC%C3%B4ng%20ty%20Lu%E1%BA%ADt%20TNHH%20DAI%20%26%20Partners!5e1!3m2!1sen!2s!4v1767084073563!5m2!1sen!2s";

  const staticLinks = [
    { href: "#", vi: "Giới thiệu", en: "About Us" },
    { href: "#", vi: "Liên hệ", en: "Contact" },
    { href: "#", vi: "Tin tức", en: "News & Updates" },
  ];

  const socialLinks = [
    {
      href: config.facebook || "#",
      icon: <Facebook size={16} />,
      label: "Facebook",
    },
    {
      href: config.youtube || "#",
      icon: <Youtube size={16} />,
      label: "YouTube",
    },
    {
      href: config.tiktok || "#",
      icon: <Instagram size={16} />,
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
                THAM GIA <span style={{ color: ACCENT }}>PHONG TRÀO</span>
              </h2>
              <p className="mt-2 text-sm" style={{ color: TEXT_MUTED }}>
                Nhận thông tin sớm nhất về hàng mới, ưu đãi độc quyền &amp; mẹo
                tập luyện.
              </p>
            </div>

            <Link
              href="#"
              className="group flex items-center gap-3 px-8 py-4 text-sm font-black tracking-[0.2em] uppercase text-black transition-all hover:scale-[1.02] shrink-0"
              style={{ backgroundColor: ACCENT }}
            >
              Liên hệ ngay
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
              <img src="/logo.png" alt="Pulsegear.Club" className="h-12 w-12 object-contain" />
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
              <p>📍 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</p>
              <p>📞 0812 303 471</p>
              <p>✉️ hello@pulsegear.club</p>
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
                <FooterLink key={l.href} href={l.href}>
                  {L === "vi" ? l.vi : l.en}
                </FooterLink>
              ))}
              {/* {policies.map((policy) => (
                <FooterLink
                  key={policy.id}
                  href={
                    policy.url
                      ? `/policy/${policy.url}`
                      : `/policy/${policy.id}`
                  }
                >
                  {getPolicyName(policy)}
                </FooterLink>
              ))} */}
            </ul>
          </div>

          {/* Col 3: Services */}
          {/* <div>
            <FooterHeading>{L === "vi" ? "Dịch vụ" : "Services"}</FooterHeading>
            <ul className="space-y-3">
              {mainPriceHref && (
                <FooterLink href={mainPriceHref}>
                  {L === "vi" ? "Bảng giá" : "Pricing"}
                </FooterLink>
              )}
              {categories.length === 0 && !mainPriceHref ? (
                <li className="text-[13px]" style={{ color: TEXT_MUTED }}>
                  {L === "vi" ? "Chưa có danh mục" : "No categories"}
                </li>
              ) : (
                categories.map((cat) => (
                  <FooterLink
                    key={cat.id}
                    href={`/services?category_id=${cat.id}`}
                  >
                    {getCategoryName(cat)}
                  </FooterLink>
                ))
              )}
            </ul>
          </div> */}

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
