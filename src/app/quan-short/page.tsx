"use client";

import CategoryPage from "@/components/category/CategoryPage";
import { CATEGORY_META, PRODUCTS_BY_CATEGORY } from "@/lib/products";

const meta = CATEGORY_META["quan-short"];

export default function QuanShortPage() {
  return (
    <CategoryPage
      slug="quan-short"
      title={meta.title}
      sub={meta.sub}
      accent={meta.accent}
      heroImage={meta.heroImage}
      products={PRODUCTS_BY_CATEGORY["quan-short"]}
    />
  );
}
