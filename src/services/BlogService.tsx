// src/services/BlogService.ts
import { supabase } from "@/lib/supabaseClient";

export interface Blog {
  id?: number;
  title: Record<string, string>;
  desc?: Record<string, string> | null;
  content: Record<string, string>;
  url?: string | null;
  image?: string | null;
  created_at?: string;
  view_count?: number;
  author?: number | null;
}

export interface BlogWithAuthor extends Blog {
  author_info?: {
    id: number;
    name: string | null;
    email: string | null;
  } | null;
}

/* =======================
   BLOG CRUD
======================= */

export async function createBlog(payload: Blog) {
  const { data, error } = await supabase
    .from("blog")
    .insert([{ ...payload }])
    .select()
    .single();
  if (error) throw error;
  return data as Blog;
}

export async function updateBlog(id: number, payload: Partial<Blog>) {
  const { data, error } = await supabase
    .from("blog")
    .update({ ...payload })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Blog;
}

export async function deleteBlog(id: number) {
  const { error } = await supabase.from("blog").delete().eq("id", id);
  if (error) throw error;
}

export async function getBlogById(id: number) {
  const { data, error } = await supabase
    .from("blog")
    .select(
      `id, title, desc, content, url, image, created_at, view_count, author,
       author_info:users (id, name, email)`,
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as BlogWithAuthor;
}

export async function getAllBlogs({
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

  let query = supabase.from("blog").select(
    `id, title, desc, content, url, image, created_at, view_count, author,
     author_info:users (id, name, email)`,
    { count: "exact" },
  );

  const s = (search ?? "").trim();
  if (s) {
    query = query.or(
      `title->>vi.ilike.%${s}%,title->>en.ilike.%${s}%,desc->>vi.ilike.%${s}%,desc->>en.ilike.%${s}%,content->>vi.ilike.%${s}%,content->>en.ilike.%${s}%,id::text.ilike.%${s}%`,
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return {
    data: (data ?? []) as BlogWithAuthor[],
    total: count ?? 0,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}

/* =======================
   HELPERS
======================= */

export async function getLatestBlogs(limit: number = 5) {
  const { data, error } = await supabase
    .from("blog")
    .select(
      `id, title, desc, url, image, created_at, view_count, author,
       author_info:users (id, name, email)`,
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as BlogWithAuthor[];
}

export async function countBlogs() {
  const { count, error } = await supabase
    .from("blog")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function getBlogByUrl(
  url: string,
): Promise<BlogWithAuthor | null> {
  const { data, error } = await supabase
    .from("blog")
    .select(
      `id, title, desc, content, url, image, created_at, view_count, author,
       author_info:users (id, name, email)`,
    )
    .eq("url", url)
    .maybeSingle();
  if (error) {
    console.error("Error fetching blog by URL:", error);
    return null;
  }
  return data as BlogWithAuthor | null;
}

export async function incrementBlogView(id: number): Promise<number> {
  const { data, error } = await supabase.rpc("increment_blog_view", {
    blog_id: id,
  });
  if (error) {
    console.error("Error incrementing blog view:", error);
    return 0;
  }
  return data as number;
}

export async function getAdjacentBlogs(
  created_at: string,
  currentId: number,
): Promise<{ prev: Blog | null; next: Blog | null }> {
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from("blog")
      .select("id, title, url, created_at")
      .lt("created_at", created_at)
      .neq("id", currentId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("blog")
      .select("id, title, url, created_at")
      .gt("created_at", created_at)
      .neq("id", currentId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    prev: (prevRes.data as Blog | null) ?? null,
    next: (nextRes.data as Blog | null) ?? null,
  };
}
