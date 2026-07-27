import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionGuard } from '@/core/rbac/components/PermissionGuard';

import PlatformDashboardScreen from '@/modules/platform/screens/PlatformDashboardScreen';
import PlatformNotificationsScreen from '@/modules/platform/screens/PlatformNotificationsScreen';
import GlobalSearchScreen from '@/modules/platform/screens/GlobalSearchScreen';
import PlatformOverviewScreen from '@/modules/platform/screens/PlatformOverviewScreen';

const Stack = createNativeStackNavigator();

const ProtectedPlatformDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_PLATFORM_DASHBOARD">
    <PlatformDashboardScreen />
  </PermissionGuard>
);

const ProtectedPlatformNotifications = () => (
  <PermissionGuard requiredPermissions="VIEW_PLATFORM_NOTIFICATIONS">
    <PlatformNotificationsScreen />
  </PermissionGuard>
);

const ProtectedGlobalSearch = () => (
  <PermissionGuard requiredPermissions="SEARCH_PLATFORM">
    <GlobalSearchScreen />
  </PermissionGuard>
);

const ProtectedPlatformOverview = () => (
  <PermissionGuard requiredPermissions="VIEW_PLATFORM_DASHBOARD">
    <PlatformOverviewScreen />
  </PermissionGuard>
);

export default function PlatformNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlatformDashboard" component={ProtectedPlatformDashboard} />
      <Stack.Screen name="PlatformNotifications" component={ProtectedPlatformNotifications} />
      <Stack.Screen name="GlobalSearch" component={ProtectedGlobalSearch} />
      <Stack.Screen name="PlatformOverview" component={ProtectedPlatformOverview} />
    </Stack.Navigator>
  );
}
