import { useEffect, useMemo } from 'react';
import { useIamStore } from '../store/iamStore';

export function useRoleAssignments() {
  const {
    assignments,
    accessReviews,
    effectivePermissions,
    isLoading,
    error,
    selectedEmployeeId,
    filters,
    loadAssignments,
    loadAccessReviews,
    setSelectedEmployeeId,
    assignRole,
    removeRole,
    transferRole,
    verifyAccessReview,
    setFilters
  } = useIamStore((state) => ({
    assignments: state.assignments,
    accessReviews: state.accessReviews,
    effectivePermissions: state.effectivePermissions,
    isLoading: state.isLoading,
    error: state.error,
    selectedEmployeeId: state.selectedEmployeeId,
    filters: state.filters,
    loadAssignments: state.loadAssignments,
    loadAccessReviews: state.loadAccessReviews,
    setSelectedEmployeeId: state.setSelectedEmployeeId,
    assignRole: state.assignRole,
    removeRole: state.removeRole,
    transferRole: state.transferRole,
    verifyAccessReview: state.verifyAccessReview,
    setFilters: state.setFilters
  }));

  useEffect(() => {
    if (assignments.length === 0) {
      loadAssignments();
    }
    if (accessReviews.length === 0) {
      loadAccessReviews();
    }
  }, [loadAssignments, loadAccessReviews, assignments.length, accessReviews.length]);

  const filteredAssignments = useMemo(() => {
    let result = [...assignments];
    if (filters.assignmentSearch) {
      const q = filters.assignmentSearch.toLowerCase();
      result = result.filter(a =>
        a.employeeName.toLowerCase().includes(q) ||
        a.employeeEmail.toLowerCase().includes(q) ||
        a.roleName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [assignments, filters.assignmentSearch]);

  return {
    assignments: filteredAssignments,
    allAssignments: assignments,
    accessReviews,
    effectivePermissions,
    isLoading,
    error,
    selectedEmployeeId,
    setSelectedEmployeeId,
    filters,
    setFilters,
    loadAssignments,
    loadAccessReviews,
    assignRole,
    removeRole,
    transferRole,
    verifyAccessReview,
  };
}
