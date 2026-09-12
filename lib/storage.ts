import { getCoversBucket } from "./supabase-admin";

export function storagePathFromUrl(url: string | null | undefined) {
  if (!url) return null;
  const bucket = getCoversBucket();
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length).split("?")[0] || "");
}
