import { supabase } from "./supabaseClient";

export type AboutHeroSection = {
  eyebrow: { vi: string; en: string };
  title1: { vi: string; en: string };
  title2: { vi: string; en: string };
  subtitle: { vi: string; en: string };
  image: string;
};

type AboutHeroRow = {
  eyebrow_vi: string;
  eyebrow_en: string;
  title1_vi: string;
  title1_en: string;
  title2_vi: string;
  title2_en: string;
  subtitle_vi: string;
  subtitle_en: string;
  image_url: string | null;
};

// Fallback — the content already hardcoded in gioi-thieu/page.tsx before this table existed.
export const FALLBACK_ABOUT_HERO: AboutHeroSection = {
  eyebrow: { vi: "GIỚI THIỆU", en: "ABOUT US" },
  title1: { vi: "SINH RA ĐỂ", en: "BUILT TO" },
  title2: { vi: "VƯỢT GIỚI HẠN", en: "BREAK LIMITS" },
  subtitle: {
    vi: "PULSEGEAR.CLUB là thương hiệu trang phục thể thao được tạo ra bởi vận động viên, dành cho những người không bao giờ chấp nhận mức trung bình.",
    en: "PULSEGEAR.CLUB is a performance apparel brand built by athletes, for those who never settle for average.",
  },
  image: "/images/about/hero.jpg",
};

export async function getAboutHeroSection(): Promise<AboutHeroSection | null> {
  const { data, error } = await supabase
    .from("about_hero_section")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  const row = data as AboutHeroRow;

  return {
    eyebrow: { vi: row.eyebrow_vi, en: row.eyebrow_en },
    title1: { vi: row.title1_vi, en: row.title1_en },
    title2: { vi: row.title2_vi, en: row.title2_en },
    subtitle: { vi: row.subtitle_vi, en: row.subtitle_en },
    image: row.image_url ?? FALLBACK_ABOUT_HERO.image,
  };
}
