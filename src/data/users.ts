import {
  readItems,
  removeItems,
  setItem,
  writeItems,
  type PaginatedMockItemsResult,
} from "./mockItem";
import { generateUserEmail, generateUserName } from "./userMockData";
import { FETCH_DELAY_MS, RANDOM_ERROR_PROBABILITY } from "../constants";
import type { User } from "./types";

export type PaginatedUsersResult = PaginatedMockItemsResult<"user">;

const maybeThrowRandomBulkActionError = (operation: string): void => {
  if (Math.random() < RANDOM_ERROR_PROBABILITY) {
    throw new Error(`Failed to ${operation}`);
  }
};

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
  maybeThrowRandomBulkActionError("delete selected users");
  removeItems("user", ids);
};

export const batchUpdateUsers = (users: User[]): void => {
  maybeThrowRandomBulkActionError("update selected users");
  for (const user of users) {
    setItem({ ...user, type: "user" });
  }
};

export const populateUsers = (count: number = 200): void => {
  const users = Array.from({ length: count }, (_, index) => {
    const name = generateUserName(index);
    return {
      id: index + 1,
      displayName: name,
      name,
      email: generateUserEmail(index),
    };
  });

  writeItems(
    "user",
    users.map((user) => ({ ...user, type: "user" })),
  );
};
