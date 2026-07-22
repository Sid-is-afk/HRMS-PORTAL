import '../global.css';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from '@/api/client/queryClient';
import RootNavigator from '@/app/navigation/RootNavigator';
import { sessionManager } from '@/core/session/sessionManager';
import { useEffect } from 'react';

import { Platform } from 'react-native';

export default function App() {
  useEffect(() => {
    sessionManager.setupInterceptors();
    
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        html, body, #root {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        #root > div {
          flex: 1;
          display: flex;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1, height: Platform.OS === 'web' ? '100vh' : 'auto' }}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
