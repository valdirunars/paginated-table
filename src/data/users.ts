import {
  readItems,
  removeItems,
  setItem,
  writeItems,
  type PaginatedMockItemsResult,
} from "./mockItem";
import type { User } from "./types";

const RANDOM_ERROR_PROBABILITY = 0.1;
const FETCH_DELAY_MS = 1000;

export type PaginatedUsersResult = PaginatedMockItemsResult<"user">;

export const fetchUsersPage = (
  page: number,
  pageSize: number,
  searchQuery: string,
): Promise<PaginatedUsersResult> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < RANDOM_ERROR_PROBABILITY) {
        reject(new Error("Failed to fetch users page"));
        return;
      }

      try {
        resolve(readItems("user", page, pageSize, searchQuery));
      } catch {
        reject(new Error("Failed to fetch users page"));
      }
    }, FETCH_DELAY_MS);
  });

export const batchDeleteUsers = (ids: number[]): void => {
  removeItems("user", ids);
};

export const batchUpdateUsers = (users: User[]): void => {
  for (const user of users) {
    setItem({ ...user, type: "user" });
  }
};

export const populateUsers = (count: number = 200): void => {
  const users = Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    displayName: `User ${index + 1}`,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
  }));

  writeItems(
    "user",
    users.map((user) => ({ ...user, type: "user" })),
  );
};
