export const SITE = "https://manishbiswashere.vercel.app";
export const SITE_NAME = "Manish Biswas — Portfolio";
export const DEFAULT_OG_IMAGE = { url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: "Manish Biswas — AI Engineer and Product Manager" };
export const TWITTER_HANDLE = "@realmanishb";

export const PERSON_ID = `${SITE}/#person`;

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  };
}

export function absoluteUrl(url: string | null | undefined) {
  if (!url) return DEFAULT_OG_IMAGE.url;
  return url.startsWith("http") ? url : `${SITE}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Trim to a search-snippet-friendly length without cutting mid-word. */
export function snippet(text: string, max = 158) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
