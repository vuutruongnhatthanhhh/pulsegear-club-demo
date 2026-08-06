"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import PageLoading from "@/components/PageLoading";
import { getCategoryBySlug } from "@/lib/categories";
import {
  getProduct,
  getProductsByCategory,
  type CategoryMeta,
  type Product,
} from "@/lib/products";

export default function ProductDetailPage() {
  const params = useParams<{ category: string; id: string }>();
  const categorySlug = params.category;
  const id = Number(params.id);

  const [category, setCategory] = useState<CategoryMeta | null>(null);
  const [categoryChecked, setCategoryChecked] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [productChecked, setProductChecked] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    setCategory(null);
    setCategoryChecked(false);
    setProduct(null);
    setProductChecked(false);
    setRelated([]);

    getCategoryBySlug(categorySlug).then((cat) => {
      if (cancelled) return;
      setCategory(
        cat
          ? {
              slug: categorySlug,
              title: cat.label,
              sub: cat.sub ?? { vi: "", en: "" },
              accent: cat.accentColor,
              heroImage: cat.img ?? "",
            }
          : null
      );
      setCategoryChecked(true);
    });

    getProduct(categorySlug, id).then((data) => {
      if (cancelled) return;
      setProduct(data);
      setProductChecked(true);
    });

    getProductsByCategory(categorySlug).then((data) => {
      if (cancelled) return;
      setRelated(data.filter((p) => p.id !== id).slice(0, 4));
    });

    return () => {
      cancelled = true;
    };
  }, [categorySlug, id]);

  if (categoryChecked && !category) notFound();
  if (productChecked && !product) notFound();

  if (!category || !product) return <PageLoading />;

  return (
    <ProductDetail product={product} category={category} related={related} />
  );
}
