"use server";

import { requireAdmin } from "@/lib/auth";
import { actionError } from "@/lib/action-error";
import { getCoversBucket, getSupabaseAdmin } from "@/lib/supabase-admin";
import { storagePathFromUrl } from "@/lib/storage";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 4 * 1024 * 1024;

type UploadFile = {
  size: number;
  type: string;
  name: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

function asUploadFile(value: FormDataEntryValue | null): UploadFile | null {
  if (!value || typeof value === "string") return null;
  const blob = value as Blob & { name?: string };
  if (typeof blob.arrayBuffer !== "function" || typeof blob.size !== "number") return null;
  return {
    size: blob.size,
    type: blob.type || "",
    name: blob.name || "image.jpg",
    arrayBuffer: () => blob.arrayBuffer(),
  };
}

export async function uploadCoverImage(formData: FormData) {
  return uploadCaseStudyImage(formData);
}

export async function uploadCaseStudyImage(formData: FormData) {
  try {
    await requireAdmin();
    const file = asUploadFile(formData.get("file"));
    if (!file || file.size === 0) {
      return { error: "Choose an image file." };
    }
    if (!ALLOWED.has(file.type)) {
      return { error: "Use a JPG, PNG, WebP, or GIF." };
    }
    if (file.size > MAX_BYTES) {
      return { error: "Image must be under 4MB." };
    }

    const supabase = getSupabaseAdmin();
    const bucket = getCoversBucket();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      return { error: error.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (error) {
    return actionError(error, "Upload failed. Check Supabase storage env vars.");
  }
}

export async function deleteStoredImages(urls: Array<string | null | undefined>) {
  try {
    await requireAdmin();
    const paths = urls
      .map((url) => storagePathFromUrl(url))
      .filter((path): path is string => Boolean(path));
    if (!paths.length) return { ok: true };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(getCoversBucket()).remove(paths);
    if (error) return { error: error.message };
    return { ok: true };
  } catch (error) {
    return actionError(error, "Could not delete image.");
  }
}
