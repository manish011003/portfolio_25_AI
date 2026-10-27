import { asBody, bodyToPlainText, type ContentBlock } from "./blocks";

export const BLOG_CATEGORIES = [
  { value: "ai", label: "AI/ML", emoji: "🤖" },
  { value: "pm", label: "Product", emoji: "🎯" },
  { value: "engineering", label: "Engineering", emoji: "💪" },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]["value"];

export function asBlogCategory(value: unknown): BlogCategory {
  return BLOG_CATEGORIES.some((c) => c.value === value) ? (value as BlogCategory) : "ai";
}

export function categoryLabel(value: string) {
  return BLOG_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function categoryEmoji(value: string) {
  return BLOG_CATEGORIES.find((c) => c.value === value)?.emoji ?? "✍️";
}

export type BlogDraft = {
  title: string;
  slug: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  emoji: string | null;
  coverImage: string | null;
  body: ContentBlock[];
  publishedAt: string | null; // YYYY-MM-DD
  readMinutes: number;
  metaTitle: string;
  metaDescription: string;
};

/** The shape the public pages render, independent of whether it came from the DB or the fallback list. */
export type PublicBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  emoji: string | null;
  coverImage: string | null;
  body: unknown;
  publishedAt: Date | null;
  readMinutes: number;
  metaTitle: string | null;
  metaDescription: string | null;
  externalUrl: string | null;
};

export function estimateReadMinutes(body: ContentBlock[]) {
  const words = bodyToPlainText(body).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function postHref(post: Pick<PublicBlogPost, "slug" | "externalUrl">) {
  const external = post.externalUrl?.trim();
  if (!external) return `/blog/${post.slug}`;
  return /^(https?:\/\/|\/|#)/i.test(external) ? external : `/${external}`;
}

export function formatPostDate(date: Date | null) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatPostDateLong(date: Date | null) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function toDateInput(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : null;
}

export { asBody };
