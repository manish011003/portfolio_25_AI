import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/graphify-out/"],
      },
    ],
    sitemap: "https://manishbiswashere.vercel.app/sitemap.xml",
  };
}
