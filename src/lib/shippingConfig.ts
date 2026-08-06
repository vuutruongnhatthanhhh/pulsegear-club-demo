import { supabase } from "./supabaseClient";

// Fallback — matches the "always free" behavior hardcoded before this table existed.
export const FALLBACK_SHIPPING_FEE = 0;

export async function getShippingFee(): Promise<number | null> {
  const { data, error } = await supabase
    .from("site_shipping_config")
    .select("shipping_fee")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  return data.shipping_fee;
}
