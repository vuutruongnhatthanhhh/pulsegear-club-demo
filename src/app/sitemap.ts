// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllCategories } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import { getArticles } from "@/lib/articles";
import { getAllDrops } from "@/lib/drops";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/danh-muc`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/bo-suu-tap`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/tin-tuc`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/gioi-thieu`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/lien-he`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [categories, articles, drops] = await Promise.all([
    getAllCategories(),
    getArticles(),
    getAllDrops(),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}${c.href}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const dropRoutes: MetadataRoute.Sitemap = drops.map((d) => ({
    url: `${SITE_URL}/bo-suu-tap/${d.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/tin-tuc/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // "Giảm giá" is a virtual category (old_price IS NOT NULL) — no products are
  // assigned to it directly, so skip it here to avoid a pointless empty fetch.
  const sellableCategories = categories.filter((c) => c.href !== "/giam-gia");
  const productsByCategory = await Promise.all(
    sellableCategories.map((c) => getProductsByCategory(c.href.replace(/^\//, "")))
  );
  const productRoutes: MetadataRoute.Sitemap = sellableCategories.flatMap((c, i) =>
    productsByCategory[i].map((p) => ({
      url: `${SITE_URL}${c.href}/${p.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }))
  );

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...dropRoutes,
    ...articleRoutes,
    ...productRoutes,
  ];
}
