"use client";

import CategoryPage from "@/components/category/CategoryPage";
import { CATEGORY_META, PRODUCTS_BY_CATEGORY } from "@/lib/products";

const meta = CATEGORY_META["do-nu"];

export default function DoNuPage() {
  return (
    <CategoryPage
      slug="do-nu"
      title={meta.title}
      sub={meta.sub}
      accent={meta.accent}
      heroImage={meta.heroImage}
      products={PRODUCTS_BY_CATEGORY["do-nu"]}
    />
  );
}
