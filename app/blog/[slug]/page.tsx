import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { BlogFooter, BlogHeader } from "@/components/blog/BlogChrome";
import { loadPublishedPost } from "@/lib/blog-public";
import { getPublishedBlogPosts } from "@/lib/queries";

export const revalidate = 60;
export const dynamicParams = true;

const SITE = "https://manishbiswashere.vercel.app";

export async function generateStaticParams() {
  try {
    return (await getPublishedBlogPosts()).map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPublishedPost(slug);
  if (!post) return { title: "Post not found" };
  const title = post.metaTitle || `${post.title} — Manish Biswas`;
  const description = post.metaDescription || post.excerpt;
  const image = post.coverImage || `${SITE}/og-image.png`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE}/blog/${post.slug}` },
    openGraph: { type: "article", title, description, url: `${SITE}/blog/${post.slug}`, images: [{ url: image }], publishedTime: post.publishedAt?.toISOString() },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await loadPublishedPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.coverImage || `${SITE}/og-image.png`,
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Person", name: "Manish Biswas" },
    mainEntityOfPage: `${SITE}/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogHeader />
      <main className="blog-main" id="main">
        <BlogArticle post={post} />
      </main>
      <BlogFooter />
    </>
  );
}
