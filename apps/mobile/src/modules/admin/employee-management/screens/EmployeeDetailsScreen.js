import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useEmployee } from '../hooks/useEmployee';
import { useEmployeeDetails } from '../hooks/useEmployeeDetails';
import EmployeeProfileCard from '../components/EmployeeProfileCard';
import EmployeeInfoSection from '../components/EmployeeInfoSection';
import EmployeeSummaryCard from '../components/EmployeeSummaryCard';
import EmployeeTimeline from '../components/EmployeeTimeline';
import EmployeeActionMenu from '../components/EmployeeActionMenu';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function EmployeeDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const { employee, isLoading, error, deactivate, activate } = useEmployee(id);
  const { attendanceSummary, leaveSummary, activityTimeline } = useEmployeeDetails(employee);

  if (isLoading && !employee) {
    return (
      <AdminLayout title="Employee Details">
        <SkeletonDashboard />
      </AdminLayout>
    );
  }

  if (error || !employee) {
    return (
      <AdminLayout title="Employee Details">
        <ErrorMessage message={error || 'Employee details not found.'} />
      </AdminLayout>
    );
  }

  const handleEdit = () => {
    navigation.navigate('AdminEditEmployee', { id: employee.id });
  };

  const handleToggleStatus = () => {
    if (employee.status === 'ACTIVE') {
      deactivate();
    } else {
      activate();
    }
  };

  const handleArchivePlaceholder = () => {
    // Placeholder action
  };

  const personalData = [
    { label: 'Full Name', value: `${employee.firstName} ${employee.lastName}` },
    { label: 'Email', value: employee.email },
    { label: 'Phone', value: employee.phone },
  ];

  const employmentData = [
    { label: 'Employee ID', value: employee.employment.employeeId },
    { label: 'Role', value: employee.employment.role },
    { label: 'Employment Type', value: employee.employment.type },
    { label: 'Department', value: employee.employment.department.name },
    { label: 'Designation', value: employee.employment.designation.title },
    { label: 'Joining Date', value: employee.employment.joiningDate },
    { label: 'Reporting Manager', value: employee.employment.manager ? `${employee.employment.manager.firstName} ${employee.employment.manager.lastName}` : 'None' },
  ];

  const emergencyData = [
    { label: 'Name', value: employee.emergencyContact.name },
    { label: 'Relationship', value: employee.emergencyContact.relationship },
    { label: 'Phone', value: employee.emergencyContact.phone },
  ];

  return (
    <AdminLayout title={`${employee.firstName} ${employee.lastName}`}>
      <ScrollView contentContainerStyle={styles.container}>
        <EmployeeProfileCard employee={employee} />

        <EmployeeActionMenu
          status={employee.status}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onArchive={handleArchivePlaceholder}
        />

        <View style={styles.summaryContainer}>
          <EmployeeSummaryCard
            title="Attendance"
            value={attendanceSummary?.attendancePercentage}
            subtitle={`${attendanceSummary?.presentDays} Days Present`}
          />
          <EmployeeSummaryCard
            title="Leave Balance"
            value={leaveSummary?.remaining}
            subtitle={`${leaveSummary?.pending} Pending Approval`}
          />
        </View>

        <EmployeeInfoSection title="Personal Information" data={personalData} />
        <EmployeeInfoSection title="Employment Information" data={employmentData} />
        <EmployeeInfoSection title="Emergency Contact" data={emergencyData} />
        <EmployeeTimeline timeline={activityTimeline} />
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
});
