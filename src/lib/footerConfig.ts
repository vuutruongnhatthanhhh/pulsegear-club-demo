import { supabase } from "./supabaseClient";

export type FooterConfig = {
  address: string;
  phone: string;
  email: string;
};

// Fallback — the content already hardcoded in Footer.tsx before this table existed.
export const FALLBACK_FOOTER_CONFIG: FooterConfig = {
  address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
  phone: "0812 303 471",
  email: "hello@pulsegear.club",
};

export async function getFooterConfig(): Promise<FooterConfig | null> {
  const { data, error } = await supabase
    .from("site_footer_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  return {
    address: data.address,
    phone: data.phone,
    email: data.email,
  };
}
