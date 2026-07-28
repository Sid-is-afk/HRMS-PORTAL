import { useCallback } from 'react';
import { useOrganizationStore } from '../store/organizationStore';
import { useShallow } from 'zustand/react/shallow';

export function useOrganization() {
  const {
    createDepartment,
    updateDepartment,
    createDesignation,
    updateDesignation,
    isLoading,
    error,
  } = useOrganizationStore(useShallow((state) => ({
    createDepartment: state.createDepartment,
    updateDepartment: state.updateDepartment,
    createDesignation: state.createDesignation,
    updateDesignation: state.updateDesignation,
    isLoading: state.isLoading,
    error: state.error,
  })));

  const saveDepartment = useCallback(async (id, data) => {
    if (id) {
      return await updateDepartment(id, data);
    } else {
      return await createDepartment(data);
    }
  }, [createDepartment, updateDepartment]);

  const saveDesignation = useCallback(async (id, data) => {
    if (id) {
      return await updateDesignation(id, data);
    } else {
      return await createDesignation(data);
    }
  }, [createDesignation, updateDesignation]);

  return {
    saveDepartment,
    saveDesignation,
    isLoading,
    error,
  };
}
