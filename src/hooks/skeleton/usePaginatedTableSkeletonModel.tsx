import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import type { ItemType, ItemTypeMap } from "../../data/types";
import { useLocalization } from "../../localization/localization";
import { createColumnsForItemType } from "../table/columns";
import {
  type TableSelectionMode,
  usePaginatedTableModel,
} from "../usePaginatedTableModel";

const skeletonTableConfig = {
  task: {
    titleKey: "tasks.title" as const,
    itemNounPluralKey: "tasks.itemNounPlural" as const,
    emptyStateKey: "tasks.emptyState" as const,
    searchPlaceholderKey: "pagination.searchTasks" as const,
  },
  user: {
    titleKey: "users.title" as const,
    itemNounPluralKey: "users.itemNounPlural" as const,
    emptyStateKey: "users.emptyState" as const,
    searchPlaceholderKey: "pagination.searchUsers" as const,
  },
} satisfies Record<
  ItemType,
  {
    titleKey: "tasks.title" | "users.title";
    itemNounPluralKey: "tasks.itemNounPlural" | "users.itemNounPlural";
    emptyStateKey: "tasks.emptyState" | "users.emptyState";
    searchPlaceholderKey: "pagination.searchTasks" | "pagination.searchUsers";
  }
>;

type UsePaginatedTableSkeletonModelArgs<T extends ItemType> = {
  itemType: T;
  rowCount: number;
  selectionMode?: TableSelectionMode;
};

export function usePaginatedTableSkeletonModel<T extends ItemType>({
  itemType,
  rowCount,
  selectionMode = { type: "multi" },
}: UsePaginatedTableSkeletonModelArgs<T>) {
  const { translate } = useLocalization();
  const config = skeletonTableConfig[itemType];
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: rowCount,
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setPagination((current) => ({ ...current, pageSize: rowCount }));
  }, [rowCount]);

  const columns = useMemo(
    () => createColumnsForItemType(itemType, translate, selectionMode),
    [itemType, selectionMode, translate],
  );

  const items = useMemo(() => [] as ItemTypeMap[T][], [itemType]);

  const { table, selectedRowsCount } = usePaginatedTableModel<ItemTypeMap[T]>({
    items,
    columns,
    pagination,
    setPagination,
    totalItems: rowCount,
    totalPages: 1,
    selectionMode,
  });

  return {
    title: translate(config.titleKey),
    itemNounPlural: translate(config.itemNounPluralKey),
    emptyStateText: translate(config.emptyStateKey),
    searchPlaceholder: translate(config.searchPlaceholderKey),
    columns,
    table,
    pagination,
    setPagination: setPagination as Dispatch<
      SetStateAction<{ pageIndex: number; pageSize: number }>
    >,
    totalItems: rowCount,
    totalPages: 1,
    selectedRowsCount,
    searchQuery,
    setSearchQuery,
  };
}
