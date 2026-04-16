// app/(public)/contact/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import ConsultationRequestForm from "@/components/home/ConsultationRequestForm";
import {
  getLatestContact,
  type Contact,
  type I18N,
} from "@/services/ContactService";
import {
  getAllCategoriesService,
  type CategoryService,
} from "@/services/CategoriesService";
import { getLatestBlogs, type Blog } from "@/services/BlogService";
import {
  getHighlightedServices,
  type Service,
} from "@/services/ServiceService";
import { Star } from "lucide-react";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

function LangSafe(l: Lang) {
  return l === "vi" || l === "en" ? l : ("vi" as Lang);
}

type Copy = {
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  title: string;
  sidebarInfoTitle: string;
  sidebarHighlightTitle: string;
  sidebarLatestTitle: string;
  sidebarBlogLink: string;
};

const COPY: Record<Lang, Copy> = {
  vi: {
    breadcrumbHome: "Trang chủ",
    breadcrumbCurrent: "Liên hệ",
    title: "Liên hệ",
    sidebarInfoTitle: "Danh mục thông tin",
    sidebarHighlightTitle: "Các dịch vụ",
    sidebarLatestTitle: "Bài viết mới nhất",
    sidebarBlogLink: "Tin tức",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Contact",
    title: "Contact",
    sidebarInfoTitle: "Information Categories",
    sidebarHighlightTitle: "Featured Services",
    sidebarLatestTitle: "Latest Posts",
    sidebarBlogLink: "News",
  },
};

function renderHighlightBlocks(html: string): string {
  return html.replace(
    /<div([^>]*data-type="highlight-block")[^>]*data-content="([^"]*)"[^>]*><\/div>/gi,
    (match, attrs, encodedContent) => {
      const content = encodedContent
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      return `<div data-type="highlight-block">${content}</div>`;
    },
  );
}

export default function ContactPage() {
  const lang = useI18nStore((s) => s.lang);
  const L = LangSafe(lang);
  const c = COPY[L];

  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryService[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [highlightedServices, setHighlightedServices] = useState<Service[]>([]);
  const [processedContent, setProcessedContent] = useState<string>("");

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoading(true);
        const data = await getLatestContact();
        setContact(data);
      } catch (err: any) {
        if (!err?.message?.includes("No rows")) {
          console.error("Lỗi khi fetch contact:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchContact();
  }, []);

  useEffect(() => {
    if (!contact) return;
    const rawHtml =
      contact.content?.[L] || contact.content?.vi || contact.content?.en || "";
    setProcessedContent(renderHighlightBlocks(rawHtml));
  }, [contact, L]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoadingCategories(true);
        const res = await getAllCategoriesService({
          page: 1,
          limit: 1000,
          level: 1,
        });
        setCategories(res.data.reverse());
      } catch (err) {
        console.error("Lỗi fetch categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const latest = await getLatestBlogs(5);
        setLatestBlogs(latest);
      } catch (err) {
        console.error("Lỗi fetch latest blogs:", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setHighlightedServices(await getHighlightedServices(6));
      } catch {}
    })();
  }, []);

  const getCategoryName = (cat: CategoryService) => {
    return cat.name[L] || cat.name.vi || cat.name.en || "";
  };

  return (
    <div className="w-full">
      <style jsx global>{`
        /* ══════════════════════════════════════
           Contact content — base styles
        ══════════════════════════════════════ */
        .contact-content strong {
          color: #06446a;
          font-weight: bold;
        }
        .contact-content ul {
          list-style: none;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .contact-content li {
          position: relative;
          margin-bottom: 0.75rem;
          line-height: 2rem;
          padding-left: 0;
        }
        .contact-content li::before {
          content: "";
          position: absolute;
          left: -1.5rem;
          top: 0.75rem;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #e7bf64;
        }
        .contact-content p {
          margin: 1rem 0;
        }

        /* ══════════════════════════════════════
           Highlight Block
        ══════════════════════════════════════ */
        .contact-content div[data-type="highlight-block"] {
          border: 1.5px solid #06446a;
          border-radius: 6px;
          padding: 14px 18px;
          margin: 1.5rem 0;
          background-color: #eeeeee;
        }
        .contact-content div[data-type="highlight-block"] ul {
          list-style: none;
          margin: 0.25rem 0 0 0;
          padding-left: 0;
        }
        .contact-content div[data-type="highlight-block"] ul li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.4rem;
          line-height: 1.7;
        }
        .contact-content div[data-type="highlight-block"] ul li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #06446a;
          font-size: 1.3rem;
          font-weight: bold;
          line-height: 1;
          top: 0.1em;
          width: auto;
          height: auto;
          border-radius: 0;
          background-color: transparent;
        }
        .contact-content div[data-type="highlight-block"] ol {
          counter-reset: item;
          list-style: none;
          margin: 0.25rem 0 0 0;
          padding-left: 0;
        }
        .contact-content div[data-type="highlight-block"] ol li {
          position: relative;
          padding-left: 2rem;
          margin-bottom: 0.4rem;
          counter-increment: item;
          line-height: 1.7;
        }
        .contact-content div[data-type="highlight-block"] ol li::before {
          content: counter(item) ".";
          position: absolute;
          left: 0;
          color: #06446a;
          font-weight: 700;
          font-size: 1rem;
          width: auto;
          height: auto;
          border-radius: 0;
          background-color: transparent;
          top: 0;
        }
        .contact-content div[data-type="highlight-block"] p {
          margin-bottom: 0.4rem;
          text-align: left;
        }
        .contact-content div[data-type="highlight-block"] p:last-child {
          margin-bottom: 0;
        }
        .contact-content div[data-type="highlight-block"] strong,
        .contact-content div[data-type="highlight-block"] b {
          font-weight: 700;
          color: inherit;
        }
        .contact-content div[data-type="highlight-block"] a {
          color: #06446a;
          text-decoration: underline;
          text-decoration-color: #e7bf64;
          text-underline-offset: 3px;
        }
        .contact-content div[data-type="highlight-block"] a:hover {
          color: #e7bf64;
        }
        .contact-content div[data-type="highlight-block"] h1,
        .contact-content div[data-type="highlight-block"] h2,
        .contact-content div[data-type="highlight-block"] h3 {
          color: #06446a;
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-5">
          <Link href="/" className="hover:underline">
            {c.breadcrumbHome}
          </Link>
          <span className="mx-2">/</span>
          <span style={{ color: PRIMARY }} className="font-medium">
            {c.breadcrumbCurrent}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* MAIN */}
          <main className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold" style={{ color: PRIMARY }}>
                {c.title}
              </h1>
              <div
                className="mt-2 h-[3px] w-16"
                style={{ backgroundColor: ACCENT }}
              />
              <div className="mt-4 h-px w-full bg-gray-200" />
            </div>

            {isLoading ? (
              <div className="text-center py-10 text-gray-500">Đang tải...</div>
            ) : contact ? (
              <div className="space-y-4 leading-8 text-[17px]">
                <div
                  className="contact-content text-justify"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Chưa có thông tin liên hệ
              </div>
            )}

            <ConsultationRequestForm />
          </main>

          {/* SIDEBAR */}
          <aside className="space-y-8">
            <SidebarBox title={c.sidebarInfoTitle}>
              {isLoadingCategories ? (
                <div className="px-4 py-3 text-gray-400">
                  {L === "vi" ? "Đang tải..." : "Loading..."}
                </div>
              ) : categories.length === 0 ? (
                <div className="px-4 py-3 text-gray-400">
                  {L === "vi" ? "Chưa có danh mục" : "No categories"}
                </div>
              ) : (
                <>
                  {categories.map((cat) => (
                    <SidebarItem
                      key={cat.id}
                      label={getCategoryName(cat)}
                      href={`/services?category_id=${cat.id}`}
                    />
                  ))}
                  <SidebarItem label={c.sidebarBlogLink} href="/blog" />
                </>
              )}
            </SidebarBox>

            {highlightedServices.length > 0 && (
              <SidebarBox title={c.sidebarHighlightTitle}>
                {highlightedServices.map((s) => (
                  <HighlightedServiceItem key={s.id} service={s} lang={L} />
                ))}
              </SidebarBox>
            )}

            {latestBlogs.length > 0 && (
              <SidebarBox title={c.sidebarLatestTitle}>
                {latestBlogs.map((b) => (
                  <LatestBlogItem key={b.id} blog={b} lang={L} />
                ))}
              </SidebarBox>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ===== Sidebar components ===== */

function SidebarBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
      <div
        className="px-4 py-3 font-semibold text-white text-sm"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, #0A5A88 100%)`,
        }}
      >
        {title.toUpperCase()}
      </div>
      <div className="divide-y divide-gray-200">{children}</div>
    </div>
  );
}

