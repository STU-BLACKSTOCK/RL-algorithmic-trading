import type { HistoryItem, HistorySortConfig } from "../types";

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

export function getTotalPages(totalItems: number, perPage: number): number {
  return Math.max(1, Math.ceil(totalItems / perPage));
}

export function filterHistory(
  items: HistoryItem[],
  search: string
): HistoryItem[] {
  const query = search.trim().toLowerCase();
  if (!query) return items;

  return items.filter(
    (item) =>
      item.ticker.toLowerCase().includes(query) ||
      item.action.toLowerCase().includes(query) ||
      String(item.id).includes(query) ||
      item.created_at.toLowerCase().includes(query)
  );
}

export function sortHistory(
  items: HistoryItem[],
  config: HistorySortConfig
): HistoryItem[] {
  const sorted = [...items];
  const { field, direction } = config;
  const multiplier = direction === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * multiplier;
    }

    return String(aVal).localeCompare(String(bVal)) * multiplier;
  });

  return sorted;
}
