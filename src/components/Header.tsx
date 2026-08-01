"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, Menu, User, ShoppingBag } from "lucide-react";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import { useCartStore, cartCount } from "@/lib/cart/store";
import { useFlyStore } from "@/lib/cart/flyStore";
import { getAllCategories } from "@/lib/categories";

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
type NavItem = { vi: string; en: string; href: string };

// Fallback nav categories — shown until categories load from the DB.
const FALLBACK_CATEGORY_NAV_ITEMS: NavItem[] = [
  { vi: "Đồ Nam", en: "Men", href: "/do-nam" },
  { vi: "Đồ Nữ", en: "Women", href: "/do-nu" },
  { vi: "Liền Mạch", en: "Seamless", href: "/lien-mach" },
  { vi: "Áo Khoác", en: "Jackets", href: "/ao-khoac" },
  { vi: "Quần Short", en: "Shorts", href: "/quan-short" },
  { vi: "Phụ Kiện", en: "Accessories", href: "/phu-kien" },
  { vi: "Giảm Giá", en: "Sale", href: "/giam-gia" },
];

// Not a product category — always a static nav link, appended after the categories.
const NEWS_NAV_ITEM: NavItem = { vi: "Tin Tức", en: "News", href: "/tin-tuc" };

/* =========================================================
   COPY
   ========================================================= */
const TXT = {
  aboutUs: { vi: "Về Chúng Tôi", en: "About Us" },
  contact: { vi: "Liên Hệ", en: "Contact" },
  searchPlaceholder: { vi: "Tìm kiếm...", en: "Search gear..." },
  searchPlaceholderShort: { vi: "Tìm kiếm...", en: "Search..." },
  close: { vi: "Đóng", en: "Close" },
  home: { vi: "Trang Chủ", en: "Home" },
  language: { vi: "Ngôn Ngữ", en: "Language" },
};

