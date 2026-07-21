import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '@/app/Splash';
import Login from '@/modules/auth/Login';
import Dashboard from '@/app/Dashboard';
import Attendance from '@/modules/attendance/Attendance';
import Leave from '@/modules/leave/Leave';
import Profile from '@/modules/profile/Profile';
import Notifications from '@/modules/notifications/Notifications';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { sessionManager } from '@/modules/auth/services/sessionManager';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    async function bootstrap() {
      await sessionManager.initialize();
      // Simulate splash delay for branding
      setTimeout(() => {
        setIsReady(true);
      }, 1000);
    }
    bootstrap();
  }, []);

  if (!isReady) {
    return <Splash />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {accessToken == null ? (
        // Unauthenticated Stack
        <Stack.Screen name="Login" component={Login} />
      ) : (
        // Authenticated Stack
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Attendance" component={Attendance} />
          <Stack.Screen name="Leave" component={Leave} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Notifications" component={Notifications} />
        </>
      )}
    </Stack.Navigator>
  );
}
