import {
  getItem,
  readItems,
  removeItems,
  setItem,
  writeItems,
  type PaginatedMockItemsResult,
} from "./mockItem";
import { generateTaskName } from "./taskMockData";
import { FETCH_DELAY_MS, RANDOM_ERROR_PROBABILITY } from "../constants";
import type { Task } from "./types";

export type PaginatedTasksResult = PaginatedMockItemsResult<"task">;

const maybeThrowRandomBulkActionError = (operation: string): void => {
  if (Math.random() < RANDOM_ERROR_PROBABILITY) {
    throw new Error(`Failed to ${operation}`);
  }
};

export const fetchTasksPage = (
  page: number,
  pageSize: number,
  searchQuery: string,
): Promise<PaginatedTasksResult> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < RANDOM_ERROR_PROBABILITY) {
        reject(new Error("Failed to fetch tasks page"));
        return;
      }

      try {
        resolve(readItems("task", page, pageSize, searchQuery));
      } catch {
        reject(new Error("Failed to fetch tasks page"));
      }
    }, FETCH_DELAY_MS);
  });

export const batchDeleteTasks = (ids: number[]): void => {
  maybeThrowRandomBulkActionError("delete selected tasks");
  removeItems("task", ids);
};

export const batchArchiveTasks = (ids: number[]): void => {
  maybeThrowRandomBulkActionError("archive selected tasks");
  for (const id of ids) {
    const task = getItem("task", id);
    if (!task) {
      continue;
    }
    setItem({ ...task, isArchived: true, type: "task" });
  }
};

export const batchUpdateTasks = (tasks: Task[]): void => {
  maybeThrowRandomBulkActionError("update selected tasks");
  for (const task of tasks) {
    setItem({ ...task, type: "task" });
  }
};

export const assignUserToTask = (taskId: number, userId: number): void => {
  const task = getItem("task", taskId);
  const user = getItem("user", userId);

  if (!task) {
    throw new Error(`Task ${taskId} not found`);
  }

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  setItem({ ...task, assignee: user, type: "task" });
};

export const assignUserToTasks = (taskIds: number[], userId: number): void => {
  maybeThrowRandomBulkActionError("assign user to selected tasks");
  const user = getItem("user", userId);

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  for (const taskId of taskIds) {
    const task = getItem("task", taskId);

    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    setItem({ ...task, assignee: user, type: "task" });
  }
};

export const populateTasks = (count: number = 1000): void => {
  const tasks = Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: generateTaskName(index),
    assignee: null,
    due: new Date(),
    isArchived: false,
  }));

  writeItems(
    "task",
    tasks.map((task) => ({ ...task, type: "task" })),
  );
};
