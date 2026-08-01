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
} from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";
import { getHomepageDrops, FALLBACK_HOMEPAGE_DROPS, type Drop } from "@/lib/drops";
import { getBanners, type BannerSlide } from "@/lib/banners";
import { getMarqueeItems, type MarqueeItem } from "@/lib/marquee";
import { getHomepageCategories, type Category } from "@/lib/categories";
import { CategoryTile } from "@/components/home/CategoryTile";
import { getStorySection, type StorySection } from "@/lib/story";
import {
  getFeatureCards,
  getFeaturesSection,
  FEATURE_ICONS,
  type FeatureCard,
  type FeaturesSectionData,
} from "@/lib/features";
import { getStats, type Stat } from "@/lib/stats";
import { getServices, SERVICE_ICONS, type Service } from "@/lib/services";
import { getReviews, getReviewsSection, type Review, type ReviewsSectionData } from "@/lib/reviews";
import { getCommunityTiles, type CommunityTile } from "@/lib/community";
import { getSocialConfig, FALLBACK_SOCIAL_CONFIG, type SocialConfig } from "@/lib/socialConfig";

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
const TikTokIcon = ({ size = 18 }: { size?: number }) => (
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

/* ─── TOKENS ─── */
const C = {
  bg: "#0A0A0A",
  bg2: "#111111",
  bg3: "#161616",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

/* ─── no-jump href ─── */
const VOID = "javascript:void(0)";

/* ═══════════════════════════════════════════
   COPY (bilingual UI strings)
═══════════════════════════════════════════ */
const T = {
  marquee: [
    {
      vi: "MIỄN PHÍ VẬN CHUYỂN ĐƠN TRÊN 2 TRIỆU",
      en: "FREE SHIPPING ON ORDERS OVER 2,000,000₫",
    },
    { vi: "HÀNG MỚI VỀ MỖI TUẦN", en: "NEW ARRIVALS EVERY WEEK" },
    { vi: "ĐỔI TRẢ MIỄN PHÍ 30 NGÀY", en: "FREE 30-DAY RETURNS" },
    {
      vi: "THIẾT KẾ CHO HIỆU SUẤT ĐỈNH CAO",
      en: "DESIGNED FOR PEAK PERFORMANCE",
    },
  ],
  scrollDown: { vi: "CUỘN XUỐNG", en: "SCROLL DOWN" },

  collectionsEyebrow: { vi: "CÁC BỘ SƯU TẬP", en: "COLLECTIONS" },
  shopByCategory: { vi: "MUA THEO DANH MỤC", en: "SHOP BY CATEGORY" },
  viewAll: { vi: "XEM TẤT CẢ", en: "VIEW ALL" },
  shopNow: { vi: "MUA NGAY", en: "SHOP NOW" },

  ourStoryEyebrow: { vi: "CÂU CHUYỆN CỦA CHÚNG TÔI", en: "OUR STORY" },
  storyLine1: { vi: "CHÚNG TÔI", en: "WE" },
  storyLine2: { vi: "TẠO RA", en: "MAKE THE" },
  storyLine3: { vi: "KHÁC BIỆT.", en: "DIFFERENCE." },
  storyP1: {
    vi: "Thành lập bởi các vận động viên, dành cho các vận động viên. Chúng tôi bắt đầu PULSEGEAR.CLUB vì không thể tìm được trang phục theo kịp với mình.",
    en: "Founded by athletes, for athletes. We started PULSEGEAR.CLUB because we couldn't find gear that kept up with us.",
  },
  storyP2: {
    vi: "Mỗi sản phẩm được thiết kế với một ám ảnh duy nhất: hiệu suất. Từ phòng lab đến sàn tập, từ ý tưởng đến tủ quần áo của bạn — chúng tôi không bao giờ chấp nhận mức trung bình.",
    en: "Every product is engineered with one obsession: performance. From the lab to the gym floor, from concept to your closet — we never settle for average.",
  },
  readStory: { vi: "ĐỌC CÂU CHUYỆN", en: "READ OUR STORY" },
  engineeredFor: {
    vi: "ĐƯỢC THIẾT KẾ VÌ HIỆU SUẤT",
    en: "ENGINEERED FOR PERFORMANCE",
  },
  trainLikePro: { vi: "TẬP LUYỆN NHƯ PRO", en: "TRAIN LIKE A PRO" },
  statAthletes: { vi: "Vận động viên", en: "Athletes" },
  statHappy: { vi: "Khách hài lòng", en: "Happy Customers" },

  dropsEyebrow: { vi: "BỘ SƯU TẬP", en: "NEW DROPS" },
  dropsTitle1: { vi: "BỘ SƯU TẬP", en: "LATEST" },
  dropsTitle2: { vi: "MỚI NHẤT", en: "DROPS" },

  featuresEyebrow: {
    vi: "ĐIỀU LÀM PULSEGEAR KHÁC BIỆT",
    en: "WHAT MAKES PULSEGEAR DIFFERENT",
  },
  featuresTitle1: { vi: "ĐƯỢC TẠO RA ĐỂ", en: "BUILT TO" },
  featuresTitle2: { vi: "CHIẾN THẮNG", en: "WIN" },

  serviceShippingTitle: { vi: "MIỄN PHÍ VẬN CHUYỂN", en: "FREE SHIPPING" },
  serviceShippingSub: {
    vi: "Đơn hàng trên 2 triệu toàn quốc",
    en: "Orders over 2,000,000₫ nationwide",
  },
  serviceReturnsTitle: { vi: "ĐỔI TRẢ 30 NGÀY", en: "30-DAY RETURNS" },
  serviceReturnsSub: {
    vi: "Đổi trả dễ dàng, không cần lý do",
    en: "Easy returns, no questions asked",
  },
  serviceQualityTitle: { vi: "CAM KẾT CHẤT LƯỢNG", en: "QUALITY GUARANTEE" },
  serviceQualitySub: {
    vi: "Bền bỉ hoặc hoàn tiền 100%",
    en: "Built to last or your money back",
  },

  reviewsEyebrow: { vi: "CỘNG ĐỒNG YÊU THÍCH", en: "LOVED BY THE COMMUNITY" },
  reviewsTitle1: { vi: "VẬN ĐỘNG VIÊN THẬT.", en: "REAL ATHLETES." },
  reviewsTitle2: { vi: "KẾT QUẢ THẬT.", en: "REAL RESULTS." },

  communityJoin1: { vi: "THAM GIA", en: "JOIN THE" },
  communityJoin2: { vi: "PHONG TRÀO", en: "MOVEMENT" },
};

// Fallback community tiles — shown until they load from the DB.
const FALLBACK_COMMUNITY_TILES: CommunityTile[] = [
  { id: -1, label: { vi: "TẬP LUYỆN", en: "TRAINING" }, img: "/images/home/hero-2.jpg", glow: "#FF3C00", href: "#" },
  { id: -2, label: { vi: "LIỀN MẠCH", en: "SEAMLESS" }, img: "/images/home/category-seamless.jpg", glow: "#A855F7", href: "#" },
  { id: -3, label: { vi: "CHẠY BỘ", en: "RUNNING" }, img: "/images/home/category-accessories.jpg", glow: "#00C8FF", href: "#" },
  { id: -4, label: { vi: "ÁO KHOÁC", en: "JACKETS" }, img: "/images/home/category-jackets.jpg", glow: "#F59E0B", href: "#" },
  { id: -5, label: { vi: "GỬ TẠ", en: "LIFTING" }, img: "/images/home/category-men.jpg", glow: "#22C55E", href: "#" },
  { id: -6, label: { vi: "PHỤC HỒI", en: "RECOVERY" }, img: "/images/home/drop-apex.jpg", glow: "#FF3C00", href: "#" },
];

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
// Fallback hero slides — shown until banners load from the DB (and if the table is empty).
const FALLBACK_SLIDES: BannerSlide[] = [
  {
    id: -1,
    eyebrow: { vi: "BỘ SƯU TẬP SS25", en: "SS25 COLLECTION" },
    headline: {
      vi: ["VƯỢT QUA", "MỌI", "GIỚI HẠN"],
      en: ["BREAK", "EVERY", "LIMIT"],
    },
    accentIndex: 2,
    sub: {
      vi: "Bộ sưu tập PULSEGEAR SS25 đã ra mắt. Được tạo ra cho những người không bao giờ dừng lại.",
      en: "The PULSEGEAR SS25 collection has landed. Made for those who never stop.",
    },
    cta1: { vi: "MUA ĐỒ NAM", en: "SHOP MEN" },
    cta1Url: "/do-nam",
    cta2: { vi: "MUA ĐỒ NỮ", en: "SHOP WOMEN" },
    cta2Url: "/do-nu",
    glow: "#FF3C00",
    tag: { vi: "MỚI VỀ", en: "NEW IN" },
    bg: "/images/home/hero-1.jpg",
  },
  {
    id: -2,
    eyebrow: { vi: "SEAMLESS PRO V2", en: "SEAMLESS PRO V2" },
    headline: {
      vi: ["LIỀN MẠCH", "KHÔNG", "BÓ BUỘC"],
      en: ["SEAMLESS", "NEVER", "RESTRICTED"],
    },
    accentIndex: 2,
    sub: {
      vi: "Công nghệ liền mạch tiên tiến nhất. Co giãn 4 chiều. Không hạn chế. Hiệu suất tuyệt đối.",
      en: "Our most advanced seamless technology. 4-way stretch. Zero restriction. Absolute performance.",
    },
    cta1: { vi: "XEM NGAY", en: "SHOP NOW" },
    cta1Url: "/san-pham",
    cta2: { vi: "XEM LOOKBOOK", en: "VIEW LOOKBOOK" },
    cta2Url: "/san-pham",
    glow: "#00C8FF",
    tag: { vi: "BÁN CHẠY NHẤT", en: "BEST SELLER" },
    bg: "/images/home/hero-2.jpg",
  },
  {
    id: -3,
    eyebrow: { vi: "BỘ SƯU TẬP PHỤ NỮ", en: "WOMEN'S COLLECTION" },
    headline: {
      vi: ["SINH RA", "ĐỂ", "THI ĐẤU"],
      en: ["BORN", "TO", "COMPETE"],
    },
    accentIndex: 2,
    sub: {
      vi: "Thiết kế cho cơ thể phụ nữ. Từng đường may, từng mũi chỉ đều vì hiệu suất tối đa.",
      en: "Designed for the female body. Every seam, every stitch built for maximum performance.",
    },
    cta1: { vi: "MUA ĐỒ NỮ", en: "SHOP WOMEN" },
    cta1Url: "/do-nu",
    cta2: { vi: "KHÁM PHÁ", en: "EXPLORE" },
    cta2Url: "/san-pham",
    glow: "#A855F7",
    tag: { vi: "XU HƯỚNG", en: "TRENDING" },
    bg: "/images/home/hero-3.jpg",
  },
];

// Fallback marquee items — shown until items load from the DB (and if the table is empty).
const FALLBACK_MARQUEE: MarqueeItem[] = T.marquee.map((text, i) => ({
  id: -(i + 1),
  text,
}));

// Fallback categories — shown until the homepage-flagged categories load from the DB.
const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    label: { vi: "ĐỒ NAM", en: "MEN" },
    sub: { vi: "Tập luyện & Phong cách", en: "Training & Style" },
    count: { vi: "120+ sản phẩm", en: "120+ products" },
    accentColor: "#FF3C00",
    tag: { vi: "MỚI VỀ", en: "NEW IN" },
    img: "/images/home/category-men.jpg",
    href: "/do-nam",
  },
  {
    id: 2,
    label: { vi: "ĐỒ NỮ", en: "WOMEN" },
    sub: { vi: "Hiệu suất & Thoải mái", en: "Performance & Comfort" },
    count: { vi: "140+ sản phẩm", en: "140+ products" },
    accentColor: "#A855F7",
    tag: { vi: "XU HƯỚNG", en: "TRENDING" },
    img: "/images/home/hero-2.jpg",
    href: "/do-nu",
  },
  {
    id: 3,
    label: { vi: "LIỀN MẠCH", en: "SEAMLESS" },
    sub: null,
    count: { vi: "60+ sản phẩm", en: "60+ products" },
    accentColor: "#00C8FF",
    tag: { vi: "BÁN CHẠY", en: "BEST SELLER" },
    img: "/images/home/category-seamless.jpg",
    href: "/lien-mach",
  },
  {
    id: 4,
    label: { vi: "ÁO KHOÁC", en: "JACKETS" },
    sub: null,
    count: { vi: "40+ sản phẩm", en: "40+ products" },
    accentColor: "#F59E0B",
    tag: { vi: "MỚI", en: "NEW" },
    img: "/images/home/category-jackets.jpg",
    href: "/ao-khoac",
  },
  {
    id: 5,
    label: { vi: "PHỤ KIỆN", en: "ACCESSORIES" },
    sub: null,
    count: { vi: "80+ sản phẩm", en: "80+ products" },
    accentColor: "#22C55E",
    tag: null,
    img: "/images/home/category-accessories.jpg",
    href: "/phu-kien",
  },
  {
    id: 6,
    label: { vi: "GIẢM GIÁ", en: "SALE" },
    sub: null,
    count: { vi: "200+ sản phẩm", en: "200+ products" },
    accentColor: "#FF3C00",
    tag: { vi: "ĐẾN -50%", en: "UP TO -50%" },
    img: "/images/home/category-sale.jpg",
    href: "/giam-gia",
  },
];

