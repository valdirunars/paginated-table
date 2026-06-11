import { flexRender } from "@tanstack/react-table";
import type { ColumnDef, PaginationState, Table } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useState } from "react";
import type { BulkActionType } from "../data/types";
import type { TableSelectionMode } from "../hooks/usePaginatedTableModel";
import { assertNever } from "../utils";
import { Button } from "./Button";

const getBulkActionLabel = (action: BulkActionType): string => {
  switch (action) {
    case "assign":
      return "Assign";
    case "archive":
      return "Archive";
    case "delete":
      return "Delete";
    default:
      return assertNever(action);
  }
};

type BulkActionConfirmationValue<TData> =
  | ReactNode
  | ((selectedItems: TData[]) => ReactNode);

type BulkActionConfirmationConfig<TData> = {
  title?: BulkActionConfirmationValue<TData>;
  description?: BulkActionConfirmationValue<TData>;
  confirmButtonText?: string;
  cancelButtonText?: string;
  renderPreview?: (selectedItems: TData[]) => ReactNode;
};

export type BulkActionConfig<TData> = {
  type: BulkActionType;
  label?: string;
  confirmation?: BulkActionConfirmationConfig<TData>;
};

const resolveBulkActionConfirmationValue = <TData,>(
  value: BulkActionConfirmationValue<TData> | undefined,
  selectedItems: TData[],
): ReactNode =>
  typeof value === "function"
    ? (value as (items: TData[]) => ReactNode)(selectedItems)
    : value;

type PaginatedTableViewBaseProps<TData> = {
  title: string;
  itemNounPlural: string;
  emptyStateText: string;
  columns: Array<ColumnDef<TData>>;
  table: Table<TData>;
  pagination: PaginationState;
  totalItems: number;
  totalPages: number;
  selectedRowsCount: number;
  selectionMode?: TableSelectionMode;
  showBulkActions?: boolean;
  bulkActions?: Array<BulkActionConfig<TData>>;
  onBulkAction?: (action: BulkActionType, selectedItems: TData[]) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  showPageHeader?: boolean;
};

type PaginatedTableViewProps<TData> =
  | (PaginatedTableViewBaseProps<TData> & {
      selectionMode?: { type: "multi" } | { type: "single"; behavior: "soft" };
      onSingleSelect?: (item: TData) => void;
    })
  | (PaginatedTableViewBaseProps<TData> & {
      selectionMode: { type: "single"; behavior: "hard" };
      onSingleSelect: (item: TData) => void;
    });

