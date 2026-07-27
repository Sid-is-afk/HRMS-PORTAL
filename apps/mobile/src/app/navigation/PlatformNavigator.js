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

// Identity & Trust Screen Imports
import IdentityDashboardScreen from '@/modules/platform/identity/screens/IdentityDashboardScreen';
import PlatformUsersScreen from '@/modules/platform/identity/screens/PlatformUsersScreen';
import GlobalRolesScreen from '@/modules/platform/identity/screens/GlobalRolesScreen';
import PermissionExplorerScreen from '@/modules/platform/identity/screens/PermissionExplorerScreen';
import SessionCenterScreen from '@/modules/platform/identity/screens/SessionCenterScreen';
import AuthenticationPoliciesScreen from '@/modules/platform/identity/screens/AuthenticationPoliciesScreen';

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

// Identity & Trust Guarded Screen Wrappers
const ProtectedIdentityDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_PLATFORM_USERS">
    <IdentityDashboardScreen />
  </PermissionGuard>
);

const ProtectedPlatformUsers = () => (
  <PermissionGuard requiredPermissions="VIEW_PLATFORM_USERS">
    <PlatformUsersScreen />
  </PermissionGuard>
);

const ProtectedGlobalRoles = () => (
  <PermissionGuard requiredPermissions="VIEW_GLOBAL_ROLES">
    <GlobalRolesScreen />
  </PermissionGuard>
);

const ProtectedPermissionExplorer = () => (
  <PermissionGuard requiredPermissions="VIEW_GLOBAL_ROLES">
    <PermissionExplorerScreen />
  </PermissionGuard>
);

const ProtectedSessionCenter = () => (
  <PermissionGuard requiredPermissions="VIEW_SESSIONS">
    <SessionCenterScreen />
  </PermissionGuard>
);

const ProtectedAuthenticationPolicies = () => (
  <PermissionGuard requiredPermissions="VIEW_AUTH_POLICIES">
    <AuthenticationPoliciesScreen />
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

      {/* Identity & Trust Subdomain */}
      <Stack.Screen name="IdentityDashboard" component={ProtectedIdentityDashboard} />
      <Stack.Screen name="PlatformUsers" component={ProtectedPlatformUsers} />
      <Stack.Screen name="GlobalRoles" component={ProtectedGlobalRoles} />
      <Stack.Screen name="PermissionExplorer" component={ProtectedPermissionExplorer} />
      <Stack.Screen name="SessionCenter" component={ProtectedSessionCenter} />
      <Stack.Screen name="AuthenticationPolicies" component={ProtectedAuthenticationPolicies} />
    </Stack.Navigator>
  );
}
