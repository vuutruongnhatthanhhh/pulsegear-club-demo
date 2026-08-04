import { supabase } from "./supabaseClient";

export type TeamMember = {
  id: number;
  name: string;
  role: { vi: string; en: string };
  img: string;
};

export type TeamSectionData = {
  eyebrow: { vi: string; en: string };
  title1: { vi: string; en: string };
  title2: { vi: string; en: string };
};

type TeamMemberRow = {
  id: number;
  name: string;
  role_vi: string;
  role_en: string;
  image_url: string | null;
};

type SectionRow = {
  eyebrow_vi: string;
  eyebrow_en: string;
  title1_vi: string;
  title1_en: string;
  title2_vi: string;
  title2_en: string;
};

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("about_team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as TeamMemberRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    role: { vi: row.role_vi, en: row.role_en },
    img: row.image_url ?? "",
  }));
}

export async function getTeamSection(): Promise<TeamSectionData | null> {
  const { data, error } = await supabase
    .from("about_team_section")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  const row = data as SectionRow;
  return {
    eyebrow: { vi: row.eyebrow_vi, en: row.eyebrow_en },
    title1: { vi: row.title1_vi, en: row.title1_en },
    title2: { vi: row.title2_vi, en: row.title2_en },
  };
}
