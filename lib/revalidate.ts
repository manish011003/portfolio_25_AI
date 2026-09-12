import { revalidatePath } from "next/cache";

export function revalidatePublicContent(slug?: string) {
  revalidatePath("/pm");
  revalidatePath("/case-studies");
  revalidatePath("/case-studies/[slug]", "page");
  if (slug) {
    revalidatePath(`/case-studies/${slug}`);
  }
}
