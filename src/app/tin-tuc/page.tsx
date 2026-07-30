"use client";

import NewsPage from "@/components/news/NewsPage";
import { ARTICLES } from "@/lib/articles";

export default function TinTucPage() {
  return <NewsPage articles={ARTICLES} />;
}
