"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import CategoryPage from "@/components/category/CategoryPage";
import PageLoading from "@/components/PageLoading";
import { getCategoryBySlug, type Category } from "@/lib/categories";
import { getProductsByCategory, getSaleProducts, type Product } from "@/lib/products";

export default function DynamicCategoryPageClient() {
  const params = useParams<{ category: string }>();
  const slug = params.category;

  const [category, setCategory] = useState<Category | null>(null);
  const [checked, setChecked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    window.scrollTo(0, 0);
    setCategory(null);
    setChecked(false);
    setProducts([]);

    getCategoryBySlug(slug).then((cat) => {
      if (cancelled) return;
      setCategory(cat);
      setChecked(true);
      if (!cat) return;

      // "Giảm giá" isn't a real product category — it's every active product
      // (in any category) that currently has an old_price set.
      const fetchProducts =
        slug === "giam-gia" ? getSaleProducts() : getProductsByCategory(slug);
      fetchProducts.then((data) => {
        if (!cancelled) setProducts(data);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (checked && !category) notFound();
  if (!category) return <PageLoading />;

  return (
    <CategoryPage
      slug={slug}
      title={category.label}
      sub={category.sub ?? { vi: "", en: "" }}
      accent={category.accentColor}
      heroImage={category.img ?? "/images/home/category-men.jpg"}
      products={products}
    />
  );
}
