// src/components/home/HeroBanner.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import type { Banner, I18N } from "@/services/BannerService";
import type { WhyChoose } from "@/services/WhyChooseService";

/* =========================
 * Helpers
 * ========================= */
function safeLang(l: any): Lang {
  return l === "vi" || l === "en" ? l : ("vi" as Lang);
}

function i18nText(v?: I18N | null, lang?: Lang) {
  const L = safeLang(lang);
  if (!v) return "";
  return (v[L] ?? v.vi ?? v.en ?? "").trim();
}

const PRIMARY = "#08476E";
const ACCENT = "#E7BF64";

export default function HeroBanner({
  banner,
  whychoose,
}: {
  banner: Banner | null;
  whychoose: WhyChoose | null;
}) {
  const lang = useI18nStore((s) => s.lang);
  const L = safeLang(lang);

  const heroImageSrc = "/images/home/bannerhome1.png";
  const contentImageSrc = "/images/home/bannerhome2.png";

  const dbTitle = i18nText(banner?.title, L);
  const dbSub = i18nText(banner?.sub, L);
  const dbDesc1 = i18nText(banner?.desc1, L);
  const dbWebsite = (banner?.website ?? "").trim();
  const dbDesc2 = i18nText(banner?.desc2, L);

  const dbMainServices = useMemo(() => {
    const s1 = i18nText((banner as any)?.mainService1, L);
    const s2 = i18nText((banner as any)?.mainService2, L);
    const s3 = i18nText((banner as any)?.mainService3, L);
    return [s1, s2, s3].filter(Boolean);
  }, [banner, L]);

  const mainServiceLine = dbMainServices.join(" • ");

  const wcTitle = i18nText(whychoose?.title as any, L);
  const wcContent = i18nText(whychoose?.content as any, L);

  const c1 = i18nText(whychoose?.commitment1 as any, L);
  const c2 = i18nText(whychoose?.commitment2 as any, L);
  const c3 = i18nText(whychoose?.commitment3 as any, L);
  const commitmentLine = [c1, c2, c3].filter(Boolean).join(" • ");

  const sectionTitle =
    L === "en"
      ? "WHY CHOOSE DAI & PARTNERS"
      : "VÌ SAO BẠN NÊN CHỌN DAI & PARTNERS";
  const floatingLabel = L === "en" ? "Highlights" : "Dịch vụ nổi bật";
  const commitmentLabel = L === "en" ? "Commitment" : "Cam kết";

  return (
    <section className="w-full bg-white overflow-hidden">
      {" "}
      {/* ✅ THÊM overflow-hidden */}
      <style jsx global>{`
        .whychoose-content ul {
          list-style: disc !important;
          list-style-position: outside;
          padding-left: 1.25rem;
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .whychoose-content ol {
          list-style: decimal !important;
          list-style-position: outside;
          padding-left: 1.25rem;
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .whychoose-content li::marker {
          color: ${PRIMARY};
        }
        .whychoose-content li {
          margin: 0.35rem 0;
        }
        .whychoose-content p {
          color: #000;
          line-height: 1.7;
          margin: 0.5rem 0;
          font-size: 16px;
          text-align: justify;
        }
      `}</style>
      {/* HERO */}
      <div className="relative overflow-hidden pb-10">
        <div className="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-10 xl:px-12 pt-6 md:pt-10">
          {/* ✅ THÊM overflow-hidden vào card chính */}
          <div className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-24px_rgba(2,8,23,.35)] overflow-hidden">
            {/* ✅ GIỮ decorative nhưng đã có overflow-hidden ở parent */}
            <div
              className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rotate-12 opacity-20"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY} 55%, transparent 55%)`,
              }}
            />
            <div
              className="pointer-events-none absolute -right-28 -bottom-28 h-72 w-72 rotate-12 opacity-10"
              style={{
                background: `linear-gradient(315deg, ${PRIMARY} 0%, ${PRIMARY} 55%, transparent 55%)`,
              }}
            />

            <div className="grid gap-6 p-5 md:grid-cols-2 md:gap-8 md:p-8">
              {/* Left copy */}
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PRIMARY }}
                  />
                  DAI & PARTNERS
                </div>

                <h1
                  className="mt-4 text-3xl font-extrabold leading-tight tracking-wide md:text-4xl"
                  style={{ color: PRIMARY }}
                >
                  {dbTitle}
                </h1>

                {!!dbSub && (
                  <div className="mt-4">
                    <div
                      className="relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-lg"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {dbSub}
                    </div>
                  </div>
                )}

                {!!dbDesc1 && (
                  <div className="mt-5">
                    <div
                      className="relative overflow-hidden rounded-xl px-4 py-3 text-[16px] font-semibold"
                      style={{
                        color: PRIMARY,
                        backgroundColor: "#FBF4D6",
                        border: `1px solid ${ACCENT}`,
                        boxShadow: "0 10px 26px -18px rgba(231,191,100,0.6)",
                      }}
                    >
                      <span
                        className="absolute inset-y-0 left-0 w-1.5"
                        style={{ backgroundColor: ACCENT }}
                      />
                      {dbDesc1}
                    </div>
                  </div>
                )}

                {!!dbWebsite && (
                  <div className="mt-4">
                    <div
                      className="inline-flex items-center rounded-full px-4 py-2 text-sm font-bold text-white"
                      style={{
                        background:
                          "linear-gradient(90deg, #08476E 0%, #0B5C8E 55%, #08476E 100%)",
                      }}
                    >
                      Website:&nbsp;
                      <span className="underline underline-offset-4">
                        {dbWebsite}
                      </span>
                    </div>
                  </div>
                )}

                {!!dbDesc2 && <p className="mt-4 text-[16px]">{dbDesc2}</p>}
              </div>

              {/* Right image */}
              <div className="relative">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_18px_50px_-30px_rgba(2,8,23,.55)]">
                  <Image
                    src={heroImageSrc}
                    alt="Hero banner"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 520px"
                    priority
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(120deg, rgba(8,71,110,.15) 0%, rgba(249,115,22,.10) 35%, rgba(255,255,255,0) 70%)",
                    }}
                  />
                </div>

                {/* ✅ FIX Floating badge - bỏ min-width cố định */}
                <div className="mt-3 md:mt-0 md:absolute md:-bottom-4 md:left-1/2 md:-translate-x-1/2 w-full max-w-[300px] md:max-w-[400px] mx-auto rounded-2xl border border-slate-200 bg-white/95 px-6 py-4 shadow-lg backdrop-blur text-center">
                  <div className="text-base font-semibold text-slate-600">
                    {floatingLabel}
                  </div>
                  <div
                    className="mt-1 text-[15px] font-bold break-words"
                    style={{ color: PRIMARY }}
                  >
                    {mainServiceLine}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* WHYCHOOSE (DB) */}
      <div className="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-10 xl:px-12 py-20">
        <h2 className="text-xl font-bold tracking-wide text-slate-900 md:text-2xl">
          {sectionTitle}
        </h2>

        <div className="mt-6 grid gap-8 md:grid-cols-[1.05fr_.95fr] md:items-start">
          {/* Left text block */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_-30px_rgba(2,8,23,.45)] md:p-8">
            <h3 className="text-xl font-bold" style={{ color: PRIMARY }}>
              {wcTitle}
            </h3>

            {wcContent ? (
              <div
                className="whychoose-content mt-2"
                dangerouslySetInnerHTML={{ __html: wcContent }}
              />
            ) : (
              <p className="mt-2 text-[16px] leading-relaxed text-gray-500">
                {L === "en" ? "No content yet." : "Chưa có nội dung."}
              </p>
            )}

            <div className="mt-6">
              <Link href="/about" className="inline-flex">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:translate-y-[-1px] active:translate-y-0"
                  style={{
                    background:
                      "linear-gradient(90deg, #08476E 0%, #0B5C8E 55%, #08476E 100%)",
                  }}
                >
                  {L === "en" ? "Learn more" : "Xem thêm"}
                </button>
              </Link>
            </div>
          </div>

          {/* ✅ FIX Right image card - thêm overflow-hidden */}
          <div className="relative overflow-hidden">
            {/* ✅ GIẢM kích thước decorative để không tràn quá xa */}
            <div
              className="absolute -left-2 -top-2 md:-left-4 md:-top-4 h-12 w-20 md:h-16 md:w-28 rounded-2xl opacity-25"
              style={{
                background:
                  "linear-gradient(90deg, #F59E0B 0%, #F97316 60%, #EA580C 100%)",
              }}
            />
            <div
              className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 h-16 w-16 md:h-24 md:w-24 rounded-3xl opacity-15"
              style={{ backgroundColor: PRIMARY }}
            />

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_20px_55px_-35px_rgba(2,8,23,.65)]">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={contentImageSrc}
                  alt={L === "en" ? "Service content" : "Nội dung dịch vụ"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>

              <div className="border-t border-slate-200 bg-white p-4">
                <div className="text-[15px] font-semibold text-slate-600">
                  {commitmentLabel}
                </div>
                <div
                  className="mt-1 text-[15px] font-bold break-words"
                  style={{ color: PRIMARY }}
                >
                  {commitmentLine || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
