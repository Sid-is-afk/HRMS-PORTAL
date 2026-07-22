import { useState, useCallback } from 'react';

/**
 * Hook to manage pagination state for lists and tables
 */
export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  const hasMore = page * limit < total;

  return {
    page,
    limit,
    total,
    setPage,
    setLimit,
    setTotal,
    nextPage,
    prevPage,
    reset,
    hasMore,
  };
}
