import { useEffect, useCallback } from 'react';
import { useEmployeeManagementStore } from '../store/employeeManagementStore';

export function useEmployees() {
  const {
    employees,
    isLoading,
    isRefreshing,
    error,
    pagination,
    loadEmployees,
    refreshEmployees,
    loadMetadata,
  } = useEmployeeManagementStore((state) => ({
    employees: state.employees,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    pagination: state.pagination,
    loadEmployees: state.loadEmployees,
    refreshEmployees: state.refreshEmployees,
    loadMetadata: state.loadMetadata,
  }));

  useEffect(() => {
    loadMetadata();
    loadEmployees(1);
  }, [loadMetadata, loadEmployees]);

  const loadMore = useCallback(() => {
    if (isLoading || isRefreshing) return;
    if (pagination.page < pagination.totalPages) {
      loadEmployees(pagination.page + 1);
    }
  }, [isLoading, isRefreshing, pagination, loadEmployees]);

  return {
    employees,
    isLoading,
    isRefreshing,
    error,
    refresh: refreshEmployees,
    loadMore,
    hasMore: pagination.page < pagination.totalPages,
  };
}
