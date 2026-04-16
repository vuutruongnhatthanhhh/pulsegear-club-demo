"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, Menu, Zap } from "lucide-react";

/* =========================================================
   DESIGN TOKENS
   ========================================================= */
const BG_HEADER = "#0A0A0A";
const ACCENT = "#FF3C00";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT_MUTED = "rgba(255,255,255,0.5)";

/* =========================================================
   NAV ITEMS
   ========================================================= */
const NAV_ITEMS = [
  { label: "Đồ Nam", href: "#" },
  { label: "Đồ Nữ", href: "#" },
  { label: "Liền Mạch", href: "#" },
  { label: "Áo Khoác", href: "#" },
  { label: "Quần Short", href: "#" },
  { label: "Phụ Kiện", href: "#" },
  { label: "Giảm Giá", href: "#" },
  { label: "Tin Tức", href: "#" },
];

/* =========================================================
   LANGS
   ========================================================= */
type Lang = "vi" | "en";

const LANGS: Record<Lang, { label: string; flag: string; long: string }> = {
  en: { label: "EN", flag: "/images/language/en.png", long: "English" },
  vi: { label: "VI", flag: "/images/language/vi.png", long: "Tiếng Việt" },
};

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [lang, setLang] = useState<Lang>("vi");
  const [isLangOpen, setLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const langBtnRef = useRef<HTMLButtonElement | null>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus search
  useEffect(() => {
    if (!isSearchOpen) return;
    const id = window.setTimeout(() => searchInputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [isSearchOpen]);

  // Body scroll lock
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMobileMenuOpen]);

  // Close on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Click outside lang menu
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target as Node) &&
        !langBtnRef.current?.contains(e.target as Node)
      ) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleRouteChange = (href: string) => {
    setMobileMenuOpen(false);
    if (href !== "#" && pathname !== href) router.push(href);
  };

  return (
    <header className="w-full">
      {/* ====== DESKTOP (>=1141px) ====== */}
      <div className="hidden min-[1141px]:block">
        {/* Top utility bar */}
        <div
          className="w-full border-b"
          style={{ backgroundColor: "#060606", borderColor: BORDER }}
        >
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6">
            <div
              className="flex items-center gap-6 text-[11px] font-semibold tracking-[0.15em] uppercase"
              style={{ color: TEXT_MUTED }}
            >
              <Link href="#" className="transition-colors hover:text-white">
                Về Chúng Tôi
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Liên Hệ
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Lang switcher */}
              <div className="relative" ref={langMenuRef}>
                <button
                  ref={langBtnRef}
                  onClick={() => setLangOpen((v) => !v)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors hover:text-white"
                  style={{ color: TEXT_MUTED }}
                >
                  <img
                    src={LANGS[lang].flag}
                    alt={LANGS[lang].long}
                    className="h-3.5 w-3.5 rounded-full object-cover"
                  />
                  {LANGS[lang].label}
                  <ChevronDown size={10} />
                </button>

                {isLangOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-36 overflow-hidden py-1 shadow-2xl"
                    style={{
                      backgroundColor: "#111111",
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    {(["vi", "en"] as Lang[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLang(l);
                          setLangOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-colors hover:bg-white/5 ${lang === l ? "text-white" : "text-white/50"}`}
                      >
                        <img
                          src={LANGS[l].flag}
                          alt={LANGS[l].long}
                          className="h-4 w-4 rounded-full object-cover"
                        />
                        {LANGS[l].long}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Brand + Search bar */}
        <div
          className="w-full border-b"
          style={{ backgroundColor: BG_HEADER, borderColor: BORDER }}
        >
          <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div
                className="flex h-9 w-9 items-center justify-center"
                style={{ backgroundColor: ACCENT }}
              >
                <Zap size={18} className="text-black" fill="black" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-black tracking-[0.08em] text-white">
                  PULSEGEAR
                </div>
                <div
                  className="text-[10px] font-bold tracking-[0.3em] uppercase"
                  style={{ color: ACCENT }}
                >
                  .CLUB
                </div>
              </div>
            </Link>

            {/* Search */}
            <form className="ml-auto flex w-full max-w-md items-center">
              <div
                className="flex w-full items-center overflow-hidden"
                style={{
                  border: `1px solid ${BORDER}`,
                  backgroundColor: "#141414",
                }}
              >
                <input
                  name="q"
                  placeholder={lang === "vi" ? "Tìm kiếm..." : "Search gear..."}
                  className="h-10 w-full bg-transparent px-4 text-[13px] text-white placeholder-white/20 outline-none"
                />
                <button
                  type="submit"
                  className="flex h-10 w-11 shrink-0 items-center justify-center transition-opacity hover:opacity-80"
                  style={{ backgroundColor: ACCENT }}
                  aria-label="Search"
                >
                  <Search size={15} className="text-black" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Navigation */}
        <div className="relative">
          <div className={isScrolled ? "h-[48px]" : "h-0"} />
          <div
            className={[
              isScrolled ? "fixed top-0 left-0 right-0" : "relative",
              "z-[9999] w-full border-b",
            ].join(" ")}
            style={{ backgroundColor: BG_HEADER, borderColor: BORDER }}
          >
            <div className="mx-auto max-w-7xl px-6">
              <nav className="relative flex w-full items-center">
                {isScrolled && (
                  <Link
                    href="/"
                    className="mr-8 flex items-center gap-2 shrink-0"
                  >
                    <div
                      className="flex h-7 w-7 items-center justify-center"
                      style={{ backgroundColor: ACCENT }}
                    >
                      <Zap size={13} className="text-black" fill="black" />
                    </div>
                    <span className="text-xs font-black tracking-[0.1em] text-white">
                      PULSEGEAR.CLUB
                    </span>
                  </Link>
                )}

                <ul className="flex flex-wrap items-center gap-x-1 gap-y-0 py-2">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="flex items-center px-3 py-3 text-[11px] font-black tracking-[0.18em] uppercase text-white/50 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* ====== MOBILE (<=1140px) ====== */}
      <div className="max-[1140px]:block min-[1141px]:hidden relative">
        <div className="h-[60px]" />

        <div
          className="fixed top-0 left-0 right-0 z-[9999] border-b"
          style={{ backgroundColor: BG_HEADER, borderColor: BORDER }}
        >
          <div className="flex h-[60px] items-center justify-between px-5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center"
                style={{ backgroundColor: ACCENT }}
              >
                <Zap size={16} className="text-black" fill="black" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-black tracking-[0.08em] text-white">
                  PULSEGEAR
                </div>
                <div
                  className="text-[9px] font-bold tracking-[0.3em]"
                  style={{ color: ACCENT }}
                >
                  .CLUB
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen((v) => !v);
                }}
                className="flex h-9 w-9 items-center justify-center transition-colors"
                style={{ color: isSearchOpen ? "white" : TEXT_MUTED }}
                aria-label="Search"
              >
                {isSearchOpen ? <X size={17} /> : <Search size={17} />}
              </button>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setMobileMenuOpen(true);
                }}
                className="flex h-9 w-9 items-center justify-center transition-colors"
                style={{ color: TEXT_MUTED }}
                aria-label="Menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <AnimatePresence initial={false}>
            {isSearchOpen && (
              <motion.div
                key="mobile-search"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t"
                style={{ borderColor: BORDER }}
              >
                <form className="flex items-center px-4 py-3 gap-2">
                  <div
                    className="flex flex-1 items-center overflow-hidden"
                    style={{
                      border: `1px solid ${BORDER}`,
                      backgroundColor: "#141414",
                    }}
                  >
                    <input
                      ref={searchInputRef}
                      name="q"
                      placeholder={lang === "vi" ? "Tìm kiếm..." : "Search..."}
                      className="h-10 w-full bg-transparent px-4 text-sm text-white placeholder-white/20 outline-none"
                    />
                    <button
                      type="submit"
                      className="flex h-10 w-10 shrink-0 items-center justify-center"
                      style={{ backgroundColor: ACCENT }}
                    >
                      <Search size={14} className="text-black" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-xs font-semibold tracking-widest uppercase transition-colors hover:text-white"
                    style={{ color: TEXT_MUTED }}
                  >
                    Đóng
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[1100] bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 z-[11200] h-full w-[80%] max-w-[320px] transform overflow-hidden transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundColor: "#0E0E0E",
          borderLeft: `1px solid ${BORDER}`,
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center"
              style={{ backgroundColor: ACCENT }}
            >
              <Zap size={13} className="text-black" fill="black" />
            </div>
            <span className="text-xs font-black tracking-[0.1em] text-white">
              PULSEGEAR.CLUB
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center transition-colors"
            style={{ color: TEXT_MUTED }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav className="flex flex-col px-5 py-6 gap-1 text-[12px] font-black tracking-[0.18em] uppercase">
            <button
              onClick={() => handleRouteChange("/")}
              className="text-left py-3 text-white/70 transition-colors hover:text-white border-b"
              style={{ borderColor: BORDER }}
            >
              Trang Chủ
            </button>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleRouteChange(item.href)}
                className="text-left py-3 text-white/70 transition-colors hover:text-white border-b"
                style={{ borderColor: BORDER }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Lang switcher mobile */}
          <div className="px-5 pb-8">
            <div
              className="mb-3 text-[10px] font-black tracking-[0.3em] uppercase"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Language
            </div>
            <div className="flex gap-2">
              {(["vi", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold tracking-wider uppercase transition-all"
                  style={{
                    border: `1px solid ${lang === l ? ACCENT : BORDER}`,
                    color: lang === l ? "white" : TEXT_MUTED,
                    backgroundColor: lang === l ? `${ACCENT}15` : "transparent",
                  }}
                >
                  <img
                    src={LANGS[l].flag}
                    alt={LANGS[l].long}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  {LANGS[l].long}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
