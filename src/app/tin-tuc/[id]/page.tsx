"use client";

import { useParams, notFound } from "next/navigation";
import ArticleDetail from "@/components/news/ArticleDetail";
import { ARTICLES, getArticle } from "@/lib/articles";

export default function ArticleDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const article = getArticle(id);

  if (!article) {
    notFound();
  }

  const related = ARTICLES.filter((a) => a.id !== id).slice(0, 3);

  return <ArticleDetail article={article} related={related} />;
}
