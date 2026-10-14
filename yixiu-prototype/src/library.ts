export type LibraryScope = "all" | "free" | "favorites" | "recent";

export type LibraryItem = { id: string; searchText: string };

function normalized(text: string) {
  return text.normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase().trim();
}

/** Categories and personal scopes intersect; recent results retain listening order. */
export function filterLibrary<T extends LibraryItem>(
  items: readonly T[],
  options: { scope: LibraryScope; query: string; free: ReadonlySet<string>; favorites: readonly string[]; recent: readonly string[] },
): T[] {
  const favorites = new Set(options.favorites);
  const recent = new Set(options.recent);
  const terms = normalized(options.query).split(/\s+/).filter(Boolean);
  const matches = items.filter(item => {
    if (options.scope === "free" && !options.free.has(item.id)) return false;
    if (options.scope === "favorites" && !favorites.has(item.id)) return false;
    if (options.scope === "recent" && !recent.has(item.id)) return false;
    const text = normalized(item.searchText);
    return terms.every(term => text.includes(term));
  });
  if (options.scope !== "recent") return matches;
  const order = new Map(options.recent.map((id, index) => [id, index]));
  return matches.sort((a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity));
}
