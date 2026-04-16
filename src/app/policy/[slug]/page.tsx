// app/policy/[slug]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import { getPolicyByUrl, type Policy } from "@/services/PolicyService";
import { getLatestBlogs, type Blog } from "@/services/BlogService";
import {
  getAllCategoriesService,
  type CategoryService,
} from "@/services/CategoriesService";
import {
  getHighlightedServices,
  type Service,
} from "@/services/ServiceService";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Star } from "lucide-react";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

type Copy = {
  breadcrumbHome: string;
  breadcrumbPolicies: string;
  notFound: string;
  sidebarInfoTitle: string;
  sidebarHighlightTitle: string;
  sidebarLatestTitle: string;
  sidebarBlogLink: string;
};

const COPY: Record<Lang, Copy> = {
  vi: {
    breadcrumbHome: "Trang chủ",
    breadcrumbPolicies: "Chính sách & Điều khoản",
    notFound: "Không tìm thấy chính sách",
    sidebarInfoTitle: "Danh mục thông tin",
    sidebarHighlightTitle: "Các dịch vụ",
    sidebarLatestTitle: "Bài viết mới nhất",
    sidebarBlogLink: "Tin tức",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbPolicies: "Policies & Terms",
    notFound: "Policy not found",
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

export default function PolicyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const lang = useI18nStore((s) => s.lang);
  const c = COPY[lang];

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<CategoryService[]>([]);
  const [highlightedServices, setHighlightedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [processedContent, setProcessedContent] = useState<string>("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const fetchData = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const policyData = await getPolicyByUrl(slug);
        if (!policyData) {
          setNotFound(true);
          return;
        }
        setPolicy(policyData);
        getLatestBlogs(5).then(setLatestBlogs);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  useEffect(() => {
    if (!policy) return;
    const rawHtml = policy.content?.[lang] || policy.content?.vi || "";
    setProcessedContent(renderHighlightBlocks(rawHtml));
  }, [policy, lang]);

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
      } catch {
      } finally {
        setIsLoadingCategories(false);
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

  const getCategoryName = (cat: CategoryService) =>
    cat.name[lang] || cat.name.vi || cat.name.en || "";

  if (loading)
    return (
      <div className="w-full flex items-center justify-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
      </div>
    );

  if (notFound || !policy)
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        {c.notFound}
      </div>
    );

  const title = policy.title?.[lang] || policy.title?.vi || "";

  return (
    <div className="w-full bg-white">
      <style jsx global>{`
        .policy-content {
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
          color: #1a1a1a;
          line-height: 1.8;
          font-size: 16px;
          text-align: justify;
        }

        /* ══════════════════════════════════════
           Highlight Block
        ══════════════════════════════════════ */
        .policy-content div[data-type="highlight-block"] {
          border: 1.5px solid #06446a;
          border-radius: 6px;
          padding: 14px 18px;
          margin: 1.5rem 0;
          background-color: #eeeeee;
        }
        .policy-content div[data-type="highlight-block"] ul {
          list-style: none;
          margin: 0.25rem 0 0 0;
          padding-left: 0;
        }
        .policy-content div[data-type="highlight-block"] ul li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.4rem;
          line-height: 1.7;
        }
        .policy-content div[data-type="highlight-block"] ul li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #06446a;
          font-size: 1.3rem;
          font-weight: bold;
          line-height: 1;
          top: 0.1em;
        }
        .policy-content div[data-type="highlight-block"] ol {
          counter-reset: item;
          list-style: none;
          margin: 0.25rem 0 0 0;
          padding-left: 0;
        }
        .policy-content div[data-type="highlight-block"] ol li {
          position: relative;
          padding-left: 2rem;
          margin-bottom: 0.4rem;
          counter-increment: item;
          line-height: 1.7;
        }
        .policy-content div[data-type="highlight-block"] ol li::before {
          content: counter(item) ".";
          position: absolute;
          left: 0;
          color: #06446a;
          font-weight: 700;
          font-size: 1rem;
        }
        .policy-content div[data-type="highlight-block"] p {
          margin-bottom: 0.4rem;
          text-align: left;
        }
        .policy-content div[data-type="highlight-block"] p:last-child {
          margin-bottom: 0;
        }
        .policy-content div[data-type="highlight-block"] strong,
        .policy-content div[data-type="highlight-block"] b {
          font-weight: 700;
        }
        .policy-content div[data-type="highlight-block"] a {
          color: #06446a;
          text-decoration: underline;
          text-decoration-color: #e7bf64;
          text-underline-offset: 3px;
        }
        .policy-content div[data-type="highlight-block"] a:hover {
          color: #e7bf64;
        }
        .policy-content div[data-type="highlight-block"] h1,
        .policy-content div[data-type="highlight-block"] h2,
        .policy-content div[data-type="highlight-block"] h3 {
          color: #06446a;
          margin-top: 0;
          margin-bottom: 0.5rem;
        }

        /* ══════════════════════════════════════
           Phần còn lại
        ══════════════════════════════════════ */
        .policy-content h1 {
          color: #000;
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .policy-content h2 {
          color: #000;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          line-height: 1.35;
        }
        .policy-content h3 {
          color: #000;
          font-size: 1.2rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        .policy-content h4 {
          color: #000;
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.625rem;
        }
        .policy-content p {
          margin-bottom: 1.25rem;
          color: black;
          font-weight: 400;
        }
        .policy-content ul {
          list-style: none;
          margin: 1.5rem 0;
          padding-left: 0;
        }
        .policy-content ul li {
          position: relative;
          padding-left: 1.75rem;
          margin-bottom: 0.875rem;
          color: #1a1a1a;
          line-height: 1.7;
        }
        .policy-content ul li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #000;
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 1;
          top: 0.1em;
        }
        .policy-content ol {
          counter-reset: item;
          list-style: none;
          margin: 1.5rem 0;
          padding-left: 0;
        }
        .policy-content ol li {
          position: relative;
          padding-left: 2.25rem;
          margin-bottom: 0.875rem;
          counter-increment: item;
          color: #1a1a1a;
          line-height: 1.7;
        }
        .policy-content ol li::before {
          content: counter(item) ".";
          position: absolute;
          left: 0;
          color: #000;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .policy-content ul ul,
        .policy-content ol ul,
        .policy-content ul ol,
        .policy-content ol ol {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .policy-content ul ul li::before {
          content: "◦";
          font-size: 1.3rem;
        }
        .policy-content a {
          color: #06446a;
          text-decoration: underline;
          text-decoration-color: #e7bf64;
          text-underline-offset: 3px;
          transition: all 0.2s ease;
        }
        .policy-content a:hover {
          color: #e7bf64;
          text-decoration-color: #06446a;
        }
        .policy-content strong,
        .policy-content b {
          font-weight: 700;
          color: #0d0d0d;
        }
        .policy-content em,
        .policy-content i {
          font-style: italic;
          color: #2a2a2a;
        }
        .policy-content blockquote {
          border-left: 4px solid #e7bf64;
          padding: 1.25rem 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #3a3a3a;
          background-color: #fafaf8;
          border-radius: 0 4px 4px 0;
        }
        .policy-content pre {
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 1.25rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .policy-content code {
          background-color: #f5f5f5;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: "Courier New", monospace;
          font-size: 0.9em;
          color: #06446a;
        }
        .policy-content pre code {
          background-color: transparent;
          padding: 0;
        }
        .policy-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 0.95rem;
        }
        .policy-content table th {
          background-color: #06446a;
          color: white;
          padding: 0.875rem;
          text-align: left;
          font-weight: 600;
        }
        .policy-content table td {
          padding: 0.875rem;
          border-bottom: 1px solid #e0e0e0;
          color: #1a1a1a;
        }
        .policy-content table tr:hover {
          background-color: #fafaf8;
        }
        .policy-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .policy-content hr {
          border: none;
          border-top: 2px solid #e7bf64;
          margin: 2.5rem 0;
          opacity: 0.3;
        }
        .policy-content > *:first-child {
          margin-top: 0;
        }
        .policy-content > *:last-child {
          margin-bottom: 0;
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-5">
          <Link href="/" className="hover:underline">
            {c.breadcrumbHome}
          </Link>
          <span className="mx-2">/</span>
          <span className="cursor-default">{c.breadcrumbPolicies}</span>
          <span className="mx-2">/</span>
          <span style={{ color: PRIMARY }} className="font-medium">
            {title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* MAIN CONTENT */}
          <main className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold" style={{ color: PRIMARY }}>
                {title}
              </h1>
              <div
                className="mt-2 h-[3px] w-16"
                style={{ backgroundColor: ACCENT }}
              />
              {policy.created_at && (
                <p className="mt-3 text-sm text-gray-400">
                  {new Date(policy.created_at).toLocaleDateString(
                    lang === "vi" ? "vi-VN" : "en-US",
                    { day: "numeric", month: "long", year: "numeric" },
                  )}
                </p>
              )}
              <div className="mt-4 h-px w-full bg-gray-200" />
            </div>

            <div
              className="policy-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </main>

          {/* SIDEBAR */}
          <aside className="space-y-8">
            {/* 1. Danh mục thông tin */}
            <SidebarBox title={c.sidebarInfoTitle}>
              {isLoadingCategories ? (
                <div className="px-4 py-3">
                  <Loader2 className="animate-spin w-5 h-5 text-gray-400" />
                </div>
              ) : categories.length === 0 ? (
                <div className="px-4 py-3 text-gray-400 text-sm">
                  {lang === "vi" ? "Chưa có danh mục" : "No categories"}
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

            {/* 2. Các dịch vụ nổi bật */}
            {highlightedServices.length > 0 && (
              <SidebarBox title={c.sidebarHighlightTitle}>
                {highlightedServices.map((s) => (
                  <HighlightedServiceItem key={s.id} service={s} lang={lang} />
                ))}
              </SidebarBox>
            )}

            {/* 3. Bài viết mới nhất */}
            {latestBlogs.length > 0 && (
              <SidebarBox title={c.sidebarLatestTitle}>
                {latestBlogs.map((b) => (
                  <LatestBlogItem key={b.id} blog={b} lang={lang} />
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
  const router = useRouter();
  return (
    <div
      className="px-4 py-3 text-[16px] hover:bg-gray-200 transition-colors cursor-pointer flex gap-2"
      onClick={() => {
        if (href) router.push(href);
      }}
      role={href ? "link" : undefined}
    >
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
