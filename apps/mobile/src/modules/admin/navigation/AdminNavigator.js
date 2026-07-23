import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../dashboard/DashboardScreen';
import {
  AdminAttendance,
  AdminReports,
  AdminAnnouncements,
  AdminSettings,
} from '../screens/Placeholders';
import EmployeeDirectoryScreen from '../employee-management/screens/EmployeeDirectoryScreen';
import EmployeeDetailsScreen from '../employee-management/screens/EmployeeDetailsScreen';
import AddEmployeeScreen from '../employee-management/screens/AddEmployeeScreen';
import EditEmployeeScreen from '../employee-management/screens/EditEmployeeScreen';
import OrganizationOverviewScreen from '../organization/screens/OrganizationOverviewScreen';
import DepartmentDirectoryScreen from '../organization/screens/DepartmentDirectoryScreen';
import DepartmentDetailsScreen from '../organization/screens/DepartmentDetailsScreen';
import DepartmentFormScreen from '../organization/screens/DepartmentFormScreen';
import DesignationDirectoryScreen from '../organization/screens/DesignationDirectoryScreen';
import DesignationDetailsScreen from '../organization/screens/DesignationDetailsScreen';
import DesignationFormScreen from '../organization/screens/DesignationFormScreen';
import TeamDirectoryScreen from '../organization/screens/TeamDirectoryScreen';
import LocationDirectoryScreen from '../organization/screens/LocationDirectoryScreen';
import OrganizationTreeScreen from '../organization/screens/OrganizationTreeScreen';
import ReportingStructureScreen from '../organization/screens/ReportingStructureScreen';
import WorkflowDashboardScreen from '../workflow/screens/WorkflowDashboardScreen';
import WorkflowTemplatesScreen from '../workflow/screens/WorkflowTemplatesScreen';
import ApprovalQueueScreen from '../workflow/screens/ApprovalQueueScreen';
import PendingRequestsScreen from '../workflow/screens/PendingRequestsScreen';
import ApprovalHistoryScreen from '../workflow/screens/ApprovalHistoryScreen';
import WorkflowDetailsScreen from '../workflow/screens/WorkflowDetailsScreen';
import ApprovalDetailsScreen from '../workflow/screens/ApprovalDetailsScreen';
import ApprovalTimelineScreen from '../workflow/screens/ApprovalTimelineScreen';
import WorkflowConfigurationScreen from '../workflow/screens/WorkflowConfigurationScreen';
import WorkforceOverviewScreen from '../workforce/screens/WorkforceOverviewScreen';
import ShiftDirectoryScreen from '../workforce/screens/ShiftDirectoryScreen';
import HolidayCalendarScreen from '../workforce/screens/HolidayCalendarScreen';
import AttendancePolicyDirectoryScreen from '../workforce/screens/AttendancePolicyDirectoryScreen';
import { PermissionGuard } from '@/core/rbac/guards/PermissionGuard';

// IAM Screen Imports
import IAMDashboardScreen from '../iam/screens/IAMDashboardScreen';
import RoleDirectoryScreen from '../iam/screens/RoleDirectoryScreen';
import RoleDetailsScreen from '../iam/screens/RoleDetailsScreen';
import CreateRoleScreen from '../iam/screens/CreateRoleScreen';
import EditRoleScreen from '../iam/screens/EditRoleScreen';
import PermissionDirectoryScreen from '../iam/screens/PermissionDirectoryScreen';
import PermissionGroupDirectoryScreen from '../iam/screens/PermissionGroupDirectoryScreen';
import RoleAssignmentScreen from '../iam/screens/RoleAssignmentScreen';
import UserPermissionViewerScreen from '../iam/screens/UserPermissionViewerScreen';
import PermissionMatrixScreen from '../iam/screens/PermissionMatrixScreen';
import AccessPolicyDirectoryScreen from '../iam/screens/AccessPolicyDirectoryScreen';
import AccessReviewDashboardScreen from '../iam/screens/AccessReviewDashboardScreen';

// Master Data Screen Imports
import MasterDataDashboardScreen from '../master-data/screens/MasterDataDashboardScreen';
import CategoryDirectoryScreen from '../master-data/screens/CategoryDirectoryScreen';
import CategoryDetailsScreen from '../master-data/screens/CategoryDetailsScreen';
import ReferenceValueListScreen from '../master-data/screens/ReferenceValueListScreen';
import ReferenceValueFormScreen from '../master-data/screens/ReferenceValueFormScreen';
import ConfigurationSearchScreen from '../master-data/screens/ConfigurationSearchScreen';
import ConfigurationFiltersScreen from '../master-data/screens/ConfigurationFiltersScreen';
import ImportPlaceholderScreen from '../master-data/screens/ImportPlaceholderScreen';
import ExportPlaceholderScreen from '../master-data/screens/ExportPlaceholderScreen';

