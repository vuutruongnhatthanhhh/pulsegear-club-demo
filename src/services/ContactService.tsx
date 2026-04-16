// services/ContactService.ts
import { supabase } from "@/lib/supabaseClient";

export type I18N = { vi?: string; en?: string };

export interface Contact {
  id?: number; // bigint
  content: I18N; // jsonb
  created_at?: string; // timestamp
}

/** Create */
export async function createContact(payload: Contact) {
  const { data, error } = await supabase
    .from("contact")
    .insert([{ ...payload }])
    .select()
    .single();
  if (error) throw error;
  return data as Contact;
}

/** Get latest */
export async function getLatestContact() {
  const { data, error } = await supabase
    .from("contact")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data as Contact;
}

/** Get all contacts */
export async function getAllContacts() {
  const { data, error } = await supabase
    .from("contact")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Contact[];
}

/** Get by ID */
export async function getContactById(id: number) {
  const { data, error } = await supabase
    .from("contact")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Contact;
}

/** Update */
export async function updateContact(id: number, payload: Partial<Contact>) {
  const { data, error } = await supabase
    .from("contact")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Contact;
}

/** Delete */
export async function deleteContact(id: number) {
  const { error } = await supabase.from("contact").delete().eq("id", id);
  if (error) throw error;
}
