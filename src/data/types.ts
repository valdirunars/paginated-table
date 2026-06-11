export type User = {
  id: number;
  displayName: string;
  name: string;
  email: string;
};

export type Task = {
  id: number;
  name: string;
  assignee: User | null;
  due: Date;
  isArchived?: boolean;
};

export type ItemType = keyof ItemTypeMap;

export type ItemTypeMap = {
  user: User;
  task: Task;
};

export type BulkActionType = "assign" | "archive" | "delete";
