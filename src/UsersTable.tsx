import { PaginatedTableView } from "./components/PaginatedTableView";
import { useUsersPageData } from "./hooks/useUsersPageData";
import { useUsersTableModel } from "./hooks/useUsersTableModel";

function UsersTable() {
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
      title="Paginated Users Table"
      itemNounPlural="users"
      emptyStateText="No users found for this page."
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
