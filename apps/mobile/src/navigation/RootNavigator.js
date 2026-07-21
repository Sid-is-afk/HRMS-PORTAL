import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '@/app/Splash';
import Login from '@/modules/auth/Login';
import DashboardScreen from '@/modules/dashboard/screens/DashboardScreen';
import AttendanceScreen from '@/modules/attendance/screens/AttendanceScreen';
import AttendanceHistoryScreen from '@/modules/attendance/screens/AttendanceHistoryScreen';
import LeaveScreen from '@/modules/leave/screens/LeaveScreen';
import ApplyLeaveScreen from '@/modules/leave/screens/ApplyLeaveScreen';
import LeaveHistoryScreen from '@/modules/leave/screens/LeaveHistoryScreen';
import LeaveDetailsScreen from '@/modules/leave/screens/LeaveDetailsScreen';
import ProfileHomeScreen from '@/modules/profile/screens/ProfileHomeScreen';
import EditProfileScreen from '@/modules/profile/screens/EditProfileScreen';
import EmergencyContactsScreen from '@/modules/profile/screens/EmergencyContactsScreen';
import AccountInfoScreen from '@/modules/profile/screens/AccountInfoScreen';
import ChangePasswordScreen from '@/modules/profile/screens/ChangePasswordScreen';
import NotificationsScreen from '@/modules/notifications/screens/NotificationsScreen';
import NotificationDetailsScreen from '@/modules/notifications/screens/NotificationDetailsScreen';
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
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Attendance" component={AttendanceScreen} />
          <Stack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} />
          <Stack.Screen name="Leave" component={LeaveScreen} />
          <Stack.Screen name="ApplyLeave" component={ApplyLeaveScreen} />
          <Stack.Screen name="LeaveHistory" component={LeaveHistoryScreen} />
          <Stack.Screen name="LeaveDetails" component={LeaveDetailsScreen} />
          <Stack.Screen name="Profile" component={ProfileHomeScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
          <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="NotificationDetails" component={NotificationDetailsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
