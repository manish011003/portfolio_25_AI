import { revalidatePath } from "next/cache";

export function revalidatePublicContent(slug?: string) {
  try {
    revalidatePath("/pm");
    revalidatePath("/case-studies");
    revalidatePath("/case-studies/[slug]", "page");
    revalidatePath("/admin", "layout");
    if (slug) {
      revalidatePath(`/case-studies/${slug}`);
    }
  } catch (error) {
    console.error("revalidatePublicContent failed", error);
  }
}
