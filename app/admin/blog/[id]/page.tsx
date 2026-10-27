import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { toDateInput } from "@/lib/blog";
import { getBlogPostById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <AdminShell title={`Edit: ${post.title}`}>
      <BlogPostForm
        post={{
          ...post,
          publishedAt: toDateInput(post.publishedAt),
        }}
      />
    </AdminShell>
  );
}
