import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { BlogFooter, BlogHeader } from "@/components/blog/BlogChrome";
import { loadPublishedPost } from "@/lib/blog-public";
import { getPublishedBlogPosts } from "@/lib/queries";
import { DEFAULT_OG_IMAGE, JsonLd, PERSON_ID, SITE_NAME, TWITTER_HANDLE, breadcrumbs } from "@/lib/seo";

export const revalidate = 60;
export const dynamicParams = true;

import { SITE } from "@/lib/seo";

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
  const image = post.coverImage || DEFAULT_OG_IMAGE.url;
  const modified = "updatedAt" in post ? (post.updatedAt as Date) : post.publishedAt;
  return {
    title,
    description,
    keywords: [...post.tags, post.category, "Manish Biswas"],
    authors: [{ name: "Manish Biswas", url: SITE }],
    alternates: { canonical: `${SITE}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title,
      description,
      url: `${SITE}/blog/${post.slug}`,
      images: [{ url: image }],
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: modified?.toISOString(),
      authors: ["Manish Biswas"],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description, images: [image], creator: TWITTER_HANDLE },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await loadPublishedPost(slug);
  if (!post) notFound();

  const modified = "updatedAt" in post ? (post.updatedAt as Date) : post.publishedAt;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${SITE}/blog/${post.slug}#post`,
        headline: post.title,
        description: post.metaDescription || post.excerpt,
        image: post.coverImage || DEFAULT_OG_IMAGE.url,
        datePublished: post.publishedAt?.toISOString(),
        dateModified: modified?.toISOString(),
        articleSection: post.category,
        keywords: post.tags.join(", "),
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        mainEntityOfPage: `${SITE}/blog/${post.slug}`,
        inLanguage: "en",
      },
      breadcrumbs([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog.html" },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogHeader />
      <main className="blog-main" id="main">
        <BlogArticle post={post} />
      </main>
      <BlogFooter />
    </>
  );
}
