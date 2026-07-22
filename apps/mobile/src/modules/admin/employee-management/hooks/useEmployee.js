import { useEffect, useCallback } from 'react';
import { useEmployeeManagementStore } from '../store/employeeManagementStore';

export function useEmployee(id) {
  const {
    selectedEmployee,
    isLoading,
    error,
    loadEmployeeDetails,
    deactivateEmployee,
    activateEmployee,
  } = useEmployeeManagementStore((state) => ({
    selectedEmployee: state.selectedEmployee,
    isLoading: state.isLoading,
    error: state.error,
    loadEmployeeDetails: state.loadEmployeeDetails,
    deactivateEmployee: state.deactivateEmployee,
    activateEmployee: state.activateEmployee,
  }));

  useEffect(() => {
    if (id) {
      loadEmployeeDetails(id);
    }
  }, [id, loadEmployeeDetails]);

  const deactivate = useCallback(async () => {
    if (id) {
      await deactivateEmployee(id);
    }
  }, [id, deactivateEmployee]);

  const activate = useCallback(async () => {
    if (id) {
      await activateEmployee(id);
    }
  }, [id, activateEmployee]);

  return {
    employee: selectedEmployee,
    isLoading,
    error,
    deactivate,
    activate,
  };
}
