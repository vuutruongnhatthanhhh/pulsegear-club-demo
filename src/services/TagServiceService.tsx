// src/services/TagServiceService.ts
import { supabase } from "@/lib/supabaseClient";

export interface TagService {
  id?: number; // bigint, auto identity
  header?: Record<string, string> | null; // jsonb: { vi: "...", en: "..." }
  content?: Record<string, string> | null; // jsonb: { vi: "...", en: "..." }
  footer?: Record<string, string> | null; // jsonb: { vi: "...", en: "..." }
  created_at?: string; // timestamptz
}

/* =======================
   TAG SERVICE CRUD
======================= */

export async function createTagService(
  payload: Omit<TagService, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("tag_service")
    .insert([{ ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data as TagService;
}

export async function updateTagService(
  id: number,
  payload: Partial<TagService>,
) {
  const { data, error } = await supabase
    .from("tag_service")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as TagService;
}

export async function deleteTagService(id: number) {
  const { error } = await supabase.from("tag_service").delete().eq("id", id);
  if (error) throw error;
}

export async function getTagServiceById(id: number) {
  const { data, error } = await supabase
    .from("tag_service")
    .select(
      `
        id,
        header,
        content,
        footer,
        created_at
      `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as TagService;
}

export async function getAllTagServices({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("tag_service").select(
    `
      id,
      header,
      content,
      footer,
      created_at
    `,
    { count: "exact" },
  );

  // Search trong JSONB header (cả vi và en)
  const s = (search ?? "").trim();
  if (s) {
    query = query.or(`header->>vi.ilike.%${s}%,header->>en.ilike.%${s}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as TagService[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}

/* =======================
   HELPERS
======================= */

// Lấy tag service mới nhất (dùng cho trang chủ, SEO, v.v.)
export async function getLatestTagService() {
  const { data, error } = await supabase
    .from("tag_service")
    .select(
      `
        id,
        header,
        content,
        footer,
        created_at
      `,
    )
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data as TagService;
}
