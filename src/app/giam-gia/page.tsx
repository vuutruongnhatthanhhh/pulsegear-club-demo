"use client";

import CategoryPage from "@/components/category/CategoryPage";
import { CATEGORY_META, PRODUCTS_BY_CATEGORY } from "@/lib/products";

const meta = CATEGORY_META["giam-gia"];

export default function GiamGiaPage() {
  return (
    <CategoryPage
      slug="giam-gia"
      title={meta.title}
      sub={meta.sub}
      accent={meta.accent}
      heroImage={meta.heroImage}
      products={PRODUCTS_BY_CATEGORY["giam-gia"]}
    />
  );
}
