import {
  Target, Eye, Compass, Flag, Rocket, Heart, Award, ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "./supabaseClient";

// Must match the icon picker in pulsegearclub-admin's mission-vision-form.tsx.
export const MISSION_VISION_ICONS: Record<string, LucideIcon> = {
  Target, Eye, Compass, Flag, Rocket, Heart, Award, ShieldCheck,
};

export type MissionVisionCard = {
  icon: string;
  title: { vi: string; en: string };
  text: { vi: string; en: string };
};

export type MissionVisionSection = {
  mission: MissionVisionCard;
  vision: MissionVisionCard;
};

type MissionVisionRow = {
  mission_icon: string;
  mission_title_vi: string;
  mission_title_en: string;
  mission_text_vi: string;
  mission_text_en: string;
  vision_icon: string;
  vision_title_vi: string;
  vision_title_en: string;
  vision_text_vi: string;
  vision_text_en: string;
};

// Fallback — the content already hardcoded in gioi-thieu/page.tsx before this table existed.
export const FALLBACK_MISSION_VISION: MissionVisionSection = {
  mission: {
    icon: "Target",
    title: { vi: "SỨ MỆNH", en: "MISSION" },
    text: {
      vi: "Trang bị cho mọi vận động viên — dù chuyên nghiệp hay mới bắt đầu — những sản phẩm hiệu suất cao, bền bỉ và vừa vặn với mọi cơ thể.",
      en: "Equip every athlete — pro or just starting out — with high-performance gear that's durable and fits every body.",
    },
  },
  vision: {
    icon: "Eye",
    title: { vi: "TẦM NHÌN", en: "VISION" },
    text: {
      vi: "Trở thành thương hiệu trang phục thể thao được tin dùng nhất châu Á, nơi hiệu suất và trách nhiệm với hành tinh song hành.",
      en: "Become Asia's most trusted performance apparel brand, where performance and planet-friendly manufacturing go hand in hand.",
    },
  },
};

export async function getMissionVisionSection(): Promise<MissionVisionSection | null> {
  const { data, error } = await supabase
    .from("about_mission_vision_section")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  const row = data as MissionVisionRow;

  return {
    mission: {
      icon: row.mission_icon,
      title: { vi: row.mission_title_vi, en: row.mission_title_en },
      text: { vi: row.mission_text_vi, en: row.mission_text_en },
    },
    vision: {
      icon: row.vision_icon,
      title: { vi: row.vision_title_vi, en: row.vision_title_en },
      text: { vi: row.vision_text_vi, en: row.vision_text_en },
    },
  };
}
