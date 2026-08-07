import { supabase } from "./supabaseClient";

export type Article = {
  id: number;
  slug: string;
  title: { vi: string; en: string };
  excerpt: { vi: string; en: string };
  content: { vi: string; en: string }; // rich HTML from the admin editor
  img: string;
  category: { vi: string; en: string };
  accent: string; // the article's news category accent color
  date: string; // formatted "DD/MM/YYYY"
  author: string;
};

type ArticleRow = {
  id: number;
  slug: string;
  title_vi: string;
  title_en: string;
  excerpt_vi: string;
  excerpt_en: string;
  content_vi: string;
  content_en: string;
  image_url: string | null;
  author: string;
  published_at: string;
  news_categories: { label_vi: string; label_en: string; accent_color: string };
};

const ARTICLE_SELECT =
  "id, slug, title_vi, title_en, excerpt_vi, excerpt_en, content_vi, content_en, image_url, author, published_at, news_categories!inner(label_vi, label_en, accent_color)";

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: { vi: row.title_vi, en: row.title_en },
    excerpt: { vi: row.excerpt_vi, en: row.excerpt_en },
    content: { vi: row.content_vi, en: row.content_en },
    img: row.image_url ?? "",
    category: { vi: row.news_categories.label_vi, en: row.news_categories.label_en },
    accent: row.news_categories.accent_color,
    date: formatDate(row.published_at),
    author: row.author,
  };
}

/** All active articles, newest first — used by /tin-tuc. */
export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("news_posts")
    .select(ARTICLE_SELECT)
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as unknown as ArticleRow[]).map(mapArticle);
}

/** A single article — used by /tin-tuc/[slug]. */
export async function getArticle(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("news_posts")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapArticle(data as unknown as ArticleRow);
}
