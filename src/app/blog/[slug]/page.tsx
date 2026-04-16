// app/blog/[slug]/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import {
  getBlogByUrl,
  getLatestBlogs,
  incrementBlogView,
  getAdjacentBlogs,
  getAllBlogs,
  type Blog,
  type BlogWithAuthor,
} from "@/services/BlogService";
import {
  getAllCategoriesService,
  type CategoryService,
} from "@/services/CategoriesService";
import {
  getHighlightedServices,
  type Service,
} from "@/services/ServiceService";
import {
  getLatestTagService,
  type TagService,
} from "@/services/TagServiceService";
import { useParams, useRouter } from "next/navigation";
import {
  Eye,
  Loader2,
  Star,
  List,
  X,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  UserRound,
} from "lucide-react";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";
const STAR_COUNT = 4;

type TocItem = { id: string; text: string; level: number };

type CopyText = {
  breadcrumbHome: string;
  breadcrumbBlog: string;
  notFound: string;
  sidebarInfoTitle: string;
  sidebarHighlightTitle: string;
  sidebarLatestTitle: string;
  sidebarBlogLink: string;
  views: string;
  tocTitle: string;
  shareLabel: string;
  relatedTitle: string;
  readMore: string;
};

const COPY: Record<Lang, CopyText> = {
  vi: {
    breadcrumbHome: "Trang chủ",
    breadcrumbBlog: "Tin tức",
    notFound: "Không tìm thấy bài viết",
    sidebarInfoTitle: "Danh mục thông tin",
    sidebarHighlightTitle: "Các dịch vụ",
    sidebarLatestTitle: "Bài viết mới nhất",
    sidebarBlogLink: "Tin tức",
    views: "lượt xem",
    tocTitle: "Mục lục",
    shareLabel: "Chia sẻ:",
    relatedTitle: "Bài viết liên quan",
    readMore: "Xem thêm",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbBlog: "News",
    notFound: "Article not found",
    sidebarInfoTitle: "Information Categories",
    sidebarHighlightTitle: "Featured Services",
    sidebarLatestTitle: "Latest Posts",
    sidebarBlogLink: "News",
    views: "views",
    tocTitle: "Table of Contents",
    shareLabel: "Share:",
    relatedTitle: "Related Posts",
    readMore: "Read more",
  },
};

