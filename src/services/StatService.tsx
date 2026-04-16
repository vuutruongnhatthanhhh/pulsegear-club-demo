// src/services/StatService.ts
import { supabase } from "@/lib/supabaseClient";

export interface Stat {
  id?: number; // int8 (bigint)
  customer?: number | null; // bigint
  satisfied?: number | null; // bigint
  year?: number | null; // bigint
  partners?: number | null; // bigint
  created_at?: string; // timestamptz
}

/* =======================
   STATS CRUD
======================= */

export async function createStat(payload: Stat) {
  const { data, error } = await supabase
    .from("stats")
    .insert([{ ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data as Stat;
}

export async function updateStat(id: number, payload: Partial<Stat>) {
  const { data, error } = await supabase
    .from("stats")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Stat;
}

export async function deleteStat(id: number) {
  const { error } = await supabase.from("stats").delete().eq("id", id);
  if (error) throw error;
}

export async function getStatById(id: number) {
  const { data, error } = await supabase
    .from("stats")
    .select(
      `
        id,
        customer,
        satisfied,
        year,
        partners,
        created_at
      `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Stat;
}

export async function getAllStats({
  page = 1,
  limit = 10,
  search = "",
  year,
}: {
  page?: number;
  limit?: number;
  search?: string;
  year?: number; // filter nhanh theo năm nếu cần
}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("stats").select(
    `
      id,
      customer,
      satisfied,
      year,
      partners,
      created_at
    `,
    { count: "exact" },
  );

  // filter theo year (optional)
  if (typeof year === "number") {
    query = query.eq("year", year);
  }

  // search đơn giản trên các cột số (cast text)
  const s = (search ?? "").trim();
  if (s) {
    const like = `%${s}%`;
    query = query.or(
      [
        `year::text.ilike.${like}`,
        `customer::text.ilike.${like}`,
        `satisfied::text.ilike.${like}`,
        `partners::text.ilike.${like}`,
        `id::text.ilike.${like}`,
      ].join(","),
    );
  }

  const { data, error, count } = await query
    // sort: mới nhất trước; nếu anh muốn sort theo year trước thì đổi order("year", ...)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as Stat[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}

/* =======================
   OPTIONAL HELPERS
======================= */

// Lấy 1 record theo year (nếu bảng mỗi năm chỉ có 1 dòng)
export async function getStatByYear(year: number) {
  const { data, error } = await supabase
    .from("stats")
    .select(
      `
        id,
        customer,
        satisfied,
        year,
        partners,
        created_at
      `,
    )
    .eq("year", year)
    .order("created_at", { ascending: false })
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as Stat | null;
}
