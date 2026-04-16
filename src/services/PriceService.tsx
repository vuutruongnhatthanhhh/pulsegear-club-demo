// src/services/PriceService.ts
import { supabase } from "@/lib/supabaseClient";

export interface Price {
  id?: number;
  title?: Record<string, string> | null; // jsonb: { vi: "...", en: "..." }
  content?: Record<string, string> | null; // jsonb: { vi: "...", en: "..." }
  url?: string | null;
  main?: boolean | null;
  created_at?: string;
}

/* =======================
   INTERNAL HELPERS
======================= */

// Reset tất cả main = false trước khi set 1 record làm chính
async function clearMainFlag(excludeId?: number) {
  let query = supabase.from("prices").update({ main: false }).eq("main", true);

  if (excludeId !== undefined) {
    query = query.neq("id", excludeId);
  }

  const { error } = await query;
  if (error) throw error;
}

/* =======================
   PRICE CRUD
======================= */

export async function createPrice(payload: Price) {
  if (payload.main) {
    await clearMainFlag();
  }

  const { data, error } = await supabase
    .from("prices")
    .insert([{ ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data as Price;
}

export async function updatePrice(id: number, payload: Partial<Price>) {
  if (payload.main) {
    await clearMainFlag(id);
  }

  const { data, error } = await supabase
    .from("prices")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Price;
}

export async function deletePrice(id: number) {
  const { error } = await supabase.from("prices").delete().eq("id", id);
  if (error) throw error;
}

export async function getPriceById(id: number) {
  const { data, error } = await supabase
    .from("prices")
    .select(`id, title, content, url, main, created_at`)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Price;
}

export async function getAllPrices({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("prices")
    .select(`id, title, content, url, main, created_at`, { count: "exact" });

  const s = (search ?? "").trim();
  if (s) {
    query = query.or(
      `title->>vi.ilike.%${s}%,title->>en.ilike.%${s}%,content->>vi.ilike.%${s}%,content->>en.ilike.%${s}%,id::text.ilike.%${s}%`,
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as Price[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}

/* =======================
   HELPERS
======================= */

export async function getPriceByUrl(url: string) {
  const { data, error } = await supabase
    .from("prices")
    .select(`id, title, content, url, main, created_at`)
    .eq("url", url)
    .single();

  if (error) {
    console.error("Error fetching price by URL:", error);
    return null;
  }

  return data as Price;
}

// Lấy bảng giá chính (main = true)
export async function getMainPrice() {
  const { data, error } = await supabase
    .from("prices")
    .select(`id, title, content, url, main, created_at`)
    .eq("main", true)
    .single();

  if (error) {
    console.error("Error fetching main price:", error);
    return null;
  }

  return data as Price;
}
