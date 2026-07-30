"use client";

import CategoryPage from "@/components/category/CategoryPage";
import { CATEGORY_META, PRODUCTS_BY_CATEGORY } from "@/lib/products";

const meta = CATEGORY_META["phu-kien"];

export default function PhuKienPage() {
  return (
    <CategoryPage
      slug="phu-kien"
      title={meta.title}
      sub={meta.sub}
      accent={meta.accent}
      heroImage={meta.heroImage}
      products={PRODUCTS_BY_CATEGORY["phu-kien"]}
    />
  );
}
