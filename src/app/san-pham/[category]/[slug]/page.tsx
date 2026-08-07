import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/categories";
import { getProduct } from "@/lib/products";
import { baseOpenGraph } from "@/app/shared-metadata";
import { stripHtml } from "@/lib/seo";
import ProductDetailPageClient from "./product-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) return {};

  const title = product.name.vi;
  const description = product.description?.vi
    ? stripHtml(product.description.vi)
    : `Mua ${product.name.vi} chính hãng tại PULSEGEAR.CLUB.`;

  return {
    title,
    description,
    openGraph: {
      ...baseOpenGraph,
      type: "website",
      title,
      description,
      images: product.img ? [{ url: product.img, width: 1200, height: 1500 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.img ? [product.img] : undefined,
    },
  };
}

export default function Page() {
  return <ProductDetailPageClient />;
}
