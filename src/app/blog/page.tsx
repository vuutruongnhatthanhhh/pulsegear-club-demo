// app/blog/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Loader2, User } from "lucide-react";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import { getAllBlogs, type Blog } from "@/services/BlogService";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

type Copy = {
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  loading: string;
  noData: string;
  readMore: string;
  postedOn: string;
};

const COPY: Record<Lang, Copy> = {
  vi: {
    breadcrumbHome: "Trang chủ",
    breadcrumbCurrent: "Tin tức",
    loading: "Đang tải...",
    noData: "Chưa có bài viết nào",
    readMore: "Xem thêm",
    postedOn: "Đăng ngày",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "News",
    loading: "Loading...",
    noData: "No posts available",
    readMore: "Read more",
    postedOn: "Posted on",
  },
};

export default function BlogPage() {
  const lang = useI18nStore((s) => s.lang);
  const c = COPY[lang];

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Scroll to top ngay khi page thay đổi
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await getAllBlogs({
          page,
          limit: 12,
        });

        setBlogs(result.data);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, lang]);

  return (
    <div className="w-full bg-white">
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

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: PRIMARY }}>
            {c.breadcrumbCurrent}
          </h1>
          <div
            className="mt-2 h-[3px] w-16"
            style={{ backgroundColor: ACCENT }}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="w-full">
            <div className="w-full flex items-center justify-center max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{c.noData}</div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  lang={lang}
                  readMore={c.readMore}
                  postedOn={c.postedOn}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Số trang tối đa hiển thị

    if (totalPages <= maxVisible) {
      // Nếu ít trang, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic hiển thị rút gọn
      if (currentPage <= 3) {
        // Ở đầu: 1 2 3 4 ... 10
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Ở cuối: 1 ... 7 8 9 10
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Ở giữa: 1 ... 4 5 6 ... 10
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-10 flex justify-center items-center gap-2">
      {pageNumbers.map((pageNum, index) => {
        if (pageNum === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          );
        }

        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum as number)}
            className={`px-4 py-2 rounded transition-colors ${
              isActive
                ? "text-white font-semibold"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            style={isActive ? { backgroundColor: PRIMARY } : undefined}
          >
            {pageNum}
          </button>
        );
      })}
    </div>
  );
}

function BlogCard({
  blog,
  lang,
  readMore,
  postedOn,
}: {
  blog: Blog;
  lang: Lang;
  readMore: string;
  postedOn: string;
}) {
  const title = blog.title[lang] || blog.title.vi || "";
  const description = blog.desc?.[lang] || blog.desc?.vi || "";
  const imgSrc = blog.image?.trim() || "/images/blog/fallback.jpg";

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="bg-white border border-gray-200 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      {/* Image */}
      <Link
        href={`/blog/${blog.url}`}
        className="block relative w-full aspect-[16/9] overflow-hidden"
      >
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover hover:scale-[1.02] transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      {/* Body */}
      <div className="p-4">
        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(blog.created_at)}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-[16px] font-semibold leading-snug line-clamp-2">
          <Link
            href={`/blog/${blog.url}`}
            className="hover:underline"
            style={{ color: PRIMARY }}
          >
            {title}
          </Link>
        </h2>

        {/* Description */}
        <p className="mt-3 text-[14px] leading-6 text-gray-700 line-clamp-3">
          {description}
        </p>

        {/* Button */}
        <div className="mt-4">
          <Link
            href={`/blog/${blog.url}`}
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: PRIMARY }}
          >
            {readMore}
          </Link>
        </div>
      </div>
    </article>
  );
}
