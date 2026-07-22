import { useState, useEffect } from 'react';

export function useAdminData() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Placeholder logic for future dashboard data fetch
    setData(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading };
}
