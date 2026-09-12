"use server";

import { requireAdmin } from "@/lib/auth";
import { getCoversBucket, getSupabaseAdmin } from "@/lib/supabase-admin";
import { storagePathFromUrl } from "@/lib/storage";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 6 * 1024 * 1024;

export async function uploadCoverImage(formData: FormData) {
  return uploadCaseStudyImage(formData);
}

export async function uploadCaseStudyImage(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file." };
  }
  if (!ALLOWED.has(file.type)) {
    return { error: "Use a JPG, PNG, WebP, or GIF." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image must be under 6MB." };
  }

  try {
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
    return {
      error:
        error instanceof Error
          ? error.message
          : "Upload failed. Check Supabase storage env vars.",
    };
  }
}

export async function deleteStoredImages(urls: Array<string | null | undefined>) {
  await requireAdmin();
  const paths = urls
    .map((url) => storagePathFromUrl(url))
    .filter((path): path is string => Boolean(path));
  if (!paths.length) return { ok: true };

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(getCoversBucket()).remove(paths);
    if (error) return { error: error.message };
    return { ok: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not delete image.",
    };
  }
}
