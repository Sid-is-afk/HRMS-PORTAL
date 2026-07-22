import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AdminLayout from '../components/AdminLayout';

function GenericPlaceholder({ title, description }) {
  const navigation = useNavigation();

  return (
    <AdminLayout title={title}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Button mode="contained" onPress={() => navigation.navigate('AdminDashboard')} style={styles.button}>
          Back to Dashboard
        </Button>
      </View>
    </AdminLayout>
  );
}

export function AdminEmployeeManagement() {
  return (
    <GenericPlaceholder
      title="Employee Management"
      description="Operational module to manage organization employee records, view active/inactive hires, and modify profiles."
    />
  );
}

export function AdminAttendance() {
  return (
    <GenericPlaceholder
      title="Attendance Logs"
      description="Administrative module to view employee check-ins, resolve anomalies, and correct timesheets."
    />
  );
}

export function AdminLeave() {
  return (
    <GenericPlaceholder
      title="Leave Approvals"
      description="Administrative module to review, approve, or reject pending leave requests submitted by staff."
    />
  );
}

export function AdminDepartments() {
  return (
    <GenericPlaceholder
      title="Departments Control"
      description="Operational module to define departments, assign managers, and allocate workforce capacity."
    />
  );
}

export function AdminReports() {
  return (
    <GenericPlaceholder
      title="System Reports & Analytics"
      description="Administrative module to generate audit logs, export attendance datasets, and view operational analytics."
    />
  );
}

export function AdminAnnouncements() {
  return (
    <GenericPlaceholder
      title="Company Announcements"
      description="Operational module to post news, set bulletins, and publish announcements across the portal."
    />
  );
}

export function AdminSettings() {
  return (
    <GenericPlaceholder
      title="Portal Settings"
      description="Administrative configuration panel to adjust parameters, session timeout limits, and RBAC rules."
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 400,
  },
  button: {
    backgroundColor: '#3B82F6',
  },
});
