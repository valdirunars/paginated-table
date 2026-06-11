import { useMemo } from "react";
import type { Task, User } from "../data/types";
import { Button, surfaces, Typography } from "../design-system";
import { useUsersPageData } from "../hooks/useUsersPageData";
import { useUsersTableModel } from "../hooks/useUsersTableModel";
import { useLocalization } from "../localization/localization";
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
  const { translate } = useLocalization();
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

  const selectedTasksPreview = useMemo(() => {
    const taskNames = selectedTasks.map((task) => task.name);
    if (selectedTasks.length > 5) {
      return `${taskNames.slice(0, 5).join(", ")}${translate("assignModal.andMore", {
        values: { count: selectedTasks.length - 5 },
      })}`;
    }
    return taskNames.join(", ");
  }, [selectedTasks, translate]);

  const assignModalTitle =
    selectedTasks.length === 1
      ? translate("assignModal.titleSingular", {
          values: { count: selectedTasks.length },
        })
      : translate("assignModal.titlePlural", {
          values: { count: selectedTasks.length },
        });

  return (
    <div className={surfaces.modalBackdrop} role="presentation">
      <div className={surfaces.modal} role="dialog" aria-modal="true">
        <Button variant="icon" onClick={onClose} aria-label={translate("common.closeModal")}>
          ×
        </Button>
        <Typography variant="h2" className="mb-2">
          {assignModalTitle}
        </Typography>
        <Typography variant="body-sm" className="mb-3 text-foreground-secondary">
          {translate("assignModal.description", {
            values: { tasks: selectedTasksPreview },
          })}
        </Typography>
        <PaginatedTableView
          title={translate("users.modalTitle")}
          itemNounPlural={translate("users.itemNounPlural")}
          emptyStateText={translate("users.emptyState")}
          searchPlaceholder={translate("pagination.searchUsers")}
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
