import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '@/app/Splash';
import Login from '@/modules/auth/Login';
import MainTabNavigator from './MainTabNavigator';
import AttendanceHistoryScreen from '@/modules/employee/attendance/screens/AttendanceHistoryScreen';
import ApplyLeaveScreen from '@/modules/employee/leave/screens/ApplyLeaveScreen';
import LeaveHistoryScreen from '@/modules/employee/leave/screens/LeaveHistoryScreen';
import LeaveDetailsScreen from '@/modules/employee/leave/screens/LeaveDetailsScreen';
import EditProfileScreen from '@/modules/employee/profile/screens/EditProfileScreen';
import EmergencyContactsScreen from '@/modules/employee/profile/screens/EmergencyContactsScreen';
import AccountInfoScreen from '@/modules/employee/profile/screens/AccountInfoScreen';
import ChangePasswordScreen from '@/modules/employee/profile/screens/ChangePasswordScreen';
import NotificationsScreen from '@/modules/employee/notifications/screens/NotificationsScreen';
import NotificationDetailsScreen from '@/modules/employee/notifications/screens/NotificationDetailsScreen';
import SettingsHomeScreen from '@/modules/employee/settings/screens/SettingsHomeScreen';
import AccountSettingsScreen from '@/modules/employee/settings/screens/AccountSettingsScreen';
import SecuritySettingsScreen from '@/modules/employee/settings/screens/SecuritySettingsScreen';
import NotificationPreferencesScreen from '@/modules/employee/settings/screens/NotificationPreferencesScreen';
import PrivacySettingsScreen from '@/modules/employee/settings/screens/PrivacySettingsScreen';
import PreferencesScreen from '@/modules/employee/settings/screens/PreferencesScreen';
import HelpAndSupportScreen from '@/modules/employee/settings/screens/HelpAndSupportScreen';
import AboutApplicationScreen from '@/modules/employee/settings/screens/AboutApplicationScreen';
import LogoutConfirmationScreen from '@/modules/employee/settings/screens/LogoutConfirmationScreen';
import { useAuthStore } from '@/core/auth/authStore';
import { sessionManager } from '@/core/session/sessionManager';
import { networkMonitor } from '@/core/network/networkMonitor';
import { queueManager } from '@/core/offline/queueManager';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import AdminNavigator from '@/modules/admin/navigation/AdminNavigator';
import HRNavigator from './HRNavigator';
import SuperAdminNavigator from './SuperAdminNavigator';
import { useRbacStore } from '@/core/rbac/store/rbacStore';
import { ROLES } from '@/core/rbac/roles';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const role = useRbacStore((state) => state.role);

  useEffect(() => {
    async function bootstrap() {
      await sessionManager.initialize();
      
      // Sync RBAC store with the restored user (role, permissions, accessible modules)
      const user = useAuthStore.getState().user;
      if (user) {
        useRbacStore.getState().syncWithUser(user);
      }

      queueManager.initializeStore();
      networkMonitor.startMonitoring();
      
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
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {accessToken == null ? (
        // Unauthenticated Stack
        <Stack.Screen name="Login" component={Login} />
      ) : (
        // Authenticated Stack
        <>
          {role === ROLES.ADMIN ? (
            <Stack.Screen name="AdminMain" component={AdminNavigator} />
          ) : role === ROLES.HR ? (
            <Stack.Screen name="HRMain" component={HRNavigator} />
          ) : role === ROLES.SUPER_ADMIN ? (
            <Stack.Screen name="SuperAdminMain" component={SuperAdminNavigator} />
          ) : (
            <Stack.Screen name="Main" component={MainTabNavigator} />
          )}
          <Stack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} />
          <Stack.Screen name="ApplyLeave" component={ApplyLeaveScreen} />
          <Stack.Screen name="LeaveHistory" component={LeaveHistoryScreen} />
          <Stack.Screen name="LeaveDetails" component={LeaveDetailsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
          <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="NotificationDetails" component={NotificationDetailsScreen} />
          <Stack.Screen name="Settings" component={SettingsHomeScreen} />
          <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
          <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
          <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
          <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
          <Stack.Screen name="Preferences" component={PreferencesScreen} />
          <Stack.Screen name="HelpAndSupport" component={HelpAndSupportScreen} />
          <Stack.Screen name="AboutApplication" component={AboutApplicationScreen} />
          <Stack.Screen name="LogoutConfirmation" component={LogoutConfirmationScreen} />
        </>
      )}
      </Stack.Navigator>
    </View>
  );
}