const Stack = createNativeStackNavigator();

const ProtectedEmployeeDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_EMPLOYEE">
    <EmployeeDirectoryScreen />
  </PermissionGuard>
);

const ProtectedEmployeeDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_EMPLOYEE">
    <EmployeeDetailsScreen />
  </PermissionGuard>
);

const ProtectedAddEmployee = () => (
  <PermissionGuard requiredPermissions="CREATE_EMPLOYEE">
    <AddEmployeeScreen />
  </PermissionGuard>
);

const ProtectedEditEmployee = () => (
  <PermissionGuard requiredPermissions="UPDATE_EMPLOYEE">
    <EditEmployeeScreen />
  </PermissionGuard>
);

const ProtectedOrgOverview = () => (
  <PermissionGuard requiredPermissions="VIEW_DEPARTMENTS">
    <OrganizationOverviewScreen />
  </PermissionGuard>
);

const ProtectedDeptDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_DEPARTMENTS">
    <DepartmentDirectoryScreen />
  </PermissionGuard>
);

const ProtectedDeptDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_DEPARTMENTS">
    <DepartmentDetailsScreen />
  </PermissionGuard>
);

const ProtectedDeptForm = () => (
  <PermissionGuard requiredPermissions="CREATE_DEPARTMENT">
    <DepartmentFormScreen />
  </PermissionGuard>
);

const ProtectedDesigDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_DESIGNATIONS">
    <DesignationDirectoryScreen />
  </PermissionGuard>
);

const ProtectedDesigDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_DESIGNATIONS">
    <DesignationDetailsScreen />
  </PermissionGuard>
);

const ProtectedDesigForm = () => (
  <PermissionGuard requiredPermissions="CREATE_DESIGNATION">
    <DesignationFormScreen />
  </PermissionGuard>
);

const ProtectedTeamDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_DEPARTMENTS">
    <TeamDirectoryScreen />
  </PermissionGuard>
);

const ProtectedLocationDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_DEPARTMENTS">
    <LocationDirectoryScreen />
  </PermissionGuard>
);

const ProtectedOrgTree = () => (
  <PermissionGuard requiredPermissions="VIEW_DEPARTMENTS">
    <OrganizationTreeScreen />
  </PermissionGuard>
);

const ProtectedReportingStructure = () => (
  <PermissionGuard requiredPermissions="VIEW_DEPARTMENTS">
    <ReportingStructureScreen />
  </PermissionGuard>
);

const ProtectedWorkflowDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_APPROVAL_QUEUE">
    <WorkflowDashboardScreen />
  </PermissionGuard>
);

const ProtectedWorkflowTemplates = () => (
  <PermissionGuard requiredPermissions="CONFIGURE_WORKFLOW">
    <WorkflowTemplatesScreen />
  </PermissionGuard>
);

const ProtectedApprovalQueue = () => (
  <PermissionGuard requiredPermissions="VIEW_APPROVAL_QUEUE">
    <ApprovalQueueScreen />
  </PermissionGuard>
);

const ProtectedPendingRequests = () => (
  <PermissionGuard requiredPermissions="VIEW_APPROVAL_QUEUE">
    <PendingRequestsScreen />
  </PermissionGuard>
);

const ProtectedApprovalHistory = () => (
  <PermissionGuard requiredPermissions="VIEW_WORKFLOW_HISTORY">
    <ApprovalHistoryScreen />
  </PermissionGuard>
);

const ProtectedWorkflowDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_APPROVAL_QUEUE">
    <WorkflowDetailsScreen />
  </PermissionGuard>
);

const ProtectedApprovalDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_APPROVAL_QUEUE">
    <ApprovalDetailsScreen />
  </PermissionGuard>
);

const ProtectedApprovalTimeline = () => (
  <PermissionGuard requiredPermissions="VIEW_APPROVAL_QUEUE">
    <ApprovalTimelineScreen />
  </PermissionGuard>
);

const ProtectedWorkflowConfiguration = () => (
  <PermissionGuard requiredPermissions="CONFIGURE_WORKFLOW">
    <WorkflowConfigurationScreen />
  </PermissionGuard>
);

const ProtectedWorkforceOverview = () => (
  <PermissionGuard requiredPermissions="MANAGE_WORKFORCE_CONFIG">
    <WorkforceOverviewScreen />
  </PermissionGuard>
);

const ProtectedShiftDirectory = () => (
  <PermissionGuard requiredPermissions="MANAGE_SHIFT">
    <ShiftDirectoryScreen />
  </PermissionGuard>
);

