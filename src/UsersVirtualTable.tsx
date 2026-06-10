import { PaginatedVirtualTableView } from "./components/PaginatedVirtualTableView";
import { useUsersPageData } from "./hooks/useUsersPageData";
import { useUsersTableModel } from "./hooks/useUsersTableModel";

function UsersVirtualTable() {
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
    <PaginatedVirtualTableView
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

export default UsersVirtualTable;
