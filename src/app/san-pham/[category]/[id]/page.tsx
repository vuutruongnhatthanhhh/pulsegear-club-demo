"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import { CATEGORY_META, PRODUCTS_BY_CATEGORY, getProduct } from "@/lib/products";

export default function ProductDetailPage() {
  const params = useParams<{ category: string; id: string }>();
  const categorySlug = params.category;
  const id = Number(params.id);

  const category = CATEGORY_META[categorySlug];
  const product = getProduct(categorySlug, id);

  if (!category || !product) {
    notFound();
  }

  const related = (PRODUCTS_BY_CATEGORY[categorySlug] || [])
    .filter((p) => p.id !== id)
    .slice(0, 4);

  return (
    <ProductDetail product={product} category={category} related={related} />
  );
}
