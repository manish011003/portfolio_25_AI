import type { CSSProperties } from "react";
import { asBody } from "@/lib/blocks";
import { categoryLabel, formatPostDateLong, type PublicBlogPost } from "@/lib/blog";
import { BlogBlocks } from "./BlogBlocks";

const del = (value: string) => ({ "--del": value }) as CSSProperties;

export function BlogArticle({ post }: { post: PublicBlogPost }) {
  const blocks = asBody(post.body);
  const date = formatPostDateLong(post.publishedAt);

  return (
    <article className="blog-article">
      <header className="ba-hero">
        <div className="ba-wrap">
          <p className="ba-meta" data-anim="fade-in" style={del(".3s")}>
            <span className="ba-cat">{categoryLabel(post.category)}</span>
            {date ? <time>{date}</time> : null}
            {post.readMinutes ? <span>{post.readMinutes} min read</span> : null}
          </p>
          <div className="ba-title" data-anim="slide-from-bottom">
            <h1>{post.title}</h1>
          </div>
          {post.excerpt ? (
            <p className="ba-excerpt" data-anim="fade-in-up" style={del(".7s")}>
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </header>

      <div className="ba-wrap ba-main">
        {post.coverImage ? (
          <div className="ba-cover" data-anim="zoom-in" style={{ "--dur": "1.6s", "--del": ".2s" } as CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={`${post.title} cover`} />
          </div>
        ) : null}
        <BlogBlocks blocks={blocks} />
        <footer className="ba-foot">
          {post.tags.length ? (
            <ul className="ba-tags">
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
          <a className="bb-btn" href="/blog.html#posts">
            ← All posts
          </a>
        </footer>
      </div>
    </article>
  );
}
