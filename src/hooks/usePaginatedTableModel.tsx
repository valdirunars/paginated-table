import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table,
} from "@tanstack/react-table";
import { Checkbox } from "../design-system";
import type { TranslateFn } from "../localization/translations";

type UsePaginatedTableModelArgs<TData extends { id: number }> = {
  items: TData[];
  columns: Array<ColumnDef<TData>>;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  totalItems: number;
  totalPages: number;
  selectionMode?: TableSelectionMode;
};

export type TableSelectionMode =
  | { type: "multi" }
  | { type: "single"; behavior: "soft" | "hard" };

export type PaginatedTableModel<TData extends { id: number }> = {
  columns: Array<ColumnDef<TData>>;
  table: Table<TData>;
  selectedRowsCount: number;
  selectedRowIds: number[];
};

export function withSelectionColumn<TData extends { id: number }>(
  columns: Array<ColumnDef<TData>>,
  getItemLabel: (item: TData) => string,
  getPluralLabel: () => string,
  selectionMode: TableSelectionMode = { type: "multi" },
  translate: TranslateFn,
): Array<ColumnDef<TData>> {
  if (selectionMode.type === "single") {
    return columns;
  }

  return [
    {
      id: "select",
      size: 44,
      enableSorting: false,
      enableGlobalFilter: false,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label={translate("a11y.selectAllOnPage", {
            values: { items: getPluralLabel() },
          })}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label={translate("a11y.selectItem", {
            values: { label: getItemLabel(row.original) },
          })}
        />
      ),
    },
    ...columns,
  ];
}

export function usePaginatedTableModel<TData extends { id: number }>({
  items,
  columns,
  pagination,
  setPagination,
  totalItems,
  totalPages,
  selectionMode = { type: "multi" },
}: UsePaginatedTableModelArgs<TData>): PaginatedTableModel<TData> {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting, rowSelection, pagination },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: selectionMode.type === "multi",
    manualPagination: true,
    pageCount: totalPages,
    rowCount: totalItems,
    getRowId: (row) => String(row.id),
    autoResetPageIndex: false,
  });

  const selectedRowsCount = Object.values(rowSelection).filter(Boolean).length;
  const selectedRowIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  return {
    columns,
    table,
    selectedRowsCount,
    selectedRowIds,
  };
}