// Fallback "Our Story" section — shown until it loads from the DB.
const FALLBACK_STORY: StorySection = {
  eyebrow: T.ourStoryEyebrow,
  headline: {
    vi: [T.storyLine1.vi, T.storyLine2.vi, T.storyLine3.vi],
    en: [T.storyLine1.en, T.storyLine2.en, T.storyLine3.en],
  },
  accentIndex: 1,
  paragraph1: T.storyP1,
  paragraph2: T.storyP2,
  ctaLabel: T.readStory,
  ctaUrl: "/gioi-thieu",
  image: "/images/home/story.jpg",
  imageOverlayEyebrow: T.engineeredFor,
  imageOverlayTitle: T.trainLikePro,
  stat1Value: "2.5M+",
  stat1Label: T.statAthletes,
  stat2Value: "98%",
  stat2Label: T.statHappy,
};

// Fallback feature cards — shown until they load from the DB.
const FALLBACK_FEATURE_CARDS: FeatureCard[] = [
  {
    id: -1,
    icon: "Zap",
    title: { vi: "KỸ THUẬT CAO", en: "ADVANCED TECH" },
    desc: {
      vi: "Co giãn 4 chiều, thoát ẩm và công nghệ chống mùi trong từng sản phẩm. Được tạo ra để di chuyển cùng cơ thể bạn.",
      en: "4-way stretch, moisture-wicking and odor-control tech in every piece. Built to move with your body.",
    },
  },
  {
    id: -2,
    icon: "Star",
    title: { vi: "CHẤT LƯỢNG CAO CẤP", en: "PREMIUM QUALITY" },
    desc: {
      vi: "Đường may gia cố, màu vải bền màu, chịu được hàng nghìn lần giặt. Chúng tôi đứng sau từng mũi chỉ.",
      en: "Reinforced seams, fade-resistant fabric, built to survive thousands of washes. We stand behind every stitch.",
    },
  },
  {
    id: -3,
    icon: "Shield",
    title: { vi: "ĐA DẠNG KÍCH CỠ", en: "SIZE INCLUSIVE" },
    desc: {
      vi: "Từ XS đến 4XL, thiết kế từ dữ liệu cơ thể thực của vận động viên. Vì trang phục hiệu suất phải vừa với tất cả.",
      en: "From XS to 4XL, designed from real athlete body data. Because performance gear should fit everyone.",
    },
  },
  {
    id: -4,
    icon: "RotateCcw",
    title: { vi: "TƯƠNG LAI BỀN VỮNG", en: "SUSTAINABLE FUTURE" },
    desc: {
      vi: "100% bao bì tái chế. Nguồn gốc có trách nhiệm. Chúng tôi xây dựng thương hiệu tồn tại lâu dài — cả với hành tinh.",
      en: "100% recycled packaging. Responsibly sourced. We're building a brand that lasts — for the planet too.",
    },
  },
];

