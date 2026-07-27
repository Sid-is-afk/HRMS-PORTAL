import { useEffect } from 'react';
import { useOperationsStore } from '../store/operationsStore';
import { operationsService } from '../services/operationsService';

export function useOperations() {
  const store = useOperationsStore();

  const fetchData = async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const [reqs, cases, rules, rems, apps] = await Promise.all([
        operationsService.getServiceRequests(),
        operationsService.getCases(),
        operationsService.getAutomationRules(),
        operationsService.getReminders(),
        operationsService.getApprovalQueue()
      ]);
      store.setServiceRequests(reqs);
      store.setCases(cases);
      store.setAutomationRules(rules);
      store.setReminders(rems);
      store.setApprovals(apps);
    } catch (err) {
      store.setError(err.message || 'Failed to fetch operations data');
    } finally {
      store.setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { ...store, refresh: fetchData };
}
