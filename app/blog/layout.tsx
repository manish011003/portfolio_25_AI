import Script from "next/script";
import { BlogHead } from "@/components/blog/BlogChrome";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-root">
      <BlogHead />
      {children}
      <Script src="/blog.js" strategy="afterInteractive" />
    </div>
  );
}