// Fallback features section heading — shown until it loads from the DB.
const FALLBACK_FEATURES_SECTION: FeaturesSectionData = {
  eyebrow: T.featuresEyebrow,
  title1: T.featuresTitle1,
  title2: T.featuresTitle2,
};

// Fallback stats — shown until they load from the DB.
const FALLBACK_STATS: Stat[] = [
  {
    id: -1,
    value: "2.5M+",
    label: { vi: "Thành viên toàn cầu", en: "Global members" },
  },
  { id: -2, value: "98%", label: { vi: "Tỷ lệ hài lòng", en: "Satisfaction rate" } },
  { id: -3, value: "6+", label: { vi: "Năm đổi mới", en: "Years of innovation" } },
  {
    id: -4,
    value: "45+",
    label: { vi: "Quốc gia giao hàng", en: "Countries shipped" },
  },
];

// Fallback services — shown until they load from the DB.
const FALLBACK_SERVICES: Service[] = [
  { id: -1, icon: "Truck", title: T.serviceShippingTitle, sub: T.serviceShippingSub },
  { id: -2, icon: "RotateCcw", title: T.serviceReturnsTitle, sub: T.serviceReturnsSub },
  { id: -3, icon: "Shield", title: T.serviceQualityTitle, sub: T.serviceQualitySub },
];

