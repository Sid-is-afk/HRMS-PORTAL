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

// Talent Acquisition Screen Imports
import TalentDashboardScreen from '@/modules/hr/talent-acquisition/screens/TalentDashboardScreen';
import JobRequisitionDirectoryScreen from '@/modules/hr/talent-acquisition/screens/JobRequisitionDirectoryScreen';
import JobRequisitionDetailsScreen from '@/modules/hr/talent-acquisition/screens/JobRequisitionDetailsScreen';
import JobPostingDirectoryScreen from '@/modules/hr/talent-acquisition/screens/JobPostingDirectoryScreen';
import RecruitmentActivityFeedScreen from '@/modules/hr/talent-acquisition/screens/RecruitmentActivityFeedScreen';
import RecruitmentSearchScreen from '@/modules/hr/talent-acquisition/screens/RecruitmentSearchScreen';
import RecruitmentFiltersScreen from '@/modules/hr/talent-acquisition/screens/RecruitmentFiltersScreen';

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

// Talent Acquisition Guarded Screen Wrappers
const ProtectedTalentDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_RECRUITMENT">
    <TalentDashboardScreen />
  </PermissionGuard>
);

const ProtectedJobRequisitions = () => (
  <PermissionGuard requiredPermissions="VIEW_RECRUITMENT">
    <JobRequisitionDirectoryScreen />
  </PermissionGuard>
);

const ProtectedJobRequisitionDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_RECRUITMENT">
    <JobRequisitionDetailsScreen />
  </PermissionGuard>
);

const ProtectedJobPostings = () => (
  <PermissionGuard requiredPermissions="VIEW_RECRUITMENT">
    <JobPostingDirectoryScreen />
  </PermissionGuard>
);

const ProtectedRecruitmentActivityFeed = () => (
  <PermissionGuard requiredPermissions="VIEW_HIRING_ACTIVITY">
    <RecruitmentActivityFeedScreen />
  </PermissionGuard>
);

const ProtectedRecruitmentSearch = () => (
  <PermissionGuard requiredPermissions="VIEW_RECRUITMENT">
    <RecruitmentSearchScreen />
  </PermissionGuard>
);

const ProtectedRecruitmentFilters = () => (
  <PermissionGuard requiredPermissions="VIEW_RECRUITMENT">
    <RecruitmentFiltersScreen />
  </PermissionGuard>
);

export default function HRNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Workspace Foundation Domain */}
      <Stack.Screen name="HRDashboard" component={ProtectedHRDashboard} />
      <Stack.Screen name="HROverview" component={ProtectedHROverview} />
      <Stack.Screen name="HRActivityFeed" component={ProtectedHRActivityFeed} />
      <Stack.Screen name="HRNotifications" component={ProtectedHRNotifications} />
      <Stack.Screen name="HRQuickActions" component={ProtectedHRQuickActions} />
      <Stack.Screen name="UpcomingEvents" component={ProtectedUpcomingEvents} />
      <Stack.Screen name="HRSearch" component={ProtectedHRSearch} />

      {/* Talent Acquisition Domain */}
      <Stack.Screen name="TalentDashboard" component={ProtectedTalentDashboard} />
      <Stack.Screen name="JobRequisitions" component={ProtectedJobRequisitions} />
      <Stack.Screen name="JobRequisitionDetails" component={ProtectedJobRequisitionDetails} />
      <Stack.Screen name="JobPostings" component={ProtectedJobPostings} />
      <Stack.Screen name="RecruitmentActivityFeed" component={ProtectedRecruitmentActivityFeed} />
      <Stack.Screen name="RecruitmentSearch" component={ProtectedRecruitmentSearch} />
      <Stack.Screen name="RecruitmentFilters" component={ProtectedRecruitmentFilters} />
    </Stack.Navigator>
  );
}
