import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from '@/api/queryClient';
import RootNavigator from '@/navigation/RootNavigator';
import { sessionManager } from '@/modules/auth/services/sessionManager';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    sessionManager.setupInterceptors();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
