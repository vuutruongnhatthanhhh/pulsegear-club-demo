// src/services/CompanyInfoService.ts
import { supabase } from "@/lib/supabaseClient";

export type I18N = { vi?: string; en?: string };

export interface CompanyInfo {
  id?: number;
  content?: I18N | null;
  created_at?: string;
}

/* =======================
   COMPANY INFO CRUD
======================= */

export async function createCompanyInfo(payload: CompanyInfo) {
  const { data, error } = await supabase
    .from("company_info")
    .insert([{ ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data as CompanyInfo;
}

export async function updateCompanyInfo(
  id: number,
  payload: Partial<CompanyInfo>,
) {
  const { data, error } = await supabase
    .from("company_info")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CompanyInfo;
}

export async function deleteCompanyInfo(id: number) {
  const { error } = await supabase.from("company_info").delete().eq("id", id);
  if (error) throw error;
}

export async function getCompanyInfoById(id: number) {
  const { data, error } = await supabase
    .from("company_info")
    .select(
      `
        id,
        content,
        created_at
      `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as CompanyInfo;
}

export async function getAllCompanyInfos({
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

  let query = supabase.from("company_info").select(
    `
      id,
      content,
      created_at
    `,
    { count: "exact" },
  );

  const s = (search ?? "").trim();
  if (s) {
    const like = `%${s}%`;
    query = query.or(
      [`content->>vi.ilike.${like}`, `content->>en.ilike.${like}`].join(","),
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as CompanyInfo[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}
