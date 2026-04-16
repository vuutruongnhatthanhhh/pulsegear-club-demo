// src/services/SpecializeService.tsx
import { supabase } from "@/lib/supabaseClient";

export type I18N = { vi?: string; en?: string };

export interface SpecializeContentItem {
  vi?: string;
  en?: string;
  href?: string;
}

export interface SpecializeContent {
  items?: SpecializeContentItem[];
}

export interface Specialize {
  id?: number;
  title?: I18N | null;
  content?: SpecializeContent | null; // đổi từ I18N sang SpecializeContent
  icon?: string | null;
  created_at?: string;
}

/* =======================
   SPECIALIZE CRUD
======================= */

export async function createSpecialize(payload: Specialize) {
  const { data, error } = await supabase
    .from("specialize")
    .insert([{ ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data as Specialize;
}

export async function updateSpecialize(
  id: number,
  payload: Partial<Specialize>,
) {
  const { data, error } = await supabase
    .from("specialize")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Specialize;
}

export async function deleteSpecialize(id: number) {
  const { error } = await supabase.from("specialize").delete().eq("id", id);
  if (error) throw error;
}

export async function getSpecializeById(id: number) {
  const { data, error } = await supabase
    .from("specialize")
    .select(
      `
        id,
        title,
        content,
        icon,
        created_at
      `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Specialize;
}

export async function getAllSpecializes({
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

  let query = supabase.from("specialize").select(
    `
      id,
      title,
      content,
      icon,
      created_at
    `,
    { count: "exact" },
  );

  const s = (search ?? "").trim();
  if (s) {
    const like = `%${s}%`;
    // content giờ là array nên không search được trực tiếp qua jsonb arrow
    // chỉ search trên title và icon
    query = query.or(
      [
        `title->>vi.ilike.${like}`,
        `title->>en.ilike.${like}`,
        `icon.ilike.${like}`,
      ].join(","),
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as Specialize[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}
