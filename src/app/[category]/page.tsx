import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/categories";
import { baseOpenGraph } from "@/app/shared-metadata";
import DynamicCategoryPageClient from "./category-page-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const title = category.label.vi;
  const description =
    category.sub?.vi || `Mua sắm ${category.label.vi} chính hãng tại PULSEGEAR.CLUB.`;

  return {
    title,
    description,
    openGraph: {
      ...baseOpenGraph,
      type: "website",
      title,
      description,
      images: category.img ? [{ url: category.img, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: category.img ? [category.img] : undefined,
    },
  };
}

export default function Page() {
  return <DynamicCategoryPageClient />;
}
