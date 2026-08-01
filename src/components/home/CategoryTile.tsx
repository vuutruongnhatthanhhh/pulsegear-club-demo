"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/categories";
import type { Lang } from "@/lib/i18n/store";

const SHOP_NOW: Record<Lang, string> = { vi: "MUA NGAY", en: "SHOP NOW" };

export function CategoryTile({
  cat,
  lang,
  isWide,
}: {
  cat: Category;
  lang: Lang;
  isWide: boolean;
}) {
  return (
    <Link
      href={cat.href}
      className={`group relative overflow-hidden ${isWide ? "col-span-2 lg:col-span-2 lg:row-span-2" : "col-span-1 lg:col-span-2"}`}
      style={{ minHeight: isWide ? "440px" : "210px", display: "block" }}
    >
      {cat.img ? (
        <img
          src={cat.img}
          alt={cat.label[lang]}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: "#161616" }} />
      )}
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
          style={{ backgroundColor: cat.accentColor, color: "#000" }}
        >
          {cat.tag[lang]}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {cat.sub && (
          <p
            className="mb-0.5 text-[9px] font-semibold tracking-[0.2em] uppercase"
            style={{ color: `${cat.accentColor}cc` }}
          >
            {cat.sub[lang]}
          </p>
        )}
        <h3 className={`font-black tracking-tight text-white ${isWide ? "text-3xl" : "text-xl"}`}>
          {cat.label[lang]}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            {cat.count?.[lang] ?? ""}
          </span>
          <span
            className="flex items-center gap-1 text-[11px] font-black tracking-[0.15em] uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ color: cat.accentColor }}
          >
            {SHOP_NOW[lang]} <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}
