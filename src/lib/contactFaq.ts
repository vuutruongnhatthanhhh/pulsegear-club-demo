import { supabase } from "./supabaseClient";

export type FaqItem = {
  id: number;
  q: { vi: string; en: string };
  a: { vi: string; en: string };
};

export type FaqSectionData = {
  eyebrow: { vi: string; en: string };
  title: { vi: string; en: string };
};

type FaqItemRow = {
  id: number;
  question_vi: string;
  question_en: string;
  answer_vi: string;
  answer_en: string;
};

type SectionRow = {
  eyebrow_vi: string;
  eyebrow_en: string;
  title_vi: string;
  title_en: string;
};

export async function getFaqs(): Promise<FaqItem[]> {
  const { data, error } = await supabase
    .from("contact_faqs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as FaqItemRow[]).map((row) => ({
    id: row.id,
    q: { vi: row.question_vi, en: row.question_en },
    a: { vi: row.answer_vi, en: row.answer_en },
  }));
}

export async function getFaqSection(): Promise<FaqSectionData | null> {
  const { data, error } = await supabase
    .from("contact_faq_section")
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
