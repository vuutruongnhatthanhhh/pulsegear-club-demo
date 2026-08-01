import {
  Zap, ShieldCheck, Users, Leaf, Heart, Award, Globe, Star,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "./supabaseClient";

// Must match the icon picker in pulsegearclub-admin's gia-tri-cot-loi/icons.ts.
export const VALUE_ICONS: Record<string, LucideIcon> = {
  Zap, ShieldCheck, Users, Leaf, Heart, Award, Globe, Star,
};

export type ValueCard = {
  id: number;
  icon: string;
  title: { vi: string; en: string };
  desc: { vi: string; en: string };
};

export type ValuesSectionData = {
  eyebrow: { vi: string; en: string };
  title1: { vi: string; en: string };
  title2: { vi: string; en: string };
};

type ValueRow = {
  id: number;
  icon: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
};

type SectionRow = {
  eyebrow_vi: string;
  eyebrow_en: string;
  title1_vi: string;
  title1_en: string;
  title2_vi: string;
  title2_en: string;
};

export async function getValueCards(): Promise<ValueCard[]> {
  const { data, error } = await supabase
    .from("about_values")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as ValueRow[]).map((row) => ({
    id: row.id,
    icon: row.icon,
    title: { vi: row.title_vi, en: row.title_en },
    desc: { vi: row.desc_vi, en: row.desc_en },
  }));
}

export async function getValuesSection(): Promise<ValuesSectionData | null> {
  const { data, error } = await supabase
    .from("about_values_section")
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
