import type { Metadata } from "next";
import { getArticle } from "@/lib/articles";
import { baseOpenGraph } from "@/app/shared-metadata";
import ArticleDetailPageClient from "./article-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const title = article.title.vi;
  const description = article.excerpt.vi;

  return {
    title,
    description,
    openGraph: {
      ...baseOpenGraph,
      type: "article",
      title,
      description,
      images: article.img ? [{ url: article.img, width: 1200, height: 750 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.img ? [article.img] : undefined,
    },
  };
}

export default function Page() {
  return <ArticleDetailPageClient />;
}
