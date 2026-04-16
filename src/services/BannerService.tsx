// src/services/BannerService.ts
import { supabase } from "@/lib/supabaseClient";

export type I18N = { vi?: string; en?: string };

export interface Banner {
  id?: number; // int8 (bigint)
  title?: I18N | null; // jsonb
  sub?: I18N | null; // jsonb
  desc1?: I18N | null; // jsonb
  website?: string | null; // text
  desc2?: I18N | null; // jsonb
  mainService1?: I18N | null; // jsonb
  mainService2?: I18N | null; // jsonb
  mainService3?: I18N | null; // jsonb
  created_at?: string;
}

/* =======================
   BANNER CRUD
======================= */

export async function createBanner(payload: Banner) {
  const { data, error } = await supabase
    .from("banner")
    .insert([{ ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data as Banner;
}

export async function updateBanner(id: number, payload: Partial<Banner>) {
  const { data, error } = await supabase
    .from("banner")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Banner;
}

export async function deleteBanner(id: number) {
  const { error } = await supabase.from("banner").delete().eq("id", id);
  if (error) throw error;
}

export async function getBannerById(id: number) {
  const { data, error } = await supabase
    .from("banner")
    .select(
      `
        id,
        title,
        sub,
        desc1,
        website,
        desc2,
        "mainService1",
        "mainService2",
        "mainService3",
        created_at
      `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Banner;
}

export async function getAllBanners({
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

  let query = supabase.from("banner").select(
    `
      id,
      title,
      sub,
      desc1,
      website,
      desc2,
      "mainService1",
      "mainService2",
      "mainService3",
      created_at
    `,
    { count: "exact" }
  );

  const s = (search ?? "").trim();
  if (s) {
    const like = `%${s}%`;
    // search trên các field jsonb vi/en + website
    query = query.or(
      [
        `title->>vi.ilike.${like}`,
        `title->>en.ilike.${like}`,
        `sub->>vi.ilike.${like}`,
        `sub->>en.ilike.${like}`,
        `desc1->>vi.ilike.${like}`,
        `desc1->>en.ilike.${like}`,
        `desc2->>vi.ilike.${like}`,
        `desc2->>en.ilike.${like}`,
        `"mainService1"->>vi.ilike.${like}`,
        `"mainService1"->>en.ilike.${like}`,
        `"mainService2"->>vi.ilike.${like}`,
        `"mainService2"->>en.ilike.${like}`,
        `"mainService3"->>vi.ilike.${like}`,
        `"mainService3"->>en.ilike.${like}`,
        `website.ilike.${like}`,
      ].join(",")
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as Banner[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}
