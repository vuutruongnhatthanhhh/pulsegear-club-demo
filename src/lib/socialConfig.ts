import { supabase } from "./supabaseClient";
import config from "@/config";

export type SocialConfig = {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  group: string;
  messenger: string;
  zalo: string;
};

// Falls back to the static config.tsx values (used everywhere before this table existed)
// until the DB row loads, or if the table doesn't exist yet.
export const FALLBACK_SOCIAL_CONFIG: SocialConfig = {
  facebook: config.facebook,
  instagram: config.instagram,
  youtube: config.youtube,
  tiktok: config.tiktok,
  group: config.group,
  messenger: config.mess,
  zalo: config.zalo,
};

type SocialRow = {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  group: string;
  messenger: string;
  zalo: string;
};

export async function getSocialConfig(): Promise<SocialConfig | null> {
  const { data, error } = await supabase
    .from("site_social_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  const row = data as SocialRow;
  return {
    facebook: row.facebook,
    instagram: row.instagram,
    youtube: row.youtube,
    tiktok: row.tiktok,
    group: row.group,
    messenger: row.messenger,
    zalo: row.zalo,
  };
}
