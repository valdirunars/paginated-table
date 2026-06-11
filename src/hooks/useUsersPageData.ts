import type { Dispatch, SetStateAction } from "react";
import type { PaginationState } from "@tanstack/react-table";
import type { User } from "../data/types";
import { fetchUsersPage } from "../data/users";
import {
  usePaginatedPageData,
  type PaginatedPageDataState,
} from "./usePaginatedPageData";

export type UsersPageDataState = {
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  users: User[];
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  errorMessage: string | null;
  retry: () => Promise<void>;
};

type UseUsersPageDataArgs = {
  initialPageSize?: number;
};

export function useUsersPageData({
  initialPageSize,
}: UseUsersPageDataArgs = {}): UsersPageDataState {
  const state: PaginatedPageDataState<User> = usePaginatedPageData<User>({
    fetchPage: fetchUsersPage,
    initialPageSize,
    fallbackErrorMessage: "Failed to fetch users page",
  });

  return {
    pagination: state.pagination,
    setPagination: state.setPagination,
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    users: state.items,
    totalItems: state.totalItems,
    totalPages: state.totalPages,
    isLoading: state.isLoading,
    errorMessage: state.errorMessage,
    retry: state.retry,
  };
}