const ProtectedHolidayCalendar = () => (
  <PermissionGuard requiredPermissions="MANAGE_HOLIDAY">
    <HolidayCalendarScreen />
  </PermissionGuard>
);

const ProtectedAttendancePolicy = () => (
  <PermissionGuard requiredPermissions="MANAGE_ATTENDANCE_POLICY">
    <AttendancePolicyDirectoryScreen />
  </PermissionGuard>
);

// IAM Protected Screen Wrappers
const ProtectedIAMDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_ROLE">
    <IAMDashboardScreen />
  </PermissionGuard>
);

const ProtectedRoleDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_ROLE">
    <RoleDirectoryScreen />
  </PermissionGuard>
);

const ProtectedRoleDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_ROLE">
    <RoleDetailsScreen />
  </PermissionGuard>
);

const ProtectedCreateRole = () => (
  <PermissionGuard requiredPermissions="CREATE_ROLE">
    <CreateRoleScreen />
  </PermissionGuard>
);

const ProtectedEditRole = () => (
  <PermissionGuard requiredPermissions="UPDATE_ROLE">
    <EditRoleScreen />
  </PermissionGuard>
);

const ProtectedPermissionDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_PERMISSION">
    <PermissionDirectoryScreen />
  </PermissionGuard>
);

const ProtectedPermissionGroupDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_PERMISSION">
    <PermissionGroupDirectoryScreen />
  </PermissionGuard>
);

const ProtectedRoleAssignment = () => (
  <PermissionGuard requiredPermissions="ASSIGN_ROLE">
    <RoleAssignmentScreen />
  </PermissionGuard>
);

const ProtectedUserPermissionViewer = () => (
  <PermissionGuard requiredPermissions="VIEW_PERMISSION">
    <UserPermissionViewerScreen />
  </PermissionGuard>
);

const ProtectedPermissionMatrix = () => (
  <PermissionGuard requiredPermissions="VIEW_PERMISSION">
    <PermissionMatrixScreen />
  </PermissionGuard>
);

const ProtectedAccessPolicyDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_ACCESS_POLICY">
    <AccessPolicyDirectoryScreen />
  </PermissionGuard>
);

const ProtectedAccessReviewDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_ROLE">
    <AccessReviewDashboardScreen />
  </PermissionGuard>
);

// Master Data Protected Screen Wrappers
const ProtectedMasterDataDashboard = () => (
  <PermissionGuard requiredPermissions="VIEW_MASTER_DATA">
    <MasterDataDashboardScreen />
  </PermissionGuard>
);

const ProtectedCategoryDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_MASTER_DATA">
    <CategoryDirectoryScreen />
  </PermissionGuard>
);

const ProtectedCategoryDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_MASTER_DATA">
    <CategoryDetailsScreen />
  </PermissionGuard>
);

const ProtectedReferenceValueList = () => (
  <PermissionGuard requiredPermissions="VIEW_MASTER_DATA">
    <ReferenceValueListScreen />
  </PermissionGuard>
);

const ProtectedReferenceValueForm = () => (
  <PermissionGuard requiredPermissions="CREATE_MASTER_DATA">
    <ReferenceValueFormScreen />
  </PermissionGuard>
);

const ProtectedConfigurationSearch = () => (
  <PermissionGuard requiredPermissions="VIEW_MASTER_DATA">
    <ConfigurationSearchScreen />
  </PermissionGuard>
);

const ProtectedConfigurationFilters = () => (
  <PermissionGuard requiredPermissions="MANAGE_CONFIGURATION">
    <ConfigurationFiltersScreen />
  </PermissionGuard>
);

const ProtectedImportPlaceholder = () => (
  <PermissionGuard requiredPermissions="CREATE_MASTER_DATA">
    <ImportPlaceholderScreen />
  </PermissionGuard>
);

