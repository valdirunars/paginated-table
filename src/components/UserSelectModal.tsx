import { useMemo } from "react";
import type { Task, User } from "../data/types";
import { useUsersPageData } from "../hooks/useUsersPageData";
import { useUsersTableModel } from "../hooks/useUsersTableModel";
import { Button } from "./Button";
import { PaginatedTableView } from "./PaginatedTableView";

type UserSelectModalProps = {
  selectedTasks: Task[];
  onAssign: (user: User) => void;
  onClose: () => void;
};

export function UserSelectModal({
  selectedTasks,
  onAssign,
  onClose,
}: UserSelectModalProps) {
  const {
    pagination,
    setPagination,
    searchQuery,
    setSearchQuery,
    users,
    totalItems,
    totalPages,
    isLoading,
    errorMessage,
    retry: retryUsers,
  } = useUsersPageData({ initialPageSize: 5 });

  const { columns, table, selectedRowsCount } = useUsersTableModel({
    users,
    pagination,
    setPagination,
    totalItems,
    totalPages,
    selectionMode: { type: "single", behavior: "hard" },
  });

  const selectedTasksPreview = useMemo(
    () =>
      selectedTasks.length > 5
        ? `${selectedTasks
            .slice(0, 5)
            .map((task) => task.name)
            .join(", ")} and ${selectedTasks.length - 5} more`
        : selectedTasks.map((task) => task.name).join(", "),
    [selectedTasks],
  );

  return (
    <div className="users-table-modal-backdrop" role="presentation">
      <div className="users-table-modal" role="dialog" aria-modal="true">
        <Button variant="icon" onClick={onClose} aria-label="Close modal">
          ×
        </Button>
        <h2 className="users-table-modal-title">
          Assign user to {selectedTasks.length} task
          {selectedTasks.length === 1 ? "" : "s"}
        </h2>
        <p className="users-table-modal-description">
          Select a user to assign immediately. Tasks:{" "}
          {selectedTasksPreview}
        </p>
        <PaginatedTableView
          title="Users"
          itemNounPlural="users"
          emptyStateText="No users found for this page."
          columns={columns}
          table={table}
          pagination={pagination}
          totalItems={totalItems}
          totalPages={totalPages}
          selectedRowsCount={selectedRowsCount}
          selectionMode={{ type: "single", behavior: "hard" }}
          onSingleSelect={(user: User) => {
            onAssign(user);
            onClose();
          }}
          showBulkActions={false}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onRetry={() => {
            void retryUsers();
          }}
          showPageHeader={false}
        />
      </div>
    </div>
  );
}
