import type { ItemType, ItemTypeMap } from "../../data/types";
import { usePaginatedTableSkeletonModel } from "../../hooks/skeleton";
import { assertNever } from "../../utils";
import type { BulkActionConfig } from "../PaginatedTableView";
import { PaginatedTableView } from "../PaginatedTableView";

const taskBulkActions = [
  { type: "assign" },
  { type: "archive" },
  { type: "delete" },
] as const satisfies ReadonlyArray<BulkActionConfig<ItemTypeMap["task"]>>;

function getDefaultShowBulkActions(itemType: ItemType): boolean {
  switch (itemType) {
    case "task":
      return true;
    case "user":
      return false;
    default:
      return assertNever(itemType);
  }
}

function getBulkActionsForItemType<T extends ItemType>(
  itemType: T,
  showBulkActions: boolean,
): Array<BulkActionConfig<ItemTypeMap[T]>> {
  if (!showBulkActions) {
    return [];
  }

  switch (itemType) {
    case "task":
      return [...taskBulkActions];
    case "user":
      return [];
    default:
      return assertNever(itemType);
  }
}

type PaginatedTableSkeletonViewProps<T extends ItemType> = {
  itemType: T;
  rowCount: number;
  title?: string;
  showBulkActions?: boolean;
  showPageHeader?: boolean;
};

export function PaginatedTableSkeletonView<T extends ItemType>({
  itemType,
  rowCount,
  title,
  showBulkActions = getDefaultShowBulkActions(itemType),
  showPageHeader = true,
}: PaginatedTableSkeletonViewProps<T>) {
  const model = usePaginatedTableSkeletonModel({ itemType, rowCount });

  return (
    <PaginatedTableView<ItemTypeMap[T]>
      title={title ?? model.title}
      itemNounPlural={model.itemNounPlural}
      emptyStateText={model.emptyStateText}
      searchPlaceholder={model.searchPlaceholder}
      columns={model.columns}
      table={model.table}
      pagination={model.pagination}
      totalItems={model.totalItems}
      totalPages={model.totalPages}
      selectedRowsCount={model.selectedRowsCount}
      searchQuery={model.searchQuery}
      onSearchQueryChange={model.setSearchQuery}
      bulkActions={getBulkActionsForItemType(itemType, showBulkActions)}
      isLoading
      skeletonRowCount={rowCount}
      skeletonSearch
      skeletonBulkActions={showBulkActions}
      skeletonTitle={showPageHeader}
      skeletonPageInfo={showPageHeader}
      skeletonLanguage={showPageHeader}
      skeletonPagination
      errorMessage={null}
      onRetry={() => {}}
      showBulkActions={showBulkActions}
      showPageHeader={showPageHeader}
    />
  );
}
