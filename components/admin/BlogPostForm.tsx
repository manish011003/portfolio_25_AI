"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { publishBlogPost, saveBlogDraft, unpublishBlogPost } from "@/app/actions/blog";
import { duplicateBlogPost } from "@/app/actions/blog";
import { asBody } from "@/lib/blocks";
import { asBlogCategory, BLOG_CATEGORIES, type BlogDraft } from "@/lib/blog";
import { SaveQueue, type SaveOutcome } from "@/lib/save-queue";
import { slugify } from "@/lib/slug";
import { BLOG_BLOCK_TYPES, BlockEditor } from "./BlockEditor";
import { DeleteBlogPostButton } from "./DeleteBlogPostButton";
import { ImageField, UploadTrackerContext } from "./ImageField";

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
const LEAVE_WARNING = "You have changes that are not saved yet. Leave anyway?";

export function BlogPostForm({ post, revision }: { post: EditorPost; revision: string }) {
  const [draft, setDraft] = useState<BlogDraft>(() => toDraft(post));
  const [status, setStatus] = useState(post.status);
  const [actionError, setActionError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [preview, setPreview] = useState<"off" | "desktop" | "mobile">("off");
  // The newest local state. Every edit goes through here, so handlers that outlive a render
  // (uploads, timers) can never build on an older copy.
  const draftRef = useRef(draft);
  const slugField = useRef<HTMLInputElement>(null);
  const serverSlug = useRef(post.slug);

  const [queue] = useState(
    () =>
      new SaveQueue<BlogDraft>({
        initial: toDraft(post),
        revision,
        debounceMs: 800,
        maxWaitMs: 4000,
        save: async (snapshot, base, { force, publish }): Promise<SaveOutcome> => {
          const result = publish
            ? await publishBlogPost(post.id, snapshot, base, force)
            : await saveBlogDraft(post.id, snapshot, base, force);
          if ("conflict" in result && result.conflict) return { conflict: true, revision: result.revision };
          if ("error" in result && result.error) return { error: result.error };
          if (!("revision" in result)) return { error: "Save failed" };
          if (result.slug) serverSlug.current = result.slug;
          return { ok: true, revision: result.revision };
        },
        onSaved: (_saved, _outcome, isLatest) => {
          // The server normalises the slug. Show that back only when nothing newer was typed and
          // the field isn't being edited, otherwise it would overwrite what the user is typing.
          const slug = serverSlug.current;
          if (isLatest && slug !== draftRef.current.slug && document.activeElement !== slugField.current) {
            draftRef.current = { ...draftRef.current, slug };
            setDraft(draftRef.current);
          }
        },
      }),
  );
  const snap = useSyncExternalStore(queue.subscribe, queue.getSnapshot, queue.getSnapshot);
  useEffect(() => () => queue.dispose(), [queue]);

  const uploadTracker = useMemo(
    () => ({
      begin: () => {
        setUploads((n) => n + 1);
        let ended = false;
        return () => {
          if (ended) return;
          ended = true;
          setUploads((n) => n - 1);
        };
      },
    }),
    [],
  );

  const uploading = uploads > 0;
  const unsafeToLeave = snap.status !== "saved" || uploading || publishing;
  const label = publishing
    ? "Publishing…"
    : snap.status === "failed" || snap.status === "conflict"
      ? "Save failed"
      : snap.status === "saving"
        ? "Saving"
        : snap.status === "unsaved" || uploading
          ? "Unsaved"
          : "Saved";

  // Warn before closing the tab, reloading or following a link while edits are not persisted.
  const leaveGuard = useRef(false);
  useEffect(() => {
    leaveGuard.current = unsafeToLeave;
  });
  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      if (!leaveGuard.current) return;
      event.preventDefault();
      event.returnValue = "";
    }
    function onClick(event: MouseEvent) {
      if (!leaveGuard.current || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash) return;
      if (!window.confirm(LEAVE_WARNING)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  function patch(partial: Partial<BlogDraft>) {
    draftRef.current = { ...draftRef.current, ...partial };
    setDraft(draftRef.current);
    setActionError("");
    queue.edit(draftRef.current);
  }

  async function onPreview() {
    // Open the tab first (popup blockers allow it only inside the click), then point it at the
    // preview once the latest edits are confirmed saved, so it shows exactly what is stored.
    const tab = window.open("", "_blank");
    if (tab) tab.opener = null;
    const saved = await queue.flush();
    if (saved && !uploading) {
      if (tab) tab.location.href = `/admin/blog/${post.id}/preview`;
      else window.open(`/admin/blog/${post.id}/preview`, "_blank", "noopener");
    } else {
      tab?.close();
    }
  }

  async function onPublish() {
    setPublishing(true);
    setActionError("");
    try {
      if (uploading) {
        setActionError("Wait for the image upload to finish before publishing.");
        return;
      }
      if (!(await queue.publish())) return;
      setStatus("published");
      if (!draftRef.current.publishedAt) patch({ publishedAt: new Date().toISOString().slice(0, 10) });
    } finally {
      setPublishing(false);
    }
  }

  async function onUnpublish() {
    try {
      const result = await unpublishBlogPost(post.id);
      if ("error" in result && result.error) {
        setActionError(result.error);
        return;
      }
      setStatus("draft");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not unpublish");
    }
  }

  return (
    <UploadTrackerContext.Provider value={uploadTracker}>
    <div className="space-y-6">
      <div className="sticky top-0 z-10 flex flex-col gap-2 border-b border-zinc-200 bg-zinc-50/95 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-zinc-500" aria-live="polite">
          <span data-testid="save-label">
            {status === "published" ? "Published" : "Draft"} · {label}
          </span>
          {uploading && !publishing ? <span> · uploading image…</span> : null}
          {snap.status === "failed" ? (
            <span className="ml-2 text-red-600">
              {snap.error}. Your edits are kept.{" "}
              <button type="button" onClick={() => void queue.flush()} className="rounded border border-red-300 bg-white px-2 py-0.5 text-xs text-red-700">
                Retry
              </button>
            </span>
          ) : null}
          {snap.status === "conflict" ? (
            <span className="ml-2 text-red-600">
              This post was changed somewhere else since you opened it. Nothing was overwritten.{" "}
              <button type="button" onClick={() => void queue.overwrite()} className="rounded border border-red-300 bg-white px-2 py-0.5 text-xs text-red-700">
                Keep my version
              </button>{" "}
              <button type="button" onClick={() => window.location.reload()} className="rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs text-zinc-700">
                Load latest
              </button>
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void onPreview()} className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm">
            Preview
          </button>
          <button
            type="button"
            aria-pressed={preview !== "off"}
            onClick={() => setPreview(preview === "off" ? "desktop" : "off")}
            className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm"
          >
            {preview === "off" ? "Show live preview" : "Hide live preview"}
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
          <form
            action={duplicateBlogPost.bind(null, post.id)}
            onSubmit={async (event) => {
              // The copy is made from the stored post, so unsaved edits would be left out.
              if (queue.isClean && !uploading) return;
              event.preventDefault();
              const form = event.currentTarget;
              if (!uploading && (await queue.flush())) form.requestSubmit();
            }}
          >
            <button type="submit" className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm">
              Duplicate
            </button>
          </form>
          <DeleteBlogPostButton id={post.id} />
        </div>
      </div>
      {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}

      <section className="space-y-4 rounded border border-zinc-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Title
            <input value={draft.title} onChange={(e) => patch({ title: e.target.value })} className={input} />
          </label>
          <label className="text-sm">
            Slug
            <input
              ref={slugField}
              value={draft.slug}
              onChange={(e) => patch({ slug: e.target.value })}
              onBlur={(e) => {
                const clean = slugify(e.target.value);
                if (clean && clean !== draftRef.current.slug) patch({ slug: clean });
              }}
              className={input}
            />
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
        <ImageField
          label="Cover image"
          url={draft.coverImage ?? ""}
          deleteOnReplace={false}
          onChange={(coverImage) => patch({ coverImage: coverImage || null })}
        />
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

      <BlockEditor
        title="Post content"
        blocks={draft.body}
        allowed={BLOG_BLOCK_TYPES}
        keepImagesUntilSaved
        onChange={(body) => patch({ body })}
      />

      {preview !== "off" ? (
        <section className="space-y-2 rounded border border-zinc-200 bg-white p-4" aria-label="Live preview">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Live preview</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500">
                {label === "Saved" ? "Matches what is saved." : "Updates when the latest edits are saved."}
              </span>
              <button type="button" aria-pressed={preview === "desktop"} onClick={() => setPreview("desktop")} className="rounded border border-zinc-300 px-2 py-1 text-xs">
                Desktop
              </button>
              <button type="button" aria-pressed={preview === "mobile"} onClick={() => setPreview("mobile")} className="rounded border border-zinc-300 px-2 py-1 text-xs">
                Mobile
              </button>
            </div>
          </div>
          <div className="overflow-x-auto bg-zinc-100 p-2">
            <iframe
              key={snap.revision}
              title="Article preview"
              src={`/admin/blog/${post.id}/preview?r=${snap.revision}`}
              className="mx-auto block h-[75vh] max-w-full border-0 bg-white"
              style={{ width: preview === "mobile" ? 390 : "100%" }}
            />
          </div>
        </section>
      ) : null}
    </div>
    </UploadTrackerContext.Provider>
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
