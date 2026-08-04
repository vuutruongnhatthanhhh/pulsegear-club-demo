import { supabase } from "./supabaseClient";

export type AboutStat = {
  id: number;
  value: string;
  label: { vi: string; en: string };
};

type AboutStatRow = {
  id: number;
  value: string;
  label_vi: string;
  label_en: string;
};

export async function getAboutStats(): Promise<AboutStat[]> {
  const { data, error } = await supabase
    .from("about_stats")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as AboutStatRow[]).map((row) => ({
    id: row.id,
    value: row.value,
    label: { vi: row.label_vi, en: row.label_en },
  }));
}
