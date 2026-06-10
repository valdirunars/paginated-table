import { PaginatedVirtualTableView } from "./components/PaginatedVirtualTableView";
import { batchArchiveTasks, batchDeleteTasks } from "./data/tasks";
import type { BulkActionType } from "./data/types";
import { useTasksPageData } from "./hooks/useTasksPageData";
import { assertNever } from "./utils";
import { useTasksTableModel } from "./hooks/useTasksTableModel";
import { useCallback } from "react";

function TasksVirtualTable() {
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

  const { columns, table, selectedRowsCount, selectedRowIds } =
    useTasksTableModel({
      tasks,
      pagination,
      setPagination,
      totalItems,
      totalPages,
    });

  const handleBulkAction = useCallback(
    (action: BulkActionType) => {
      if (selectedRowIds.length === 0) {
        return;
      }

      switch (action) {
        case "archive":
          batchArchiveTasks(selectedRowIds);
          break;
        case "delete":
          batchDeleteTasks(selectedRowIds);
          break;
        default:
          assertNever(action);
      }

      table.resetRowSelection();
      void retry();
    },
    [selectedRowIds, table, retry],
  );

  return (
    <PaginatedVirtualTableView
      title="Paginated Tasks Table"
      itemNounPlural="tasks"
      emptyStateText="No tasks found for this page."
      columns={columns}
      table={table}
      pagination={pagination}
      totalItems={totalItems}
      totalPages={totalPages}
      selectedRowsCount={selectedRowsCount}
      bulkActions={["archive", "delete"]}
      onBulkAction={handleBulkAction}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={() => {
        void retry();
      }}
    />
  );
}

export default TasksVirtualTable;
