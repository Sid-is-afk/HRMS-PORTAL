import { useEffect } from 'react';
import { useSystemStore } from '../store/systemStore';

export const useAuditLogs = () => {
  const { auditLogs, isLoading, error, fetchAuditLogs } = useSystemStore();

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return { auditLogs, isLoading, error, fetchAuditLogs };
};
