"use client";

import CategoryPage from "@/components/category/CategoryPage";
import { CATEGORY_META, PRODUCTS_BY_CATEGORY } from "@/lib/products";

const meta = CATEGORY_META["lien-mach"];

export default function LienMachPage() {
  return (
    <CategoryPage
      slug="lien-mach"
      title={meta.title}
      sub={meta.sub}
      accent={meta.accent}
      heroImage={meta.heroImage}
      products={PRODUCTS_BY_CATEGORY["lien-mach"]}
    />
  );
}
