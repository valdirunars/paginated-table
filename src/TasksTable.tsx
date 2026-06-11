import { PaginatedTableView } from "./components/PaginatedTableView";
import { UserSelectModal } from "./components/UserSelectModal";
import {
  assignUserToTasks,
  batchArchiveTasks,
  batchDeleteTasks,
} from "./data/tasks";
import type { BulkActionType, Task, User } from "./data/types";
import { useTasksPageData } from "./hooks/useTasksPageData";
import { assertNever } from "./utils";
import { useTasksTableModel } from "./hooks/useTasksTableModel";
import { useLocalization } from "./localization/localization";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

function TasksTable() {
  const { translate } = useLocalization();
  const [selectedTasksForAssignment, setSelectedTasksForAssignment] = useState<
    Task[] | null
  >(null);

  const {
    pagination,
    setPagination,
    searchQuery,
    setSearchQuery,
    tasks,
    totalItems,
    totalPages,
    isLoading,
    errorMessage,
    retry,
  } = useTasksPageData();

  const { columns, table, selectedRowsCount } = useTasksTableModel({
    tasks,
    pagination,
    setPagination,
    totalItems,
    totalPages,
  });

  const handleBulkAction = useCallback(
    (action: BulkActionType, selectedItems: Task[]) => {
      if (selectedItems.length === 0) {
        return;
      }

      const selectedRowIds = selectedItems.map((task) => task.id);

      switch (action) {
        case "assign":
          setSelectedTasksForAssignment(selectedItems);
          return;
        case "archive":
          try {
            batchArchiveTasks(selectedRowIds);
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : translate("tasks.failedArchive"),
            );
            return;
          }
          break;
        case "delete":
          try {
            batchDeleteTasks(selectedRowIds);
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : translate("tasks.failedDelete"),
            );
            return;
          }
          break;
        default:
          assertNever(action);
      }

      table.resetRowSelection();
      void retry();
    },
    [table, retry, translate],
  );

  const handleAssignUser = useCallback(
    (user: User) => {
      if (!selectedTasksForAssignment || selectedTasksForAssignment.length === 0) {
        return;
      }

      try {
        assignUserToTasks(
          selectedTasksForAssignment.map((task) => task.id),
          user.id,
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : translate("tasks.failedAssign"),
        );
        return;
      }
      setSelectedTasksForAssignment(null);
      table.resetRowSelection();
      void retry();
    },
    [retry, selectedTasksForAssignment, table, translate],
  );

  return (
    <>
      <PaginatedTableView
        title={translate("tasks.title")}
        itemNounPlural={translate("tasks.itemNounPlural")}
        emptyStateText={translate("tasks.emptyState")}
        searchPlaceholder={translate("pagination.searchTasks")}
        columns={columns}
        table={table}
        pagination={pagination}
        totalItems={totalItems}
        totalPages={totalPages}
        selectedRowsCount={selectedRowsCount}
        bulkActions={[
          { type: "assign" },
          { type: "archive" },
          {
            type: "delete",
            confirmation: {
              title: (selectedItems) =>
                translate("tasks.deleteConfirmTitle", {
                  values: { count: selectedItems.length },
                }),
              description: translate("tasks.deleteConfirmDescription"),
              confirmButtonText: translate("tasks.deleteConfirmButton"),
              renderPreview: (selectedItems) => (
                <ul className="m-0 list-disc pl-4">
                  {selectedItems.slice(0, 8).map((task) => (
                    <li key={task.id}>
                      #{task.id} - {task.name}
                    </li>
                  ))}
                  {selectedItems.length > 8 ? (
                    <li>
                      {translate("tasks.previewAndMore", {
                        values: { count: selectedItems.length - 8 },
                      })}
                    </li>
                  ) : null}
                </ul>
              ),
            },
          },
        ]}
        onBulkAction={handleBulkAction}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onRetry={() => {
          void retry();
        }}
      />
      {selectedTasksForAssignment ? (
        <UserSelectModal
          selectedTasks={selectedTasksForAssignment}
          onAssign={handleAssignUser}
          onClose={() => setSelectedTasksForAssignment(null)}
        />
      ) : null}
    </>
  );
}

export default TasksTable;