function parseTocFromHtml(html: string): { toc: TocItem[]; html: string } {
  const toc: TocItem[] = [];
  let counter = 0;
  const processedHtml = html.replace(
    /<(h[123])([^>]*)>([\s\S]*?)<\/h[123]>/gi,
    (match, tag, attrs, inner) => {
      const level = parseInt(tag[1]);
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const id = `toc-heading-${counter++}`;
      toc.push({ id, text, level });
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    },
  );
  return { toc, html: processedHtml };
}

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

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const lang = useI18nStore((s) => s.lang);
  const c = COPY[lang];

  const [blog, setBlog] = useState<BlogWithAuthor | null>(null);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<CategoryService[]>([]);
  const [highlightedServices, setHighlightedServices] = useState<Service[]>([]);
  const [tagService, setTagService] = useState<TagService | null>(null);
  const [prevBlog, setPrevBlog] = useState<Blog | null>(null);
  const [nextBlog, setNextBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [viewCount, setViewCount] = useState<number>(0);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [processedContent, setProcessedContent] = useState<string>("");
  const [tocOpen, setTocOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const fetchData = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        setPrevBlog(null);
        setNextBlog(null);
        setRelatedBlogs([]);

        const blogData = await getBlogByUrl(slug);
        if (!blogData) {
          setNotFound(true);
          return;
        }

        setBlog(blogData);
        setViewCount((blogData.view_count ?? 0) + 1);
        if (blogData.id) incrementBlogView(blogData.id).then(setViewCount);

        getLatestBlogs(6).then((list) =>
          setLatestBlogs(list.filter((b) => b.id !== blogData.id).slice(0, 5)),
        );

        if (blogData.created_at && blogData.id) {
          getAdjacentBlogs(blogData.created_at, blogData.id).then(
            ({ prev, next }) => {
              setPrevBlog(prev);
              setNextBlog(next);
            },
          );
        }

        getAllBlogs({ page: 1, limit: 5 }).then((res) => {
          setRelatedBlogs(
            res.data.filter((b) => b.id !== blogData.id).slice(0, 4),
          );
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  useEffect(() => {
    if (!blog) return;
    const rawHtml = blog.content[lang] || blog.content.vi || "";
    const withHighlights = renderHighlightBlocks(rawHtml);
    const { toc, html } = parseTocFromHtml(withHighlights);
    setTocItems(toc);
    setProcessedContent(html);
  }, [blog, lang]);

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

  useEffect(() => {
    (async () => {
      try {
        setTagService(await getLatestTagService());
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!tocItems.length) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        }),
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );
    tocItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocItems, processedContent]);

  const handleTocClick = useCallback((id: string) => {
    setTocOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el)
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.pageYOffset - 80,
          behavior: "smooth",
        });
    }, 150);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getCategoryName = (cat: CategoryService) =>
    cat.name[lang] || cat.name.vi || cat.name.en || "";

  if (loading)
    return (
      <div className="w-full flex items-center justify-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
      </div>
    );
  if (notFound || !blog)
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        {c.notFound}
      </div>
    );

  const title = blog.title[lang] || blog.title.vi || "";
  const description = blog.desc?.[lang] || blog.desc?.vi || "";
  const authorName = blog.author_info?.name ?? null;
  const encodedUrl = encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : "",
  );
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: "#1877F2",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Twitter/X",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      bg: "#000",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Tumblr",
      url: `https://www.tumblr.com/share/link?url=${encodedUrl}&name=${encodedTitle}`,
      bg: "#35465C",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469.035-.168.106-.21.239-.21h3.006v6.142h3.965v3.605h-3.966v7.359c.007.876.277 1.538 1.665 1.538.462 0 1.108-.054 1.399-.109l.958 3.257c-.32.091-1.927.239-2.528.239z" />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      bg: "#E60023",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bg: "#0A66C2",
      svg: (
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full bg-white">
      <style jsx global>{`
        .blog-content {
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

        .blog-content div[data-type="highlight-block"] {
          border: 1.5px solid #06446a;
          border-radius: 6px;
          padding: 14px 18px;
          margin: 1.5rem 0;
          background-color: #eeeeee;
        }
        .blog-content div[data-type="highlight-block"] ul {
          list-style: none;
          margin: 0.25rem 0 0 0;
          padding-left: 0;
        }
        .blog-content div[data-type="highlight-block"] ul li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.4rem;
          line-height: 1.7;
        }
        .blog-content div[data-type="highlight-block"] ul li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #06446a;
          font-size: 1.3rem;
          font-weight: bold;
          line-height: 1;
          top: 0.1em;
        }
        .blog-content div[data-type="highlight-block"] ol {
          counter-reset: item;
          list-style: none;
          margin: 0.25rem 0 0 0;
          padding-left: 0;
        }
        .blog-content div[data-type="highlight-block"] ol li {
          position: relative;
          padding-left: 2rem;
          margin-bottom: 0.4rem;
          counter-increment: item;
          line-height: 1.7;
        }
        .blog-content div[data-type="highlight-block"] ol li::before {
          content: counter(item) ".";
          position: absolute;
          left: 0;
          color: #06446a;
          font-weight: 700;
          font-size: 1rem;
        }
        .blog-content div[data-type="highlight-block"] p {
          margin-bottom: 0.4rem;
          text-align: left;
        }
        .blog-content div[data-type="highlight-block"] p:last-child {
          margin-bottom: 0;
        }
        .blog-content div[data-type="highlight-block"] strong,
        .blog-content div[data-type="highlight-block"] b {
          font-weight: 700;
        }
        .blog-content div[data-type="highlight-block"] a {
          color: #06446a;
          text-decoration: underline;
          text-decoration-color: #e7bf64;
          text-underline-offset: 3px;
        }
        .blog-content div[data-type="highlight-block"] a:hover {
          color: #e7bf64;
        }
        .blog-content div[data-type="highlight-block"] h1,
        .blog-content div[data-type="highlight-block"] h2,
        .blog-content div[data-type="highlight-block"] h3 {
          color: #06446a;
          margin-top: 0;
          margin-bottom: 0.5rem;
          scroll-margin-top: 90px;
        }

        .blog-content h1 {
          color: #000;
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
          scroll-margin-top: 90px;
        }
        .blog-content h2 {
          color: #000;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          line-height: 1.35;
          scroll-margin-top: 90px;
        }
        .blog-content h3 {
          color: #000;
          font-size: 1.2rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          scroll-margin-top: 90px;
        }
        .blog-content h4 {
          color: #000;
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.625rem;
        }
        .blog-content p {
          margin-bottom: 1.25rem;
          color: black;
          font-weight: 400;
        }
        .blog-content ul {
          list-style: none;
          margin: 1.5rem 0;
          padding-left: 0;
        }
        .blog-content ul li {
          position: relative;
          padding-left: 1.75rem;
          margin-bottom: 0.875rem;
          color: #1a1a1a;
          line-height: 1.7;
        }
        .blog-content ul li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #000;
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 1;
          top: 0.1em;
        }
        .blog-content ol {
          counter-reset: item;
          list-style: none;
          margin: 1.5rem 0;
          padding-left: 0;
        }
        .blog-content ol li {
          position: relative;
          padding-left: 2.25rem;
          margin-bottom: 0.875rem;
          counter-increment: item;
          color: #1a1a1a;
          line-height: 1.7;
        }
        .blog-content ol li::before {
          content: counter(item) ".";
          position: absolute;
          left: 0;
          color: #000;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .blog-content ul ul,
        .blog-content ol ul,
        .blog-content ul ol,
        .blog-content ol ol {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .blog-content ul ul li::before {
          content: "◦";
          font-size: 1.3rem;
        }
        .blog-content a {
          color: #06446a;
          text-decoration: underline;
          text-decoration-color: #e7bf64;
          text-underline-offset: 3px;
          transition: all 0.2s ease;
        }
        .blog-content a:hover {
          color: #e7bf64;
          text-decoration-color: #06446a;
        }
        .blog-content strong,
        .blog-content b {
          font-weight: 700;
          color: #0d0d0d;
        }
        .blog-content em,
        .blog-content i {
          font-style: italic;
          color: #2a2a2a;
        }
        .blog-content blockquote {
          border-left: 4px solid #e7bf64;
          padding: 1.25rem 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #3a3a3a;
          background-color: #fafaf8;
          border-radius: 0 4px 4px 0;
        }
        .blog-content pre {
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 1.25rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .blog-content code {
          background-color: #f5f5f5;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: "Courier New", monospace;
          font-size: 0.9em;
          color: #06446a;
        }
        .blog-content pre code {
          background-color: transparent;
          padding: 0;
        }
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 0.95rem;
        }
        .blog-content table th {
          background-color: #06446a;
          color: white;
          padding: 0.875rem;
          text-align: left;
          font-weight: 600;
        }
        .blog-content table td {
          padding: 0.875rem;
          border-bottom: 1px solid #e0e0e0;
          color: #1a1a1a;
        }
        .blog-content table tr:hover {
          background-color: #fafaf8;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .blog-content hr {
          border: none;
          border-top: 2px solid #e7bf64;
          margin: 2.5rem 0;
          opacity: 0.3;
        }
        .blog-content > *:first-child {
          margin-top: 0;
        }
        .blog-content > *:last-child {
          margin-bottom: 0;
        }
        .tag-box-content {
          scrollbar-width: thin;
          scrollbar-color: #b0c4d8 transparent;
        }
        .tag-box-content::-webkit-scrollbar {
          width: 5px;
        }
        .tag-box-content::-webkit-scrollbar-thumb {
          background: #b0c4d8;
          border-radius: 3px;
        }
        .tag-box-content p {
          margin: 0 0 0.25rem 0;
        }
        .tag-box-content ul {
          list-style: disc;
          padding-left: 1.25rem;
          margin: 0;
        }
        .tag-box-content ul li {
          margin-bottom: 0.2rem;
          line-height: 1.6;
        }
        .tag-box-header p,
        .tag-box-footer p {
          margin: 0;
        }
        .share-icon {
          transition:
            opacity 0.15s,
            transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 5px;
        }
        .share-icon:hover {
          opacity: 0.82;
          transform: translateY(-2px);
        }
        .nav-btn {
          transition: filter 0.15s;
        }
        .nav-btn:hover {
          filter: brightness(1.13);
        }
        .toc-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          pointer-events: none;
        }
        .toc-overlay.open {
          pointer-events: auto;
        }
        .toc-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          transition: background 0.25s ease;
        }
        .toc-overlay.open .toc-backdrop {
          background: rgba(0, 0, 0, 0.35);
        }
        .toc-panel {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 340px;
          max-width: 85vw;
          background: #fff;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .toc-overlay.open .toc-panel {
          transform: translateX(0);
        }
        .toc-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: linear-gradient(135deg, #06446a 0%, #0a5a88 100%);
          color: white;
          flex-shrink: 0;
        }
        .toc-panel-body {
          flex: 1;
          overflow-y: auto;
          padding: 12px 0;
        }
        .toc-panel-body::-webkit-scrollbar {
          width: 4px;
        }
        .toc-panel-body::-webkit-scrollbar-thumb {
          background: #c5c5c5;
          border-radius: 4px;
        }
        .toc-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 20px;
          cursor: pointer;
          transition: background 0.15s;
          border-left: 3px solid transparent;
        }
        .toc-item:hover {
          background: #f0f6fb;
          border-left-color: #e7bf64;
        }
        .toc-item.active {
          background: #e8f3fa;
          border-left-color: #06446a;
        }
        .toc-item.active .toc-item-text {
          color: #06446a;
          font-weight: 600;
        }
        .toc-item-text {
          font-size: 13.5px;
          line-height: 1.5;
          color: #2a2a2a;
          flex: 1;
        }
        .toc-item-text.level-1 {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }
        .toc-item-text.level-2 {
          font-size: 13.5px;
        }
        .toc-item-text.level-3 {
          font-size: 13px;
          color: #555;
        }
        .toc-indent-1 {
          padding-left: 20px;
        }
        .toc-indent-2 {
          padding-left: 32px;
        }
        .toc-indent-3 {
          padding-left: 44px;
        }
        .toc-toggle-btn {
          position: fixed;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          z-index: 49;
          display: flex;
          align-items: center;
          background: #06446a;
          color: white;
          border: none;
          cursor: pointer;
          padding: 10px 8px;
          border-radius: 0 8px 8px 0;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
          transition: background 0.2s;
          writing-mode: vertical-rl;
          gap: 6px;
        }
        .toc-toggle-btn:hover {
          background: #0a5a88;
        }
        .toc-toggle-btn-label {
          font-size: 13px;
          font-weight: 600;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          white-space: nowrap;
        }
      `}</style>

      {tocItems.length > 0 && (
        <button
          className="toc-toggle-btn"
          onClick={() => setTocOpen(true)}
          aria-label="Mở mục lục"
        >
          <List size={16} style={{ flexShrink: 0 }} />
          <span className="toc-toggle-btn-label hidden sm:block">
            {c.tocTitle.toUpperCase()}
          </span>
        </button>
      )}

      <div
        className={`toc-overlay${tocOpen ? " open" : ""}`}
        aria-hidden={!tocOpen}
      >
        <div className="toc-backdrop" onClick={() => setTocOpen(false)} />
        <div className="toc-panel" role="dialog">
          <div className="toc-panel-header">
            <div className="flex items-center gap-2">
              <List size={18} />
              <span className="font-semibold text-sm">
                {c.tocTitle.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => setTocOpen(false)}
              className="p-1 rounded hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>
          <div className="toc-panel-body">
            {tocItems.map((item) => (
              <div
                key={item.id}
                className={`toc-item toc-indent-${item.level}${activeId === item.id ? " active" : ""}`}
                onClick={() => handleTocClick(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleTocClick(item.id);
                }}
              >
                {item.level >= 2 && (
                  <ChevronRight
                    size={12}
                    style={{
                      flexShrink: 0,
                      marginTop: 3,
                      opacity: item.level === 3 ? 0.4 : 0.6,
                    }}
                  />
                )}
                <span className={`toc-item-text level-${item.level}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-5">
          <Link href="/" className="hover:underline">
            {c.breadcrumbHome}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:underline">
            {c.breadcrumbBlog}
          </Link>
          <span className="mx-2">/</span>
          <span style={{ color: PRIMARY }} className="font-medium">
            {title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* MAIN */}
          <main className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold" style={{ color: PRIMARY }}>
                {title}
              </h1>

              {/* Author + Stars + Views */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {/* Tên tác giả */}
                {authorName && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <UserRound
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: PRIMARY }}
                    />
                    <span className="font-medium">{authorName}</span>
                  </div>
                )}

                {/* Separator */}
                {authorName && (
                  <span className="text-gray-300 select-none">|</span>
                )}

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5"
                      fill={i < STAR_COUNT ? ACCENT : "none"}
                      stroke={ACCENT}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>

                <span className="text-gray-300 select-none">|</span>

                {/* Views */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>
                    {viewCount.toLocaleString(
                      lang === "vi" ? "vi-VN" : "en-US",
                    )}{" "}
                    {c.views}
                  </span>
                </div>
              </div>

              <div
                className="mt-3 h-[3px] w-16"
                style={{ backgroundColor: ACCENT }}
              />
              <div className="mt-4 h-px w-full bg-gray-200" />
            </div>

            {description && (
              <div className="mb-6 text-gray-700 text-lg leading-relaxed text-justify">
                {description}
              </div>
            )}

            {blog.image && (
              <div className="mb-8 relative w-full aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src={blog.image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 66vw"
                  priority
                />
              </div>
            )}

            <div
              ref={contentRef}
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {tagService && (
              <TagServiceBox tagService={tagService} lang={lang} />
            )}

            {/* Social Share */}
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-600">
                {c.shareLabel}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {shareLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    className="share-icon"
                    style={{ backgroundColor: s.bg }}
                    aria-label={s.name}
                  >
                    {s.svg}
                  </a>
                ))}
                <button
                  onClick={handleCopyLink}
                  title="Copy link"
                  aria-label="Copy link"
                  className="share-icon"
                  style={{ backgroundColor: copied ? "#16a34a" : "#6b7280" }}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Prev / Next */}
            {(prevBlog || nextBlog) && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {prevBlog ? (
                  <Link
                    href={`/blog/${prevBlog.url}`}
                    className="nav-btn flex items-center gap-2 px-4 py-3 rounded text-white text-sm font-medium min-w-0"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    <ChevronLeft size={16} className="flex-shrink-0" />
                    <span className="truncate">
                      {prevBlog.title[lang] || prevBlog.title.vi || ""}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {nextBlog ? (
                  <Link
                    href={`/blog/${nextBlog.url}`}
                    className="nav-btn flex items-center justify-end gap-2 px-4 py-3 rounded text-white text-sm font-medium min-w-0"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    <span className="truncate">
                      {nextBlog.title[lang] || nextBlog.title.vi || ""}
                    </span>
                    <ChevronRight size={16} className="flex-shrink-0" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            )}
          </main>

          {/* SIDEBAR */}
          <aside className="space-y-8">
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

            {highlightedServices.length > 0 && (
              <SidebarBox title={c.sidebarHighlightTitle}>
                {highlightedServices.map((s) => (
                  <HighlightedServiceItem key={s.id} service={s} lang={lang} />
                ))}
              </SidebarBox>
            )}

            {latestBlogs.length > 0 && (
              <SidebarBox title={c.sidebarLatestTitle}>
                {latestBlogs.map((b) => (
                  <LatestBlogItem key={b.id} blog={b} lang={lang} />
                ))}
              </SidebarBox>
            )}
          </aside>
        </div>

        {relatedBlogs.length > 0 && (
          <section className="mt-14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold" style={{ color: PRIMARY }}>
                {c.relatedTitle}
              </h2>
              <div
                className="mt-2 h-[3px] w-16"
                style={{ backgroundColor: ACCENT }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedBlogs.map((b) => (
                <RelatedBlogCard
                  key={b.id}
                  blog={b}
                  lang={lang}
                  readMore={c.readMore}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ===== Tag Service Box ===== */
function TagServiceBox({
  tagService,
  lang,
}: {
  tagService: TagService;
  lang: Lang;
}) {
  const header = tagService.header?.[lang] || tagService.header?.vi || "";
  const content = tagService.content?.[lang] || tagService.content?.vi || "";
  const footer = tagService.footer?.[lang] || tagService.footer?.vi || "";
  if (!header && !content && !footer) return null;
  return (
    <div
      className="mt-8 rounded-xl overflow-hidden"
      style={{
        border: "1.5px solid #a8c4d8",
        fontSize: "15px",
        lineHeight: "1.7",
        color: "#1a1a1a",
      }}
    >
      {header && (
        <div
          className="tag-box-header px-5 py-3 bg-white"
          style={{
            borderBottom: content || footer ? "1px solid #ddeaf3" : "none",
          }}
          dangerouslySetInnerHTML={{ __html: header }}
        />
      )}
      {content && (
        <div
          className="tag-box-content px-5 py-3 overflow-y-auto bg-white"
          style={{
            maxHeight: "160px",
            borderBottom: footer ? "1px solid #ddeaf3" : "none",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
      {footer && (
        <div
          className="tag-box-footer px-5 py-3 font-semibold bg-white"
          dangerouslySetInnerHTML={{ __html: footer }}
        />
      )}
    </div>
  );
}

/* ===== Related Blog Card ===== */
function RelatedBlogCard({
  blog,
  lang,
  readMore,
}: {
  blog: Blog;
  lang: Lang;
  readMore: string;
}) {
  const title = blog.title[lang] || blog.title.vi || "";
  const description = blog.desc?.[lang] || blog.desc?.vi || "";
  const imgSrc = blog.image?.trim() || "/images/blog/fallback.jpg";
  return (
    <article className="bg-white border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col">
      <Link
        href={`/blog/${blog.url}`}
        className="block relative w-full aspect-[16/9] overflow-hidden flex-shrink-0"
      >
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover hover:scale-[1.03] transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 flex-1">
          <Link
            href={`/blog/${blog.url}`}
            className="hover:underline"
            style={{ color: PRIMARY }}
          >
            {title}
          </Link>
        </h3>
        {description && (
          <p className="mt-2 text-[13px] leading-5 text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
        {blog.created_at && (
          <p className="mt-1 text-xs text-gray-400">
            {new Date(blog.created_at).toLocaleDateString(
              lang === "vi" ? "vi-VN" : "en-US",
              { month: "short", day: "numeric", year: "numeric" },
            )}
          </p>
        )}
        <div className="mt-3">
          <Link
            href={`/blog/${blog.url}`}
            className="inline-flex items-center justify-center px-5 py-1.5 text-sm font-semibold text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            {readMore}
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ===== Sidebar ===== */
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
      className="block p-3 hover:bg-gray-50 transition-colors"
    >
      <div className="flex gap-3">
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
      </div>
    </Link>
  );
}
