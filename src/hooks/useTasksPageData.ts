import type { Dispatch, SetStateAction } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { fetchTasksPage } from "../data/tasks";
import type { Task } from "../data/types";
import { useLocalization } from "../localization/localization";
import {
  usePaginatedPageData,
  type PaginatedPageDataState,
} from "./usePaginatedPageData";

export type TasksPageDataState = {
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  tasks: Task[];
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  errorMessage: string | null;
  retry: () => Promise<void>;
};

export function useTasksPageData(): TasksPageDataState {
  const { translate } = useLocalization();

  const state: PaginatedPageDataState<Task> = usePaginatedPageData<Task>({
    fetchPage: fetchTasksPage,
    fallbackErrorMessage: translate("tasks.failedFetch"),
  });

  return {
    pagination: state.pagination,
    setPagination: state.setPagination,
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    tasks: state.items,
    totalItems: state.totalItems,
    totalPages: state.totalPages,
    isLoading: state.isLoading,
    errorMessage: state.errorMessage,
    retry: state.retry,
  };
}
