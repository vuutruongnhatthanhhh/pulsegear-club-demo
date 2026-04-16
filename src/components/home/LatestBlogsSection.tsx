// components/home/LatestBlogsSection.tsx
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import type { Blog } from "@/services/BlogService";

const PRIMARY = "#06446A";
const ACCENT = "#E7BF64";

async function getLatestBlogs(): Promise<Blog[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return [];

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("blog")
    .select("id, title, desc, image, url, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Load latest blogs error:", error);
    return [];
  }

  return (data ?? []) as Blog[];
}

function formatDate(dateString?: string, lang: "vi" | "en" = "vi") {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function LatestBlogsSection() {
  const blogs = await getLatestBlogs();

  if (!blogs.length) return null;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2
              className="text-2xl font-extrabold tracking-wide md:text-3xl"
              style={{ color: PRIMARY }}
            >
              THÔNG TIN, TIN TỨC
            </h2>
            <div
              className="mt-3 h-[3px] w-16"
              style={{ backgroundColor: ACCENT }}
            />
          </div>

          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-75"
            style={{ color: PRIMARY }}
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog, index) => {
            const title = blog.title?.vi || blog.title?.en || "";
            const description = blog.desc?.vi || blog.desc?.en || "";
            const imgSrc = blog.image?.trim() || "/images/blog/fallback.jpg";

            return (
              <article
                key={blog.id}
                className="bg-white border border-gray-200 flex flex-col group hover:shadow-md transition-shadow duration-300"
              >
                {/* Image */}
                <Link
                  href={`/blog/${blog.url}`}
                  className="block relative w-full aspect-[16/9] overflow-hidden"
                >
                  <Image
                    src={imgSrc}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={index === 0}
                  />
                  {/* Accent top bar on hover */}
                  <span
                    className="absolute top-0 left-0 w-0 h-[3px] group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: ACCENT }}
                  />
                </Link>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(blog.created_at)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 mb-3">
                    <Link
                      href={`/blog/${blog.url}`}
                      className="hover:underline"
                      style={{ color: PRIMARY }}
                    >
                      {title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p className="text-[13px] leading-6 text-gray-600 line-clamp-3 flex-1">
                    {description}
                  </p>

                  {/* Read more */}
                  <div className="mt-5">
                    <Link
                      href={`/blog/${blog.url}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all"
                      style={{ color: PRIMARY }}
                    >
                      Xem thêm
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile: view all */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: PRIMARY }}
          >
            Xem tất cả bài viết
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
