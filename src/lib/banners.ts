import { supabase } from "./supabaseClient";

export type BannerSlide = {
  id: number;
  tag: { vi: string; en: string };
  eyebrow: { vi: string; en: string };
  headline: { vi: string[]; en: string[] };
  accentIndex: number;
  sub: { vi: string; en: string };
  cta1: { vi: string; en: string };
  cta1Url: string;
  cta2: { vi: string; en: string };
  cta2Url: string;
  glow: string;
  bg: string;
};

type HomeBannerRow = {
  id: number;
  tag_vi: string;
  tag_en: string;
  eyebrow_vi: string;
  eyebrow_en: string;
  headline_line1_vi: string;
  headline_line2_vi: string;
  headline_line3_vi: string;
  headline_line1_en: string;
  headline_line2_en: string;
  headline_line3_en: string;
  accent_line: number;
  sub_vi: string;
  sub_en: string;
  cta1_label_vi: string;
  cta1_label_en: string;
  cta1_url: string;
  cta2_label_vi: string;
  cta2_label_en: string;
  cta2_url: string;
  glow_color: string;
  image_url: string | null;
};

function mapBanner(row: HomeBannerRow): BannerSlide {
  return {
    id: row.id,
    tag: { vi: row.tag_vi, en: row.tag_en },
    eyebrow: { vi: row.eyebrow_vi, en: row.eyebrow_en },
    headline: {
      vi: [row.headline_line1_vi, row.headline_line2_vi, row.headline_line3_vi],
      en: [row.headline_line1_en, row.headline_line2_en, row.headline_line3_en],
    },
    accentIndex: row.accent_line,
    sub: { vi: row.sub_vi, en: row.sub_en },
    cta1: { vi: row.cta1_label_vi, en: row.cta1_label_en },
    cta1Url: row.cta1_url || "#",
    cta2: { vi: row.cta2_label_vi, en: row.cta2_label_en },
    cta2Url: row.cta2_url || "#",
    glow: row.glow_color,
    bg: row.image_url ?? "/images/home/hero-1.jpg",
  };
}

export async function getBanners(): Promise<BannerSlide[]> {
  const { data, error } = await supabase
    .from("home_banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return data.map(mapBanner);
}
