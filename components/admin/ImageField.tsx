"use client";

import { useState } from "react";
import { deleteStoredImages, uploadCaseStudyImage } from "@/app/actions/upload";

export function ImageField({
  label,
  url,
  onChange,
}: {
  label: string;
  url: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    const data = new FormData();
    data.set("file", file);
    const result = await uploadCaseStudyImage(data);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.url) {
      if (url && url !== result.url) {
        void deleteStoredImages([url]);
      }
      onChange(result.url);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="max-h-40 rounded border border-zinc-200" />
      ) : (
        <p className="text-xs text-zinc-500">No image yet.</p>
      )}
      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm">
          {url ? "Replace" : "Upload"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = "";
            }}
          />
        </label>
        {url ? (
          <button
            type="button"
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
            onClick={() => {
              void deleteStoredImages([url]);
              onChange("");
            }}
          >
            Remove
          </button>
        ) : null}
      </div>
      <label className="block text-xs text-zinc-500">
        Or paste a URL
        <input
          value={url}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        />
      </label>
      {busy ? <p className="text-xs text-zinc-500">Uploading…</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
