import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionGuard } from '@/core/rbac/components/PermissionGuard';

import PlatformDashboardScreen from '@/modules/platform/screens/PlatformDashboardScreen';
import PlatformNotificationsScreen from '@/modules/platform/screens/PlatformNotificationsScreen';
import GlobalSearchScreen from '@/modules/platform/screens/GlobalSearchScreen';
import PlatformOverviewScreen from '@/modules/platform/screens/PlatformOverviewScreen';

// Tenant Lifecycle Screen Imports
import TenantDashboardScreen from '@/modules/platform/tenant/screens/TenantDashboardScreen';
import TenantDirectoryScreen from '@/modules/platform/tenant/screens/TenantDirectoryScreen';
import TenantDetailsScreen from '@/modules/platform/tenant/screens/TenantDetailsScreen';
import ProvisioningWizardScreen from '@/modules/platform/tenant/screens/ProvisioningWizardScreen';

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

// Tenant Lifecycle Guarded Screen Wrappers
const ProtectedTenantDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_TENANTS">
    <TenantDashboardScreen />
  </PermissionGuard>
);

const ProtectedTenantDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_TENANTS">
    <TenantDirectoryScreen />
  </PermissionGuard>
);

const ProtectedTenantDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_TENANTS">
    <TenantDetailsScreen />
  </PermissionGuard>
);

const ProtectedProvisioningWizard = () => (
  <PermissionGuard requiredPermissions="PROVISION_TENANTS">
    <ProvisioningWizardScreen />
  </PermissionGuard>
);

export default function PlatformNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlatformDashboard" component={ProtectedPlatformDashboard} />
      <Stack.Screen name="PlatformNotifications" component={ProtectedPlatformNotifications} />
      <Stack.Screen name="GlobalSearch" component={ProtectedGlobalSearch} />
      <Stack.Screen name="PlatformOverview" component={ProtectedPlatformOverview} />

      {/* Tenant Lifecycle Subdomain */}
      <Stack.Screen name="TenantDashboard" component={ProtectedTenantDashboard} />
      <Stack.Screen name="TenantDirectory" component={ProtectedTenantDirectory} />
      <Stack.Screen name="TenantDetails" component={ProtectedTenantDetails} />
      <Stack.Screen name="ProvisioningWizard" component={ProtectedProvisioningWizard} />
    </Stack.Navigator>
  );
}
