// src/services/ServiceService.ts
import { supabase } from "@/lib/supabaseClient";

export interface FAQ {
  question: Record<string, string>; // { vi: "...", en: "..." }
  answer: Record<string, string>; // { vi: "<html>", en: "<html>" }
  order: number;
}

export interface Service {
  id?: number;
  category_id: number;
  title: Record<string, string>;
  content: Record<string, string>;
  desc?: Record<string, string> | null;
  url?: string | null;
  image?: string | null;
  created_at?: string;
  highlight?: boolean;
  view_count?: number;
  author?: number | null;
  faqs?: FAQ[] | null;
}

export interface ServiceWithCategory extends Service {
  category?: {
    id: number;
    name: Record<string, string>;
    parent_id?: number | null;
    level: number;
  };
  author_info?: {
    id: number;
    name: string | null;
    email: string | null;
  } | null;
}

export async function createService(payload: Service) {
  const { data, error } = await supabase
    .from("service")
    .insert([{ ...payload }])
    .select()
    .single();
  if (error) throw error;
  return data as Service;
}

export async function updateService(id: number, payload: Partial<Service>) {
  const { data, error } = await supabase
    .from("service")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Service;
}

export async function deleteService(id: number) {
  const { error } = await supabase.from("service").delete().eq("id", id);
  if (error) throw error;
}

export async function getServiceById(id: number) {
  const { data, error } = await supabase
    .from("service")
    .select(
      `id, category_id, title, content, desc, url, image, created_at, highlight, view_count, author, faqs,
       category:categories_service (id, name, parent_id, level),
       author_info:users (id, name, email)`,
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as ServiceWithCategory;
}

export async function getAllServices({
  page = 1,
  limit = 10,
  search = "",
  category_id,
  category_ids,
  highlight,
}: {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  category_ids?: number[];
  highlight?: boolean;
}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("service").select(
    `id, category_id, title, content, desc, url, image, created_at, highlight, view_count, author, faqs,
     category:categories_service (id, name, parent_id, level),
     author_info:users (id, name, email)`,
    { count: "exact" },
  );

  if (category_ids && category_ids.length > 0) {
    query = query.in("category_id", category_ids);
  } else if (typeof category_id === "number") {
    query = query.eq("category_id", category_id);
  }

  if (typeof highlight === "boolean") {
    query = query.eq("highlight", highlight);
  }

  const s = (search ?? "").trim();
  if (s) {
    query = query.or(
      `title->>vi.ilike.%${s}%,title->>en.ilike.%${s}%,desc->>vi.ilike.%${s}%,desc->>en.ilike.%${s}%`,
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return {
    data: (data ?? []) as ServiceWithCategory[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}

export async function getServicesByCategory(category_id: number) {
  const { data, error } = await supabase
    .from("service")
    .select(
      `id, category_id, title, content, desc, url, image, created_at, highlight, view_count, author, faqs`,
    )
    .eq("category_id", category_id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Service[];
}

export async function getServicesByCategories(category_ids: number[]) {
  const { data, error } = await supabase
    .from("service")
    .select(
      `id, category_id, title, content, desc, url, image, created_at, highlight, view_count, author, faqs,
       category:categories_service (id, name, parent_id, level),
       author_info:users (id, name, email)`,
    )
    .in("category_id", category_ids)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ServiceWithCategory[];
}

export async function getServiceByUrl(
  url: string,
): Promise<ServiceWithCategory | null> {
  const { data, error } = await supabase
    .from("service")
    .select(
      `id, category_id, title, content, desc, url, image, created_at, highlight, view_count, author, faqs,
       author_info:users (id, name, email)`,
    )
    .eq("url", url)
    .maybeSingle();

  if (error) {
    console.error("Error fetching service by URL:", error);
    return null;
  }
  return data as ServiceWithCategory | null;
}

export async function countServicesByCategory(category_id: number) {
  const { count, error } = await supabase
    .from("service")
    .select("*", { count: "exact", head: true })
    .eq("category_id", category_id);
  if (error) throw error;
  return count ?? 0;
}

export async function getAllCategoryIdsIncludingChildren(
  categoryId: number,
): Promise<number[]> {
  const result: number[] = [categoryId];
  const { data, error } = await supabase
    .from("categories_service")
    .select("id")
    .eq("parent_id", categoryId);
  if (error) throw error;
  for (const child of data ?? []) {
    const nested = await getAllCategoryIdsIncludingChildren(child.id);
    result.push(...nested);
  }
  return result;
}

export async function incrementServiceView(id: number): Promise<number> {
  const { data, error } = await supabase.rpc("increment_service_view", {
    service_id: id,
  });
  if (error) {
    console.error("Error incrementing view:", error);
    return 0;
  }
  return data as number;
}

export async function getHighlightedServices(limit = 10) {
  const { data, error } = await supabase
    .from("service")
    .select(
      `id, category_id, title, content, desc, url, image, created_at, highlight, view_count, author, faqs,
       category:categories_service (id, name, parent_id, level),
       author_info:users (id, name, email)`,
    )
    .eq("highlight", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ServiceWithCategory[];
}

export async function getAdjacentServices(
  currentCreatedAt: string,
  currentId: number,
): Promise<{ prev: Service | null; next: Service | null }> {
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from("service")
      .select("id, title, url, created_at")
      .lt("created_at", currentCreatedAt)
      .neq("id", currentId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("service")
      .select("id, title, url, created_at")
      .gt("created_at", currentCreatedAt)
      .neq("id", currentId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    prev: (prevRes.data as Service | null) ?? null,
    next: (nextRes.data as Service | null) ?? null,
  };
}

export async function getPrevService(
  currentCreatedAt: string,
  category_id: number,
): Promise<Service | null> {
  const { data, error } = await supabase
    .from("service")
    .select("id, title, url, created_at")
    .eq("category_id", category_id)
    .lt("created_at", currentCreatedAt)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as Service | null;
}

export async function getNextService(
  currentCreatedAt: string,
  category_id: number,
): Promise<Service | null> {
  const { data, error } = await supabase
    .from("service")
    .select("id, title, url, created_at")
    .eq("category_id", category_id)
    .gt("created_at", currentCreatedAt)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as Service | null;
}
