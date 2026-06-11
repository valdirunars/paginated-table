import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";
import type { ColumnDef, PaginationState, Table } from "@tanstack/react-table";
import type { Task } from "../data/types";
import { useLocalization } from "../localization/localization";
import { createColumnsForItemType } from "./table/columns";
import {
  type TableSelectionMode,
  usePaginatedTableModel,
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
  const { translate } = useLocalization();

  const columns = useMemo(
    () => createColumnsForItemType("task", translate, selectionMode),
    [selectionMode, translate],
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
