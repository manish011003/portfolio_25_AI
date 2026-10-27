/** Turn a YouTube or Vimeo page URL into an embeddable player URL; anything else returns null. */
export function toEmbedUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    id = url.pathname.slice(1);
  } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else {
      const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/);
      id = match?.[1] ?? null;
    }
  }
  if (id && /^[\w-]{6,20}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const match = url.pathname.match(/(\d{5,})/);
    if (match) return `https://player.vimeo.com/video/${match[1]}`;
  }
  return null;
}
