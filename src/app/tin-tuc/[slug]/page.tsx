"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import ArticleDetail from "@/components/news/ArticleDetail";
import PageLoading from "@/components/PageLoading";
import { getArticle, getArticles, type Article } from "@/lib/articles";

export default function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [article, setArticle] = useState<Article | null>(null);
  const [checked, setChecked] = useState(false);
  const [related, setRelated] = useState<Article[]>([]);

  useEffect(() => {
    let cancelled = false;
    setArticle(null);
    setChecked(false);
    setRelated([]);

    getArticle(slug).then((data) => {
      if (cancelled) return;
      setArticle(data);
      setChecked(true);
    });

    getArticles().then((data) => {
      if (cancelled) return;
      setRelated(data.filter((a) => a.slug !== slug).slice(0, 3));
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (checked && !article) notFound();
  if (!article) return <PageLoading />;

  return <ArticleDetail article={article} related={related} />;
}
