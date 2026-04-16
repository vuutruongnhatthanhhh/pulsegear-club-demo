// src/app/services/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, Eye, Loader2 } from "lucide-react";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import {
  getAllServices,
  type ServiceWithCategory,
} from "@/services/ServiceService";
import {
  getCategoryServiceById,
  getAllCategoryIdsIncludingChildren,
} from "@/services/CategoriesService";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

type Copy = {
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  loading: string;
  noData: string;
  readMore: string;
};

const COPY: Record<Lang, Copy> = {
  vi: {
    breadcrumbHome: "Trang chủ",
    breadcrumbCurrent: "Dịch vụ",
    loading: "Đang tải...",
    noData: "Chưa có dịch vụ nào",
    readMore: "Xem thêm",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Services",
    loading: "Loading...",
    noData: "No services available",
    readMore: "Read more",
  },
};

export default function ServicePage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id");

  const lang = useI18nStore((s) => s.lang);
  const c = COPY[lang];

  const [services, setServices] = useState<ServiceWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Scroll to top ngay khi page thay đổi
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchData = async () => {
      try {
        setLoading(true);

        let categoryIdsToFetch: number[] | undefined = undefined;

        // Fetch category name nếu có category_id
        if (categoryId) {
          const cat = await getCategoryServiceById(Number(categoryId));
          setCategoryName(lang === "vi" ? cat.name.vi : cat.name.en);

          // Lấy tất cả category IDs bao gồm cả children
          categoryIdsToFetch = await getAllCategoryIdsIncludingChildren(
            Number(categoryId),
          );
        } else {
          setCategoryName(c.breadcrumbCurrent);
        }

        // Fetch services
        const result = await getAllServices({
          page,
          limit: 12,
          category_ids: categoryIdsToFetch, // Truyền mảng IDs thay vì 1 ID
        });

        setServices(result.data);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, page, lang]);

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
            {categoryName}
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: PRIMARY }}>
            {categoryName}
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
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{c.noData}</div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  lang={lang}
                  readMore={c.readMore}
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

function ServiceCard({
  service,
  lang,
  readMore,
}: {
  service: ServiceWithCategory;
  lang: Lang;
  readMore: string;
}) {
  const title = service.title[lang] || service.title.vi || "";

  // Lấy desc theo ngôn ngữ (JSONB)
  const description = service.desc?.[lang] || service.desc?.vi || "";

  const imgSrc = service.image?.trim() || "/images/services/fallback.jpg";

  return (
    <article className="bg-white border border-gray-200 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      {/* Image */}
      <Link
        href={`/services/${service.url}`}
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
        {/* Title */}
        <h2 className="text-[16px] font-semibold leading-snug line-clamp-2">
          <Link
            href={`/services/${service.url}`}
            className="hover:underline"
            style={{ color: PRIMARY }}
          >
            {title}
          </Link>
        </h2>

        {/* Category badge */}
        {service.category && (
          <div className="mt-2">
            <span
              className="inline-block text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: ACCENT + "30",
                color: PRIMARY,
              }}
            >
              {service.category.name[lang] || service.category.name.vi}
            </span>
          </div>
        )}

        {/* Description - Plain text from JSONB desc */}
        <p className="mt-3 text-[14px] leading-6 text-gray-700 line-clamp-3">
          {description}
        </p>

        {/* Button */}
        <div className="mt-4">
          <Link
            href={`/services/${service.url}`}
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            {readMore}
          </Link>
        </div>
      </div>
    </article>
  );
}
