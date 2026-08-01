import { supabase } from "./supabaseClient";

export type StorySection = {
  eyebrow: { vi: string; en: string };
  headline: { vi: string[]; en: string[] };
  accentIndex: number;
  paragraph1: { vi: string; en: string };
  paragraph2: { vi: string; en: string };
  ctaLabel: { vi: string; en: string };
  ctaUrl: string;
  image: string;
  imageOverlayEyebrow: { vi: string; en: string };
  imageOverlayTitle: { vi: string; en: string };
  stat1Value: string;
  stat1Label: { vi: string; en: string };
  stat2Value: string;
  stat2Label: { vi: string; en: string };
};

type StoryRow = {
  eyebrow_vi: string;
  eyebrow_en: string;
  headline_line1_vi: string;
  headline_line2_vi: string;
  headline_line3_vi: string;
  headline_line1_en: string;
  headline_line2_en: string;
  headline_line3_en: string;
  accent_line: number;
  paragraph1_vi: string;
  paragraph1_en: string;
  paragraph2_vi: string;
  paragraph2_en: string;
  cta_label_vi: string;
  cta_label_en: string;
  cta_url: string;
  image_url: string | null;
  image_overlay_eyebrow_vi: string;
  image_overlay_eyebrow_en: string;
  image_overlay_title_vi: string;
  image_overlay_title_en: string;
  stat1_value: string;
  stat1_label_vi: string;
  stat1_label_en: string;
  stat2_value: string;
  stat2_label_vi: string;
  stat2_label_en: string;
};

export async function getStorySection(): Promise<StorySection | null> {
  const { data, error } = await supabase
    .from("home_story_section")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  const row = data as StoryRow;

  return {
    eyebrow: { vi: row.eyebrow_vi, en: row.eyebrow_en },
    headline: {
      vi: [row.headline_line1_vi, row.headline_line2_vi, row.headline_line3_vi],
      en: [row.headline_line1_en, row.headline_line2_en, row.headline_line3_en],
    },
    accentIndex: row.accent_line,
    paragraph1: { vi: row.paragraph1_vi, en: row.paragraph1_en },
    paragraph2: { vi: row.paragraph2_vi, en: row.paragraph2_en },
    ctaLabel: { vi: row.cta_label_vi, en: row.cta_label_en },
    ctaUrl: row.cta_url || "/gioi-thieu",
    image: row.image_url ?? "/images/home/story.jpg",
    imageOverlayEyebrow: { vi: row.image_overlay_eyebrow_vi, en: row.image_overlay_eyebrow_en },
    imageOverlayTitle: { vi: row.image_overlay_title_vi, en: row.image_overlay_title_en },
    stat1Value: row.stat1_value,
    stat1Label: { vi: row.stat1_label_vi, en: row.stat1_label_en },
    stat2Value: row.stat2_value,
    stat2Label: { vi: row.stat2_label_vi, en: row.stat2_label_en },
  };
}
