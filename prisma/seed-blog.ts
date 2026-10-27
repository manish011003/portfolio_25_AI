import { config } from "dotenv";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import { BLOG_SEED_POSTS } from "../lib/blog-seed";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

// Maps the original static blog posts into the CMS. Existing rows are never overwritten.
async function main() {
  for (const post of BLOG_SEED_POSTS) {
    const exists = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (exists) {
      console.log(`skip   ${post.slug}`);
      continue;
    }
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        emoji: post.emoji,
        tags: [],
        body: [{ id: "p-1", type: "paragraph", text: post.excerpt }],
        status: "published",
        publishedAt: new Date(post.publishedAt),
        readMinutes: post.readMinutes,
        externalUrl: post.externalUrl,
      },
    });
    console.log(`create ${post.slug}`);
  }
}

main().finally(() => prisma.$disconnect());
