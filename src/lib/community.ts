import { supabase } from "./supabaseClient";

export type CommunityTile = {
  id: number;
  label: { vi: string; en: string };
  img: string;
  glow: string;
  href: string;
};

type TileRow = {
  id: number;
  label_vi: string;
  label_en: string;
  image_url: string | null;
  glow_color: string;
  href: string;
};

export async function getCommunityTiles(): Promise<CommunityTile[]> {
  const { data, error } = await supabase
    .from("home_community_tiles")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as TileRow[]).map((row) => ({
    id: row.id,
    label: { vi: row.label_vi, en: row.label_en },
    img: row.image_url ?? "/images/home/hero-2.jpg",
    glow: row.glow_color,
    href: row.href || "#",
  }));
}
