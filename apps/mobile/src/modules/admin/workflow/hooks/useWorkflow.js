import { useEffect } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export function useWorkflow() {
  const { templates, isLoading, error, loadTemplates } = useWorkflowStore((state) => ({
    templates: state.templates,
    isLoading: state.isLoading,
    error: state.error,
    loadTemplates: state.loadTemplates,
  }));

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return {
    templates,
    isLoading,
    error,
  };
}
