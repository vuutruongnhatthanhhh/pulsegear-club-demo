export const SITE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

/** Strips HTML tags from rich-text content for use as a meta description. */
export function stripHtml(html: string, maxLen = 160): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLen ? text.slice(0, maxLen - 1).trimEnd() + "…" : text;
}
