export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function parseTags(raw: string) {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function parseStats(values: string[], labels: string[]) {
  const stats = [];
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i]?.trim();
    const label = labels[i]?.trim();
    if (value && label) stats.push({ value, label });
  }
  return stats.slice(0, 4);
}

export function isDarkHex(hex: string) {
  const raw = hex.replace("#", "");
  if (raw.length !== 6) return false;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 145;
}
