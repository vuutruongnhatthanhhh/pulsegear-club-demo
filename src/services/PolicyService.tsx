// src/services/PolicyService.ts
import { supabase } from "@/lib/supabaseClient";

export interface Policy {
  id?: number; // bigint identity
  title?: Record<string, string> | null; // jsonb: { vi: "...", en: "..." }
  content?: Record<string, string> | null; // jsonb: { vi: "...", en: "..." }
  url?: string | null; // text
  created_at?: string; // timestamptz
}

/* =======================
   POLICY CRUD
======================= */

export async function createPolicy(payload: Policy) {
  const { data, error } = await supabase
    .from("policies")
    .insert([{ ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data as Policy;
}

export async function updatePolicy(id: number, payload: Partial<Policy>) {
  const { data, error } = await supabase
    .from("policies")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Policy;
}

export async function deletePolicy(id: number) {
  const { error } = await supabase.from("policies").delete().eq("id", id);
  if (error) throw error;
}

export async function getPolicyById(id: number) {
  const { data, error } = await supabase
    .from("policies")
    .select(
      `
        id,
        title,
        content,
        url,
        created_at
      `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Policy;
}

export async function getAllPolicies({
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

  let query = supabase.from("policies").select(
    `
      id,
      title,
      content,
      url,
      created_at
    `,
    { count: "exact" },
  );

  // Search trong JSONB title, content (cả vi và en)
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
    data: (data ?? []) as Policy[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}

/* =======================
   HELPERS
======================= */

// Lấy policy theo URL/slug
export async function getPolicyByUrl(url: string) {
  const { data, error } = await supabase
    .from("policies")
    .select(
      `
        id,
        title,
        content,
        url,
        created_at
      `,
    )
    .eq("url", url)
    .single();

  if (error) {
    console.error("Error fetching policy by URL:", error);
    return null;
  }

  return data as Policy;
}
