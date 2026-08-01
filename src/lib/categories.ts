import { supabase } from "./supabaseClient";

export type Category = {
  id: number;
  label: { vi: string; en: string };
  sub: { vi: string; en: string } | null;
  count: { vi: string; en: string } | null;
  tag: { vi: string; en: string } | null;
  accentColor: string;
  img: string | null;
  href: string;
};

type CategoryRow = {
  id: number;
  label_vi: string;
  label_en: string;
  sub_vi: string;
  sub_en: string;
  count_vi: string;
  count_en: string;
  tag_vi: string;
  tag_en: string;
  accent_color: string;
  image_url: string | null;
  href: string;
  show_on_homepage: boolean;
};

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    label: { vi: row.label_vi, en: row.label_en },
    sub: row.sub_vi || row.sub_en ? { vi: row.sub_vi, en: row.sub_en } : null,
    count: row.count_vi || row.count_en ? { vi: row.count_vi, en: row.count_en } : null,
    tag: row.tag_vi || row.tag_en ? { vi: row.tag_vi, en: row.tag_en } : null,
    accentColor: row.accent_color,
    img: row.image_url,
    href: row.href,
  };
}

/** All categories, in navbar order — used by the navbar and the /danh-muc page. */
export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (error || !data) return [];
  return (data as CategoryRow[]).map(mapCategory);
}

/** Only the categories flagged to appear in the homepage "Shop by category" grid. */
export async function getHomepageCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("show_on_homepage", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as CategoryRow[]).map(mapCategory);
}
