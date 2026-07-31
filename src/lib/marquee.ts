import { supabase } from "./supabaseClient";

export type MarqueeItem = {
  id: number;
  text: { vi: string; en: string };
};

type HomeMarqueeRow = {
  id: number;
  text_vi: string;
  text_en: string;
};

export async function getMarqueeItems(): Promise<MarqueeItem[]> {
  const { data, error } = await supabase
    .from("home_marquee_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as HomeMarqueeRow[]).map((row) => ({
    id: row.id,
    text: { vi: row.text_vi, en: row.text_en },
  }));
}
