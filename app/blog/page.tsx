import type { Metadata } from "next";
import { BlogListPage } from "@/components/blog/BlogListPage";
import { loadPublishedPosts } from "@/lib/blog-public";

export const revalidate = 60;

const SITE = "https://manishbiswashere.vercel.app";
const DESCRIPTION =
  "Blog by Manish Biswas on AI engineering, product management, and shipping — notes on LLM agents, SIH case studies, and building in public.";

export const metadata: Metadata = {
  title: "Blog — Manish Biswas | AI, Product & Engineering",
  description: DESCRIPTION,
  keywords: ["Manish Biswas blog", "AI engineering blog", "product management essays", "LLM agents", "SIH case study"],
  authors: [{ name: "Manish Biswas" }],
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  alternates: { canonical: `${SITE}/blog.html` },
  openGraph: {
    type: "website",
    siteName: "Manish Biswas — Portfolio",
    title: "Blog — Manish Biswas | AI & Product",
    description: "Essays and notes on AI, product management, and engineering from Manish Biswas.",
    url: `${SITE}/blog.html`,
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630 }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Manish Biswas",
    description: "Exploring AI, product management, and engineering.",
    images: [`${SITE}/og-image.png`],
    creator: "@realmanishb",
    site: "@realmanishb",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": `${SITE}/blog.html#blog`,
      url: `${SITE}/blog.html`,
      name: "Blog — Manish Biswas",
      description: "AI, product, and engineering notes by Manish Biswas.",
      author: { "@id": `${SITE}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog.html` },
      ],
    },
  ],
};

export default async function BlogPage() {
  const posts = await loadPublishedPosts();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogListPage posts={posts} />
    </>
  );
}
