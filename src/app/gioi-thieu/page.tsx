"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Target, ChevronRight } from "lucide-react";
import { useI18nStore } from "@/lib/i18n/store";
import { getAboutHeroSection, FALLBACK_ABOUT_HERO } from "@/lib/aboutHero";
import { getAboutStorySection, FALLBACK_ABOUT_STORY } from "@/lib/aboutStory";
import {
  getMissionVisionSection,
  FALLBACK_MISSION_VISION,
  MISSION_VISION_ICONS,
} from "@/lib/aboutMissionVision";
import {
  getValueCards,
  getValuesSection,
  VALUE_ICONS,
  type ValueCard,
  type ValuesSectionData,
} from "@/lib/aboutValues";
import {
  getTimelineItems,
  getTimelineSection,
  type TimelineItem,
  type TimelineSectionData,
} from "@/lib/aboutTimeline";
import { getAboutStats, type AboutStat } from "@/lib/aboutStats";
import {
  getTeamMembers,
  getTeamSection,
  type TeamMember,
  type TeamSectionData,
} from "@/lib/aboutTeam";

/* ─── TOKENS ─── */
const C = {
  bg: "#0A0A0A",
  bg2: "#111111",
  bg3: "#161616",
  accent: "#FF3C00",
  muted: "#888888",
  border: "rgba(255,255,255,0.07)",
};

const VOID = "javascript:void(0)";

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
  breadcrumbAbout: { vi: "Giới thiệu", en: "About Us" },

  ctaTitle1: { vi: "SẴN SÀNG", en: "READY TO" },
  ctaTitle2: { vi: "THAM GIA?", en: "JOIN US?" },
  ctaSub: {
    vi: "Khám phá bộ sưu tập mới nhất hoặc liên hệ với đội ngũ của chúng tôi.",
    en: "Explore the latest collection or get in touch with our team.",
  },
  ctaShop: { vi: "MUA SẮM NGAY", en: "SHOP NOW" },
  ctaContact: { vi: "LIÊN HỆ", en: "CONTACT US" },
};

// Fallback core values — shown until they load from the DB.
const FALLBACK_VALUES: ValueCard[] = [
  {
    id: -1,
    icon: "Zap",
    title: { vi: "HIỆU SUẤT LÀ ƯU TIÊN", en: "PERFORMANCE FIRST" },
    desc: {
      vi: "Mọi quyết định thiết kế đều bắt đầu từ một câu hỏi: liệu nó có giúp bạn tập luyện tốt hơn không?",
      en: "Every design decision starts with one question: will it help you train better?",
    },
  },
  {
    id: -2,
    icon: "ShieldCheck",
    title: { vi: "CHẤT LƯỢNG KHÔNG THỎA HIỆP", en: "UNCOMPROMISING QUALITY" },
    desc: {
      vi: "Đường may gia cố, vải kiểm định độc lập. Chúng tôi đứng sau từng sản phẩm rời khỏi kho.",
      en: "Reinforced seams, independently tested fabric. We stand behind every product that leaves our warehouse.",
    },
  },
  {
    id: -3,
    icon: "Users",
    title: { vi: "CỘNG ĐỒNG LÀ SỨC MẠNH", en: "COMMUNITY IS POWER" },
    desc: {
      vi: "2.5 triệu vận động viên không chỉ là khách hàng — họ là lý do chúng tôi tiếp tục đổi mới mỗi ngày.",
      en: "2.5M athletes aren't just customers — they're the reason we keep innovating every day.",
    },
  },
  {
    id: -4,
    icon: "Leaf",
    title: { vi: "BỀN VỮNG CHO TƯƠNG LAI", en: "SUSTAINABLE FUTURE" },
    desc: {
      vi: "100% bao bì tái chế, nguồn nguyên liệu có trách nhiệm. Hiệu suất không nên đánh đổi bằng hành tinh.",
      en: "100% recycled packaging, responsibly sourced materials. Performance shouldn't cost the planet.",
    },
  },
];

