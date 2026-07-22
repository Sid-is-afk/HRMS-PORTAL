import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../dashboard/DashboardScreen';
import {
  AdminEmployeeManagement,
  AdminAttendance,
  AdminLeave,
  AdminDepartments,
  AdminReports,
  AdminAnnouncements,
  AdminSettings,
} from '../screens/Placeholders';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={DashboardScreen} />
      <Stack.Screen name="AdminEmployeeManagement" component={AdminEmployeeManagement} />
      <Stack.Screen name="AdminAttendance" component={AdminAttendance} />
      <Stack.Screen name="AdminLeave" component={AdminLeave} />
      <Stack.Screen name="AdminDepartments" component={AdminDepartments} />
      <Stack.Screen name="AdminReports" component={AdminReports} />
      <Stack.Screen name="AdminAnnouncements" component={AdminAnnouncements} />
      <Stack.Screen name="AdminSettings" component={AdminSettings} />
    </Stack.Navigator>
  );
}