/* =========================================================
   LANGS
   ========================================================= */
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

  const lang = useI18nStore((s) => s.lang);
  const setLang = useI18nStore((s) => s.setLang);
  const cartItems = useCartStore((s) => s.items);
  const cartQty = cartCount(cartItems);
  const cartBump = useFlyStore((s) => s.bump);
  const [isLangOpen, setLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const langBtnRef = useRef<HTMLButtonElement | null>(null);

  const [categoryNavItems, setCategoryNavItems] = useState<NavItem[]>(FALLBACK_CATEGORY_NAV_ITEMS);
  const NAV_ITEMS: NavItem[] = [...categoryNavItems, NEWS_NAV_ITEM];

  useEffect(() => {
    getAllCategories().then((data) => {
      if (data.length > 0) {
        setCategoryNavItems(data.map((c) => ({ vi: c.label.vi, en: c.label.en, href: c.href })));
      }
    });
  }, []);

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
    <header className="w-full" style={{ backgroundColor: BG_HEADER }}>
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
              <Link
                href="/gioi-thieu"
                className="transition-colors hover:text-white"
              >
                {TXT.aboutUs[lang]}
              </Link>
              <Link
                href="/lien-he"
                className="transition-colors hover:text-white"
              >
                {TXT.contact[lang]}
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
                    className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden py-1 shadow-2xl"
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
          <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img src="/logo.png" alt="Pulsegear.Club" className="h-20 w-20 object-contain" />
              <div className="leading-tight">
                <div className="text-lg font-black tracking-[0.08em] text-white">
                  PULSEGEAR
                </div>
                <div
                  className="text-xs font-bold tracking-[0.3em] uppercase"
                  style={{ color: ACCENT }}
                >
                  .CLUB
                </div>
              </div>
            </Link>

            {/* Search */}
            <form
              action="/search"
              method="get"
              className="ml-auto flex w-full max-w-md items-center"
            >
              <div
                className="flex h-10 w-full items-stretch overflow-hidden"
                style={{
                  border: `1px solid ${BORDER}`,
                  backgroundColor: "#141414",
                }}
              >
                <input
                  name="q"
                  placeholder={TXT.searchPlaceholder[lang]}
                  className="w-full bg-transparent px-4 text-[13px] text-white placeholder-white/20 outline-none"
                />
                <button
                  type="submit"
                  className="flex w-11 shrink-0 items-center justify-center transition-opacity hover:opacity-80"
                  style={{ backgroundColor: ACCENT }}
                  aria-label="Search"
                >
                  <Search size={15} className="text-black" />
                </button>
              </div>
            </form>

            {/* Account + Cart */}
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/dang-nhap"
                className="flex h-10 w-10 items-center justify-center transition-colors hover:text-white"
                style={{ color: TEXT_MUTED }}
                aria-label="Account"
              >
                <User size={19} />
              </Link>
              <Link
                href="/gio-hang"
                className="relative flex h-10 w-10 items-center justify-center transition-colors hover:text-white"
                style={{ color: TEXT_MUTED }}
                aria-label="Cart"
              >
                <ShoppingBag size={19} />
                <motion.span
                  key={cartBump}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-black"
                  style={{ backgroundColor: ACCENT }}
                >
                  {cartQty}
                </motion.span>
              </Link>
            </div>
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
            style={{
              backgroundColor: BG_HEADER,
              borderColor: BORDER,
              height: isScrolled ? 48 : undefined,
            }}
          >
            <div className="mx-auto h-full max-w-7xl px-6">
              <nav className="relative flex h-full w-full items-center">
                {isScrolled && (
                  <Link
                    href="/"
                    className="mr-8 flex items-center gap-2 shrink-0"
                  >
                    <img src="/logo.png" alt="Pulsegear.Club" className="h-11 w-11 object-contain" />
                    <span className="text-sm font-black tracking-[0.1em] text-white">
                      PULSEGEAR.CLUB
                    </span>
                  </Link>
                )}

                <ul className="flex h-full flex-wrap items-center gap-x-1 gap-y-0 py-2">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.en} className="h-full">
                      <Link
                        href={item.href}
                        className="flex h-full items-center px-3 text-[11px] font-black tracking-[0.18em] uppercase text-white/50 transition-colors hover:text-white"
                      >
                        {item[lang]}
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
              <img src="/logo.png" alt="Pulsegear.Club" className="h-14 w-14 object-contain" />
              <div className="leading-tight">
                <div className="text-sm font-black tracking-[0.08em] text-white">
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

            <div className="flex items-center gap-1">
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
              <Link
                href="/dang-nhap"
                className="flex h-9 w-9 items-center justify-center transition-colors"
                style={{ color: TEXT_MUTED }}
                aria-label="Account"
              >
                <User size={18} />
              </Link>
              <Link
                href="/gio-hang"
                className="relative flex h-9 w-9 items-center justify-center transition-colors"
                style={{ color: TEXT_MUTED }}
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                <motion.span
                  key={cartBump}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-black"
                  style={{ backgroundColor: ACCENT }}
                >
                  {cartQty}
                </motion.span>
              </Link>
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
                <form
                  action="/search"
                  method="get"
                  className="flex items-center px-4 py-3 gap-2"
                >
                  <div
                    className="flex h-10 flex-1 items-stretch overflow-hidden"
                    style={{
                      border: `1px solid ${BORDER}`,
                      backgroundColor: "#141414",
                    }}
                  >
                    <input
                      ref={searchInputRef}
                      name="q"
                      placeholder={TXT.searchPlaceholderShort[lang]}
                      className="w-full bg-transparent px-4 text-sm text-white placeholder-white/20 outline-none"
                    />
                    <button
                      type="submit"
                      className="flex w-10 shrink-0 items-center justify-center"
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
                    {TXT.close[lang]}
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
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Pulsegear.Club" className="h-11 w-11 object-contain" />
            <span className="text-sm font-black tracking-[0.1em] text-white">
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
              {TXT.home[lang]}
            </button>

            <button
              onClick={() => handleRouteChange("/gioi-thieu")}
              className="text-left py-3 text-white/70 transition-colors hover:text-white border-b"
              style={{ borderColor: BORDER }}
            >
              {TXT.aboutUs[lang]}
            </button>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.en}
                onClick={() => handleRouteChange(item.href)}
                className="text-left py-3 text-white/70 transition-colors hover:text-white border-b"
                style={{ borderColor: BORDER }}
              >
                {item[lang]}
              </button>
            ))}

            <button
              onClick={() => handleRouteChange("/lien-he")}
              className="text-left py-3 text-white/70 transition-colors hover:text-white border-b"
              style={{ borderColor: BORDER }}
            >
              {TXT.contact[lang]}
            </button>
          </nav>

          {/* Lang switcher mobile */}
          <div className="px-5 pb-8">
            <div
              className="mb-3 text-[10px] font-black tracking-[0.3em] uppercase"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              {TXT.language[lang]}
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
