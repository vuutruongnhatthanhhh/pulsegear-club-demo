"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { useI18nStore, type Lang } from "@/lib/i18n/store";
import {
  getAllServices,
  type ServiceWithCategory,
} from "@/services/ServiceService";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

type Copy = {
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  searchPlaceholder: string;
  searchButton: string;
  loading: string;
  noResults: string;
  resultsFor: string;
  foundResults: string;
  readMore: string;
};

const COPY: Record<Lang, Copy> = {
  vi: {
    breadcrumbHome: "Trang chủ",
    breadcrumbCurrent: "Tìm kiếm",
    searchPlaceholder: "Nhập từ khóa tìm kiếm...",
    searchButton: "Tìm kiếm",
    loading: "Đang tìm kiếm...",
    noResults: "Không tìm thấy kết quả nào",
    resultsFor: "Kết quả tìm kiếm cho",
    foundResults: "Tìm thấy",
    readMore: "Xem thêm",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Search",
    searchPlaceholder: "Enter search keyword...",
    searchButton: "Search",
    loading: "Searching...",
    noResults: "No results found",
    resultsFor: "Search results for",
    foundResults: "Found",
    readMore: "Read more",
  },
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const lang = useI18nStore((s) => s.lang);
  const c = COPY[lang];

  const [services, setServices] = useState<ServiceWithCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    setSearchTerm(query);
    if (query.trim()) {
      performSearch(query);
    }
  }, [query, lang]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setServices([]);
      return;
    }

    try {
      setLoading(true);

      // Lấy tất cả services
      const { data: allServices } = await getAllServices({
        page: 1,
        limit: 9999,
      });

      // Lọc theo title (case-insensitive)
      const searchLower = searchQuery.toLowerCase().trim();
      const filtered = allServices.filter((service) => {
        const titleVi = (service.title.vi || "").toLowerCase();
        const titleEn = (service.title.en || "").toLowerCase();

        return titleVi.includes(searchLower) || titleEn.includes(searchLower);
      });

      setServices(filtered);
    } catch (error) {
      console.error("Error searching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = String(formData.get("q") ?? "").trim();
    if (q) {
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(q)}`);
      performSearch(q);
    }
  };

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

        {/* Search Box */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ color: PRIMARY }}>
            {c.breadcrumbCurrent}
          </h1>
          <div
            className="mt-2 h-[3px] w-16 mb-6"
            style={{ backgroundColor: ACCENT }}
          />

          {/* <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/10">
                <input
                  name="q"
                  defaultValue={searchTerm}
                  placeholder={c.searchPlaceholder}
                  className="h-12 w-full px-5 text-[14px] text-slate-900 outline-none"
                />
                <button
                  type="submit"
                  className="flex h-12 w-14 shrink-0 items-center justify-center bg-[#F3C969] text-white hover:brightness-95"
                  aria-label={c.searchButton}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </form> */}
        </div>

        {/* Results */}
        {loading ? (
          <div className="w-full">
            <div className="w-full flex flex-col items-center justify-center max-w-7xl mx-auto px-4 py-20 text-center">
              <Loader2 className="animate-spin w-8 h-8 text-gray-400 mb-3" />
              <p className="text-gray-500">{c.loading}</p>
            </div>
          </div>
        ) : query.trim() ? (
          <>
            {/* Result count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {c.resultsFor} <span className="font-semibold">"{query}"</span>
                {services.length > 0 && (
                  <span className="ml-2">
                    - {c.foundResults}{" "}
                    <span className="font-semibold">{services.length}</span>{" "}
                    {lang === "vi" ? "kết quả" : "results"}
                  </span>
                )}
              </p>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-400 mb-2">
                  <Search size={48} className="mx-auto mb-4" />
                </div>
                <p className="text-gray-500 text-lg">{c.noResults}</p>
                <p className="text-gray-400 text-sm mt-2">
                  {lang === "vi"
                    ? "Vui lòng thử lại với từ khóa khác"
                    : "Please try again with different keywords"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    lang={lang}
                    readMore={c.readMore}
                    searchTerm={query}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-2">
              <Search size={48} className="mx-auto mb-4" />
            </div>
            <p className="text-gray-500">
              {lang === "vi"
                ? "Nhập từ khóa để tìm kiếm dịch vụ"
                : "Enter keywords to search for services"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  lang,
  readMore,
  searchTerm,
}: {
  service: ServiceWithCategory;
  lang: Lang;
  readMore: string;
  searchTerm: string;
}) {
  const title = service.title[lang] || service.title.vi || "";
  const description = service.desc?.[lang] || service.desc?.vi || "";
  const imgSrc = service.image?.trim() || "/images/services/fallback.jpg";

  // Highlight search term in title
  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;

    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-inherit font-semibold">
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
  };

  return (
    <article className="bg-white border border-gray-200 shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
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
        {/* Title with highlight */}
        <h2 className="text-[16px] font-semibold leading-snug line-clamp-2 mb-2">
          <Link
            href={`/services/${service.url}`}
            className="hover:underline"
            style={{ color: PRIMARY }}
          >
            {highlightText(title, searchTerm)}
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

        {/* Description */}
        <p className="mt-3 text-[14px] leading-6 text-gray-700 line-clamp-3">
          {description}
        </p>

        {/* Button */}
        <div className="mt-4">
          <Link
            href={`/services/${service.url}`}
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: PRIMARY }}
          >
            {readMore}
          </Link>
        </div>
      </div>
    </article>
  );
}
