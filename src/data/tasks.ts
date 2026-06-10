import {
  getItem,
  readItems,
  removeItems,
  setItem,
  writeItems,
  type PaginatedMockItemsResult,
} from "./mockItem";
import { generateTaskName } from "./taskMockData";
import type { Task } from "./types";

const RANDOM_ERROR_PROBABILITY = 0.1;
const FETCH_DELAY_MS = 1000;

export type PaginatedTasksResult = PaginatedMockItemsResult<"task">;

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
  removeItems("task", ids);
};

export const batchArchiveTasks = (ids: number[]): void => {
  for (const id of ids) {
    const task = getItem("task", id);
    if (!task) {
      continue;
    }
    setItem({ ...task, isArchived: true, type: "task" });
  }
};

export const batchUpdateTasks = (tasks: Task[]): void => {
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
