import { supabase } from "./supabaseClient";

// Fallback — the embed URL already hardcoded in Footer.tsx / lien-he/page.tsx before this table existed.
export const FALLBACK_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4879.504307635821!2d106.6964218!3d10.7393764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f7cd686d175%3A0x7b325abcaf954a51!2sC%C3%B4ng%20ty%20Lu%E1%BA%ADt%20TNHH%20DAI%20%26%20Partners!5e1!3m2!1sen!2s!4v1767084073563!5m2!1sen!2s";

export async function getMapEmbedUrl(): Promise<string | null> {
  const { data, error } = await supabase
    .from("site_map_config")
    .select("embed_url")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  return data.embed_url || null;
}
