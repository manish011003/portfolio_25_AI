import Script from "next/script";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { BlogFooter, BlogHead, BlogHeader } from "@/components/blog/BlogChrome";
import { getBlogPostById } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Renders the saved draft with the exact public article component, behind the admin login. */
export default async function PreviewBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <div className="blog-root">
      <BlogHead />
      <div className="preview-banner">
        Preview — {post.status === "published" ? "this post is live" : "draft, not public"}
        <a href={`/admin/blog/${post.id}`}>← Back to editor</a>
      </div>
      <BlogHeader />
      <main className="blog-main" id="main">
        <BlogArticle post={{ ...post, publishedAt: post.publishedAt ?? new Date() }} />
      </main>
      <BlogFooter />
      <Script src="/blog.js" strategy="afterInteractive" />
    </div>
  );
}
