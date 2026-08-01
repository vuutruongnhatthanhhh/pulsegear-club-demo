import {
  Zap, Star, Shield, RotateCcw, Truck, Award,
  Heart, Sparkles, CheckCircle, Leaf, Users, Globe,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "./supabaseClient";

// Must match the icon dropdown in pulsegearclub-admin's service-form.tsx.
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Zap, Star, Shield, RotateCcw, Truck, Award,
  Heart, Sparkles, CheckCircle, Leaf, Users, Globe,
};

export type Service = {
  id: number;
  icon: string;
  title: { vi: string; en: string };
  sub: { vi: string; en: string };
};

type ServiceRow = {
  id: number;
  icon: string;
  title_vi: string;
  title_en: string;
  sub_vi: string;
  sub_en: string;
};

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("home_services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as ServiceRow[]).map((row) => ({
    id: row.id,
    icon: row.icon,
    title: { vi: row.title_vi, en: row.title_en },
    sub: { vi: row.sub_vi, en: row.sub_en },
  }));
}
