import type { ColumnDef } from "@tanstack/react-table";
import type { ItemType, ItemTypeMap, Task, User } from "../../data/types";
import type { TranslateFn } from "../../localization/translations";
import { assertNever } from "../../utils";
import { type TableSelectionMode, withSelectionColumn } from "../usePaginatedTableModel";

export function createTasksBaseColumns(
  translate: TranslateFn,
): Array<ColumnDef<Task>> {
  return [
    {
      accessorKey: "id",
      header: translate("columns.id"),
      size: 80,
    },
    {
      accessorKey: "name",
      header: translate("columns.task"),
      size: 260,
    },
    {
      id: "assignee",
      header: translate("columns.assignee"),
      size: 260,
      accessorFn: (task) =>
        task.assignee?.displayName ?? translate("common.unassigned"),
    },
    {
      id: "due",
      header: translate("columns.due"),
      size: 220,
      accessorFn: (task) => new Date(task.due).toLocaleDateString(),
    },
  ];
}

export function createUsersBaseColumns(
  translate: TranslateFn,
): Array<ColumnDef<User>> {
  return [
    {
      accessorKey: "id",
      header: translate("columns.id"),
      size: 80,
    },
    {
      accessorKey: "displayName",
      header: translate("columns.name"),
      size: 260,
    },
    {
      accessorKey: "email",
      header: translate("columns.email"),
      size: 320,
    },
  ];
}

export function createColumnsForItemType<T extends ItemType>(
  itemType: T,
  translate: TranslateFn,
  selectionMode: TableSelectionMode = { type: "multi" },
): Array<ColumnDef<ItemTypeMap[T]>> {
  switch (itemType) {
    case "task":
      return withSelectionColumn(
        createTasksBaseColumns(translate),
        (task) => `${translate("columns.task")} ${task.name}`,
        () => translate("tasks.itemNounPlural"),
        selectionMode,
        translate,
      ) as Array<ColumnDef<ItemTypeMap[T]>>;
    case "user":
      return withSelectionColumn(
        createUsersBaseColumns(translate),
        (user) => `${translate("users.modalTitle")} ${user.displayName}`,
        () => translate("users.itemNounPlural"),
        selectionMode,
        translate,
      ) as Array<ColumnDef<ItemTypeMap[T]>>;
    default:
      return assertNever(itemType);
  }
}
