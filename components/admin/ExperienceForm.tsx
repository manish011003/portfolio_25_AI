"use client";

import { useState } from "react";
import { deleteExperience, saveExperience } from "@/app/actions/experience";
import { toMonthInput, type ExperienceDraft } from "@/lib/experience";
import { ImageField } from "./ImageField";

export type EditorExperience = {
  id: string;
  role: string;
  company: string;
  startDate: Date | string;
  endDate: Date | string | null;
  description: string;
  images: string[];
  order: number;
};

export function ExperienceForm({ entry }: { entry: EditorExperience }) {
  const [draft, setDraft] = useState<ExperienceDraft>(() => toDraft(entry));
  const [saveLabel, setSaveLabel] = useState("Save");
  const [error, setError] = useState("");

  function patch(partial: Partial<ExperienceDraft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  async function onSave() {
    setSaveLabel("Saving…");
    const result = await saveExperience(entry.id, draft);
    if (result && "error" in result && result.error) {
      setError(result.error);
      setSaveLabel("Save failed");
      return;
    }
    setError("");
    setSaveLabel("Saved");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-zinc-500">{saveLabel}</p>
        <button
          type="button"
          className="rounded border border-red-200 px-3 py-2 text-sm text-red-700"
          onClick={() => {
            if (window.confirm("Delete this experience entry and its uploaded images?")) {
              void deleteExperience(entry.id);
            }
          }}
        >
          Delete
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="space-y-4 rounded border border-zinc-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Role
            <input
              value={draft.role}
              onChange={(e) => patch({ role: e.target.value })}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Company / organization
            <input
              value={draft.company}
              onChange={(e) => patch({ company: e.target.value })}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Start
            <input
              type="month"
              value={draft.startMonth}
              onChange={(e) => patch({ startMonth: e.target.value })}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            End
            <input
              type="month"
              value={draft.endMonth}
              disabled={draft.present}
              onChange={(e) => patch({ endMonth: e.target.value })}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 disabled:bg-zinc-100"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.present}
              onChange={(e) => patch({ present: e.target.checked })}
            />
            Present
          </label>
          <label className="text-sm">
            Order
            <input
              type="number"
              value={draft.order}
              onChange={(e) => patch({ order: Number(e.target.value) })}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
        </div>
        <label className="block text-sm">
          Description
          <textarea
            value={draft.description}
            onChange={(e) => patch({ description: e.target.value })}
            rows={4}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </label>
        <div className="space-y-4">
          <p className="text-sm font-medium">Images</p>
          {draft.images.map((url, index) => (
            <ImageField
              key={`${url}-${index}`}
              label={`Image ${index + 1}`}
              url={url}
              onChange={(next) => {
                const images = [...draft.images];
                if (next) images[index] = next;
                else images.splice(index, 1);
                patch({ images });
              }}
            />
          ))}
          <button
            type="button"
            className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm"
            onClick={() => patch({ images: [...draft.images, ""] })}
          >
            Add image
          </button>
        </div>
        <button
          type="button"
          onClick={() => void onSave()}
          className="rounded bg-zinc-900 px-3 py-2 text-sm text-white"
        >
          Save
        </button>
      </section>
    </div>
  );
}

function toDraft(entry: EditorExperience): ExperienceDraft {
  return {
    role: entry.role,
    company: entry.company,
    startMonth: toMonthInput(entry.startDate),
    endMonth: toMonthInput(entry.endDate),
    present: !entry.endDate,
    description: entry.description,
    images: entry.images,
    order: entry.order,
  };
}
