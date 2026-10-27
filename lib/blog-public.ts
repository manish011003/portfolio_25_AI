import { BLOG_SEED_POSTS } from "./blog-seed";
import type { PublicBlogPost } from "./blog";
import { getPublishedBlogPost, getPublishedBlogPosts } from "./queries";

const FALLBACK_POSTS: PublicBlogPost[] = BLOG_SEED_POSTS.map((post) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  category: post.category,
  tags: [],
  emoji: post.emoji,
  coverImage: null,
  body: [],
  publishedAt: new Date(post.publishedAt),
  readMinutes: post.readMinutes,
  metaTitle: null,
  metaDescription: null,
  externalUrl: post.externalUrl,
}));

/** Published posts from the CMS; the original five if the database is unreachable. */
export async function loadPublishedPosts(): Promise<PublicBlogPost[]> {
  try {
    return await getPublishedBlogPosts();
  } catch (error) {
    console.error("Blog fetch failed, using fallback posts", error);
    return FALLBACK_POSTS;
  }
}

export async function loadPublishedPost(slug: string): Promise<PublicBlogPost | null> {
  try {
    return await getPublishedBlogPost(slug);
  } catch {
    return FALLBACK_POSTS.find((post) => post.slug === slug) ?? null;
  }
}
