import type { ItemType, ItemTypeMap } from "./types";
import { rankItem } from "@tanstack/match-sorter-utils";

export type MockItem<T extends ItemType = ItemType> = ItemTypeMap[T] & {
  type: T;
};

function getStorageKey(type: ItemType): string {
  return `mockItems:${type}`;
}

export type PaginatedMockItemsResult<T extends ItemType> = {
  data: MockItem<T>[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export function readAllItems<T extends ItemType>(type: T): MockItem<T>[] {
  const raw = localStorage.getItem(getStorageKey(type));
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as MockItem<T>[];
  } catch {
    return [];
  }
}

export function readItems<T extends ItemType>(
  type: T,
  page: number,
  pageSize: number,
  searchQuery: string = "",
): PaginatedMockItemsResult<T> {
  const items = readAllItems(type);
  const normalizedQuery = searchQuery.trim();
  const filteredItems =
    normalizedQuery.length === 0
      ? items
      : items.filter((item) => {
          const searchableText = Object.values(item)
            .flatMap((value) => {
              if (value === null || value === undefined) {
                return [];
              }
              if (typeof value === "object") {
                return Object.values(value as Record<string, unknown>).map((nested) =>
                  String(nested),
                );
              }
              return [String(value)];
            })
            .join(" ");

          return rankItem(searchableText, normalizedQuery).passed;
        });

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    data: filteredItems.slice(start, start + pageSize),
    pagination: {
      page: safePage,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}

export function writeItems<T extends ItemType>(
  type: T,
  items: MockItem<T>[],
): void {
  localStorage.setItem(getStorageKey(type), JSON.stringify(items));
}

export function setItem<T extends ItemType>(item: MockItem<T>): void {
  const items = readAllItems(item.type);
  const index = items.findIndex((stored) => stored.id === item.id);

  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }

  writeItems(item.type, items);
}

export function getItem<T extends ItemType>(
  type: T,
  id: number,
): MockItem<T> | undefined {
  return readAllItems(type).find((item) => item.id === id);
}

export function removeItems<T extends ItemType>(type: T, ids: number[]): void {
  writeItems(
    type,
    readAllItems(type).filter((item) => !ids.includes(item.id)),
  );
}
