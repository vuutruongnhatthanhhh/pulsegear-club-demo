// src/services/WhyChooseService.ts
import { supabase } from "@/lib/supabaseClient";

export type I18N = { vi?: string; en?: string };

export interface WhyChoose {
  id?: number; // int8 (bigint)
  title?: I18N | null; // jsonb
  content?: I18N | null; // jsonb
  commitment1?: I18N | null; // jsonb
  commitment2?: I18N | null; // jsonb
  commitment3?: I18N | null; // jsonb
  created_at?: string; // timestamptz
}

/* =======================
   WHYCHOOSE CRUD
======================= */

export async function createWhyChoose(payload: WhyChoose) {
  const { data, error } = await supabase
    .from("whychoose")
    .insert([{ ...payload }])
    .select(
      `
        id,
        title,
        content,
        commitment1,
        commitment2,
        commitment3,
        created_at
      `
    )
    .single();

  if (error) throw error;
  return data as WhyChoose;
}

export async function updateWhyChoose(id: number, payload: Partial<WhyChoose>) {
  const { data, error } = await supabase
    .from("whychoose")
    .update({ ...payload })
    .eq("id", id)
    .select(
      `
        id,
        title,
        content,
        commitment1,
        commitment2,
        commitment3,
        created_at
      `
    )
    .single();

  if (error) throw error;
  return data as WhyChoose;
}

export async function deleteWhyChoose(id: number) {
  const { error } = await supabase.from("whychoose").delete().eq("id", id);
  if (error) throw error;
}

export async function getWhyChooseById(id: number) {
  const { data, error } = await supabase
    .from("whychoose")
    .select(
      `
        id,
        title,
        content,
        commitment1,
        commitment2,
        commitment3,
        created_at
      `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as WhyChoose;
}

export async function getAllWhyChooses({
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

  let query = supabase.from("whychoose").select(
    `
      id,
      title,
      content,
      commitment1,
      commitment2,
      commitment3,
      created_at
    `,
    { count: "exact" }
  );

  const s = (search ?? "").trim();
  if (s) {
    const like = `%${s}%`;
    // search trên jsonb vi/en (title + content + commitment1/2/3)
    query = query.or(
      [
        `title->>vi.ilike.${like}`,
        `title->>en.ilike.${like}`,
        `content->>vi.ilike.${like}`,
        `content->>en.ilike.${like}`,
        `commitment1->>vi.ilike.${like}`,
        `commitment1->>en.ilike.${like}`,
        `commitment2->>vi.ilike.${like}`,
        `commitment2->>en.ilike.${like}`,
        `commitment3->>vi.ilike.${like}`,
        `commitment3->>en.ilike.${like}`,
      ].join(",")
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as WhyChoose[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}