// Fallback reviews — shown until they load from the DB.
const FALLBACK_REVIEWS: Review[] = [
  {
    id: -1,
    name: "Minh Anh",
    handle: "@minhanh.fit",
    text: {
      vi: "Bộ APEX thực sự là trang phục tập luyện tốt nhất tôi từng có. Vải như làn da thứ hai, thoải mái cả buổi tập dài.",
      en: "The APEX set is honestly the best training gear I've ever owned. Fabric feels like a second skin, comfortable through the longest sessions.",
    },
    stars: 5,
    product: "APEX Pro Shorts",
  },
  {
    id: -2,
    name: "Tuấn Kiệt",
    handle: "@kiettrain",
    text: {
      vi: "Cuối cùng cũng có thương hiệu hiểu vận động viên thực sự cần gì. Từng chi tiết đều hoàn hảo, không có gì để chê.",
      en: "Finally a brand that actually gets what athletes need. Every detail is on point, nothing to complain about.",
    },
    stars: 5,
    product: "Vital Seamless Tee",
  },
  {
    id: -3,
    name: "Thu Hà",
    handle: "@thuha.lifts",
    text: {
      vi: "Tôi đã mặc Pulsegear qua 3 cuộc thi rồi. Chưa bao giờ thất vọng. Mua cho cả team rồi ai cũng mê.",
      en: "I've worn Pulsegear through 3 competitions now. Never let me down. Got the whole team wearing it and everyone's obsessed.",
    },
    stars: 5,
    product: "Seamless V2 Leggings",
  },
];

