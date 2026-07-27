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

// Pipeline Screen Imports
import CandidateDirectoryScreen from '@/modules/hr/talent-acquisition/pipeline/screens/CandidateDirectoryScreen';
import CandidateProfileScreen from '@/modules/hr/talent-acquisition/pipeline/screens/CandidateProfileScreen';
import PipelineBoardScreen from '@/modules/hr/talent-acquisition/pipeline/screens/PipelineBoardScreen';
import InterviewDashboardScreen from '@/modules/hr/talent-acquisition/pipeline/screens/InterviewDashboardScreen';
import InterviewCalendarScreen from '@/modules/hr/talent-acquisition/pipeline/screens/InterviewCalendarScreen';
import InterviewDetailsScreen from '@/modules/hr/talent-acquisition/pipeline/screens/InterviewDetailsScreen';
import FeedbackFormScreen from '@/modules/hr/talent-acquisition/pipeline/screens/FeedbackFormScreen';
import CandidateTimelineScreen from '@/modules/hr/talent-acquisition/pipeline/screens/CandidateTimelineScreen';

// Offer Management Screen Imports
import OfferDashboardScreen from '@/modules/hr/talent-acquisition/offers/screens/OfferDashboardScreen';
import OfferDirectoryScreen from '@/modules/hr/talent-acquisition/offers/screens/OfferDirectoryScreen';
import OfferDetailsScreen from '@/modules/hr/talent-acquisition/offers/screens/OfferDetailsScreen';
import DecisionCenterScreen from '@/modules/hr/talent-acquisition/offers/screens/DecisionCenterScreen';

// Employee Lifecycle Screen Imports
import LifecycleDashboardScreen from '@/modules/hr/employee-lifecycle/screens/LifecycleDashboardScreen';
import EmployeeConversionScreen from '@/modules/hr/employee-lifecycle/screens/EmployeeConversionScreen';
import OnboardingWorkspaceScreen from '@/modules/hr/employee-lifecycle/screens/OnboardingWorkspaceScreen';
import ProbationTrackerScreen from '@/modules/hr/employee-lifecycle/screens/ProbationTrackerScreen';
import ConfirmationCenterScreen from '@/modules/hr/employee-lifecycle/screens/ConfirmationCenterScreen';

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

// Pipeline Guarded Screen Wrappers
const ProtectedCandidateDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_CANDIDATES">
    <CandidateDirectoryScreen />
  </PermissionGuard>
);

const ProtectedCandidateProfile = () => (
  <PermissionGuard requiredPermissions="VIEW_CANDIDATES">
    <CandidateProfileScreen />
  </PermissionGuard>
);

const ProtectedPipelineBoard = () => (
  <PermissionGuard requiredPermissions="VIEW_PIPELINE">
    <PipelineBoardScreen />
  </PermissionGuard>
);

const ProtectedInterviewDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_RECRUITMENT">
    <InterviewDashboardScreen />
  </PermissionGuard>
);

const ProtectedInterviewCalendar = () => (
  <PermissionGuard requiredPermissions="VIEW_RECRUITMENT">
    <InterviewCalendarScreen />
  </PermissionGuard>
);

const ProtectedInterviewDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_RECRUITMENT">
    <InterviewDetailsScreen />
  </PermissionGuard>
);

const ProtectedFeedbackForm = () => (
  <PermissionGuard requiredPermissions="SUBMIT_INTERVIEW_FEEDBACK">
    <FeedbackFormScreen />
  </PermissionGuard>
);

const ProtectedCandidateTimeline = () => (
  <PermissionGuard requiredPermissions="VIEW_CANDIDATES">
    <CandidateTimelineScreen />
  </PermissionGuard>
);

// Offer Management Guarded Screen Wrappers
const ProtectedOfferDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_OFFERS">
    <OfferDashboardScreen />
  </PermissionGuard>
);

const ProtectedOfferDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_OFFERS">
    <OfferDirectoryScreen />
  </PermissionGuard>
);

const ProtectedOfferDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_OFFERS">
    <OfferDetailsScreen />
  </PermissionGuard>
);

const ProtectedDecisionCenter = () => (
  <PermissionGuard requiredPermissions="MANAGE_HIRING_DECISIONS">
    <DecisionCenterScreen />
  </PermissionGuard>
);

// Employee Lifecycle Guarded Screen Wrappers
const ProtectedLifecycleDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_EMPLOYEE_LIFECYCLE">
    <LifecycleDashboardScreen />
  </PermissionGuard>
);

const ProtectedEmployeeConversion = () => (
  <PermissionGuard requiredPermissions="CONVERT_CANDIDATE">
    <EmployeeConversionScreen />
  </PermissionGuard>
);

const ProtectedOnboardingWorkspace = () => (
  <PermissionGuard requiredPermissions="MANAGE_ONBOARDING">
    <OnboardingWorkspaceScreen />
  </PermissionGuard>
);

const ProtectedProbationTracker = () => (
  <PermissionGuard requiredPermissions="VIEW_PROBATION">
    <ProbationTrackerScreen />
  </PermissionGuard>
);

const ProtectedConfirmationCenter = () => (
  <PermissionGuard requiredPermissions="MANAGE_CONFIRMATION">
    <ConfirmationCenterScreen />
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

      {/* Pipeline & Interview Subdomain */}
      <Stack.Screen name="CandidateDirectory" component={ProtectedCandidateDirectory} />
      <Stack.Screen name="CandidateProfile" component={ProtectedCandidateProfile} />
      <Stack.Screen name="PipelineBoard" component={ProtectedPipelineBoard} />
      <Stack.Screen name="InterviewDashboard" component={ProtectedInterviewDashboard} />
      <Stack.Screen name="InterviewCalendar" component={ProtectedInterviewCalendar} />
      <Stack.Screen name="InterviewDetails" component={ProtectedInterviewDetails} />
      <Stack.Screen name="FeedbackForm" component={ProtectedFeedbackForm} />
      <Stack.Screen name="CandidateTimeline" component={ProtectedCandidateTimeline} />

      {/* Offer Management Subdomain */}
      <Stack.Screen name="OfferDashboard" component={ProtectedOfferDashboard} />
      <Stack.Screen name="OfferDirectory" component={ProtectedOfferDirectory} />
      <Stack.Screen name="OfferDetails" component={ProtectedOfferDetails} />
      <Stack.Screen name="DecisionCenter" component={ProtectedDecisionCenter} />

      {/* Employee Lifecycle Subdomain */}
      <Stack.Screen name="LifecycleDashboard" component={ProtectedLifecycleDashboard} />
      <Stack.Screen name="EmployeeConversion" component={ProtectedEmployeeConversion} />
      <Stack.Screen name="OnboardingWorkspace" component={ProtectedOnboardingWorkspace} />
      <Stack.Screen name="ProbationTracker" component={ProtectedProbationTracker} />
      <Stack.Screen name="ConfirmationCenter" component={ProtectedConfirmationCenter} />
    </Stack.Navigator>
  );
}
