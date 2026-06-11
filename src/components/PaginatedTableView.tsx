import { flexRender } from "@tanstack/react-table";
import type { ColumnDef, PaginationState, Table } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useState } from "react";
import type { BulkActionType } from "../data/types";
import {
  BulkActionsBar,
  BulkActionsBarSkeleton,
  Button,
  ErrorAlert,
  Input,
  InputSkeleton,
  PaginationSkeleton,
  SelectLanguage,
  SelectLanguageSkeleton,
  surfaces,
  TableCellSkeleton,
  Typography,
  TypographySkeleton,
} from "../design-system";
import type { TableSelectionMode } from "../hooks/usePaginatedTableModel";
import { useLocalization } from "../localization/localization";
import {
  localeDisplay,
  locales,
  type Locale,
  type TranslateFn,
} from "../localization/translations";
import { assertNever } from "../utils";

const getBulkActionLabel = (
  action: BulkActionType,
  translate: TranslateFn,
): string => {
  switch (action) {
    case "assign":
      return translate("bulkActions.assign");
    case "archive":
      return translate("bulkActions.archive");
    case "delete":
      return translate("bulkActions.delete");
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
  searchPlaceholder?: string;
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
  skeletonRowCount?: number;
  skeletonSearch?: boolean;
  skeletonBulkActions?: boolean;
  skeletonTitle?: boolean;
  skeletonPageInfo?: boolean;
  skeletonLanguage?: boolean;
  skeletonPagination?: boolean;
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
  searchPlaceholder,
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
  skeletonRowCount,
  skeletonSearch = false,
  skeletonBulkActions = false,
  skeletonTitle = false,
  skeletonPageInfo = false,
  skeletonLanguage = false,
  skeletonPagination = false,
}: PaginatedTableViewProps<TData>) {
  const { translate, locale, setLocale } = useLocalization();
  const { rows } = table.getRowModel();
  const selectedItems = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  const hasLoadError = Boolean(errorMessage);
  const [pendingAction, setPendingAction] =
    useState<BulkActionConfig<TData> | null>(null);
  const skeletonRows = Array.from(
    { length: skeletonRowCount ?? Math.max(6, pagination.pageSize) },
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
    ? translate("pagination.loadingPage", {
        values: { page: pagination.pageIndex + 1 },
      })
    : hasLoadError
      ? translate("pagination.showingPageWithError", {
          values: {
            page: pagination.pageIndex + 1,
            count: totalItems,
            items: itemNounPlural,
          },
        })
      : translate("pagination.showingPage", {
          values: {
            page: pagination.pageIndex + 1,
            totalPages,
            count: totalItems,
            items: itemNounPlural,
          },
        });

  const footerPageInfo = isLoading
    ? translate("pagination.pageLoadingTotal", {
        values: { page: pagination.pageIndex + 1 },
      })
    : hasLoadError
      ? translate("pagination.pageTotalUnavailable", {
          values: { page: pagination.pageIndex + 1 },
        })
      : translate("pagination.pageOfTotal", {
          values: {
            page: pagination.pageIndex + 1,
            totalPages,
          },
        });

  const languageOptions = locales.map((optionLocale) => ({
    value: optionLocale,
    ...localeDisplay[optionLocale],
  }));

  return (
    <div className="flex min-h-table-min flex-1 flex-col gap-ui-md">
      {showPageHeader ? (
        <div className="flex shrink-0 items-baseline justify-between gap-ui-lg">
          {skeletonTitle ? (
            <TypographySkeleton variant="h1" />
          ) : (
            <Typography variant="h1">{title}</Typography>
          )}
          <div className="flex shrink-0 items-center gap-ui-md">
            {skeletonPageInfo ? (
              <TypographySkeleton variant="caption" />
            ) : (
              <Typography variant="caption" className="m-0">
                {headerPageInfo}
              </Typography>
            )}
            {skeletonLanguage ? (
              <SelectLanguageSkeleton />
            ) : (
              <SelectLanguage
                value={locale}
                options={languageOptions}
                onChange={(nextLocale) => setLocale(nextLocale as Locale)}
                ariaLabel={translate("common.selectLanguage")}
              />
            )}
          </div>
        </div>
      ) : null}
      <div className="flex shrink-0 flex-col gap-ui-sm">
        {skeletonSearch ? (
          <InputSkeleton />
        ) : (
          <label className="flex items-center gap-ui-sm">
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder={searchPlaceholder ?? `Search ${itemNounPlural}`}
            />
          </label>
        )}
        {showBulkActions ? (
          skeletonBulkActions ? (
            <BulkActionsBarSkeleton />
          ) : (
            <BulkActionsBar
              selectionLabel={
                selectedRowsCount > 0
                  ? translate("pagination.selectedCount", {
                      values: { count: selectedRowsCount },
                    })
                  : translate("common.noneSelected")
              }
              clearSelectionLabel={translate("common.clearSelection")}
              showActions={selectedRowsCount > 0}
              onClearSelection={() => table.resetRowSelection()}
              actions={bulkActions.map((action) => ({
                id: action.type,
                label:
                  action.label ?? getBulkActionLabel(action.type, translate),
                variant: action.type === "delete" ? "destructive" : "default",
                onClick: () => {
                  if (action.confirmation) {
                    setPendingAction(action);
                    return;
                  }
                  executeBulkAction(action.type);
                },
              }))}
            />
          )
        ) : null}
      </div>
      {errorMessage ? (
        <ErrorAlert
          message={errorMessage}
          onRetry={onRetry}
          retryLabel={translate("common.retry")}
        />
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className={surfaces.tableScroll}>
          <table className="mt-0 w-full table-fixed border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className={surfaces.tableHeaderCell}
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
                      <td key={cell.id} className={surfaces.tableCell}>
                        <TableCellSkeleton />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className={`${surfaces.tableCell} text-center text-foreground-subtle`}
                  >
                    {emptyStateText}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer hover:[&>td]:bg-surface-subtle"
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
                      <td key={cell.id} className={surfaces.tableCell}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-ui-md flex shrink-0 items-center justify-between">
          {skeletonPagination ? (
            <PaginationSkeleton className="w-full" />
          ) : (
            <>
              <Typography variant="body-sm" className="m-0">
                {footerPageInfo}
              </Typography>
              <div className="flex gap-ui-sm">
                <Button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage() || isLoading}
                >
                  {translate("common.previous")}
                </Button>
                <Button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage() || isLoading}
                >
                  {translate("common.next")}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {pendingAction?.confirmation ? (
        <div className={surfaces.modalBackdrop} role="presentation">
          <div className={surfaces.modal} role="dialog" aria-modal="true">
            <Typography variant="h2" className="mb-2">
              {resolveBulkActionConfirmationValue(
                pendingAction.confirmation.title ??
                  translate("bulkActions.confirmAction", {
                    values: {
                      action: getBulkActionLabel(
                        pendingAction.type,
                        translate,
                      ).toLowerCase(),
                    },
                  }),
                selectedItems,
              )}
            </Typography>
            {pendingAction.confirmation.description ? (
              <Typography
                variant="body-sm"
                className="mb-3 text-foreground-secondary"
              >
                {resolveBulkActionConfirmationValue(
                  pendingAction.confirmation.description,
                  selectedItems,
                )}
              </Typography>
            ) : null}
            {pendingAction.confirmation.renderPreview ? (
              <div
                className={`max-h-preview-max overflow-auto px-ui-md py-ui-sm ${surfaces.panelInset}`}
              >
                {pendingAction.confirmation.renderPreview(selectedItems)}
              </div>
            ) : null}
            <div className="mt-ui-md flex justify-end gap-ui-sm">
              <Button onClick={() => setPendingAction(null)}>
                {pendingAction.confirmation.cancelButtonText ??
                  translate("common.cancel")}
              </Button>
              <Button
                variant={
                  pendingAction.type === "delete" ? "destructive" : "default"
                }
                onClick={() => executeBulkAction(pendingAction.type)}
              >
                {pendingAction.confirmation.confirmButtonText ??
                  getBulkActionLabel(pendingAction.type, translate)}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