// Fallback reviews section heading — shown until it loads from the DB.
const FALLBACK_REVIEWS_SECTION: ReviewsSectionData = {
  eyebrow: T.reviewsEyebrow,
  title1: T.reviewsTitle1,
  title2: T.reviewsTitle2,
};

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
  const lang = useI18nStore((s) => s.lang);

  /* ── HERO SLIDE (fixed with ref) ── */
  const [slides, setSlides] = useState<BannerSlide[]>(FALLBACK_SLIDES);
  const [heroIdx, setHeroIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const busyRef = useRef(false);
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>(FALLBACK_MARQUEE);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [story, setStory] = useState<StorySection>(FALLBACK_STORY);
  const [drops, setDrops] = useState<Drop[]>(FALLBACK_HOMEPAGE_DROPS);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>(FALLBACK_FEATURE_CARDS);
  const [featuresSection, setFeaturesSection] = useState<FeaturesSectionData>(FALLBACK_FEATURES_SECTION);
  const [stats, setStats] = useState<Stat[]>(FALLBACK_STATS);
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES);
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [reviewsSection, setReviewsSection] = useState<ReviewsSectionData>(FALLBACK_REVIEWS_SECTION);
  const [communityTiles, setCommunityTiles] = useState<CommunityTile[]>(FALLBACK_COMMUNITY_TILES);
  const [socialConfig, setSocialConfig] = useState<SocialConfig>(FALLBACK_SOCIAL_CONFIG);

  useEffect(() => {
    getBanners().then((data) => {
      if (data.length > 0) setSlides(data);
    });
    getMarqueeItems().then((data) => {
      if (data.length > 0) setMarqueeItems(data);
    });
    getHomepageCategories().then((data) => {
      if (data.length > 0) setCategories(data);
    });
    getStorySection().then((data) => {
      if (data) setStory(data);
    });
    getHomepageDrops().then((data) => {
      if (data.length > 0) setDrops(data);
    });
    getFeatureCards().then((data) => {
      if (data.length > 0) setFeatureCards(data);
    });
    getFeaturesSection().then((data) => {
      if (data) setFeaturesSection(data);
    });
    getStats().then((data) => {
      if (data.length > 0) setStats(data);
    });
    getServices().then((data) => {
      if (data.length > 0) setServices(data);
    });
    getReviews().then((data) => {
      if (data.length > 0) setReviews(data);
    });
    getReviewsSection().then((data) => {
      if (data) setReviewsSection(data);
    });
    getCommunityTiles().then((data) => {
      if (data.length > 0) setCommunityTiles(data);
    });
    getSocialConfig().then((data) => {
      if (data) setSocialConfig(data);
    });
  }, []);

  const slide = slides[heroIdx] ?? slides[0];

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
      const next = (idxRef.current + 1) % slides.length;
      changeSlide(next);
    }, 6000);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

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
          PULSEGEAR · CLUB
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
            {slide.tag[lang]}
          </div>

          <p
            className="hero-anim hero-d1 mb-3 text-[13px] font-black tracking-[0.45em] uppercase opacity-0"
            style={{ color: slide.glow }}
          >
            {slide.eyebrow[lang]}
          </p>

          <h1 className="hero-anim hero-d2 max-w-4xl opacity-0 text-[clamp(2rem,4.8vw,4.3rem)] font-black leading-[1.35] tracking-[-0.02em]">
            {slide.headline[lang].map((word, i) =>
              i === slide.accentIndex ? (
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
            className="hero-anim hero-d3 max-w-md text-[18px] leading-relaxed opacity-0"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {slide.sub[lang]}
          </p>

          <div className="hero-anim hero-d4 mt-9 flex flex-wrap gap-4 opacity-0">
            <Link href={slide.cta1Url || VOID}>
              <button
                className="group relative overflow-hidden px-9 py-4 text-[12px] font-black tracking-[0.25em] uppercase text-black transition-transform hover:scale-[1.03] active:scale-[0.97]"
                style={{ backgroundColor: slide.glow }}
              >
                <span className="relative z-10">{slide.cta1[lang]}</span>
                <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            </Link>
            <Link href={slide.cta2Url || VOID}>
              <button
                className="px-9 py-4 text-[12px] font-black tracking-[0.25em] uppercase text-white/55 transition-all hover:text-white"
                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
              >
                {slide.cta2[lang]}
              </button>
            </Link>
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
            {String(slides.length).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
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
                  goHero((heroIdx + dir + slides.length) % slides.length)
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
            {T.scrollDown[lang]}
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
            marqueeItems.flatMap((item, i) => [
              <span
                key={`${rep}-${i}-text`}
                className="whitespace-nowrap text-[11px] font-black tracking-[0.3em] uppercase text-black"
              >
                {item.text[lang]}
              </span>,
              <span
                key={`${rep}-${i}-sep`}
                className="whitespace-nowrap text-[11px] font-black tracking-[0.3em] uppercase text-black"
              >
                ★ PULSEGEAR.CLUB ★
              </span>,
            ]),
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
                {T.collectionsEyebrow[lang]}
              </p>
              <h2 className="text-3xl font-black tracking-[-0.02em] text-white md:text-4xl">
                {T.shopByCategory[lang]}
              </h2>
            </div>
            <Link
              href="/danh-muc"
              className="hidden items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase transition-colors hover:text-white md:flex"
              style={{ color: C.muted }}
            >
              {T.viewAll[lang]} <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => (
              <CategoryTile key={cat.id} cat={cat} lang={lang} isWide={i === 0 || i === 1} />
            ))}
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
                className="mb-4 text-[12px] font-black tracking-[0.45em] uppercase"
                style={{ color: C.accent }}
              >
                {story.eyebrow[lang]}
              </p>
              <h2 className="flex flex-col gap-3 text-5xl font-black tracking-[-0.025em] text-white md:text-6xl lg:text-7xl">
                {story.headline[lang].map((line, i) => (
                  <span
                    key={i}
                    style={
                      i === story.accentIndex
                        ? { color: C.accent, textShadow: `0 0 60px ${C.accent}30` }
                        : undefined
                    }
                  >
                    {line}
                  </span>
                ))}
              </h2>
              <div
                className="my-8 h-[1px] w-14"
                style={{ backgroundColor: C.accent }}
              />
              <p
                className="mb-5 max-w-md text-[17px] leading-[1.75]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {story.paragraph1[lang]}
              </p>
              <p
                className="max-w-md text-[15px] leading-[1.75]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {story.paragraph2[lang]}
              </p>
              <Link
                href={story.ctaUrl}
                className="group mt-10 inline-flex items-center gap-3 text-[12px] font-black tracking-[0.25em] uppercase text-white"
              >
                {story.ctaLabel[lang]}{" "}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                  style={{ color: C.accent }}
                />
              </Link>
            </div>

            <div className="relative">
              <div
                className="relative overflow-hidden"
                style={{ border: `1px solid ${C.border}` }}
              >
                <img
                  src={story.image}
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
                    {story.imageOverlayEyebrow[lang]}
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-white">
                    {story.imageOverlayTitle[lang]}
                  </h3>
                </div>
              </div>

              {[
                { val: story.stat1Value, label: story.stat1Label, pos: "-left-6 top-6" },
                {
                  val: story.stat2Value,
                  label: story.stat2Label,
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
                    {s.label[lang]}
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
                className="mb-3 text-[12px] font-black tracking-[0.4em] uppercase"
                style={{ color: C.accent }}
              >
                {T.dropsEyebrow[lang]}
              </p>
              <h2 className="text-3xl font-black tracking-[-0.02em] text-white md:text-4xl">
                {T.dropsTitle1[lang]}{" "}
                <span style={{ color: C.accent }}>{T.dropsTitle2[lang]}</span>
              </h2>
            </div>
            <Link
              href="/bo-suu-tap"
              className="hidden items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase transition-colors hover:text-white md:flex"
              style={{ color: C.muted }}
            >
              {T.viewAll[lang]} <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {drops.map((drop, i) => (
              <Link
                key={drop.id}
                href={drop.href}
                className="group relative flex h-full flex-col overflow-hidden"
                style={{ border: `1px solid ${C.border}` }}
              >
                <div className="relative w-full shrink-0 overflow-hidden aspect-[16/9]">
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
                    {drop.badge[lang]}
                  </div> */}
                </div>
                <div
                  className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: drop.glow }}
                />
                <div
                  className="relative flex flex-1 flex-col p-6"
                  style={{ backgroundColor: C.bg3 }}
                >
                  <p
                    className="mb-1 text-[10px] font-semibold tracking-[0.2em] uppercase"
                    style={{ color: `${drop.glow}99` }}
                  >
                    {drop.tag[lang]}
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
                    {drop.sub[lang]}
                  </p>
                  <div
                    className="mt-auto flex items-center gap-2 pt-5 text-[11px] font-black tracking-[0.2em] uppercase transition-all group-hover:gap-3"
                    style={{ color: drop.glow }}
                  >
                    {T.shopNow[lang]} <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
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
              className="mb-5 text-[12px] font-black tracking-[0.45em] uppercase"
              style={{ color: C.accent }}
            >
              {featuresSection.eyebrow[lang]}
            </p>
            <h2 className="text-4xl font-black tracking-[-0.025em] text-white md:text-5xl">
              {featuresSection.title1[lang]}{" "}
              <span style={{ color: C.accent }}>{featuresSection.title2[lang]}</span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((f, i) => {
              const Icon = FEATURE_ICONS[f.icon] ?? Zap;
              return (
                <div
                  key={f.id}
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
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    className="mb-4 inline-flex h-11 w-11 items-center justify-center"
                    style={{
                      backgroundColor: `${C.accent}15`,
                      border: `1px solid ${C.accent}30`,
                      color: C.accent,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="mb-3 text-sm font-black tracking-[0.08em] text-white">
                    {f.title[lang]}
                  </h3>
                  <div
                    className="mb-4 h-[1px] w-8 transition-all duration-300 group-hover:w-14"
                    style={{ backgroundColor: C.accent }}
                  />
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{ color: C.muted }}
                  >
                    {f.desc[lang]}
                  </p>
                </div>
              );
            })}
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
            {stats.map((s) => (
              <div
                key={s.id}
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
                  {s.label[lang]}
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
            {services.map((item) => {
              const Icon = SERVICE_ICONS[item.icon] ?? Truck;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-6 py-6 sm:justify-center"
                  style={{ borderColor: C.border }}
                >
                  <div style={{ color: C.accent }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black tracking-[0.2em] text-white">
                      {item.title[lang]}
                    </p>
                    <p className="mt-0.5 text-[12px]" style={{ color: C.muted }}>
                      {item.sub[lang]}
                    </p>
                  </div>
                </div>
              );
            })}
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
              className="mb-5 text-[12px] font-black tracking-[0.45em] uppercase"
              style={{ color: C.accent }}
            >
              {reviewsSection.eyebrow[lang]}
            </p>
            <h2 className="text-3xl font-black tracking-[-0.02em] text-white md:text-4xl">
              {reviewsSection.title1[lang]}{" "}
              <span style={{ color: C.accent }}>{reviewsSection.title2[lang]}</span>
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <div
                key={r.id}
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
                  {r.text[lang]}
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
                className="mb-3 text-[13px] font-black tracking-[0.45em] uppercase"
                style={{ color: C.accent }}
              >
                #PULSEGEARCLUB
              </p>
              <h2 className="text-3xl font-black tracking-[-0.02em] text-white md:text-4xl">
                {T.communityJoin1[lang]}{" "}
                <span style={{ color: C.accent }}>
                  {T.communityJoin2[lang]}
                </span>
              </h2>
            </div>
            {/* <a
              href={VOID}
              className="hidden items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase transition-colors hover:text-white md:flex"
              style={{ color: C.muted }}
            >
              THEO DÕI <IgIcon size={13} />
            </a> */}
          </div>

          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {communityTiles.map((tile) => (
              <a
                key={tile.id}
                href={tile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square block cursor-pointer overflow-hidden"
              >
                <img
                  src={tile.img}
                  alt={tile.label[lang]}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/70" />
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 50%,${tile.glow}35,transparent 65%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span
                    className="text-[12px] font-black tracking-[0.35em] uppercase"
                    style={{ color: tile.glow }}
                  >
                    {tile.label[lang]}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { icon: <IgIcon size={17} />, label: "@pulsegear.club", href: socialConfig.instagram },
              { icon: <FbIcon size={17} />, label: "PULSEGEAR", href: socialConfig.facebook },
              { icon: <YtIcon size={17} />, label: "PULSEGEAR TV", href: socialConfig.youtube },
              { icon: <TikTokIcon size={17} />, label: "@pulsegear.club", href: socialConfig.tiktok },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href || VOID}
                target="_blank"
                rel="noopener noreferrer"
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
      {/* <section
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
      </section> */}
    </div>
  );
}
