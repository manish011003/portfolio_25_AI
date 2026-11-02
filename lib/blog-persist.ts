import { createHash } from "crypto";
import { Prisma, type PrismaClient } from "@prisma/client";
import { asBody, bodyToPlainText } from "./blocks";
import { asBlogCategory, estimateReadMinutes, type BlogDraft } from "./blog";
import { parseTags, slugify } from "./slug";

/** The persisted columns an editor revision covers. Status is deliberately not part of it. */
type Revisionable = {
  title: string;
  slug: string;
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
};

/** JSON with sorted keys and no undefined values, so jsonb round-trips hash identically. */
function canonical(value: unknown): string {
  if (value === undefined) return "null";
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`);
  return `{${entries.join(",")}}`;
}

/**
 * Opaque version token for a post's editable content. The editor sends the token it last saw;
 * the server only writes when the stored row still has that token, so a save built on an
 * older state can never replace newer content (ordering of requests is irrelevant).
 */
export function postRevision(post: Revisionable): string {
  const parts = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    emoji: post.emoji ?? null,
    coverImage: post.coverImage ?? null,
    body: post.body,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    readMinutes: post.readMinutes,
    metaTitle: post.metaTitle ?? null,
    metaDescription: post.metaDescription ?? null,
  };
  return createHash("sha256").update(canonical(parts)).digest("hex").slice(0, 24);
}

export function draftToData(draft: BlogDraft) {
  const title = draft.title.trim() || "Untitled post";
  const slug = slugify(draft.slug || title) || `untitled-${Date.now()}`;
  const body = asBody(draft.body);
  const published = draft.publishedAt ? new Date(`${draft.publishedAt}T00:00:00.000Z`) : null;
  return {
    title,
    slug,
    excerpt: draft.excerpt.trim() || bodyToPlainText(body).slice(0, 180),
    category: asBlogCategory(draft.category),
    tags: parseTags(draft.tags.join(",")),
    emoji: draft.emoji?.trim() || null,
    coverImage: draft.coverImage?.trim() || null,
    body: body as Prisma.InputJsonValue,
    publishedAt: published && !Number.isNaN(published.getTime()) ? published : null,
    readMinutes: Number(draft.readMinutes) > 0 ? Math.round(Number(draft.readMinutes)) : estimateReadMinutes(body),
    metaTitle: draft.metaTitle.trim() || null,
    metaDescription: draft.metaDescription.trim() || null,
  };
}

export type PersistResult =
  | {
      ok: true;
      revision: string;
      slug: string;
      savedAt: string;
      /** What the row held before this write, for orphaned-image cleanup and cache revalidation. */
      previous: { slug: string; status: "draft" | "published"; coverImage: string | null; body: unknown };
      /** The stored data, for the same purposes. */
      stored: { slug: string; coverImage: string | null; body: unknown };
    }
  | { conflict: true; revision: string }
  | { notFound: true };

export type PersistOptions = {
  /** Revision the editor's copy is based on. */
  baseRevision: string;
  /** Overwrite even if the stored post moved on (explicit "keep my version"). */
  force?: boolean;
  publish?: boolean;
};

/**
 * Compare-and-swap write of a draft. The row is locked for the length of the transaction, so
 * two overlapping saves are applied one after the other and the second sees the first's
 * revision: it either matches (it was built on it) or is rejected as a conflict.
 */
export async function persistBlogDraft(
  db: PrismaClient,
  id: string,
  draft: BlogDraft,
  { baseRevision, force = false, publish = false }: PersistOptions,
): Promise<PersistResult> {
  const data = draftToData(draft);
  return db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT 1 FROM "BlogPost" WHERE "id" = ${id} FOR UPDATE`;
    const existing = await tx.blogPost.findUnique({ where: { id } });
    if (!existing) return { notFound: true as const };

    const current = postRevision(existing);
    const previous = {
      slug: existing.slug,
      status: existing.status,
      coverImage: existing.coverImage,
      body: existing.body,
    };
    if (!force && baseRevision !== current) {
      // A retry of a save that already landed (the response was lost) carries the same content.
      const alreadyApplied = postRevision({ ...data, body: data.body }) === current;
      if (!alreadyApplied) return { conflict: true as const, revision: current };
      if (!publish) {
        return {
          ok: true as const,
          revision: current,
          slug: existing.slug,
          savedAt: new Date().toISOString(),
          previous,
          stored: { slug: existing.slug, coverImage: existing.coverImage, body: existing.body },
        };
      }
    }

    const updated = await tx.blogPost.update({
      where: { id },
      data: publish
        ? { ...data, status: "published", publishedAt: data.publishedAt ?? existing.publishedAt ?? new Date() }
        : data,
    });
    return {
      ok: true as const,
      revision: postRevision(updated),
      slug: updated.slug,
      savedAt: new Date().toISOString(),
      previous,
      stored: { slug: updated.slug, coverImage: updated.coverImage, body: updated.body },
    };
  });
}
