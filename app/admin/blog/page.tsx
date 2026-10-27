import Link from "next/link";
import { createDraftBlogPost, duplicateBlogPost, toggleBlogStatus } from "@/app/actions/blog";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteBlogPostButton } from "@/components/admin/DeleteBlogPostButton";
import { categoryLabel, formatPostDate } from "@/lib/blog";
import { getAllBlogPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <AdminShell title="Blog">
      <div className="mb-4">
        <form action={createDraftBlogPost}>
          <button type="submit" className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
            New post
          </button>
        </form>
      </div>
      <div className="overflow-x-auto rounded border border-zinc-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-zinc-100">
                <td className="px-3 py-2">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-xs text-zinc-500">
                    /blog/{post.slug}
                    {post.externalUrl ? ` · links to ${post.externalUrl}` : ""}
                  </div>
                </td>
                <td className="px-3 py-2">{categoryLabel(post.category)}</td>
                <td className="px-3 py-2">{post.status}</td>
                <td className="px-3 py-2">{formatPostDate(post.publishedAt) || "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Link className="underline" href={`/admin/blog/${post.id}`}>
                      Edit
                    </Link>
                    <form action={toggleBlogStatus.bind(null, post.id)}>
                      <button type="submit" className="underline">
                        {post.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={duplicateBlogPost.bind(null, post.id)}>
                      <button type="submit" className="underline">
                        Duplicate
                      </button>
                    </form>
                    <DeleteBlogPostButton id={post.id} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-zinc-500">
                  No posts yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
