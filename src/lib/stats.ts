import { supabase } from "./supabaseClient";

export type Stat = {
  id: number;
  value: string;
  label: { vi: string; en: string };
};

type StatRow = {
  id: number;
  value: string;
  label_vi: string;
  label_en: string;
};

export async function getStats(): Promise<Stat[]> {
  const { data, error } = await supabase
    .from("home_stats")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as StatRow[]).map((row) => ({
    id: row.id,
    value: row.value,
    label: { vi: row.label_vi, en: row.label_en },
  }));
}
