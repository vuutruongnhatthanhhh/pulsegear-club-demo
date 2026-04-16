// src/components/home/ConsultingAreasSection.tsx
"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import type {
  Specialize,
  I18N,
  SpecializeContentItem,
} from "@/services/SpecializeService";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

function LangSafe(l: Lang) {
  return l === "vi" || l === "en" ? l : ("vi" as Lang);
}

function i18nText(v?: I18N | null, lang: Lang = "vi") {
  if (!v) return "";
  const L = LangSafe(lang);
  return ((v?.[L] ?? v?.vi ?? v?.en ?? "") as string).trim();
}

function getLucideIconByName(name?: string | null) {
  if (!name) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[name] ?? null;
}

function ContentItem({
  item,
  lang,
}: {
  item: SpecializeContentItem;
  lang: "vi" | "en";
}) {
  const text = (item[lang] || item.vi || item.en || "").trim();
  const href = item.href?.trim();

  const inner = (
    <li className="flex items-start gap-2 group/item">
      <span className="mt-[2px] shrink-0">
        <ChevronRight
          className="h-4 w-4 transition-transform group-hover/item:translate-x-0.5"
          style={{ color: ACCENT }}
        />
      </span>
      <span
        className={[
          "text-[16px] leading-relaxed transition-colors",
          href
            ? "text-gray-700 hover:text-[#06446A] underline-offset-2 hover:underline cursor-pointer"
            : "text-gray-700",
        ].join(" ")}
      >
        {text}
      </span>
    </li>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }

  return inner;
}

export default function ConsultingAreasSection({
  specializes,
}: {
  specializes: Specialize[];
}) {
  const lang = useI18nStore((s) => s.lang);
  const L = LangSafe(lang);

  const heading =
    L === "en" ? "WE SPECIALIZE IN CONSULTING" : "CHÚNG TÔI CHUYÊN TƯ VẤN VỀ";
  const subheading =
    L === "en"
      ? "Law Firm – Your trusted legal partner"
      : "Công ty Luật – Đồng hành pháp lý cùng bạn";

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
        {/* Header */}
        <div className="text-center">
          <h2
            className="text-2xl font-extrabold tracking-wide md:text-3xl"
            style={{ color: PRIMARY }}
          >
            {heading}
          </h2>
          <p className="mt-4 text-[16px]">{subheading}</p>
          <div className="mt-5 flex justify-center">
            <span
              className="h-[3px] w-32 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {specializes?.length ? (
            specializes.map((sp) => {
              const title = i18nText(sp.title as any, L);
              const contentItems = sp.content?.items ?? [];
              const Icon = getLucideIconByName(sp.icon);
              const IconNode = Icon ? (
                <Icon className="h-6 w-6 text-white" />
              ) : (
                <LucideIcons.HelpCircle className="h-6 w-6 text-white" />
              );

              return (
                <article
                  key={String(sp.id)}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-35px_rgba(2,8,23,.45)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-36px_rgba(2,8,23,.55)]"
                >
                  {/* Icon + Title */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className="grid h-14 w-14 place-items-center rounded-full shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${PRIMARY} 0%, #0A5A8A 60%, ${PRIMARY} 100%)`,
                        }}
                        title={sp.icon || ""}
                      >
                        {IconNode}
                      </div>
                      <span
                        className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-4 ring-white"
                        style={{ backgroundColor: ACCENT }}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="text-[17px] font-extrabold uppercase tracking-wider break-words whitespace-normal"
                        style={{ color: PRIMARY }}
                      >
                        {title || (L === "en" ? "Untitled" : "Chưa có tiêu đề")}
                      </h3>
                      <div
                        className="mt-2 h-[2px] w-24 rounded-full"
                        style={{ backgroundColor: ACCENT }}
                      />
                    </div>
                  </div>

                  {/* List */}
                  {contentItems.length ? (
                    <ul className="mt-4 space-y-2.5">
                      {contentItems.map((item, idx) => (
                        <ContentItem key={idx} item={item} lang={L} />
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-[16px] text-gray-500">
                      {L === "en" ? "No content yet." : "Chưa có nội dung."}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-5">
                    <div className="h-px w-full bg-slate-200/80" />
                    <div
                      className="mt-3 h-1 w-10 rounded-full transition-all group-hover:w-16"
                      style={{ backgroundColor: PRIMARY }}
                    />
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              {L === "en"
                ? "No specialize data."
                : "Chưa có dữ liệu specialize."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
