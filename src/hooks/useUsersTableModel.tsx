import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";
import type { ColumnDef, PaginationState, Table } from "@tanstack/react-table";
import type { User } from "../data/types";
import {
  type TableSelectionMode,
  usePaginatedTableModel,
  withSelectionColumn,
} from "./usePaginatedTableModel";

type UsersTableModelArgs = {
  users: User[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  totalItems: number;
  totalPages: number;
  selectionMode?: TableSelectionMode;
};

export type UsersTableModel = {
  columns: Array<ColumnDef<User>>;
  table: Table<User>;
  selectedRowsCount: number;
  selectedRowIds: number[];
};

export function useUsersTableModel({
  users,
  pagination,
  setPagination,
  totalItems,
  totalPages,
  selectionMode = { type: "multi" },
}: UsersTableModelArgs): UsersTableModel {
  const baseColumns = useMemo<Array<ColumnDef<User>>>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
      },
      {
        accessorKey: "displayName",
        header: "Name",
        size: 260,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 320,
      },
    ],
    [],
  );

  const columns = useMemo(
    () =>
      withSelectionColumn(
        baseColumns,
        (user) => `user ${user.displayName}`,
        () => "users",
        selectionMode,
      ),
    [baseColumns, selectionMode],
  );

  const { table, selectedRowsCount, selectedRowIds } = usePaginatedTableModel<User>({
    items: users,
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
