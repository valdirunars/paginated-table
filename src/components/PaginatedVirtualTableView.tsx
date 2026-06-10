import { flexRender } from "@tanstack/react-table";
import type { ColumnDef, PaginationState, Table } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useState } from "react";
import type { BulkActionType } from "../data/types";
import { assertNever } from "../utils";

const getBulkActionLabel = (action: BulkActionType): string => {
  switch (action) {
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

type PaginatedVirtualTableViewProps<TData> = {
  title: string;
  itemNounPlural: string;
  emptyStateText: string;
  columns: Array<ColumnDef<TData>>;
  table: Table<TData>;
  pagination: PaginationState;
  totalItems: number;
  totalPages: number;
  selectedRowsCount: number;
  bulkActions?: Array<BulkActionConfig<TData>>;
  onBulkAction?: (action: BulkActionType, selectedItems: TData[]) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
};

export function PaginatedVirtualTableView<TData>({
  title,
  itemNounPlural,
  emptyStateText,
  columns,
  table,
  pagination,
  totalItems,
  totalPages,
  selectedRowsCount,
  bulkActions = [],
  onBulkAction,
  searchQuery,
  onSearchQueryChange,
  isLoading,
  errorMessage,
  onRetry,
}: PaginatedVirtualTableViewProps<TData>) {
  const { rows } = table.getRowModel();
  const selectedItems = table.getSelectedRowModel().rows.map((row) => row.original);
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

  return (
    <div className="users-table-container">
      <div className="app-page-header">
        <h1>{title}</h1>
        <p className="users-table-page-info">
          Showing page {pagination.pageIndex + 1} of {totalPages} ({totalItems}{" "}
          {itemNounPlural})
        </p>
      </div>
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
        <div
          className="users-table-bulk-actions"
          role={selectedRowsCount > 0 ? "status" : undefined}
          aria-live={selectedRowsCount > 0 ? "polite" : undefined}
        >
          <span className="users-table-bulk-selection">
            {selectedRowsCount > 0 ? `${selectedRowsCount} selected` : "None selected"}
          </span>
          <div className="users-table-bulk-buttons">
            <button
              type="button"
              className={`users-table-bulk-btn${
                selectedRowsCount > 0 ? "" : " users-table-bulk-btn--hidden"
              }`}
              onClick={() => table.resetRowSelection()}
              disabled={selectedRowsCount === 0}
              tabIndex={selectedRowsCount > 0 ? 0 : -1}
              aria-hidden={selectedRowsCount === 0}
            >
              Clear selection
            </button>
            {bulkActions.map((action) => (
              <button
                key={action.type}
                type="button"
                className={`users-table-bulk-btn${
                  selectedRowsCount > 0 ? "" : " users-table-bulk-btn--hidden"
                }`}
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
              </button>
            ))}
          </div>
        </div>
      </div>
      {errorMessage ? (
        <div className="users-table-error" role="alert">
          <span>{errorMessage}</span>
          <button
            type="button"
            className="users-table-bulk-btn"
            onClick={onRetry}
          >
            Retry
          </button>
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
                        <button
                          className="users-table-sort-btn"
                          type="button"
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
                        </button>
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
          <p className="users-table-pagination-info">
            Page {pagination.pageIndex + 1} of {totalPages}
          </p>
          <div className="users-table-pagination-actions">
            <button
              type="button"
              className="users-table-bulk-btn"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              Previous
            </button>
            <button
              type="button"
              className="users-table-bulk-btn"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              Next
            </button>
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
              <button
                type="button"
                className="users-table-bulk-btn"
                onClick={() => setPendingAction(null)}
              >
                {pendingAction.confirmation.cancelButtonText ?? "Cancel"}
              </button>
              <button
                type="button"
                className="users-table-bulk-btn users-table-bulk-btn--danger"
                onClick={() => executeBulkAction(pendingAction.type)}
              >
                {pendingAction.confirmation.confirmButtonText ??
                  getBulkActionLabel(pendingAction.type)}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
