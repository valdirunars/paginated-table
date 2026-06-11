import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";
import type { ColumnDef, PaginationState, Table } from "@tanstack/react-table";
import type { Task } from "../data/types";
import {
  type TableSelectionMode,
  usePaginatedTableModel,
  withSelectionColumn,
} from "./usePaginatedTableModel";

type TasksTableModelArgs = {
  tasks: Task[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  totalItems: number;
  totalPages: number;
  selectionMode?: TableSelectionMode;
};

export type TasksTableModel = {
  columns: Array<ColumnDef<Task>>;
  table: Table<Task>;
  selectedRowsCount: number;
  selectedRowIds: number[];
};

export function useTasksTableModel({
  tasks,
  pagination,
  setPagination,
  totalItems,
  totalPages,
  selectionMode = { type: "multi" },
}: TasksTableModelArgs): TasksTableModel {
  const baseColumns = useMemo<Array<ColumnDef<Task>>>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
      },
      {
        accessorKey: "name",
        header: "Task",
        size: 260,
      },
      {
        id: "assignee",
        header: "Assignee",
        size: 260,
        accessorFn: (task) => task.assignee?.displayName ?? "Unassigned",
      },
      {
        id: "due",
        header: "Due",
        size: 220,
        accessorFn: (task) => new Date(task.due).toLocaleDateString(),
      },
    ],
    [],
  );

  const columns = useMemo(
    () =>
      withSelectionColumn(
        baseColumns,
        (task) => `task ${task.name}`,
        () => "tasks",
        selectionMode,
      ),
    [baseColumns, selectionMode],
  );

  const { table, selectedRowsCount, selectedRowIds } = usePaginatedTableModel<Task>({
    items: tasks,
    columns,
    pagination,
    setPagination,
    totalItems,
    totalPages,
    selectionMode,
  });

  return {
    columns,
    table,
    selectedRowsCount,
    selectedRowIds,
  };
}
