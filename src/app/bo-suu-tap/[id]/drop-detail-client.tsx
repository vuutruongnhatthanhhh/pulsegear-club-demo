"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import CategoryPage from "@/components/category/CategoryPage";
import PageLoading from "@/components/PageLoading";
import { getDropById, type Drop } from "@/lib/drops";
import { getProductsByDrop, type Product } from "@/lib/products";

export default function DropDetailPageClient() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [drop, setDrop] = useState<Drop | null>(null);
  const [checked, setChecked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    window.scrollTo(0, 0);
    setDrop(null);
    setChecked(false);
    setProducts([]);

    if (!Number.isFinite(id)) {
      setChecked(true);
      return;
    }

    getDropById(id).then((data) => {
      if (cancelled) return;
      setDrop(data);
      setChecked(true);
      if (!data) return;

      getProductsByDrop(id).then((list) => {
        if (!cancelled) setProducts(list);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (checked && !drop) notFound();
  if (!drop) return <PageLoading />;

  return (
    <CategoryPage
      slug={`bo-suu-tap-${drop.id}`}
      title={{ vi: drop.title, en: drop.title }}
      sub={drop.sub}
      accent={drop.glow}
      heroImage={drop.img}
      products={products}
    />
  );
}
