import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";
import type { ColumnDef, PaginationState, Table } from "@tanstack/react-table";
import type { User } from "../data/types";
import { useLocalization } from "../localization/localization";
import { createColumnsForItemType } from "./table/columns";
import {
  type TableSelectionMode,
  usePaginatedTableModel,
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
  const { translate } = useLocalization();

  const columns = useMemo(
    () => createColumnsForItemType("user", translate, selectionMode),
    [selectionMode, translate],
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
