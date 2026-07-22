import React from 'react';
import { useAuthStore } from '@/core/auth/authStore';
import UnauthorizedScreen from './UnauthorizedScreen';

export function ProtectedRoute({ children }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <UnauthorizedScreen />;
  }

  return children;
}
