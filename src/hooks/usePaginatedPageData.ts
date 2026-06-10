import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";

type PaginatedPageResult<TData> = {
  data: TData[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

const SEARCH_DEBOUNCE_MS = 300;

type UsePaginatedPageDataArgs<TData> = {
  fetchPage: (
    page: number,
    pageSize: number,
    searchQuery: string,
  ) => Promise<PaginatedPageResult<TData>>;
  initialPageSize?: number;
  searchDebounceMs?: number;
  fallbackErrorMessage: string;
};

export type PaginatedPageDataState<TData> = {
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  items: TData[];
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  errorMessage: string | null;
  retry: () => Promise<void>;
};

export function usePaginatedPageData<TData>({
  fetchPage,
  initialPageSize = 200,
  searchDebounceMs = SEARCH_DEBOUNCE_MS,
  fallbackErrorMessage,
}: UsePaginatedPageDataArgs<TData>): PaginatedPageDataState<TData> {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [searchQuery, setSearchQueryState] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [items, setItems] = useState<TData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const lastAppliedSearchRef = useRef("");

  const setSearchQuery: Dispatch<SetStateAction<string>> = useCallback((nextQuery) => {
    setSearchQueryState((previousQuery) =>
      typeof nextQuery === "function" ? nextQuery(previousQuery) : nextQuery,
    );
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lastAppliedSearchRef.current === searchQuery) {
        return;
      }

      lastAppliedSearchRef.current = searchQuery;
      setDebouncedSearchQuery(searchQuery);
      setPagination((previousPagination) =>
        previousPagination.pageIndex === 0
          ? previousPagination
          : { ...previousPagination, pageIndex: 0 },
      );
    }, searchDebounceMs);

    return () => clearTimeout(timeout);
  }, [searchQuery, searchDebounceMs]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setItems([]);

    const requestId = ++requestIdRef.current;

    try {
      const result = await fetchPage(
        pagination.pageIndex + 1,
        pagination.pageSize,
        debouncedSearchQuery,
      );

      if (requestId !== requestIdRef.current) {
        return;
      }

      setItems(result.data);
      setTotalItems(result.pagination.totalItems);
      setTotalPages(result.pagination.totalPages);

      const resolvedPageIndex = result.pagination.page - 1;
      if (resolvedPageIndex !== pagination.pageIndex) {
        setPagination((prev) => ({ ...prev, pageIndex: resolvedPageIndex }));
      }
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : fallbackErrorMessage,
      );
      setItems([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [
    fallbackErrorMessage,
    fetchPage,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchQuery,
  ]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  return {
    pagination,
    setPagination,
    searchQuery,
    setSearchQuery,
    items,
    totalItems,
    totalPages,
    isLoading,
    errorMessage,
    retry: refreshData,
  };
}
