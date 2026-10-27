"use client";

import { deleteBlogPost } from "@/app/actions/blog";

export function DeleteBlogPostButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      className="rounded border border-red-200 px-3 py-2 text-sm text-red-700"
      onClick={() => {
        if (window.confirm("Delete this post and its uploaded images?")) {
          void deleteBlogPost(id);
        }
      }}
    >
      Delete
    </button>
  );
}
