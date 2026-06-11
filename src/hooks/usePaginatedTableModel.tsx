import type { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
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

type IndeterminateCheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  ariaLabel: string;
};

function IndeterminateCheckbox({
  checked,
  indeterminate = false,
  onChange,
  ariaLabel,
}: IndeterminateCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.indeterminate = !checked && indeterminate;
  }, [checked, indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
    />
  );
}

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
        <IndeterminateCheckbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          ariaLabel={`Select all ${getPluralLabel()} on this page`}
        />
      ),
      cell: ({ row }) => (
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          ariaLabel={`Select ${getItemLabel(row.original)}`}
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
