"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Star,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";

/* ─── SVG social icons (lucide deprecated theirs) ─── */
const IgIcon = ({ size = 18 }: { size?: number }) => (
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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const FbIcon = ({ size = 18 }: { size?: number }) => (
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
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const YtIcon = ({ size = 18 }: { size?: number }) => (
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
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon
      points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

/* ─── TOKENS ─── */
const C = {
  bg: "#0A0A0A",
  bg2: "#111111",
  bg3: "#161616",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

/* ─── UNSPLASH helper ─── */
const UNS = (id: string, w = 1920, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

/* ─── no-jump href ─── */
const VOID = "javascript:void(0)";

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const SLIDES = [
  {
    eyebrow: "BỘ SƯU TẬP SS25",
    headline: ["VƯỢT QUA", "MỌI", "GIỚI HẠN"],
    accent: "GIỚI HẠN",
    sub: "Bộ sưu tập PULSEGEAR SS25 đã ra mắt. Được tạo ra cho những người không bao giờ dừng lại.",
    cta1: { label: "MUA ĐỒ NAM", href: VOID },
    cta2: { label: "MUA ĐỒ NỮ", href: VOID },
    glow: "#FF3C00",
    tag: "MỚI VỀ",
    bg: UNS("1534438327276-14e5300c3a48"),
  },
  {
    eyebrow: "SEAMLESS PRO V2",
    headline: ["LIỀN MẠCH", "KHÔNG", "BÓ BUỘC"],
    accent: "BÓ BUỘC",
    sub: "Công nghệ liền mạch tiên tiến nhất. Co giãn 4 chiều. Không hạn chế. Hiệu suất tuyệt đối.",
    cta1: { label: "XEM NGAY", href: VOID },
    cta2: { label: "XEM LOOKBOOK", href: VOID },
    glow: "#00C8FF",
    tag: "BÁN CHẠY NHẤT",
    bg: UNS("1571019614242-c5c5dee9f50b"),
  },
  {
    eyebrow: "BỘ SƯU TẬP PHỤ NỮ",
    headline: ["SINH RA", "ĐỂ", "THI ĐẤU"],
    accent: "THI ĐẤU",
    sub: "Thiết kế cho cơ thể phụ nữ. Từng đường may, từng mũi chỉ đều vì hiệu suất tối đa.",
    cta1: { label: "MUA ĐỒ NỮ", href: VOID },
    cta2: { label: "KHÁM PHÁ", href: VOID },
    glow: "#A855F7",
    tag: "XU HƯỚNG",
    bg: UNS("1518611012118-696072aa579a"),
  },
];

const CATEGORIES = [
  {
    id: 1,
    label: "ĐỒ NAM",
    sub: "Tập luyện & Phong cách",
    count: "120+ sản phẩm",
    accentColor: "#FF3C00",
    tag: "MỚI VỀ",
    img: UNS("1583454110551-21f2fa2afe61", 900),
  },
  {
    id: 2,
    label: "ĐỒ NỮ",
    sub: "Hiệu suất & Thoải mái",
    count: "140+ sản phẩm",
    accentColor: "#A855F7",
    tag: "XU HƯỚNG",
    img: UNS("1571019614242-c5c5dee9f50b", 900),
  },
  {
    id: 3,
    label: "LIỀN MẠCH",
    // sub: "Dòng đặc trưng thương hiệu",
    count: "60+ sản phẩm",
    accentColor: "#00C8FF",
    tag: "BÁN CHẠY",
    img: UNS("1548690312-e3b507d8c110", 900),
  },
  {
    id: 4,
    label: "ÁO KHOÁC",
    // sub: "Jacket & Lớp mặc ngoài",
    count: "40+ sản phẩm",
    accentColor: "#F59E0B",
    tag: "MỚI",
    img: UNS("1539109136881-3be0616acf4b", 900),
  },
  {
    id: 5,
    label: "PHỤ KIỆN",
    // sub: "Túi, Mũ & Nhiều hơn",
    count: "80+ sản phẩm",
    accentColor: "#22C55E",
    tag: null,
    img: UNS("1552674605-db6ffd4facb5", 900),
  },
  {
    id: 6,
    label: "GIẢM GIÁ",
    // sub: "Đến 50% cho tất cả",
    count: "200+ sản phẩm",
    accentColor: "#FF3C00",
    tag: "ĐẾN -50%",
    img: UNS("1571019613454-1cb2f99b2d8b", 900),
  },
];

const DROPS = [
  {
    id: 1,
    badge: "VỪA RA MẮT",
    title: "APEX PRO SERIES",
    sub: "Trang phục tập luyện hiệu suất cao dành cho vận động viên đỉnh cao.",
    tag: "Nam & Nữ",
    glow: "#FF3C00",
    img: UNS("1576678927484-cc907957088c", 900),
  },
  {
    id: 2,
    badge: "MÙA MỚI",
    title: "SEAMLESS V2",
    sub: "Cảm giác như làn da thứ hai với công nghệ co giãn 4 chiều.",
    tag: "Bộ sưu tập Nữ",
    glow: "#A855F7",
    img: UNS("1552674605-db6ffd4facb5", 900),
  },
  {
    id: 3,
    badge: "BÁN CHẠY NHẤT",
    title: "VITAL SEAMLESS",
    sub: "Bộ sưu tập đã tạo nên tên tuổi chúng tôi. Phiên bản tái sinh.",
    tag: "Dòng đặc trưng",
    glow: "#00C8FF",
    img: UNS("1579758629938-03607ccdbaba", 900),
  },
];

const FEATURES = [
  {
    icon: <Zap size={22} />,
    num: "01",
    title: "KỸ THUẬT CAO",
    desc: "Co giãn 4 chiều, thoát ẩm và công nghệ chống mùi trong từng sản phẩm. Được tạo ra để di chuyển cùng cơ thể bạn.",
  },
  {
    icon: <Star size={22} />,
    num: "02",
    title: "CHẤT LƯỢNG CAO CẤP",
    desc: "Đường may gia cố, màu vải bền màu, chịu được hàng nghìn lần giặt. Chúng tôi đứng sau từng mũi chỉ.",
  },
  {
    icon: <Shield size={22} />,
    num: "03",
    title: "ĐA DẠNG KÍCH CỠ",
    desc: "Từ XS đến 4XL, thiết kế từ dữ liệu cơ thể thực của vận động viên. Vì trang phục hiệu suất phải vừa với tất cả.",
  },
  {
    icon: <RotateCcw size={22} />,
    num: "04",
    title: "TƯƠNG LAI BỀN VỮNG",
    desc: "100% bao bì tái chế. Nguồn gốc có trách nhiệm. Chúng tôi xây dựng thương hiệu tồn tại lâu dài — cả với hành tinh.",
  },
];

const STATS = [
  { value: "2.5M+", label: "Thành viên toàn cầu" },
  { value: "98%", label: "Tỷ lệ hài lòng" },
  { value: "6+", label: "Năm đổi mới" },
  { value: "45+", label: "Quốc gia giao hàng" },
];

const REVIEWS = [
  {
    name: "Minh Anh",
    handle: "@minhanh.fit",
    text: "Bộ APEX thực sự là trang phục tập luyện tốt nhất tôi từng có. Vải như làn da thứ hai, thoải mái cả buổi tập dài.",
    stars: 5,
    product: "APEX Pro Shorts",
  },
  {
    name: "Tuấn Kiệt",
    handle: "@kiettrain",
    text: "Cuối cùng cũng có thương hiệu hiểu vận động viên thực sự cần gì. Từng chi tiết đều hoàn hảo, không có gì để chê.",
    stars: 5,
    product: "Vital Seamless Tee",
  },
  {
    name: "Thu Hà",
    handle: "@thuha.lifts",
    text: "Tôi đã mặc Pulsegear qua 3 cuộc thi rồi. Chưa bao giờ thất vọng. Mua cho cả team rồi ai cũng mê.",
    stars: 5,
    product: "Seamless V2 Leggings",
  },
];

/* ═══════════════════════════════════════════
   NOISE OVERLAY
═══════════════════════════════════════════ */
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
   PAGE
═══════════════════════════════════════════ */
export default function Page() {
  /* ── HERO SLIDE (fixed with ref) ── */
  const [heroIdx, setHeroIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const busyRef = useRef(false);
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = SLIDES[heroIdx];

  const changeSlide = (next: number) => {
    if (busyRef.current) return;
    busyRef.current = true;
    idxRef.current = next;
    setHeroIdx(next);
    setAnimKey((k) => k + 1);
    setTimeout(() => {
      busyRef.current = false;
    }, 600);
  };

  const startInterval = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (idxRef.current + 1) % SLIDES.length;
      changeSlide(next);
    }, 6000);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goHero = (i: number) => {
    if (i === idxRef.current) return;
    changeSlide(i);
    startInterval();
  };

  return (
    <div style={{ backgroundColor: C.bg, color: "#fff" }}>
      <style>{`
        @keyframes heroIn {
          0%   { opacity:0; transform:translateY(28px) }
          100% { opacity:1; transform:translateY(0)    }
        }
        @keyframes heroBgIn {
          0%   { opacity:0; transform:scale(1.06) }
          100% { opacity:1; transform:scale(1)    }
        }
        @keyframes marquee {
          from { transform:translateX(0)    }
          to   { transform:translateX(-50%) }
        }
        .hero-anim   { animation: heroIn   .55s cubic-bezier(.22,.68,0,1.2) forwards }
        .hero-d1     { animation-delay:.05s }
        .hero-d2     { animation-delay:.12s }
        .hero-d3     { animation-delay:.20s }
        .hero-d4     { animation-delay:.30s }
        .hero-bg-anim{ animation: heroBgIn .7s ease forwards }
        .marquee-run { animation: marquee 30s linear infinite; width:max-content }
      `}</style>

      {/* ════════ SECTION 1 — HERO ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        <div
          key={`bg-${heroIdx}`}
          className="hero-bg-anim absolute inset-0"
          style={{
            backgroundImage: `url(${slide.bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background: `linear-gradient(to right, rgba(0,0,0,.88) 0%, rgba(0,0,0,.55) 50%, rgba(0,0,0,.30) 100%),
                         radial-gradient(ellipse 60% 80% at 75% 50%, ${slide.glow}18, transparent 70%)`,
          }}
        />
        <Noise op={0.04} />

        <div
          className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[10px] font-black tracking-[0.5em] uppercase lg:block"
          style={{ color: "rgba(255,255,255,0.1)" }}
        >
          PULSEGEAR · CLUB · SS25
        </div>

        <div
          key={`content-${animKey}`}
          className="relative mx-auto flex min-h-[100svh] max-w-screen-2xl flex-col justify-center px-8 pb-36 pt-28 md:px-16 lg:px-24"
        >
          <div
            className="hero-anim mb-8 inline-flex w-fit items-center gap-2 px-3 py-1.5 text-[10px] font-black tracking-[0.4em] uppercase opacity-0"
            style={{
              backgroundColor: `${slide.glow}22`,
              border: `1px solid ${slide.glow}45`,
              color: slide.glow,
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ backgroundColor: slide.glow }}
            />
            {slide.tag}
          </div>

          <p
            className="hero-anim hero-d1 mb-3 text-[11px] font-black tracking-[0.45em] uppercase opacity-0"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {slide.eyebrow}
          </p>

          <h1 className="hero-anim hero-d2 max-w-4xl opacity-0 text-[clamp(2.8rem,7.5vw,7rem)] font-black leading-[1.1] tracking-[-0.02em]">
            {slide.headline.map((word, i) =>
              word === slide.accent ? (
                <span
                  key={i}
                  className="block"
                  style={{
                    color: slide.glow,
                    textShadow: `0 0 80px ${slide.glow}35`,
                  }}
                >
                  {word}
                </span>
              ) : (
                <span key={i} className="block text-white">
                  {word}
                </span>
              ),
            )}
          </h1>

          <div
            className="hero-anim hero-d3 my-7 h-[2px] w-14 opacity-0"
            style={{ backgroundColor: slide.glow }}
          />

          <p
            className="hero-anim hero-d3 max-w-md text-[15px] leading-relaxed opacity-0"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {slide.sub}
          </p>

          <div className="hero-anim hero-d4 mt-9 flex flex-wrap gap-4 opacity-0">
            <a href={slide.cta1.href}>
              <button
                className="group relative overflow-hidden px-9 py-4 text-[12px] font-black tracking-[0.25em] uppercase text-black transition-transform hover:scale-[1.03] active:scale-[0.97]"
                style={{ backgroundColor: slide.glow }}
              >
                <span className="relative z-10">{slide.cta1.label}</span>
                <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            </a>
            <a href={slide.cta2.href}>
              <button
                className="px-9 py-4 text-[12px] font-black tracking-[0.25em] uppercase text-white/55 transition-all hover:text-white"
                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
              >
                {slide.cta2.label}
              </button>
            </a>
          </div>
        </div>

        {/* BOTTOM CONTROL BAR */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 pb-8 md:px-16">
          <span
            className="text-[11px] font-bold tracking-[0.25em]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            <span className="text-white/70">
              {String(heroIdx + 1).padStart(2, "0")}
            </span>
            &nbsp;/&nbsp;
            {String(SLIDES.length).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goHero(i)}
                className="block h-[2px] transition-all duration-500"
                style={{
                  width: i === heroIdx ? "36px" : "10px",
                  backgroundColor:
                    i === heroIdx ? slide.glow : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {[
              { dir: -1, Icon: ChevronLeft },
              { dir: 1, Icon: ChevronRight },
            ].map(({ dir, Icon }) => (
              <button
                key={dir}
                onClick={() =>
                  goHero((heroIdx + dir + SLIDES.length) % SLIDES.length)
                }
                className="flex h-10 w-10 items-center justify-center text-white/60 transition-colors hover:text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
          <span
            className="text-[9px] font-black tracking-[0.4em] uppercase"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            CUỘN XUỐNG
          </span>
          <div
            className="h-8 w-px"
            style={{
              background:
                "linear-gradient(to bottom,rgba(255,255,255,.3),transparent)",
            }}
          />
        </div>
      </section>

      {/* ════════ SECTION 2 — MARQUEE ════════ */}
      <div
        className="w-full overflow-hidden py-3.5"
        style={{ backgroundColor: C.accent }}
      >
        <div className="marquee-run flex gap-16">
          {Array.from({ length: 2 }, (_, rep) =>
            [
              "MIỄN PHÍ VẬN CHUYỂN ĐƠN TRÊN 2 TRIỆU",
              "★ PULSEGEAR.CLUB ★",
              "HÀNG MỚI VỀ MỖI TUẦN",
              "★ PULSEGEAR.CLUB ★",
              "ĐỔI TRẢ MIỄN PHÍ 30 NGÀY",
              "★ PULSEGEAR.CLUB ★",
              "THIẾT KẾ CHO HIỆU SUẤT ĐỈNH CAO",
              "★ PULSEGEAR.CLUB ★",
            ].map((item, i) => (
              <span
                key={`${rep}-${i}`}
                className="whitespace-nowrap text-[11px] font-black tracking-[0.3em] uppercase text-black"
              >
                {item}
              </span>
            )),
          )}
        </div>
      </div>

      {/* ════════ SECTION 3 — CATEGORY GRID ════════ */}
      <section className="w-full" style={{ backgroundColor: C.bg }}>
        <div className="mx-auto max-w-screen-2xl px-4 py-16 md:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p
                className="mb-2 text-[10px] font-black tracking-[0.4em] uppercase"
                style={{ color: C.accent }}
              >
                CÁC BỘ SƯU TẬP
              </p>
              <h2 className="text-3xl font-black tracking-[-0.02em] text-white md:text-4xl">
                MUA THEO DANH MỤC
              </h2>
            </div>
            <a
              href={VOID}
              className="hidden items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase transition-colors hover:text-white md:flex"
              style={{ color: C.muted }}
            >
              XEM TẤT CẢ <ArrowRight size={13} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat, i) => {
              const isWide = i === 0 || i === 1;
              return (
                <a
                  key={cat.id}
                  href={VOID}
                  className={`group relative overflow-hidden ${isWide ? "col-span-2 lg:col-span-2 lg:row-span-2" : "col-span-1 lg:col-span-2"}`}
                  style={{
                    minHeight: isWide ? "440px" : "210px",
                    display: "block",
                  }}
                >
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top,rgba(0,0,0,.90) 0%,rgba(0,0,0,.25) 55%,rgba(0,0,0,.1) 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(ellipse at 50% 100%,${cat.accentColor}25,transparent 65%)`,
                    }}
                  />
                  <div
                    className="absolute left-0 top-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full"
                    style={{ backgroundColor: cat.accentColor }}
                  />
                  {cat.tag && (
                    <div
                      className="absolute right-3 top-3 px-2 py-1 text-[9px] font-black tracking-[0.25em] uppercase"
                      style={{
                        backgroundColor: cat.accentColor,
                        color: "#000",
                      }}
                    >
                      {cat.tag}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p
                      className="mb-0.5 text-[9px] font-semibold tracking-[0.2em] uppercase"
                      style={{ color: `${cat.accentColor}cc` }}
                    >
                      {cat.sub}
                    </p>
                    <h3
                      className={`font-black tracking-tight text-white ${isWide ? "text-3xl" : "text-xl"}`}
                    >
                      {cat.label}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className="text-[11px]"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {cat.count}
                      </span>
                      <span
                        className="flex items-center gap-1 text-[11px] font-black tracking-[0.15em] uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ color: cat.accentColor }}
                      >
                        MUA NGAY <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 4 — BRAND MANIFESTO ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: C.bg2 }}
      >
        <Noise op={0.025} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 55% 80% at 80% 50%,${C.accent}12,transparent 65%)`,
          }}
        />
        <div className="relative mx-auto max-w-screen-2xl px-8 py-24 md:px-16 lg:px-24">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p
                className="mb-4 text-[10px] font-black tracking-[0.45em] uppercase"
                style={{ color: C.accent }}
              >
                CÂU CHUYỆN CỦA CHÚNG TÔI
              </p>
              <h2 className="flex flex-col gap-3 text-5xl font-black tracking-[-0.025em] text-white md:text-6xl lg:text-7xl">
                <span>CHÚNG TÔI</span>
                <span
                  style={{
                    color: C.accent,
                    textShadow: `0 0 60px ${C.accent}30`,
                  }}
                >
                  TẠO RA
                </span>
                <span>KHÁC BIỆT.</span>
              </h2>
              <div
                className="my-8 h-[1px] w-14"
                style={{ backgroundColor: C.accent }}
              />
              <p
                className="mb-5 max-w-md text-[15px] leading-[1.75]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Thành lập bởi các vận động viên, dành cho các vận động viên.
                Chúng tôi bắt đầu PULSEGEAR.CLUB vì không thể tìm được trang
                phục theo kịp với mình.
              </p>
              <p
                className="max-w-md text-[15px] leading-[1.75]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Mỗi sản phẩm được thiết kế với một ám ảnh duy nhất: hiệu suất.
                Từ phòng lab đến sàn tập, từ ý tưởng đến tủ quần áo của bạn —
                chúng tôi không bao giờ chấp nhận mức trung bình.
              </p>
              <a
                href={VOID}
                className="group mt-10 inline-flex items-center gap-3 text-[12px] font-black tracking-[0.25em] uppercase text-white"
              >
                ĐỌC CÂU CHUYỆN{" "}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                  style={{ color: C.accent }}
                />
              </a>
            </div>

            <div className="relative">
              <div
                className="relative overflow-hidden"
                style={{ border: `1px solid ${C.border}` }}
              >
                <img
                  src={UNS("1517836357463-d25dfeac3438", 1200)}
                  alt="PULSEGEAR Vận động viên"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top,rgba(10,10,10,0.7) 0%,transparent 60%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p
                    className="text-[10px] font-black tracking-[0.35em] uppercase"
                    style={{ color: C.accent }}
                  >
                    ĐƯỢC THIẾT KẾ VÌ HIỆU SUẤT
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-white">
                    TẬP LUYỆN NHƯ PRO
                  </h3>
                </div>
              </div>

              {[
                { val: "2.5M+", label: "Vận động viên", pos: "-left-6 top-6" },
                {
                  val: "98%",
                  label: "Khách hài lòng",
                  pos: "-right-6 bottom-14",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`absolute ${s.pos} px-4 py-3`}
                  style={{
                    backgroundColor: C.bg,
                    border: `1px solid ${C.border}`,
                    boxShadow: "0 0 40px rgba(0,0,0,0.8)",
                  }}
                >
                  <div
                    className="text-2xl font-black"
                    style={{ color: C.accent }}
                  >
                    {s.val}
                  </div>
                  <div
                    className="text-[10px] font-semibold tracking-wider uppercase"
                    style={{ color: C.muted }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}

              <div
                className="absolute -right-2 -top-2 h-14 w-14 opacity-60"
                style={{
                  background: `linear-gradient(135deg,${C.accent} 50%,transparent 50%)`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 5 — NEW DROPS ════════ */}
      <section className="relative w-full" style={{ backgroundColor: C.bg }}>
        <Noise op={0.03} />
        <div className="relative mx-auto max-w-screen-2xl px-4 py-20 md:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p
                className="mb-2 text-[10px] font-black tracking-[0.4em] uppercase"
                style={{ color: C.accent }}
              >
                HÀNG MỚI VỀ
              </p>
              <h2 className="text-3xl font-black tracking-[-0.02em] text-white md:text-4xl">
                SẢN PHẨM <span style={{ color: C.accent }}>MỚI NHẤT</span>
              </h2>
            </div>
            <a
              href={VOID}
              className="hidden items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase transition-colors hover:text-white md:flex"
              style={{ color: C.muted }}
            >
              XEM TẤT CẢ <ArrowRight size={13} />
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {DROPS.map((drop, i) => (
              <a
                key={drop.id}
                href={VOID}
                className="group relative block overflow-hidden"
                style={{ border: `1px solid ${C.border}` }}
              >
                <div className="relative w-full overflow-hidden aspect-[16/9]">
                  <img
                    src={drop.img}
                    alt={drop.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 55%)",
                    }}
                  />
                  {/* <div
                    className="absolute left-4 top-4 px-2 py-1 text-[9px] font-black tracking-[0.3em] uppercase"
                    style={{
                      backgroundColor: `${drop.glow}28`,
                      color: drop.glow,
                      border: `1px solid ${drop.glow}45`,
                    }}
                  >
                    {drop.badge}
                  </div> */}
                </div>
                <div
                  className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: drop.glow }}
                />
                <div
                  className="relative p-6"
                  style={{ backgroundColor: C.bg3 }}
                >
                  <p
                    className="mb-1 text-[10px] font-semibold tracking-[0.2em] uppercase"
                    style={{ color: `${drop.glow}99` }}
                  >
                    {drop.tag}
                  </p>
                  <h3
                    className={`font-black leading-tight tracking-[-0.02em] text-white ${i === 0 ? "text-2xl" : "text-xl"}`}
                  >
                    {drop.title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: C.muted }}
                  >
                    {drop.sub}
                  </p>
                  <div
                    className="mt-5 flex items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase transition-all group-hover:gap-3"
                    style={{ color: drop.glow }}
                  >
                    MUA NGAY <ArrowRight size={12} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 6 — FEATURES ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: C.bg2 }}
      >
        <Noise op={0.025} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg,rgba(255,60,0,.8) 0 1px,transparent 1px 70px)",
          }}
        />
        <div className="relative mx-auto max-w-screen-2xl px-8 py-24 md:px-16">
          <div className="mb-14 text-center">
            <p
              className="mb-3 text-[10px] font-black tracking-[0.45em] uppercase"
              style={{ color: C.accent }}
            >
              ĐIỀU LÀM PULSEGEAR KHÁC BIỆT
            </p>
            <h2 className="text-4xl font-black tracking-[-0.025em] text-white md:text-5xl">
              ĐƯỢC TẠO RA ĐỂ{" "}
              <span style={{ color: C.accent }}>CHIẾN THẮNG</span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.num}
                className="group relative overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1"
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
                  className="mb-4 text-6xl font-black leading-none"
                  style={{ color: C.accent, opacity: 0.1 }}
                >
                  {f.num}
                </div>
                <div
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center"
                  style={{
                    backgroundColor: `${C.accent}15`,
                    border: `1px solid ${C.accent}30`,
                    color: C.accent,
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="mb-3 text-sm font-black tracking-[0.08em] text-white">
                  {f.title}
                </h3>
                <div
                  className="mb-4 h-[1px] w-8 transition-all duration-300 group-hover:w-14"
                  style={{ backgroundColor: C.accent }}
                />
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: C.muted }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 7 — STATS ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#0F0500 0%,#1C0800 40%,#0A0A0A 100%)",
        }}
      >
        <Noise op={0.025} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%,${C.accent}18,transparent 70%)`,
          }}
        />
        <div className="relative mx-auto max-w-screen-xl px-8 py-16 md:px-16">
          <div
            className="mb-14 h-[1px] w-full"
            style={{
              background: `linear-gradient(90deg,transparent,${C.accent},transparent)`,
            }}
          />
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span
                  className="text-5xl font-black tracking-tight text-white md:text-6xl"
                  style={{ textShadow: `0 0 40px ${C.accent}30` }}
                >
                  {s.value}
                </span>
                <span
                  className="text-[11px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: C.muted }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div
            className="mt-14 h-[1px] w-full"
            style={{
              background: `linear-gradient(90deg,transparent,${C.accent},transparent)`,
            }}
          />
        </div>
      </section>

      {/* ════════ SECTION 8 — SERVICES STRIP ════════ */}
      <section
        className="w-full border-y"
        style={{ backgroundColor: C.bg3, borderColor: C.border }}
      >
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x"
            style={{ "--tw-divide-opacity": "1" } as React.CSSProperties}
          >
            {[
              {
                icon: <Truck size={20} />,
                title: "MIỄN PHÍ VẬN CHUYỂN",
                sub: "Đơn hàng trên 2 triệu toàn quốc",
              },
              {
                icon: <RotateCcw size={20} />,
                title: "ĐỔI TRẢ 30 NGÀY",
                sub: "Đổi trả dễ dàng, không cần lý do",
              },
              {
                icon: <Shield size={20} />,
                title: "CAM KẾT CHẤT LƯỢNG",
                sub: "Bền bỉ hoặc hoàn tiền 100%",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-6 sm:justify-center"
                style={{ borderColor: C.border }}
              >
                <div style={{ color: C.accent }}>{item.icon}</div>
                <div>
                  <p className="text-[11px] font-black tracking-[0.2em] text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[12px]" style={{ color: C.muted }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 9 — REVIEWS ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: C.bg }}
      >
        <Noise op={0.03} />
        <div className="relative mx-auto max-w-screen-2xl px-8 py-24 md:px-16">
          <div className="mb-12 text-center">
            <p
              className="mb-3 text-[10px] font-black tracking-[0.45em] uppercase"
              style={{ color: C.accent }}
            >
              CỘNG ĐỒNG YÊU THÍCH
            </p>
            <h2 className="text-3xl font-black tracking-[-0.02em] text-white md:text-4xl">
              VẬN ĐỘNG VIÊN THẬT.{" "}
              <span style={{ color: C.accent }}>KẾT QUẢ THẬT.</span>
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="group relative overflow-hidden p-7 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: C.bg3,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: C.accent }}
                />
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      style={{ color: C.accent }}
                      fill={C.accent}
                    />
                  ))}
                </div>
                <p
                  className="mb-3 text-5xl font-black leading-none"
                  style={{ color: `${C.accent}20` }}
                >
                  "
                </p>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {r.text}
                </p>
                <div
                  className="my-5 h-[1px] w-full"
                  style={{ backgroundColor: C.border }}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-black text-white">
                      {r.name}
                    </p>
                    <p className="text-[11px]" style={{ color: C.muted }}>
                      {r.handle}
                    </p>
                  </div>
                  <span
                    className="px-2 py-1 text-[9px] font-black tracking-wider uppercase"
                    style={{
                      backgroundColor: `${C.accent}15`,
                      color: C.accent,
                      border: `1px solid ${C.accent}25`,
                    }}
                  >
                    {r.product}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 10 — COMMUNITY GRID ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: C.bg2 }}
      >
        <Noise op={0.025} />
        <div className="relative mx-auto max-w-screen-2xl px-8 py-20 md:px-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p
                className="mb-2 text-[10px] font-black tracking-[0.45em] uppercase"
                style={{ color: C.accent }}
              >
                #PULSEGEARCLUB
              </p>
              <h2 className="text-3xl font-black tracking-[-0.02em] text-white md:text-4xl">
                THAM GIA <span style={{ color: C.accent }}>PHONG TRÀO</span>
              </h2>
            </div>
            <a
              href={VOID}
              className="hidden items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase transition-colors hover:text-white md:flex"
              style={{ color: C.muted }}
            >
              THEO DÕI <IgIcon size={13} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {[
              {
                img: UNS("1571019614242-c5c5dee9f50b", 600),
                glow: C.accent,
                label: "TẬP LUYỆN",
              },
              {
                img: UNS("1548690312-e3b507d8c110", 600),
                glow: "#A855F7",
                label: "LIỀN MẠCH",
              },
              {
                img: UNS("1552674605-db6ffd4facb5", 600),
                glow: "#00C8FF",
                label: "CHẠY BỘ",
              },
              {
                img: UNS("1539109136881-3be0616acf4b", 600),
                glow: "#F59E0B",
                label: "ÁO KHOÁC",
              },
              {
                img: UNS("1583454110551-21f2fa2afe61", 600),
                glow: "#22C55E",
                label: "GỬ TẠ",
              },
              {
                img: UNS("1576678927484-cc907957088c", 600),
                glow: C.accent,
                label: "PHỤC HỒI",
              },
            ].map((tile, i) => (
              <div
                key={i}
                className="group relative aspect-square cursor-pointer overflow-hidden"
              >
                <img
                  src={tile.img}
                  alt={tile.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/20" />
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 50%,${tile.glow}35,transparent 65%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span
                    className="text-[9px] font-black tracking-[0.35em] uppercase"
                    style={{ color: tile.glow }}
                  >
                    {tile.label}
                  </span>
                </div>
                <div
                  className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  <IgIcon size={13} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { icon: <IgIcon size={17} />, label: "@pulsegear.club" },
              { icon: <FbIcon size={17} />, label: "PULSEGEAR" },
              { icon: <YtIcon size={17} />, label: "PULSEGEAR TV" },
            ].map((s, i) => (
              <a
                key={i}
                href={VOID}
                className="flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors hover:text-white"
                style={{ color: C.muted }}
              >
                <span style={{ color: C.accent }}>{s.icon}</span>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 11 — NEWSLETTER ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: C.bg }}
      >
        <Noise op={0.03} />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[900px] -translate-x-1/2 blur-[110px]"
          style={{ backgroundColor: `${C.accent}18` }}
        />
        <div className="relative mx-auto max-w-2xl px-8 py-28 text-center md:px-16">
          <div
            className="mb-4 inline-flex items-center gap-2 text-[10px] font-black tracking-[0.45em] uppercase"
            style={{ color: C.accent }}
          >
            <Zap size={12} fill={C.accent} />
            ƯU ĐÃI THÀNH VIÊN ĐỘC QUYỀN
          </div>
          <h2 className="mb-4 text-5xl font-black leading-tight tracking-[-0.025em] text-white md:text-6xl">
            GIẢM <span style={{ color: C.accent }}>15%</span>
            <br />
            ĐƠN HÀNG ĐẦU TIÊN
          </h2>
          <p
            className="mb-10 text-base leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Tham gia cùng 2.5 triệu vận động viên. Nhận quyền truy cập sớm vào
            sản phẩm mới, ưu đãi độc quyền và nội dung tập luyện từ chuyên gia.
          </p>
          <div
            className="flex overflow-hidden"
            style={{ border: `1px solid ${C.border}` }}
          >
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              className="flex-1 bg-transparent px-5 py-4 text-sm text-white placeholder-white/20 outline-none"
            />
            <button
              type="button"
              className="group relative overflow-hidden px-7 py-4 text-[11px] font-black tracking-[0.2em] uppercase text-black"
              style={{ backgroundColor: C.accent }}
            >
              <span className="relative z-10">THAM GIA</span>
              <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          </div>
          <p
            className="mt-4 text-[11px]"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            Bằng cách tham gia, bạn đồng ý nhận email marketing. Hủy đăng ký bất
            cứ lúc nào.
          </p>
        </div>
      </section>
    </div>
  );
}
