import { supabase } from "./supabaseClient";

export type Review = {
  id: number;
  name: string;
  handle: string;
  text: { vi: string; en: string };
  stars: number;
  product: string;
};

export type ReviewsSectionData = {
  eyebrow: { vi: string; en: string };
  title1: { vi: string; en: string };
  title2: { vi: string; en: string };
};

type ReviewRow = {
  id: number;
  name: string;
  handle: string;
  stars: number;
  product: string;
  text_vi: string;
  text_en: string;
};

type SectionRow = {
  eyebrow_vi: string;
  eyebrow_en: string;
  title1_vi: string;
  title1_en: string;
  title2_vi: string;
  title2_en: string;
};

export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("home_reviews")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as ReviewRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    handle: row.handle,
    text: { vi: row.text_vi, en: row.text_en },
    stars: row.stars,
    product: row.product,
  }));
}

export async function getReviewsSection(): Promise<ReviewsSectionData | null> {
  const { data, error } = await supabase
    .from("home_reviews_section")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  const row = data as SectionRow;
  return {
    eyebrow: { vi: row.eyebrow_vi, en: row.eyebrow_en },
    title1: { vi: row.title1_vi, en: row.title1_en },
    title2: { vi: row.title2_vi, en: row.title2_en },
  };
}
