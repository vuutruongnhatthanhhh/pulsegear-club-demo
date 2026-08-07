import type { Metadata } from "next";
import { baseOpenGraph } from "@/app/shared-metadata";
import NewsPageClient from "./news-page-client";

const title = "Tin Tức & Cảm Hứng";
const description =
  "Mẹo tập luyện, câu chuyện vận động viên và tin tức mới nhất từ PULSEGEAR.CLUB.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { ...baseOpenGraph, type: "website", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function Page() {
  return <NewsPageClient />;
}
