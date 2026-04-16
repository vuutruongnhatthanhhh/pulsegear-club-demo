// src/services/CategoryService.ts
import { supabase } from "@/lib/supabaseClient";

export interface CategoryService {
  id?: number; // bigserial
  name: Record<string, string>; // jsonb: { vi: "...", en: "..." }
  parent_id?: number | null; // bigint
  level: number; // integer, default 1
  created_at?: string; // timestamptz
  updated_at?: string; // timestamptz
}

export interface CategoryServiceWithChildren extends CategoryService {
  children?: CategoryServiceWithChildren[];
}

/* =======================
   CATEGORIES_SERVICE CRUD
======================= */

export async function createCategoryService(payload: CategoryService) {
  const { data, error } = await supabase
    .from("categories_service")
    .insert([{ ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data as CategoryService;
}

export async function updateCategoryService(
  id: number,
  payload: Partial<CategoryService>,
) {
  const { data, error } = await supabase
    .from("categories_service")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CategoryService;
}

export async function deleteCategoryService(id: number) {
  const { error } = await supabase
    .from("categories_service")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getCategoryServiceById(id: number) {
  const { data, error } = await supabase
    .from("categories_service")
    .select(
      `
        id,
        name,
        parent_id,
        level,
        created_at,
        updated_at
      `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as CategoryService;
}

export async function getAllCategoriesService({
  page = 1,
  limit = 10,
  search = "",
  level,
  parent_id,
}: {
  page?: number;
  limit?: number;
  search?: string;
  level?: number;
  parent_id?: number | null;
}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("categories_service").select(
    `
      id,
      name,
      parent_id,
      level,
      created_at,
      updated_at
    `,
    { count: "exact" },
  );

  // Filter theo level
  if (typeof level === "number") {
    query = query.eq("level", level);
  }

  // Filter theo parent_id
  if (parent_id !== undefined) {
    if (parent_id === null) {
      query = query.is("parent_id", null);
    } else {
      query = query.eq("parent_id", parent_id);
    }
  }

  // Search trong JSONB name (tìm trong cả vi và en)
  const s = (search ?? "").trim();
  if (s) {
    query = query.or(
      `name->>vi.ilike.%${s}%,name->>en.ilike.%${s}%,id::text.ilike.%${s}%`,
    );
  }

  const { data, error, count } = await query
    .order("level", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as CategoryService[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}

/* =======================
   TREE HELPERS
======================= */

// Lấy toàn bộ categories và build tree structure
export async function getCategoryServiceTree(
  lang: string = "vi",
): Promise<CategoryServiceWithChildren[]> {
  const { data, error } = await supabase
    .from("categories_service")
    .select(
      `
        id,
        name,
        parent_id,
        level,
        created_at,
        updated_at
      `,
    )
    .order("level", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  const categories = (data ?? []) as CategoryService[];

  // Build tree
  const categoryMap = new Map<number, CategoryServiceWithChildren>();
  const roots: CategoryServiceWithChildren[] = [];

  categories.forEach((cat) => {
    categoryMap.set(cat.id!, { ...cat, children: [] });
  });

  categories.forEach((cat) => {
    const node = categoryMap.get(cat.id!)!;
    if (cat.parent_id === null) {
      roots.push(node);
    } else {
      const parent = categoryMap.get(cat.parent_id);
      if (parent) {
        parent.children!.push(node);
      }
    }
  });

  return roots;
}

// Lấy tất cả children của 1 category (recursive)
export async function getCategoryServiceChildren(
  parentId: number,
): Promise<CategoryService[]> {
  const { data, error } = await supabase
    .from("categories_service")
    .select(
      `
        id,
        name,
        parent_id,
        level,
        created_at,
        updated_at
      `,
    )
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as CategoryService[];
}

// Lấy parent chain của 1 category (breadcrumb)
export async function getCategoryServiceParentChain(
  id: number,
): Promise<CategoryService[]> {
  const chain: CategoryService[] = [];
  let currentId: number | null = id;

  while (currentId !== null) {
    const category = await getCategoryServiceById(currentId);
    chain.unshift(category);
    currentId = category.parent_id ?? null;
  }

  return chain;
}

// Lấy categories theo level
export async function getCategoriesServiceByLevel(level: number) {
  const { data, error } = await supabase
    .from("categories_service")
    .select(
      `
        id,
        name,
        parent_id,
        level,
        created_at,
        updated_at
      `,
    )
    .eq("level", level)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as CategoryService[];
}

// Lấy root categories (level 1 hoặc parent_id = null)
export async function getRootCategoriesService() {
  const { data, error } = await supabase
    .from("categories_service")
    .select(
      `
        id,
        name,
        parent_id,
        level,
        created_at,
        updated_at
      `,
    )
    .is("parent_id", null)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as CategoryService[];
}

// Lấy tất cả category IDs bao gồm cả children (recursive)
export async function getAllCategoryIdsIncludingChildren(
  categoryId: number,
): Promise<number[]> {
  const result: number[] = [categoryId];

  // Lấy tất cả children trực tiếp
  const { data, error } = await supabase
    .from("categories_service")
    .select("id")
    .eq("parent_id", categoryId);

  if (error) throw error;

  const childIds = (data || []).map((c: any) => c.id);

  // Đệ quy lấy children của children
  for (const childId of childIds) {
    const nestedIds = await getAllCategoryIdsIncludingChildren(childId);
    result.push(...nestedIds);
  }

  return result;
}
