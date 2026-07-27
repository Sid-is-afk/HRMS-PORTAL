import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionGuard } from '@/core/rbac/guards/PermissionGuard';
import HRDashboardScreen from '@/modules/hr/screens/HRDashboardScreen';
import HROverviewScreen from '@/modules/hr/screens/HROverviewScreen';
import HRActivityFeedScreen from '@/modules/hr/screens/HRActivityFeedScreen';
import HRNotificationsScreen from '@/modules/hr/screens/HRNotificationsScreen';
import HRQuickActionsScreen from '@/modules/hr/screens/HRQuickActionsScreen';
import UpcomingEventsScreen from '@/modules/hr/screens/UpcomingEventsScreen';
import HRSearchScreen from '@/modules/hr/screens/HRSearchScreen';

const Stack = createNativeStackNavigator();

const ProtectedHRDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_HR_DASHBOARD">
    <HRDashboardScreen />
  </PermissionGuard>
);

const ProtectedHROverview = () => (
  <PermissionGuard requiredPermissions="VIEW_HR_DASHBOARD">
    <HROverviewScreen />
  </PermissionGuard>
);

const ProtectedHRActivityFeed = () => (
  <PermissionGuard requiredPermissions="VIEW_HR_DASHBOARD">
    <HRActivityFeedScreen />
  </PermissionGuard>
);

const ProtectedHRNotifications = () => (
  <PermissionGuard requiredPermissions="VIEW_HR_DASHBOARD">
    <HRNotificationsScreen />
  </PermissionGuard>
);

const ProtectedHRQuickActions = () => (
  <PermissionGuard requiredPermissions="VIEW_HR_DASHBOARD">
    <HRQuickActionsScreen />
  </PermissionGuard>
);

const ProtectedUpcomingEvents = () => (
  <PermissionGuard requiredPermissions="VIEW_HR_DASHBOARD">
    <UpcomingEventsScreen />
  </PermissionGuard>
);

const ProtectedHRSearch = () => (
  <PermissionGuard requiredPermissions="VIEW_HR_DASHBOARD">
    <HRSearchScreen />
  </PermissionGuard>
);

export default function HRNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HRDashboard" component={ProtectedHRDashboard} />
      <Stack.Screen name="HROverview" component={ProtectedHROverview} />
      <Stack.Screen name="HRActivityFeed" component={ProtectedHRActivityFeed} />
      <Stack.Screen name="HRNotifications" component={ProtectedHRNotifications} />
      <Stack.Screen name="HRQuickActions" component={ProtectedHRQuickActions} />
      <Stack.Screen name="UpcomingEvents" component={ProtectedUpcomingEvents} />
      <Stack.Screen name="HRSearch" component={ProtectedHRSearch} />
    </Stack.Navigator>
  );
}
