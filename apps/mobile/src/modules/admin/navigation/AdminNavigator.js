import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../dashboard/DashboardScreen';
import {
  AdminAttendance,
  AdminLeave,
  AdminDepartments,
  AdminReports,
  AdminAnnouncements,
  AdminSettings,
} from '../screens/Placeholders';
import EmployeeDirectoryScreen from '../employee-management/screens/EmployeeDirectoryScreen';
import EmployeeDetailsScreen from '../employee-management/screens/EmployeeDetailsScreen';
import AddEmployeeScreen from '../employee-management/screens/AddEmployeeScreen';
import EditEmployeeScreen from '../employee-management/screens/EditEmployeeScreen';
import { PermissionGuard } from '@/core/rbac/guards/PermissionGuard';

const Stack = createNativeStackNavigator();

const ProtectedDirectory = () => (
  <PermissionGuard requiredPermissions="VIEW_EMPLOYEE">
    <EmployeeDirectoryScreen />
  </PermissionGuard>
);

const ProtectedDetails = () => (
  <PermissionGuard requiredPermissions="VIEW_EMPLOYEE">
    <EmployeeDetailsScreen />
  </PermissionGuard>
);

const ProtectedAdd = () => (
  <PermissionGuard requiredPermissions="CREATE_EMPLOYEE">
    <AddEmployeeScreen />
  </PermissionGuard>
);

const ProtectedEdit = () => (
  <PermissionGuard requiredPermissions="UPDATE_EMPLOYEE">
    <EditEmployeeScreen />
  </PermissionGuard>
);

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={DashboardScreen} />
      <Stack.Screen name="AdminEmployeeManagement" component={ProtectedDirectory} />
      <Stack.Screen name="AdminEmployeeDetails" component={ProtectedDetails} />
      <Stack.Screen name="AdminAddEmployee" component={ProtectedAdd} />
      <Stack.Screen name="AdminEditEmployee" component={ProtectedEdit} />

      <Stack.Screen name="AdminAttendance" component={AdminAttendance} />
      <Stack.Screen name="AdminLeave" component={AdminLeave} />
      <Stack.Screen name="AdminDepartments" component={AdminDepartments} />
      <Stack.Screen name="AdminReports" component={AdminReports} />
      <Stack.Screen name="AdminAnnouncements" component={AdminAnnouncements} />
      <Stack.Screen name="AdminSettings" component={AdminSettings} />
    </Stack.Navigator>
  );
}
