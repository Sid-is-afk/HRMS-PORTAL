import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionGuard } from '@/core/rbac/guards/PermissionGuard';

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

// Governance & Configuration Screen Imports
import GovernanceDashboardScreen from '@/modules/platform/governance/screens/GovernanceDashboardScreen';
import FeatureManagementScreen from '@/modules/platform/governance/screens/FeatureManagementScreen';
import ModuleCatalogScreen from '@/modules/platform/governance/screens/ModuleCatalogScreen';
import SubscriptionCenterScreen from '@/modules/platform/governance/screens/SubscriptionCenterScreen';
import PlatformConfigurationScreen from '@/modules/platform/governance/screens/PlatformConfigurationScreen';

// Operations & Observability Screen Imports
import OperationsDashboardScreen from '@/modules/platform/operations/screens/OperationsDashboardScreen';
import HealthCenterScreen from '@/modules/platform/operations/screens/HealthCenterScreen';
import IncidentCenterScreen from '@/modules/platform/operations/screens/IncidentCenterScreen';
import LogCenterScreen from '@/modules/platform/operations/screens/LogCenterScreen';
import ApiStatusScreen from '@/modules/platform/operations/screens/ApiStatusScreen';

// Intelligence & Analytics Screen Imports
import ExecutiveDashboardScreen from '@/modules/platform/analytics/screens/ExecutiveDashboardScreen';
import CrossTenantAnalyticsScreen from '@/modules/platform/analytics/screens/CrossTenantAnalyticsScreen';
import UsageAnalyticsScreen from '@/modules/platform/analytics/screens/UsageAnalyticsScreen';
import CapacityDashboardScreen from '@/modules/platform/analytics/screens/CapacityDashboardScreen';

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

// Governance & Configuration Guarded Screen Wrappers
const ProtectedGovernanceDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_PLATFORM_CONFIGURATION">
    <GovernanceDashboardScreen />
  </PermissionGuard>
);

const ProtectedFeatureManagement = () => (
  <PermissionGuard requiredPermissions="VIEW_FEATURES">
    <FeatureManagementScreen />
  </PermissionGuard>
);

const ProtectedModuleCatalog = () => (
  <PermissionGuard requiredPermissions="VIEW_PLATFORM_CONFIGURATION">
    <ModuleCatalogScreen />
  </PermissionGuard>
);

const ProtectedSubscriptionCenter = () => (
  <PermissionGuard requiredPermissions="VIEW_SUBSCRIPTIONS">
    <SubscriptionCenterScreen />
  </PermissionGuard>
);

const ProtectedPlatformConfiguration = () => (
  <PermissionGuard requiredPermissions="VIEW_PLATFORM_CONFIGURATION">
    <PlatformConfigurationScreen />
  </PermissionGuard>
);

// Operations & Observability Guarded Screen Wrappers
const ProtectedOperationsDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_OPERATIONS">
    <OperationsDashboardScreen />
  </PermissionGuard>
);

const ProtectedHealthCenter = () => (
  <PermissionGuard requiredPermissions="VIEW_HEALTH">
    <HealthCenterScreen />
  </PermissionGuard>
);

const ProtectedIncidentCenter = () => (
  <PermissionGuard requiredPermissions="VIEW_INCIDENTS">
    <IncidentCenterScreen />
  </PermissionGuard>
);

const ProtectedLogCenter = () => (
  <PermissionGuard requiredPermissions="VIEW_LOGS">
    <LogCenterScreen />
  </PermissionGuard>
);

const ProtectedApiStatus = () => (
  <PermissionGuard requiredPermissions="VIEW_API_STATUS">
    <ApiStatusScreen />
  </PermissionGuard>
);

// Intelligence & Analytics Guarded Screen Wrappers
const ProtectedExecutiveDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_EXECUTIVE_DASHBOARD">
    <ExecutiveDashboardScreen />
  </PermissionGuard>
);

const ProtectedCrossTenantAnalytics = () => (
  <PermissionGuard requiredPermissions="VIEW_ANALYTICS">
    <CrossTenantAnalyticsScreen />
  </PermissionGuard>
);

const ProtectedUsageAnalytics = () => (
  <PermissionGuard requiredPermissions="VIEW_ANALYTICS">
    <UsageAnalyticsScreen />
  </PermissionGuard>
);

const ProtectedCapacityDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_ANALYTICS">
    <CapacityDashboardScreen />
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

      {/* Governance & Configuration Subdomain */}
      <Stack.Screen name="GovernanceDashboard" component={ProtectedGovernanceDashboard} />
      <Stack.Screen name="FeatureManagement" component={ProtectedFeatureManagement} />
      <Stack.Screen name="ModuleCatalog" component={ProtectedModuleCatalog} />
      <Stack.Screen name="SubscriptionCenter" component={ProtectedSubscriptionCenter} />
      <Stack.Screen name="PlatformConfiguration" component={ProtectedPlatformConfiguration} />

      {/* Operations & Observability Subdomain */}
      <Stack.Screen name="OperationsDashboard" component={ProtectedOperationsDashboard} />
      <Stack.Screen name="HealthCenter" component={ProtectedHealthCenter} />
      <Stack.Screen name="IncidentCenter" component={ProtectedIncidentCenter} />
      <Stack.Screen name="LogCenter" component={ProtectedLogCenter} />
      <Stack.Screen name="ApiStatus" component={ProtectedApiStatus} />

      {/* Intelligence & Analytics Subdomain */}
      <Stack.Screen name="ExecutiveDashboard" component={ProtectedExecutiveDashboard} />
      <Stack.Screen name="CrossTenantAnalytics" component={ProtectedCrossTenantAnalytics} />
      <Stack.Screen name="UsageAnalytics" component={ProtectedUsageAnalytics} />
      <Stack.Screen name="CapacityDashboard" component={ProtectedCapacityDashboard} />
    </Stack.Navigator>
  );
}
