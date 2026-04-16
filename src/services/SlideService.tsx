// src/services/SlideService.ts
import { supabase } from "@/lib/supabaseClient";

export type I18N = { vi?: string; en?: string };

export interface Slide {
  id?: number; // int8 (bigint)
  title?: I18N | null; // jsonb
  content?: I18N | null; // jsonb
  author?: I18N | null; // jsonb
  created_at?: string;
}

/* =======================
   SLIDE CRUD
======================= */

export async function createSlide(payload: Slide) {
  const { data, error } = await supabase
    .from("slide")
    .insert([{ ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data as Slide;
}

export async function updateSlide(id: number, payload: Partial<Slide>) {
  const { data, error } = await supabase
    .from("slide")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Slide;
}

export async function deleteSlide(id: number) {
  const { error } = await supabase.from("slide").delete().eq("id", id);
  if (error) throw error;
}

export async function getSlideById(id: number) {
  const { data, error } = await supabase
    .from("slide")
    .select(
      `
        id,
        title,
        content,
        author,
        created_at
      `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Slide;
}

export async function getAllSlides({
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

  let query = supabase.from("slide").select(
    `
      id,
      title,
      content,
      author,
      created_at
    `,
    { count: "exact" }
  );

  const s = (search ?? "").trim();
  if (s) {
    const like = `%${s}%`;
    // search trên các field jsonb vi/en của title, content, author
    query = query.or(
      [
        `title->>vi.ilike.${like}`,
        `title->>en.ilike.${like}`,
        `content->>vi.ilike.${like}`,
        `content->>en.ilike.${like}`,
        `author->>vi.ilike.${like}`,
        `author->>en.ilike.${like}`,
      ].join(",")
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as Slide[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}
