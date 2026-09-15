export function moveItem<T extends { id: string }>(
  items: T[],
  id: string,
  direction: "up" | "down",
): T[] | null {
  const index = items.findIndex((item) => item.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= items.length) return null;
  const next = [...items];
  const current = next[index];
  next[index] = next[swapWith];
  next[swapWith] = current;
  return next;
}
