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
import { useCallback, useState } from "react";

function TasksTable() {
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
    [table, retry],
  );

  const handleAssignUser = useCallback(
    (user: User) => {
      if (!selectedTasksForAssignment || selectedTasksForAssignment.length === 0) {
        return;
      }

      assignUserToTasks(
        selectedTasksForAssignment.map((task) => task.id),
        user.id,
      );
      setSelectedTasksForAssignment(null);
      table.resetRowSelection();
      void retry();
    },
    [retry, selectedTasksForAssignment, table],
  );

  return (
    <>
      <PaginatedTableView
        title="Paginated Tasks Table"
        itemNounPlural="tasks"
        emptyStateText="No tasks found for this page."
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
              title: (selectedItems) => `Delete ${selectedItems.length} task(s)?`,
              description:
                "This action permanently removes the selected tasks and cannot be undone.",
              confirmButtonText: "Delete tasks",
              renderPreview: (selectedItems) => (
                <ul className="users-table-modal-preview-list">
                  {selectedItems.slice(0, 8).map((task) => (
                    <li key={task.id}>
                      #{task.id} - {task.name}
                    </li>
                  ))}
                  {selectedItems.length > 8 ? (
                    <li>...and {selectedItems.length - 8} more</li>
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
