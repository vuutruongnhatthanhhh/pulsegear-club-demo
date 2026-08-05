import { supabase } from "./supabaseClient";

export type Profile = {
  fullName: string;
  phone: string;
  address: string;
};

type ProfileRow = {
  full_name: string;
  phone: string;
  address: string;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  const row = data as ProfileRow;
  return { fullName: row.full_name, phone: row.phone, address: row.address };
}

export async function saveProfile(userId: string, profile: Profile): Promise<{ error: string | null }> {
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: profile.fullName,
    phone: profile.phone,
    address: profile.address,
    updated_at: new Date().toISOString(),
  });

  return { error: error?.message ?? null };
}
