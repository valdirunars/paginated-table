import { PaginatedTableView } from "./components/PaginatedTableView";
import { useUsersPageData } from "./hooks/useUsersPageData";
import { useUsersTableModel } from "./hooks/useUsersTableModel";
import { useLocalization } from "./localization/localization";

function UsersTable() {
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
    retry,
  } = useUsersPageData();

  const { columns, table, selectedRowsCount } = useUsersTableModel({
    users,
    pagination,
    setPagination,
    totalItems,
    totalPages,
  });

  return (
    <PaginatedTableView
      title={translate("users.title")}
      itemNounPlural={translate("users.itemNounPlural")}
      emptyStateText={translate("users.emptyState")}
      searchPlaceholder={translate("pagination.searchUsers")}
      columns={columns}
      table={table}
      pagination={pagination}
      totalItems={totalItems}
      totalPages={totalPages}
      selectedRowsCount={selectedRowsCount}
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

export default UsersTable;
