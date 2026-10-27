"use client";

import { useEffect, useRef, useState } from "react";
import { publishBlogPost, saveBlogDraft, unpublishBlogPost } from "@/app/actions/blog";
import { duplicateBlogPost } from "@/app/actions/blog";
import { asBody } from "@/lib/blocks";
import { asBlogCategory, BLOG_CATEGORIES, type BlogDraft } from "@/lib/blog";
import { BLOG_BLOCK_TYPES, BlockEditor } from "./BlockEditor";
import { DeleteBlogPostButton } from "./DeleteBlogPostButton";
import { ImageField } from "./ImageField";

export type EditorPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  emoji: string | null;
  coverImage: string | null;
  body: unknown;
  status: "draft" | "published";
  publishedAt: string | null; // YYYY-MM-DD
  readMinutes: number;
  metaTitle: string | null;
  metaDescription: string | null;
};

const input = "mt-1 w-full rounded border border-zinc-300 px-3 py-2";

export function BlogPostForm({ post }: { post: EditorPost }) {
  const [draft, setDraft] = useState<BlogDraft>(() => toDraft(post));
  const [status, setStatus] = useState(post.status);
  const [saveLabel, setSaveLabel] = useState("Saved");
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftRef = useRef(draft);
  const skipFirst = useRef(true);
  draftRef.current = draft;

  async function save() {
    setSaveLabel("Saving…");
    try {
      const result = await saveBlogDraft(post.id, draftRef.current);
      if (result && "error" in result && result.error) {
        setError(result.error);
        setSaveLabel("Save failed");
        return false;
      }
      setError("");
      setSaveLabel("Saved");
      if (result && "slug" in result && result.slug) {
        setDraft((current) => (current.slug === result.slug ? current : { ...current, slug: result.slug }));
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaveLabel("Save failed");
      return false;
    }
  }

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    setSaveLabel("Saving…");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(), 900);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  function patch(partial: Partial<BlogDraft>) {
    setSaveLabel("Unsaved");
    setDraft((current) => ({ ...current, ...partial }));
  }

  async function onPreview() {
    if (timer.current) clearTimeout(timer.current);
    if (await save()) window.open(`/admin/blog/${post.id}/preview`, "_blank", "noopener");
  }

  async function onPublish() {
    if (timer.current) clearTimeout(timer.current);
    setSaveLabel("Publishing…");
    try {
      const result = await publishBlogPost(post.id, draftRef.current);
      if ("error" in result && result.error) {
        setError(result.error);
        setSaveLabel("Publish failed");
        return;
      }
      setStatus("published");
      setError("");
      setSaveLabel("Published");
      if (!draftRef.current.publishedAt) patch({ publishedAt: new Date().toISOString().slice(0, 10) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
      setSaveLabel("Publish failed");
    }
  }

  async function onUnpublish() {
    try {
      const result = await unpublishBlogPost(post.id);
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      setStatus("draft");
      setSaveLabel("Unpublished");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unpublish");
    }
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 flex flex-col gap-2 border-b border-zinc-200 bg-zinc-50/95 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          {status === "published" ? "Published" : "Draft"} · {saveLabel}
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void onPreview()} className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm">
            Preview
          </button>
          {status === "published" ? (
            <>
              <a href={`/blog/${draft.slug}`} target="_blank" rel="noopener noreferrer" className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm">
                View live
              </a>
              <button type="button" onClick={() => void onUnpublish()} className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm">
                Unpublish
              </button>
            </>
          ) : (
            <button type="button" onClick={() => void onPublish()} className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
              Publish
            </button>
          )}
          <form action={duplicateBlogPost.bind(null, post.id)}>
            <button type="submit" className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm">
              Duplicate
            </button>
          </form>
          <DeleteBlogPostButton id={post.id} />
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="space-y-4 rounded border border-zinc-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Title
            <input value={draft.title} onChange={(e) => patch({ title: e.target.value })} className={input} />
          </label>
          <label className="text-sm">
            Slug
            <input value={draft.slug} onChange={(e) => patch({ slug: e.target.value })} className={input} />
          </label>
          <label className="text-sm">
            Category
            <select value={draft.category} onChange={(e) => patch({ category: asBlogCategory(e.target.value) })} className={input}>
              {BLOG_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Publish date
            <input type="date" value={draft.publishedAt ?? ""} onChange={(e) => patch({ publishedAt: e.target.value || null })} className={input} />
          </label>
          <label className="text-sm">
            Read time (minutes, 0 = automatic)
            <input type="number" min={0} value={draft.readMinutes} onChange={(e) => patch({ readMinutes: Number(e.target.value) })} className={input} />
          </label>
          <label className="text-sm">
            Placeholder emoji (used when there is no cover)
            <input value={draft.emoji ?? ""} maxLength={4} onChange={(e) => patch({ emoji: e.target.value || null })} className={input} />
          </label>
        </div>
        <label className="block text-sm">
          Excerpt
          <textarea value={draft.excerpt} onChange={(e) => patch({ excerpt: e.target.value })} rows={3} className={input} />
        </label>
        <label className="block text-sm">
          Tags (comma-separated)
          <input value={draft.tags.join(", ")} onChange={(e) => patch({ tags: e.target.value.split(",") })} className={input} />
        </label>
        <ImageField label="Cover image" url={draft.coverImage ?? ""} onChange={(coverImage) => patch({ coverImage: coverImage || null })} />
      </section>

      <section className="space-y-3 rounded border border-zinc-200 bg-white p-4">
        <h2 className="text-lg font-semibold">SEO</h2>
        <label className="block text-sm">
          Meta title <span className="text-zinc-400">({draft.metaTitle.length}/60)</span>
          <input value={draft.metaTitle} onChange={(e) => patch({ metaTitle: e.target.value })} placeholder={`${draft.title} — Manish Biswas`} className={input} />
        </label>
        <label className="block text-sm">
          Meta description <span className="text-zinc-400">({draft.metaDescription.length}/160)</span>
          <textarea value={draft.metaDescription} onChange={(e) => patch({ metaDescription: e.target.value })} rows={2} placeholder="Defaults to the excerpt" className={input} />
        </label>
      </section>

      <BlockEditor title="Post content" blocks={draft.body} allowed={BLOG_BLOCK_TYPES} onChange={(body) => patch({ body })} />
    </div>
  );
}

function toDraft(post: EditorPost): BlogDraft {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: asBlogCategory(post.category),
    tags: post.tags,
    emoji: post.emoji,
    coverImage: post.coverImage,
    body: asBody(post.body),
    publishedAt: post.publishedAt,
    readMinutes: post.readMinutes,
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
  };
}
