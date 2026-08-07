import { supabase } from "./supabaseClient";

export type ProductColor = { name: { vi: string; en: string }; hex: string };

export type Product = {
  id: number;
  slug: string;
  name: { vi: string; en: string };
  price: number;
  oldPrice?: number;
  img: string; // cover image — images[0]
  images: string[]; // full gallery, in display order
  tag?: { vi: string; en: string } | null;
  rating?: number;
  description?: { vi: string; en: string }; // rich HTML from the admin editor
  colors: ProductColor[]; // optional — empty when this product has no color options
  sizes: string[]; // optional — empty when this product has no size options
  // Set on results that span several real categories (e.g. getSaleProducts) so
  // links/cart entries can point at the product's real category instead of
  // whatever virtual listing it's being shown on.
  categorySlug?: string;
};

export type CategoryMeta = {
  slug: string;
  title: { vi: string; en: string };
  sub: { vi: string; en: string };
  accent: string;
  heroImage: string;
};

type ProductRow = {
  id: number;
  slug: string;
  name_vi: string;
  name_en: string;
  price: number;
  old_price: number | null;
  tag_vi: string;
  tag_en: string;
  rating: number;
  description_vi: string;
  description_en: string;
  product_images: { image_url: string; sort_order: number }[] | null;
  product_colors: { name_vi: string; name_en: string; hex_color: string; sort_order: number }[] | null;
  product_sizes: { label: string; sort_order: number }[] | null;
};

function mapProduct(row: ProductRow, categorySlug?: string): Product {
  const images = [...(row.product_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.image_url);

  const colors = [...(row.product_colors ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({ name: { vi: c.name_vi, en: c.name_en }, hex: c.hex_color }));

  const sizes = [...(row.product_sizes ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => s.label);

  return {
    id: row.id,
    slug: row.slug,
    name: { vi: row.name_vi, en: row.name_en },
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    img: images[0] ?? "",
    images,
    tag: row.tag_vi || row.tag_en ? { vi: row.tag_vi, en: row.tag_en } : null,
    rating: row.rating,
    description: { vi: row.description_vi, en: row.description_en },
    colors,
    sizes,
    categorySlug,
  };
}

const PRODUCT_SELECT =
  "id, slug, name_vi, name_en, price, old_price, tag_vi, tag_en, rating, description_vi, description_en, product_images(image_url, sort_order), product_colors(name_vi, name_en, hex_color, sort_order), product_sizes(label, sort_order)";

/** All active products in a given category (by URL slug, e.g. "do-nam"). */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`${PRODUCT_SELECT}, categories!inner(href)`)
    .eq("categories.href", `/${categorySlug}`)
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as unknown as ProductRow[]).map((row) => mapProduct(row, categorySlug));
}

/** A single product, scoped to its category slug (matches the /san-pham/[category]/[slug] route). */
export async function getProduct(categorySlug: string, productSlug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`${PRODUCT_SELECT}, categories!inner(href)`)
    .eq("categories.href", `/${categorySlug}`)
    .eq("slug", productSlug)
    .single();

  if (error || !data) return null;
  return mapProduct(data as unknown as ProductRow);
}

/**
 * "Giảm giá" isn't a real product category — it's every active product (in any
 * category) that currently has an old_price set. See migrations/024_create_products.sql.
 */
export async function getSaleProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`${PRODUCT_SELECT}, categories!inner(href)`)
    .not("old_price", "is", null)
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as unknown as (ProductRow & { categories: { href: string } })[]).map(
    (row) => mapProduct(row, row.categories.href.replace(/^\//, "")),
  );
}

/** All active products belonging to a given collection/drop. Used by /bo-suu-tap/[id]. */
export async function getProductsByDrop(dropId: number): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`${PRODUCT_SELECT}, categories!inner(href)`)
    .eq("drop_id", dropId)
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as unknown as (ProductRow & { categories: { href: string } })[]).map(
    (row) => mapProduct(row, row.categories.href.replace(/^\//, "")),
  );
}

export type ProductSearchResult = Product & { categorySlug: string; categoryAccent: string };

/** Searches product names (VI+EN) across every category. Used by /search. */
export async function searchProducts(query: string): Promise<ProductSearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  // PostgREST's .or() filter treats "," "(" ")" as syntax — strip them so a
  // search containing those characters doesn't break the query.
  const safe = q.replace(/[,()]/g, " ").trim();
  if (!safe) return [];

  const { data, error } = await supabase
    .from("products")
    .select(`${PRODUCT_SELECT}, categories!inner(href, accent_color)`)
    .eq("is_active", true)
    .or(`name_vi.ilike.%${safe}%,name_en.ilike.%${safe}%`)
    .order("sort_order");

  if (error || !data) return [];
  return (data as unknown as (ProductRow & { categories: { href: string; accent_color: string } })[]).map(
    (row) => ({
      ...mapProduct(row),
      categorySlug: row.categories.href.replace(/^\//, ""),
      categoryAccent: row.categories.accent_color,
    }),
  );
}
