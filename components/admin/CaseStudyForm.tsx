"use client";

import { useEffect, useRef, useState } from "react";
import {
  publishCaseStudy,
  saveCaseStudyDraft,
  unpublishCaseStudy,
} from "@/app/actions/case-studies";
import { asBody, asTemplate, type CaseStudyDraft, type CaseStudyTemplate } from "@/lib/blocks";
import type { CaseStudyStat } from "@/lib/types";
import { BlockEditor } from "./BlockEditor";
import { DeleteCaseStudyButton } from "./DeleteCaseStudyButton";
import { ImageField } from "./ImageField";

const emptyStats = [
  { value: "", label: "" },
  { value: "", label: "" },
  { value: "", label: "" },
  { value: "", label: "" },
];

export type EditorStudy = {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number;
  summary: string;
  description: string;
  coverImage: string | null;
  usersImpacted: number;
  themeColor: string;
  stats: CaseStudyStat[];
  tags: string[];
  github: string | null;
  liveDemo: string | null;
  featured?: boolean;
  status: "draft" | "published";
  order: number;
  template?: string;
  body?: unknown;
};

export function CaseStudyForm({ study }: { study: EditorStudy }) {
  const [draft, setDraft] = useState<CaseStudyDraft>(() => toDraft(study));
  const [status, setStatus] = useState(study.status);
  const [saveLabel, setSaveLabel] = useState("Saved");
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftRef = useRef(draft);
  const skipFirst = useRef(true);
  draftRef.current = draft;

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    setSaveLabel("Saving…");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void saveCaseStudyDraft(study.id, draftRef.current).then((result) => {
        if (result && "error" in result && result.error) {
          setError(result.error);
          setSaveLabel("Save failed");
          return;
        }
        setError("");
        setSaveLabel("Saved");
        if (result && "slug" in result && result.slug) {
          setDraft((current) =>
            current.slug === result.slug ? current : { ...current, slug: result.slug },
          );
        }
      });
    }, 900);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [draft, study.id]);

  function patch(partial: Partial<CaseStudyDraft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  async function onPublish() {
    setSaveLabel("Publishing…");
    const result = await publishCaseStudy(study.id, draftRef.current);
    if (result.error) {
      setError(result.error);
      setSaveLabel("Publish failed");
      return;
    }
    setStatus("published");
    setSaveLabel("Published");
  }

  async function onUnpublish() {
    const result = await unpublishCaseStudy(study.id);
    if (result.error) {
      setError(result.error);
      return;
    }
    setStatus("draft");
    setSaveLabel("Unpublished");
  }

  const stats = [...draft.stats, ...emptyStats].slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 flex flex-col gap-2 border-b border-zinc-200 bg-zinc-50/95 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          {status === "published" ? "Published" : "Draft"} · {saveLabel}
        </p>
        <div className="flex flex-wrap gap-2">
          {status === "published" ? (
            <button type="button" onClick={() => void onUnpublish()} className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm">
              Unpublish
            </button>
          ) : (
            <button type="button" onClick={() => void onPublish()} className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
              Publish
            </button>
          )}
          <DeleteCaseStudyButton id={study.id} />
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="space-y-4 rounded border border-zinc-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Title
            <input value={draft.title} onChange={(e) => patch({ title: e.target.value })} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm">
            Slug
            <input value={draft.slug} onChange={(e) => patch({ slug: e.target.value })} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm">
            Category
            <input value={draft.category} onChange={(e) => patch({ category: e.target.value })} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm">
            Year
            <input type="number" value={draft.year} onChange={(e) => patch({ year: Number(e.target.value) })} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm">
            Users impacted
            <input type="number" min={0} value={draft.usersImpacted} onChange={(e) => patch({ usersImpacted: Number(e.target.value) })} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm">
            Theme color
            <input type="color" value={draft.themeColor} onChange={(e) => patch({ themeColor: e.target.value })} className="mt-1 h-10 w-full rounded border border-zinc-300" />
          </label>
          <label className="text-sm">
            Layout template
            <select
              value={draft.template}
              onChange={(e) => patch({ template: e.target.value as CaseStudyTemplate })}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            >
              <option value="standard">Standard</option>
              <option value="narrative">Narrative</option>
              <option value="dataHeavy">Data-heavy</option>
            </select>
          </label>
          <label className="text-sm">
            Order
            <input type="number" value={draft.order} onChange={(e) => patch({ order: Number(e.target.value) })} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => patch({ featured: e.target.checked })}
            />
            Featured on /pm showcase
          </label>
        </div>
        <label className="block text-sm">
          Card summary
          <textarea value={draft.summary} onChange={(e) => patch({ summary: e.target.value })} rows={3} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          Tags (comma-separated)
          <input value={draft.tags.join(", ")} onChange={(e) => patch({ tags: e.target.value.split(",") })} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            GitHub
            <input type="url" value={draft.github ?? ""} onChange={(e) => patch({ github: e.target.value })} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm">
            Live demo
            <input type="url" value={draft.liveDemo ?? ""} onChange={(e) => patch({ liveDemo: e.target.value })} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Stats (2–4)</legend>
          {stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input
                placeholder="Value"
                value={stat.value}
                onChange={(e) => {
                  const next = [...stats];
                  next[i] = { ...next[i], value: e.target.value };
                  patch({ stats: next });
                }}
                className="rounded border border-zinc-300 px-3 py-2 text-sm"
              />
              <input
                placeholder="Label"
                value={stat.label}
                onChange={(e) => {
                  const next = [...stats];
                  next[i] = { ...next[i], label: e.target.value };
                  patch({ stats: next });
                }}
                className="rounded border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </fieldset>
        <ImageField
          label="Cover / thumbnail"
          url={draft.coverImage ?? ""}
          onChange={(coverImage) => patch({ coverImage: coverImage || null })}
        />
      </section>

      <BlockEditor blocks={draft.body} onChange={(body) => patch({ body })} />
    </div>
  );
}

function toDraft(study: EditorStudy): CaseStudyDraft {
  return {
    title: study.title,
    slug: study.slug,
    category: study.category,
    year: study.year,
    summary: study.summary,
    coverImage: study.coverImage,
    usersImpacted: study.usersImpacted,
    themeColor: study.themeColor,
    stats: study.stats,
    tags: study.tags,
    github: study.github,
    liveDemo: study.liveDemo,
    featured: Boolean(study.featured),
    order: study.order,
    template: asTemplate(study.template),
    body: asBody(study.body, study.description),
  };
}
