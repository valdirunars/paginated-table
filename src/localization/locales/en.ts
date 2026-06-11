import type { LocaleShape } from "./is";

export const en: LocaleShape = {
  common: {
    cancel: "Cancel",
    retry: "Retry",
    previous: "Previous",
    next: "Next",
    noneSelected: "None selected",
    clearSelection: "Clear selection",
    closeModal: "Close modal",
    unassigned: "Unassigned",
    selectLanguage: "Select language",
  },
  bulkActions: {
    assign: "Assign",
    archive: "Archive",
    delete: "Delete",
    confirmAction: "Confirm {{action}}",
  },
  pagination: {
    loadingPage: "Loading page {{page}}...",
    showingPageWithError:
      "Showing page {{page}} (unable to load total pages, {{count}} {{items}})",
    showingPage:
      "Showing page {{page}} of {{totalPages}} ({{count}} {{items}})",
    pageLoadingTotal: "Page {{page}} (loading total pages...)",
    pageTotalUnavailable: "Page {{page}} (total pages unavailable)",
    pageOfTotal: "Page {{page}} of {{totalPages}}",
    selectedCount: "{{count}} selected",
    searchTasks: "Search tasks",
    searchUsers: "Search users",
  },
  columns: {
    id: "ID",
    task: "Task",
    assignee: "Assignee",
    due: "Due",
    name: "Name",
    email: "Email",
  },
  tasks: {
    title: "Paginated Tasks Table",
    itemNounPlural: "tasks",
    emptyState: "No tasks found for this page.",
    deleteConfirmTitle: "Delete {{count}} task(s)?",
    deleteConfirmDescription:
      "This action permanently removes the selected tasks and cannot be undone.",
    deleteConfirmButton: "Delete tasks",
    previewAndMore: "...and {{count}} more",
    failedArchive: "Failed to archive selected tasks",
    failedDelete: "Failed to delete selected tasks",
    failedAssign: "Failed to assign user to selected tasks",
    failedFetch: "Failed to fetch tasks page",
  },
  users: {
    title: "Paginated Users Table",
    modalTitle: "Users",
    itemNounPlural: "users",
    emptyState: "No users found for this page.",
    failedFetch: "Failed to fetch users page",
  },
  assignModal: {
    titleSingular: "Assign user to {{count}} task",
    titlePlural: "Assign user to {{count}} tasks",
    description: "Select a user to assign immediately. Tasks: {{tasks}}",
    andMore: " and {{count}} more",
  },
  a11y: {
    selectAllOnPage: "Select all {{items}} on this page",
    selectItem: "Select {{label}}",
  },
};
