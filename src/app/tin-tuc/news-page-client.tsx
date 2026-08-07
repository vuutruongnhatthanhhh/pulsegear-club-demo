"use client";

import { useEffect, useState } from "react";
import NewsPage from "@/components/news/NewsPage";
import PageLoading from "@/components/PageLoading";
import { getArticles, type Article } from "@/lib/articles";

export default function NewsPageClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getArticles().then((data) => {
      setArticles(data);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <PageLoading />;

  return <NewsPage articles={articles} />;
}