// Fallback core-values section heading — shown until it loads from the DB.
const FALLBACK_VALUES_SECTION: ValuesSectionData = {
  eyebrow: { vi: "GIÁ TRỊ CỐT LÕI", en: "CORE VALUES" },
  title1: { vi: "ĐIỀU CHÚNG TÔI", en: "WHAT WE" },
  title2: { vi: "TIN TƯỞNG", en: "STAND FOR" },
};

// Fallback timeline milestones — shown until they load from the DB.
const FALLBACK_TIMELINE: TimelineItem[] = [
  {
    id: -1,
    year: "2019",
    title: { vi: "Khởi đầu tại TP.HCM", en: "Founded in Ho Chi Minh City" },
    desc: {
      vi: "PULSEGEAR.CLUB ra đời từ một phòng gym nhỏ với dòng sản phẩm đầu tiên: APEX Training Series.",
      en: "PULSEGEAR.CLUB was born in a small gym with our first line: the APEX Training Series.",
    },
  },
  {
    id: -2,
    year: "2020",
    title: { vi: "Ra mắt Seamless V1", en: "Launched Seamless V1" },
    desc: {
      vi: "Bộ sưu tập liền mạch đầu tiên — sản phẩm định hình tên tuổi thương hiệu.",
      en: "Our first seamless collection — the line that put us on the map.",
    },
  },
  {
    id: -3,
    year: "2021",
    title: { vi: "Mở rộng quốc tế", en: "Going International" },
    desc: {
      vi: "PULSEGEAR.CLUB có mặt tại hơn 10 quốc gia trên khắp châu Á và châu Âu.",
      en: "PULSEGEAR.CLUB expanded to 10+ countries across Asia and Europe.",
    },
  },
  {
    id: -4,
    year: "2023",
    title: { vi: "1 triệu thành viên", en: "1 Million Members" },
    desc: {
      vi: "Cộng đồng PULSEGEAR.CLUB cán mốc 1 triệu vận động viên trên toàn cầu.",
      en: "The PULSEGEAR.CLUB community crossed 1 million athletes worldwide.",
    },
  },
  {
    id: -5,
    year: "2025",
    title: { vi: "2.5M+ và tiếp tục phát triển", en: "2.5M+ and Growing" },
    desc: {
      vi: "Hôm nay, hơn 2.5 triệu vận động viên tại 45+ quốc gia tin dùng PULSEGEAR.CLUB.",
      en: "Today, 2.5M+ athletes across 45+ countries trust PULSEGEAR.CLUB.",
    },
  },
];

// Fallback timeline section heading — shown until it loads from the DB.
const FALLBACK_TIMELINE_SECTION: TimelineSectionData = {
  eyebrow: { vi: "HÀNH TRÌNH", en: "OUR JOURNEY" },
  title: { vi: "CÁC CỘT MỐC ĐÁNG NHỚ", en: "MILESTONES" },
};

// Fallback team members — shown until they load from the DB.
const FALLBACK_TEAM: TeamMember[] = [
  {
    id: -1,
    name: "Đăng Khoa",
    role: { vi: "Nhà Sáng Lập & CEO", en: "Founder & CEO" },
    img: "/images/about/team-1.jpg",
  },
  {
    id: -2,
    name: "Linh Chi",
    role: { vi: "Trưởng Phòng Thiết Kế", en: "Head of Design" },
    img: "/images/about/team-2.jpg",
  },
  {
    id: -3,
    name: "Quang Huy",
    role: { vi: "Trưởng Phòng Sản Phẩm", en: "Head of Product" },
    img: "/images/about/team-3.jpg",
  },
  {
    id: -4,
    name: "Bảo Trân",
    role: { vi: "Quản Lý Cộng Đồng", en: "Community Lead" },
    img: "/images/about/team-4.jpg",
  },
];

// Fallback team section heading — shown until it loads from the DB.
const FALLBACK_TEAM_SECTION: TeamSectionData = {
  eyebrow: { vi: "ĐỘI NGŨ", en: "THE TEAM" },
  title1: { vi: "NHỮNG NGƯỜI", en: "THE PEOPLE" },
  title2: { vi: "ĐỨNG SAU PULSEGEAR", en: "BEHIND PULSEGEAR" },
};