export function PaginatedTableView<TData>({
  title,
  itemNounPlural,
  emptyStateText,
  columns,
  table,
  pagination,
  totalItems,
  totalPages,
  selectedRowsCount,
  selectionMode = { type: "multi" },
  onSingleSelect,
  showBulkActions = true,
  bulkActions = [],
  onBulkAction,
  searchQuery,
  onSearchQueryChange,
  isLoading,
  errorMessage,
  onRetry,
  showPageHeader = true,
}: PaginatedTableViewProps<TData>) {
  const { rows } = table.getRowModel();
  const selectedItems = table.getSelectedRowModel().rows.map((row) => row.original);
  const hasLoadError = Boolean(errorMessage);
  const [pendingAction, setPendingAction] = useState<BulkActionConfig<TData> | null>(
    null,
  );
  const skeletonRows = Array.from(
    { length: Math.max(6, pagination.pageSize) },
    (_, rowIndex) => ({
      id: `skeleton-${rowIndex}`,
      cells: Array.from({ length: columns.length }, (_, cellIndex) => ({
        id: `skeleton-cell-${rowIndex}-${cellIndex}`,
      })),
    }),
  );

  const executeBulkAction = (actionType: BulkActionType) => {
    onBulkAction?.(actionType, selectedItems);
    setPendingAction(null);
  };

  const headerPageInfo = isLoading
    ? `Loading page ${pagination.pageIndex + 1}...`
    : hasLoadError
      ? `Showing page ${pagination.pageIndex + 1} (unable to load total pages, ${totalItems} ${itemNounPlural})`
      : `Showing page ${pagination.pageIndex + 1} of ${totalPages} (${totalItems} ${itemNounPlural})`;

  const footerPageInfo = isLoading
    ? `Page ${pagination.pageIndex + 1} (loading total pages...)`
    : hasLoadError
      ? `Page ${pagination.pageIndex + 1} (total pages unavailable)`
      : `Page ${pagination.pageIndex + 1} of ${totalPages}`;

  return (
    <div className="users-table-container">
      {showPageHeader ? (
        <div className="app-page-header">
          <h1>{title}</h1>
          <p className="users-table-page-info">{headerPageInfo}</p>
        </div>
      ) : null}
      <div className="users-table-header">
        <label className="users-table-search">
          <span className="users-table-search-label">Search</span>
          <input
            type="search"
            className="users-table-search-input"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder={`Search ${itemNounPlural}`}
          />
        </label>
        {showBulkActions ? (
          <div
            className="users-table-bulk-actions"
            role={selectedRowsCount > 0 ? "status" : undefined}
            aria-live={selectedRowsCount > 0 ? "polite" : undefined}
          >
            <span className="users-table-bulk-selection">
              {selectedRowsCount > 0 ? `${selectedRowsCount} selected` : "None selected"}
            </span>
            <div className="users-table-bulk-buttons">
              <Button
                hidden={selectedRowsCount === 0}
                onClick={() => table.resetRowSelection()}
                disabled={selectedRowsCount === 0}
                tabIndex={selectedRowsCount > 0 ? 0 : -1}
                aria-hidden={selectedRowsCount === 0}
              >
                Clear selection
              </Button>
              {bulkActions.map((action) => (
                <Button
                  key={action.type}
                  variant={action.type === "delete" ? "destructive" : "default"}
                  hidden={selectedRowsCount === 0}
                  onClick={() => {
                    if (action.confirmation) {
                      setPendingAction(action);
                      return;
                    }
                    executeBulkAction(action.type);
                  }}
                  disabled={selectedRowsCount === 0}
                  tabIndex={selectedRowsCount > 0 ? 0 : -1}
                  aria-hidden={selectedRowsCount === 0}
                >
                  {action.label ?? getBulkActionLabel(action.type)}
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {errorMessage ? (
        <div className="users-table-error" role="alert">
          <span>{errorMessage}</span>
          <Button onClick={onRetry}>Retry</Button>
        </div>
      ) : null}
      <div className="users-table-layout">
        <div className="users-table-scroll-region">
          <table className="users-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button
                          variant="ghost"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: " \u25b2",
                            desc: " \u25bc",
                          }[header.column.getIsSorted() as string] ?? null}
                        </Button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                skeletonRows.map((row) => (
                  <tr key={row.id} aria-hidden="true">
                    {row.cells.map((cell) => (
                      <td key={cell.id}>
                        <span className="users-table-skeleton" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="users-table-empty">
                    {emptyStateText}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="users-table-row"
                    aria-selected={row.getIsSelected()}
                    onClick={(event) => {
                      const target = event.target as HTMLElement;
                      if (target.closest("input, button, a")) {
                        return;
                      }
                      if (selectionMode.type === "single") {
                        const item = row.original;
                        table.setRowSelection({ [row.id]: true });
                        if (
                          selectionMode.behavior === "hard" &&
                          onSingleSelect
                        ) {
                          onSingleSelect(item);
                          return;
                        }
                        onSingleSelect?.(item);
                        return;
                      }
                      row.toggleSelected();
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="users-table-pagination">
          <p className="users-table-pagination-info">{footerPageInfo}</p>
          <div className="users-table-pagination-actions">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              Previous
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      {pendingAction?.confirmation ? (
        <div className="users-table-modal-backdrop" role="presentation">
          <div className="users-table-modal" role="dialog" aria-modal="true">
            <h2 className="users-table-modal-title">
              {resolveBulkActionConfirmationValue(
                pendingAction.confirmation.title ??
                  `Confirm ${getBulkActionLabel(pendingAction.type).toLowerCase()}`,
                selectedItems,
              )}
            </h2>
            {pendingAction.confirmation.description ? (
              <p className="users-table-modal-description">
                {resolveBulkActionConfirmationValue(
                  pendingAction.confirmation.description,
                  selectedItems,
                )}
              </p>
            ) : null}
            {pendingAction.confirmation.renderPreview ? (
              <div className="users-table-modal-preview">
                {pendingAction.confirmation.renderPreview(selectedItems)}
              </div>
            ) : null}
            <div className="users-table-modal-actions">
              <Button onClick={() => setPendingAction(null)}>
                {pendingAction.confirmation.cancelButtonText ?? "Cancel"}
              </Button>
              <Button
                variant={
                  pendingAction.type === "delete" ? "destructive" : "default"
                }
                onClick={() => executeBulkAction(pendingAction.type)}
              >
                {pendingAction.confirmation.confirmButtonText ??
                  getBulkActionLabel(pendingAction.type)}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
