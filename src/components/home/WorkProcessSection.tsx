"use client";

import React from "react";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import type { Process, I18N } from "@/services/ProcessService";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

function safeLang(lang: Lang) {
  return lang === "vi" || lang === "en" ? lang : ("vi" as Lang);
}

function i18nText(v?: I18N | null, lang: Lang = "vi") {
  if (!v) return "";
  const L = safeLang(lang);
  return ((v?.[L] ?? v?.vi ?? v?.en ?? "") as string).trim();
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function WorkProcessSection({
  processes,
}: {
  processes: Process[];
}) {
  const lang = useI18nStore((s) => s.lang);
  const L = safeLang(lang);

  const list = (processes ?? []).slice().sort((a, b) => {
    const sa = a.step ?? 999999;
    const sb = b.step ?? 999999;
    if (sa !== sb) return sa - sb;
    const ca = a.created_at ? new Date(a.created_at).getTime() : 0;
    const cb = b.created_at ? new Date(b.created_at).getTime() : 0;
    return ca - cb;
  });

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
        {/* Heading */}
        <div className="flex flex-col items-start gap-3">
          <h2
            className="text-2xl font-extrabold tracking-wide md:text-3xl"
            style={{ color: PRIMARY }}
          >
            {L === "vi" ? "QUY TRÌNH LÀM VIỆC" : "WORK PROCESS"}
          </h2>

          <div className="flex items-center gap-3 mt-2">
            <span
              className="h-[3px] w-16 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            <span className="text-[16px] ">
              {L === "vi"
                ? "Rõ ràng từng bước – theo dõi dễ dàng – tối ưu thời gian"
                : "Clear steps – easy tracking – optimized timeline"}
            </span>
          </div>
        </div>

        {/* Steps row */}
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {list.length ? (
            list.map((p, idx) => {
              const title = i18nText(p.title as any, L);
              const desc = i18nText(p.content as any, L);
              const badge = pad2(idx + 1);

              return (
                <div key={String(p.id)} className="relative">
                  {/* connector (desktop) */}
                  {idx < list.length - 1 && (
                    <div className="pointer-events-none absolute right-[-10px] top-[52px] hidden h-[2px] w-5 md:block">
                      <div
                        className="h-full w-full"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(6,68,106,.15), rgba(231,191,100,.9))",
                        }}
                      />
                    </div>
                  )}

                  <article className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_-40px_rgba(2,8,23,.55)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-42px_rgba(2,8,23,.65)]">
                    {/* Top band */}
                    <div
                      className="relative px-5 pb-4 pt-5"
                      style={{
                        background: `linear-gradient(135deg, ${PRIMARY} 0%, #0A5A8A 55%, ${PRIMARY} 100%)`,
                      }}
                    >
                      {/* big number */}
                      <div className="flex items-start justify-between">
                        <div className="text-[44px] font-black leading-none text-white/95">
                          {badge}
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="px-5 pb-6 pt-4">
                      <h3
                        className="text-[17px] font-extrabold uppercase tracking-wider"
                        style={{ color: PRIMARY }}
                      >
                        {title || (L === "vi" ? "Chưa có tiêu đề" : "Untitled")}
                      </h3>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className="h-[2px] w-10 rounded-full transition-all group-hover:w-14"
                          style={{ backgroundColor: ACCENT }}
                        />
                        <span className="text-sm text-slate-600">
                          {L === "vi" ? "Bước" : "Step"} {idx + 1}
                        </span>
                      </div>

                      {desc ? (
                        <p className="mt-3 text-[16px] leading-relaxed text-justify hyphens-auto">
                          {desc}
                        </p>
                      ) : (
                        <p className="mt-3 text-[16px] leading-relaxed text-gray-500">
                          {L === "vi" ? "Chưa có nội dung." : "No content yet."}
                        </p>
                      )}
                    </div>
                  </article>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              {L === "en" ? "No process data." : "Chưa có dữ liệu process."}
            </div>
          )}
        </div>

        {/* Note (optional) */}
        <div
          className="mt-8 rounded-2xl p-6 shadow-[0_20px_45px_-30px_rgba(6,68,106,.65)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(6,68,106,.08) 0%, rgba(231,191,100,.18) 100%)",
            border: "1px solid rgba(231,191,100,.65)",
          }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold tracking-wide shadow-sm"
              style={{
                background: "linear-gradient(135deg, #E7BF64 0%, #F3D88B 100%)",
                color: PRIMARY,
              }}
            >
              <span className="h-2 w-2 rounded-full bg-[#06446A]" />
              {L === "vi" ? "CAM KẾT" : "COMMITMENT"}
            </span>

            <p className="text-[16px] font-semibold text-slate-700">
              {L === "vi"
                ? "Minh bạch chi phí • Bám sát tiến độ • Bảo mật thông tin • Hỗ trợ sau hoàn tất"
                : "Transparent fees • On-time delivery • Confidentiality • Post-completion support"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