// Fallback stats strip — shown until it loads from the DB.
const FALLBACK_STATS: AboutStat[] = [
  {
    id: -1,
    value: "2.5M+",
    label: { vi: "Vận động viên toàn cầu", en: "Global athletes" },
  },
  {
    id: -2,
    value: "45+",
    label: { vi: "Quốc gia giao hàng", en: "Countries shipped" },
  },
  { id: -3, value: "6+", label: { vi: "Năm đổi mới", en: "Years of innovation" } },
  { id: -4, value: "98%", label: { vi: "Tỷ lệ hài lòng", en: "Satisfaction rate" } },
];

export default function AboutPage() {
  const lang = useI18nStore((s) => s.lang);

  const [hero, setHero] = useState(FALLBACK_ABOUT_HERO);
  useEffect(() => {
    getAboutHeroSection().then((data) => {
      if (data) setHero(data);
    });
  }, []);

  const [story, setStory] = useState(FALLBACK_ABOUT_STORY);
  useEffect(() => {
    getAboutStorySection().then((data) => {
      if (data) setStory(data);
    });
  }, []);

  const [missionVision, setMissionVision] = useState(FALLBACK_MISSION_VISION);
  useEffect(() => {
    getMissionVisionSection().then((data) => {
      if (data) setMissionVision(data);
    });
  }, []);

  const [values, setValues] = useState<ValueCard[]>(FALLBACK_VALUES);
  const [valuesSection, setValuesSection] = useState<ValuesSectionData>(FALLBACK_VALUES_SECTION);
  useEffect(() => {
    getValueCards().then((data) => {
      if (data.length > 0) setValues(data);
    });
    getValuesSection().then((data) => {
      if (data) setValuesSection(data);
    });
  }, []);

  const [timeline, setTimeline] = useState<TimelineItem[]>(FALLBACK_TIMELINE);
  const [timelineSection, setTimelineSection] = useState<TimelineSectionData>(FALLBACK_TIMELINE_SECTION);
  useEffect(() => {
    getTimelineItems().then((data) => {
      if (data.length > 0) setTimeline(data);
    });
    getTimelineSection().then((data) => {
      if (data) setTimelineSection(data);
    });
  }, []);

  const [stats, setStats] = useState<AboutStat[]>(FALLBACK_STATS);
  useEffect(() => {
    getAboutStats().then((data) => {
      if (data.length > 0) setStats(data);
    });
  }, []);

  const [team, setTeam] = useState<TeamMember[]>(FALLBACK_TEAM);
  const [teamSection, setTeamSection] = useState<TeamSectionData>(FALLBACK_TEAM_SECTION);
  useEffect(() => {
    getTeamMembers().then((data) => {
      if (data.length > 0) setTeam(data);
    });
    getTeamSection().then((data) => {
      if (data) setTeamSection(data);
    });
  }, []);

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
            background: `linear-gradient(to bottom, rgba(0,0,0,.75) 0%, rgba(0,0,0,.88) 60%, ${C.bg} 100%),
                         radial-gradient(ellipse 60% 70% at 75% 30%, ${C.accent}20, transparent 70%)`,
          }}
        />
        <Noise op={0.04} />

        <div className="relative mx-auto max-w-screen-2xl px-8 pb-20 pt-36 md:px-16 lg:px-24 lg:pt-44">
          {/* Breadcrumb */}
          <div
            className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <Link href="/" className="transition-colors hover:text-white">
              {T.breadcrumbHome[lang]}
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: C.accent }}>{T.breadcrumbAbout[lang]}</span>
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
              style={{
                color: C.accent,
                textShadow: `0 0 80px ${C.accent}35`,
              }}
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

      {/* ════════ STORY ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: C.bg }}
      >
        <Noise op={0.025} />
        <div className="relative mx-auto max-w-screen-2xl px-8 py-24 md:px-16 lg:px-24">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
            <div className="relative">
              <div
                className="relative overflow-hidden"
                style={{ border: `1px solid ${C.border}` }}
              >
                <img
                  src={story.image}
                  alt="PULSEGEAR founder"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top,rgba(10,10,10,0.75) 0%,transparent 55%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[17px] italic leading-relaxed text-white">
                    {story.quote[lang]}
                  </p>
                </div>
              </div>

              <div
                className="absolute -right-4 -top-4 px-4 py-3"
                style={{
                  backgroundColor: C.accent,
                  boxShadow: "0 0 40px rgba(0,0,0,0.8)",
                }}
              >
                <div className="text-[10px] font-black tracking-[0.25em] text-black">
                  {story.foundedLabel[lang]}
                </div>
                <div className="text-2xl font-black text-black">{story.foundedYear}</div>
              </div>
            </div>

            <div>
              <p
                className="mb-5 text-[13px] font-black tracking-[0.3em] uppercase"
                style={{ color: C.accent }}
              >
                {story.eyebrow[lang]}
              </p>
              <h2 className="mb-6 text-2xl font-black leading-tight tracking-[-0.02em] text-white md:text-3xl">
                {story.title[lang]}
              </h2>
              <div className="space-y-5">
                <p
                  className="text-[17px] leading-[1.8]"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {story.paragraph1[lang]}
                </p>
                <p
                  className="text-[17px] leading-[1.8]"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {story.paragraph2[lang]}
                </p>
                <p
                  className="text-[17px] leading-[1.8]"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {story.paragraph3[lang]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ MISSION / VISION ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: C.bg2 }}
      >
        <Noise op={0.025} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 55% 80% at 20% 50%,${C.accent}12,transparent 65%)`,
          }}
        />
        <div className="relative mx-auto max-w-screen-2xl px-8 py-20 md:px-16 lg:px-24">
          <div className="grid gap-4 md:grid-cols-2">
            {[missionVision.mission, missionVision.vision].map((item, i) => {
              const ItemIcon = MISSION_VISION_ICONS[item.icon] ?? Target;
              return (
                <div
                  key={i}
                  className="group relative overflow-hidden p-9 transition-all duration-300 hover:-translate-y-1"
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
                    className="mb-5 inline-flex h-12 w-12 items-center justify-center"
                    style={{
                      backgroundColor: `${C.accent}15`,
                      border: `1px solid ${C.accent}30`,
                      color: C.accent,
                    }}
                  >
                    <ItemIcon size={22} />
                  </div>
                  <h3 className="mb-3 text-xl font-black tracking-[0.02em] text-white">
                    {item.title[lang]}
                  </h3>
                  <p
                    className="text-[17px] leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {item.text[lang]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ CORE VALUES ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: C.bg }}
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
              className="mb-6 text-[14px] font-black tracking-[0.3em] uppercase"
              style={{ color: C.accent }}
            >
              {valuesSection.eyebrow[lang]}
            </p>
            <h2 className="text-4xl font-black tracking-[-0.025em] text-white md:text-5xl">
              {valuesSection.title1[lang]}{" "}
              <span style={{ color: C.accent }}>{valuesSection.title2[lang]}</span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const ValueIcon = VALUE_ICONS[v.icon] ?? Target;
              return (
              <div
                key={v.id}
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
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center"
                  style={{
                    backgroundColor: `${C.accent}15`,
                    border: `1px solid ${C.accent}30`,
                    color: C.accent,
                  }}
                >
                  <ValueIcon size={22} />
                </div>
                <h3 className="mb-3 text-[17px] font-black tracking-[0.08em] text-white">
                  {v.title[lang]}
                </h3>
                <div
                  className="mb-4 h-[1px] w-8 transition-all duration-300 group-hover:w-14"
                  style={{ backgroundColor: C.accent }}
                />
                <p
                  className="text-[16px] leading-relaxed"
                  style={{ color: C.muted }}
                >
                  {v.desc[lang]}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ TIMELINE ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: C.bg2 }}
      >
        <Noise op={0.025} />
        <div className="relative mx-auto max-w-screen-xl px-8 py-24 md:px-16">
          <div className="mb-14">
            <p
              className="mb-4 text-[13px] font-black tracking-[0.4em] uppercase"
              style={{ color: C.accent }}
            >
              {timelineSection.eyebrow[lang]}
            </p>
            <h2 className="text-3xl font-black tracking-[-0.02em] text-white md:text-4xl">
              {timelineSection.title[lang]}
            </h2>
          </div>

          <div className="relative">
            <div
              className="absolute left-[27px] top-2 bottom-2 hidden w-px sm:block"
              style={{ backgroundColor: C.border }}
            />
            <div className="space-y-8">
              {timeline.map((item) => (
                <div key={item.id} className="relative flex gap-6 sm:gap-8">
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-center">
                    <div
                      className="flex h-14 w-14 items-center justify-center text-[11px] font-black"
                      style={{
                        backgroundColor: C.bg3,
                        border: `1px solid ${C.accent}`,
                        color: C.accent,
                      }}
                    >
                      {item.year}
                    </div>
                  </div>
                  <div
                    className="flex-1 p-6"
                    style={{
                      backgroundColor: C.bg3,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      className="mb-1 text-[11px] font-black tracking-[0.2em] sm:hidden"
                      style={{ color: C.accent }}
                    >
                      {item.year}
                    </div>
                    <h3 className="mb-2 text-[19px] font-black text-white">
                      {item.title[lang]}
                    </h3>
                    <p
                      className="text-[15px] leading-relaxed"
                      style={{ color: C.muted }}
                    >
                      {item.desc[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
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

      {/* ════════ TEAM ════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: C.bg }}
      >
        <Noise op={0.03} />
        <div className="relative mx-auto max-w-screen-2xl px-8 py-24 md:px-16">
          <div className="mb-12 text-center">
            <p
              className="mb-5 text-[15px] font-black tracking-[0.3em] uppercase"
              style={{ color: C.accent }}
            >
              {teamSection.eyebrow[lang]}
            </p>
            <h2 className="text-3xl font-black tracking-[-0.02em] text-white md:text-4xl">
              {teamSection.title1[lang]}{" "}
              <span style={{ color: C.accent }}>{teamSection.title2[lang]}</span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.id} className="group relative overflow-hidden">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.05] group-hover:grayscale-0"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 55%)",
                    }}
                  />
                  <div
                    className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                    style={{ backgroundColor: C.accent }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base font-black text-white">
                      {m.name}
                    </h3>
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.15em]"
                      style={{ color: C.accent }}
                    >
                      {m.role[lang]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section
        className="relative w-full overflow-hidden border-t"
        style={{ backgroundColor: C.bg2, borderColor: C.border }}
      >
        <Noise op={0.025} />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-10"
          style={{
            background: `radial-gradient(ellipse at 80% 50%, ${C.accent}, transparent 70%)`,
          }}
        />
        <div className="relative mx-auto max-w-screen-2xl px-8 py-20 md:px-16">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black leading-tight tracking-[-0.02em] text-white md:text-4xl">
                {T.ctaTitle1[lang]}{" "}
                <span style={{ color: C.accent }}>{T.ctaTitle2[lang]}</span>
              </h2>
              <p
                className="mt-3 max-w-md text-[17px]"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {T.ctaSub[lang]}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-4">
              <Link href="/">
                <button
                  className="group relative overflow-hidden px-9 py-4 text-[12px] font-black tracking-[0.25em] uppercase text-black transition-transform hover:scale-[1.03] active:scale-[0.97]"
                  style={{ backgroundColor: C.accent }}
                >
                  <span className="relative z-10">{T.ctaShop[lang]}</span>
                  <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                </button>
              </Link>
              <Link href="/lien-he">
                <button
                  className="group flex items-center gap-2 px-9 py-4 text-[12px] font-black tracking-[0.25em] uppercase text-white/70 transition-all hover:text-white"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  {T.ctaContact[lang]}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