const ProtectedExportPlaceholder = () => (
  <PermissionGuard requiredPermissions="VIEW_MASTER_DATA">
    <ExportPlaceholderScreen />
  </PermissionGuard>
);

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={DashboardScreen} />
      <Stack.Screen name="AdminEmployeeManagement" component={ProtectedEmployeeDirectory} />
      <Stack.Screen name="AdminEmployeeDetails" component={ProtectedEmployeeDetails} />
      <Stack.Screen name="AdminAddEmployee" component={ProtectedAddEmployee} />
      <Stack.Screen name="AdminEditEmployee" component={ProtectedEditEmployee} />

      <Stack.Screen name="AdminDepartments" component={ProtectedOrgOverview} />
      <Stack.Screen name="AdminDepartmentDirectory" component={ProtectedDeptDirectory} />
      <Stack.Screen name="AdminDepartmentDetails" component={ProtectedDeptDetails} />
      <Stack.Screen name="AdminDepartmentForm" component={ProtectedDeptForm} />
      <Stack.Screen name="AdminDesignationDirectory" component={ProtectedDesigDirectory} />
      <Stack.Screen name="AdminDesignationDetails" component={ProtectedDesigDetails} />
      <Stack.Screen name="AdminDesignationForm" component={ProtectedDesigForm} />
      <Stack.Screen name="AdminTeamDirectory" component={ProtectedTeamDirectory} />
      <Stack.Screen name="AdminLocationDirectory" component={ProtectedLocationDirectory} />
      <Stack.Screen name="AdminOrganizationTree" component={ProtectedOrgTree} />
      <Stack.Screen name="AdminReportingStructure" component={ProtectedReportingStructure} />

      <Stack.Screen name="AdminLeave" component={ProtectedWorkflowDashboard} />
      <Stack.Screen name="AdminWorkflowTemplates" component={ProtectedWorkflowTemplates} />
      <Stack.Screen name="AdminApprovalQueue" component={ProtectedApprovalQueue} />
      <Stack.Screen name="AdminPendingRequests" component={ProtectedPendingRequests} />
      <Stack.Screen name="AdminApprovalHistory" component={ProtectedApprovalHistory} />
      <Stack.Screen name="AdminWorkflowDetails" component={ProtectedWorkflowDetails} />
      <Stack.Screen name="AdminApprovalDetails" component={ProtectedApprovalDetails} />
      <Stack.Screen name="AdminApprovalTimeline" component={ProtectedApprovalTimeline} />
      <Stack.Screen name="AdminWorkflowConfiguration" component={ProtectedWorkflowConfiguration} />

      <Stack.Screen name="AdminAttendance" component={AdminAttendance} />
      <Stack.Screen name="AdminReports" component={AdminReports} />
      <Stack.Screen name="AdminAnnouncements" component={AdminAnnouncements} />
      <Stack.Screen name="AdminSettings" component={AdminSettings} />
      
      {/* Workforce Configuration Domain */}
      <Stack.Screen name="WorkforceOverview" component={ProtectedWorkforceOverview} />
      <Stack.Screen name="ShiftDirectory" component={ProtectedShiftDirectory} />
      <Stack.Screen name="HolidayCalendar" component={ProtectedHolidayCalendar} />
      <Stack.Screen name="AttendancePolicyDirectory" component={ProtectedAttendancePolicy} />

      {/* Identity & Access Management (IAM) Domain */}
      <Stack.Screen name="AdminIAM" component={ProtectedIAMDashboard} />
      <Stack.Screen name="RoleDirectory" component={ProtectedRoleDirectory} />
      <Stack.Screen name="RoleDetails" component={ProtectedRoleDetails} />
      <Stack.Screen name="CreateRole" component={ProtectedCreateRole} />
      <Stack.Screen name="EditRole" component={ProtectedEditRole} />
      <Stack.Screen name="PermissionDirectory" component={ProtectedPermissionDirectory} />
      <Stack.Screen name="PermissionGroupDirectory" component={ProtectedPermissionGroupDirectory} />
      <Stack.Screen name="RoleAssignment" component={ProtectedRoleAssignment} />
      <Stack.Screen name="UserPermissionViewer" component={ProtectedUserPermissionViewer} />
      <Stack.Screen name="PermissionMatrix" component={ProtectedPermissionMatrix} />
      <Stack.Screen name="AccessPolicyDirectory" component={ProtectedAccessPolicyDirectory} />
      <Stack.Screen name="AccessReviewDashboard" component={ProtectedAccessReviewDashboard} />

      {/* Master Data & Configuration Domain */}
      <Stack.Screen name="AdminMasterData" component={ProtectedMasterDataDashboard} />
      <Stack.Screen name="CategoryDirectory" component={ProtectedCategoryDirectory} />
      <Stack.Screen name="CategoryDetails" component={ProtectedCategoryDetails} />
      <Stack.Screen name="ReferenceValueList" component={ProtectedReferenceValueList} />
      <Stack.Screen name="ReferenceValueForm" component={ProtectedReferenceValueForm} />
      <Stack.Screen name="ConfigurationSearch" component={ProtectedConfigurationSearch} />
      <Stack.Screen name="ConfigurationFilters" component={ProtectedConfigurationFilters} />
      <Stack.Screen name="ImportPlaceholder" component={ProtectedImportPlaceholder} />
      <Stack.Screen name="ExportPlaceholder" component={ProtectedExportPlaceholder} />
    </Stack.Navigator>
  );
}
