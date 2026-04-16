// services/AboutService.ts
import { supabase } from "@/lib/supabaseClient";

export type I18N = { vi?: string; en?: string };

export interface About {
  id?: number; // bigint
  content: I18N; // jsonb
  created_at?: string; // timestamp
}

/** Create */
export async function createAbout(payload: About) {
  const { data, error } = await supabase
    .from("about")
    .insert([{ ...payload }])
    .select()
    .single();
  if (error) throw error;
  return data as About;
}

/** Get latest (vì table about thường chỉ có 1 record) */
export async function getAbout() {
  const { data, error } = await supabase
    .from("about")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data as About;
}

/** Get by ID */
export async function getAboutById(id: number) {
  const { data, error } = await supabase
    .from("about")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as About;
}

/** Update */
export async function updateAbout(id: number, payload: Partial<About>) {
  const { data, error } = await supabase
    .from("about")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as About;
}

/** Delete */
export async function deleteAbout(id: number) {
  const { error } = await supabase.from("about").delete().eq("id", id);
  if (error) throw error;
}
