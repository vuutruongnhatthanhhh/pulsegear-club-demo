import { supabase } from "./supabaseClient";

export type TimelineItem = {
  id: number;
  year: string;
  title: { vi: string; en: string };
  desc: { vi: string; en: string };
};

export type TimelineSectionData = {
  eyebrow: { vi: string; en: string };
  title: { vi: string; en: string };
};

type TimelineItemRow = {
  id: number;
  year: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
};

type SectionRow = {
  eyebrow_vi: string;
  eyebrow_en: string;
  title_vi: string;
  title_en: string;
};

export async function getTimelineItems(): Promise<TimelineItem[]> {
  const { data, error } = await supabase
    .from("about_timeline_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as TimelineItemRow[]).map((row) => ({
    id: row.id,
    year: row.year,
    title: { vi: row.title_vi, en: row.title_en },
    desc: { vi: row.desc_vi, en: row.desc_en },
  }));
}

export async function getTimelineSection(): Promise<TimelineSectionData | null> {
  const { data, error } = await supabase
    .from("about_timeline_section")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  const row = data as SectionRow;
  return {
    eyebrow: { vi: row.eyebrow_vi, en: row.eyebrow_en },
    title: { vi: row.title_vi, en: row.title_en },
  };
}
