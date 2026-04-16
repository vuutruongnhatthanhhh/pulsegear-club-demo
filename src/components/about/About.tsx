// app/about/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import config from "@/config";
import banner from "@/../public/images/about-banner-9.jpg";
import { useI18nStore } from "@/lib/i18n/store";
import { supabase } from "@/lib/supabaseClient";
import { Quote, Mail, User } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
type I18N = { vi?: string; en?: string };

type AboutRow = {
  id: number;
  title: I18N;
  content: I18N;
  created_at?: string;
};

const t = (lang: "vi" | "en", i18n?: { vi?: string; en?: string }) =>
  (i18n?.[lang] ?? i18n?.en ?? i18n?.vi ?? "").trim();

function escapeHtml(input: string) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidUrl(u: string) {
  try {
    if (!u) return false;
    new URL(u);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert TipTap QuoteCard HTML nodes into a "pretty quote" layout
 * (copy y chang bên Practice)
 */
function transformQuoteCards(rawHtml: string) {
  if (!rawHtml?.trim()) return "";

  const doc = new DOMParser().parseFromString(rawHtml, "text/html");

  const quoteIconHtml = renderToStaticMarkup(
    <Quote className="h-6 w-6 text-neutral-400" />
  );

  const nodes = doc.querySelectorAll('div[data-type="quote-card"]');
  nodes.forEach((el) => {
    const source = el.getAttribute("data-source") || "";
    const href = el.getAttribute("data-href") || "";
    const quote = el.getAttribute("data-quote") || "";

    const safeSource = escapeHtml(source.trim());
    const safeQuote = escapeHtml(quote.trim());

    const safeHref = href.trim();
    const hrefOk = isValidUrl(safeHref);

    const sourceLabel = safeSource || (hrefOk ? "Nguồn" : "");
    const sourceLineHtml = sourceLabel
      ? hrefOk
        ? `
          <a
            class="align-middle text-[#033F62] underline underline-offset-2 hover:opacity-80"
            href="${escapeHtml(safeHref)}"
            target="_blank"
            rel="noreferrer noopener"
          >
            ${sourceLabel}
          </a>
        `
        : `
          <span class="align-middle text-neutral-600">
            ${sourceLabel}
          </span>
        `
      : "";

    const html = `
      <div class="rounded-md bg-neutral-50 p-5 ring-1 ring-black/5">
        <div class="flex items-start gap-3">
          <span class="mt-0.5 shrink-0">${quoteIconHtml}</span>
          <div class="text-lg italic leading-relaxed text-neutral-800">
            “${safeQuote || "…"}”
          </div>
        </div>

      ${
        sourceLineHtml
          ? `<div class="mt-2 flex items-start gap-3 text-neutral-600">
         <span class="mt-0.5 shrink-0 w-6"></span>
         <div class="flex items-center gap-2">
           <span class="align-middle">📄</span>
           <span class="align-middle">${sourceLineHtml}</span>
         </div>
       </div>`
          : ""
      }
      </div>
    `;

    const wrapper = doc.createElement("div");
    wrapper.innerHTML = html;

    el.replaceWith(wrapper.firstElementChild as HTMLElement);
  });

  return doc.body.innerHTML;
}

export default function AboutPage() {
  const lang = useI18nStore((s) => s.lang);

  const [about, setAbout] = useState<AboutRow | null>(null);
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        // 1) Lấy bài about mới nhất (tuỳ anh: nếu anh muốn 1 record cố định thì đổi query theo id)
        const { data: aboutRow, error: aboutErr } = await supabase
          .from("about")
          .select("id,title,content,created_at")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (aboutErr) throw aboutErr;

        if (!mounted) return;
        setAbout((aboutRow as AboutRow) ?? null);

        // 2) Lấy people theo about_people -> our_people (giống practice)
        if (aboutRow?.id) {
          const { data: relRows, error: relErr } = await supabase
            .from("about_people")
            .select("our_people(*)")
            .eq("about_id", aboutRow.id);

          if (relErr) throw relErr;

          const ppl = (relRows ?? [])
            .map((x: any) => x.our_people)
            .filter(Boolean);

          if (!mounted) return;
          setPeople(ppl);
        } else {
          setPeople([]);
        }
      } catch (e) {
        // Anh muốn toast thì gắn sonner ở đây cũng được
        if (mounted) {
          setAbout(null);
          setPeople([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // thay vì dùng title lấy từ DB cho HERO
  const heroTitle = lang === "vi" ? "Giới thiệu" : "About Us";

  // title của bài (để hiện trên content)
  const contentTitle = about ? t(lang, about.title) : "";

  const rawContent = about ? t(lang, about.content) : "";

  // Quote cards -> render giống Practice
  const contentHtml = useMemo(
    () => transformQuoteCards(rawContent),
    [rawContent]
  );

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative h-[34vh] min-h-[250px] w-full overflow-hidden md:h-[50vh]">
        <div className="absolute inset-0">
          <Image
            src={banner}
            alt={lang === "vi" ? "Ảnh bìa Giới thiệu" : "About banner"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            placeholder="blur"
          />
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center justify-center px-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow md:text-5xl">
            {heroTitle}
          </h1>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-12 md:py-16">
        {/* LEFT */}
        <article className="md:col-span-8">
          {contentTitle ? (
            <>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-3xl">
                {contentTitle}
              </h2>

              <hr className="my-6 h-[2px] w-full max-w-[680px] border-0 bg-neutral-200" />
            </>
          ) : null}
          {loading ? (
            <div className="text-neutral-500">
              {lang === "vi" ? "Đang tải nội dung..." : "Loading content..."}
            </div>
          ) : !about ? (
            <div className="text-neutral-500">
              {lang === "vi"
                ? "Chưa có nội dung giới thiệu."
                : "No about content yet."}
            </div>
          ) : (
            <div
              className="
                prose prose-neutral max-w-none mt-2

                prose-p:text-[18px] prose-p:text-black
                prose-li:text-[18px] prose-li:text-black

                prose-headings:text-neutral-900
                prose-headings:font-semibold
                prose-headings:tracking-tight

                prose-h1:mt-12 prose-h1:text-4xl md:prose-h1:text-4xl
                prose-h2:mt-12 prose-h2:text-3xl
                prose-h3:mt-10 prose-h3:text-2xl

                [&_h1_strong]:!font-inherit
                [&_h2_strong]:!font-inherit
                [&_h3_strong]:!font-inherit
                [&_h4_strong]:!font-inherit
                [&_h5_strong]:!font-inherit
                [&_h6_strong]:!font-inherit

                prose-strong:font-semibold

                marker:text-[#033F62]

                [&_div.rounded-md]:my-6
              "
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          )}

          {/* LEADERSHIP (dữ liệu thật từ about_people) */}
          <section className="mt-10 md:mt-12">
            <h3 className="text-[22px] md:text-[28px] font-semibold text-[#033F62]">
              {lang === "vi" ? "Ban Lãnh đạo" : "Leadership"}
            </h3>

            <p className="mt-3 text-black text-lg">
              {lang === "vi"
                ? `Ban điều hành của ${config.companyName} bao gồm:`
                : `${config.companyName}'s Executive Management Committee includes:`}
            </p>

            <div className="mt-6 space-y-6">
              {people.length === 0 ? (
                <div className="text-neutral-500">
                  {lang === "vi" ? "Chưa có nhân sự." : "No people assigned."}
                </div>
              ) : (
                people.map((p: any, idx: number) => (
                  <div key={p.id ?? `${p.email ?? "p"}-${idx}`}>
                    <div className="mb-3">
                      <div className="font-bold text-[#033F62] text-xl">
                        {t(lang, p.name)}
                      </div>
                    </div>

                    <div className="space-y-2 text-neutral-800">
                      {p.position && (
                        <div className="flex items-start gap-2 text-lg">
                          <span className="mt-[2px]">
                            <User />
                          </span>
                          <span>{t(lang, p.position)}</span>
                        </div>
                      )}

                      {p.email && (
                        <div className="flex items-start gap-2 text-lg">
                          <span className="mt-[2px]">
                            <Mail />
                          </span>
                          <a
                            href={`mailto:${p.email}`}
                            className="text-[#033F62] hover:underline break-all"
                          >
                            {p.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {idx < people.length - 1 && (
                      <hr className="mt-6 border-t border-neutral-300/90" />
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </article>

        {/* RIGHT */}
        <aside className="md:col-span-4">
          <div className="rounded-md bg-neutral-100 p-6 ring-1 ring-black/5">
            <h4 className="mb-4 text-2xl font-bold text-neutral-900">
              {lang === "vi" ? "Giới thiệu" : "About Us"}
            </h4>

            <ul className="space-y-3 text-[15px]">
              {[
                [lang === "vi" ? "Tổng quan" : "Overview", "/about"],
                [lang === "vi" ? "Văn phòng" : "Offices", "/about/offices"],
                [
                  lang === "vi" ? "Dự án tiêu biểu" : "Notable Recent Projects",
                  "/about/notable-recent-projects",
                ],
                [lang === "vi" ? "Giải thưởng" : "Awards", "/about/awards"],
              ].map(([label, href]) => (
                <li key={String(label)} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#033F62]" />
                  <Link
                    href={String(href)}
                    className="leading-relaxed hover:underline text-[16px]"
                  >
                    {label as string}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-sm bg-[#033F62] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow hover:bg-[#012a42]"
            >
              {lang === "vi" ? "Liên hệ" : "Contact Us"}
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
