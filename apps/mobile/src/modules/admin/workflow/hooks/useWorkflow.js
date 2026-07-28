import { useEffect } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { useShallow } from 'zustand/react/shallow';

export function useWorkflow() {
  const { templates, isLoading, error, loadTemplates } = useWorkflowStore(useShallow((state) => ({
    templates: state.templates,
    isLoading: state.isLoading,
    error: state.error,
    loadTemplates: state.loadTemplates,
  })));

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return {
    templates,
    isLoading,
    error,
  };
}
