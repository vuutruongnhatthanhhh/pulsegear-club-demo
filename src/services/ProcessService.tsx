// src/services/ProcessService.ts
import { supabase } from "@/lib/supabaseClient";

export type I18N = { vi?: string; en?: string };

export interface Process {
  id?: number; // int8 (bigint)
  step?: number | null; // smallint
  title?: I18N | null; // jsonb
  content?: I18N | null; // jsonb
  created_at?: string;
}

/* =======================
   PROCESS CRUD
======================= */

export async function createProcess(payload: Process) {
  const { data, error } = await supabase
    .from("process")
    .insert([{ ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data as Process;
}

export async function updateProcess(id: number, payload: Partial<Process>) {
  const { data, error } = await supabase
    .from("process")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Process;
}

export async function deleteProcess(id: number) {
  const { error } = await supabase.from("process").delete().eq("id", id);
  if (error) throw error;
}

export async function getProcessById(id: number) {
  const { data, error } = await supabase
    .from("process")
    .select(
      `
        id,
        step,
        title,
        content,
        created_at
      `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Process;
}

export async function getAllProcesses({
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

  let query = supabase.from("process").select(
    `
      id,
      step,
      title,
      content,
      created_at
    `,
    { count: "exact" }
  );

  const s = (search ?? "").trim();
  if (s) {
    const like = `%${s}%`;
    // search trên các field jsonb vi/en + step (cast text)
    query = query.or(
      [
        `title->>vi.ilike.${like}`,
        `title->>en.ilike.${like}`,
        `content->>vi.ilike.${like}`,
        `content->>en.ilike.${like}`,
        `step::text.ilike.${like}`,
      ].join(",")
    );
  }

  const { data, error, count } = await query
    // ưu tiên sort theo step nếu anh dùng step để sắp thứ tự, sau đó theo created_at
    .order("step", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as Process[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}
