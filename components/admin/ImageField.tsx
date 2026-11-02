"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { deleteStoredImages, uploadCaseStudyImage } from "@/app/actions/upload";

const MAX_BYTES = 4 * 1024 * 1024;

/** Lets a form know an upload is running, so it never reports "Saved" while a URL is still pending. */
export const UploadTrackerContext = createContext<{ begin: () => () => void } | null>(null);

type Upload = { file: File; preview: string; state: "uploading" | "failed"; error: string };

export function ImageField({
  label,
  url,
  onChange,
  deleteOnReplace = true,
}: {
  label: string;
  url: string;
  /**
   * Called with the final URL once an upload finishes. Return false when the target no longer
   * exists (e.g. its block was deleted while uploading) so the orphaned upload can be discarded.
   */
  onChange: (url: string) => boolean | void;
  /**
   * Delete the previous stored file as soon as it is replaced or removed. Posts leave this off:
   * the old file must stay until the new URL is saved, and the save removes it afterwards.
   */
  deleteOnReplace?: boolean;
}) {
  const [upload, setUpload] = useState<Upload | null>(null);
  const tracker = useContext(UploadTrackerContext);
  const onChangeRef = useRef(onChange);
  const urlRef = useRef(url);
  const mounted = useRef(true);
  const current = useRef<Upload | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
    urlRef.current = url;
  });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    current.current = upload;
  }, [upload]);
  useEffect(() => {
    return () => {
      if (current.current) URL.revokeObjectURL(current.current.preview);
    };
  }, []);

  async function start(file: File, preview = URL.createObjectURL(file)) {
    if (file.size > MAX_BYTES) {
      URL.revokeObjectURL(preview);
      setUpload({ file, preview: "", state: "failed", error: "Image must be under 4MB." });
      return;
    }
    const done = tracker?.begin();
    setUpload({ file, preview, state: "uploading", error: "" });
    try {
      const data = new FormData();
      data.set("file", file);
      const result = await uploadCaseStudyImage(data);
      if ("error" in result && result.error) {
        if (mounted.current) setUpload({ file, preview, state: "failed", error: result.error });
        return;
      }
      if (!("url" in result) || !result.url) {
        if (mounted.current) setUpload({ file, preview, state: "failed", error: "Upload failed. Try again." });
        return;
      }
      const previous = urlRef.current;
      const applied = onChangeRef.current(result.url);
      if (applied === false) {
        // The block this upload was for is gone; don't leave the file behind.
        void deleteStoredImages([result.url]);
      } else if (deleteOnReplace && previous && previous !== result.url) {
        void deleteStoredImages([previous]);
      }
      URL.revokeObjectURL(preview);
      if (mounted.current) setUpload(null);
    } catch (err) {
      if (mounted.current) {
        setUpload({
          file,
          preview,
          state: "failed",
          error: err instanceof Error ? err.message : "Upload failed. Try a smaller JPG or PNG.",
        });
      }
    } finally {
      done?.();
    }
  }

  const busy = upload?.state === "uploading";
  const shown = upload?.preview || url;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {shown ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shown} alt="" className={`max-h-40 rounded border border-zinc-200 ${busy ? "opacity-50" : ""}`} />
          {busy ? (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-zinc-900" role="status">
              Uploading…
            </span>
          ) : null}
        </div>
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
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void start(file);
              e.target.value = "";
            }}
          />
        </label>
        {url ? (
          <button
            type="button"
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40"
            disabled={busy}
            onClick={() => {
              if (deleteOnReplace) void deleteStoredImages([url]);
              onChange("");
            }}
          >
            Remove
          </button>
        ) : null}
        {upload?.state === "failed" ? (
          <>
            {upload.preview ? (
              <button
                type="button"
                className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
                onClick={() => void start(upload.file, upload.preview)}
              >
                Retry upload
              </button>
            ) : null}
            <button
              type="button"
              className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
              onClick={() => {
                if (upload.preview) URL.revokeObjectURL(upload.preview);
                setUpload(null);
              }}
            >
              Dismiss
            </button>
          </>
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
      {upload?.state === "failed" ? (
        <p className="text-xs text-red-600" role="alert">
          Upload failed: {upload.error} Your other changes are kept.
        </p>
      ) : null}
    </div>
  );
}