function SidebarItem({ label, href }: { label: string; href?: string }) {
  if (href) {
    return (
      <Link
        href={href}
        className="px-4 py-3 text-[16px] hover:bg-gray-200 transition-colors cursor-pointer flex gap-2"
      >
        <span style={{ color: PRIMARY }} className="opacity-80">
          ::
        </span>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <div className="px-4 py-3 text-[16px] hover:bg-gray-200 transition-colors cursor-pointer flex gap-2">
      <span style={{ color: PRIMARY }} className="opacity-80">
        ::
      </span>
      <span>{label}</span>
    </div>
  );
}

function HighlightedServiceItem({
  service,
  lang,
}: {
  service: Service;
  lang: Lang;
}) {
  const title = service.title[lang] || service.title.vi || "";
  const desc = service.desc?.[lang] || service.desc?.vi || "";
  const imgSrc = service.image?.trim() || null;
  return (
    <Link
      href={`/services/${service.url}`}
      className="flex gap-3 p-3 hover:bg-gray-50 transition-colors group"
    >
      {imgSrc ? (
        <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="128px"
            quality={90}
            unoptimized={imgSrc.startsWith("http")}
          />
        </div>
      ) : (
        <div
          className="w-16 h-16 flex-shrink-0 rounded flex items-center justify-center"
          style={{ backgroundColor: `${PRIMARY}15` }}
        >
          <Star
            className="w-6 h-6"
            fill={ACCENT}
            stroke={ACCENT}
            strokeWidth={1}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-medium line-clamp-2 leading-snug group-hover:underline"
          style={{ color: PRIMARY }}
        >
          {title}
        </h4>
        {desc && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{desc}</p>
        )}
      </div>
    </Link>
  );
}

function LatestBlogItem({ blog, lang }: { blog: Blog; lang: Lang }) {
  const title = blog.title[lang] || blog.title.vi || "";
  const description = blog.desc?.[lang] || blog.desc?.vi || "";
  const imgSrc = blog.image?.trim() || "/images/blog/fallback.jpg";

  return (
    <Link
      href={`/blog/${blog.url}`}
      className="flex gap-3 p-3 hover:bg-gray-50 transition-colors"
    >
      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="160px"
          quality={90}
          unoptimized={imgSrc.startsWith("http")}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-medium line-clamp-2 leading-snug hover:underline"
          style={{ color: PRIMARY }}
        >
          {title}
        </h4>
        {description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {description}
          </p>
        )}
        {blog.created_at && (
          <p className="text-xs text-gray-500 mt-1">
            {new Date(blog.created_at).toLocaleDateString(
              lang === "vi" ? "vi-VN" : "en-US",
              { month: "short", day: "numeric", year: "numeric" },
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
