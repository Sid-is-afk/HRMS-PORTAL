import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import EmployeeForm from '../components/EmployeeForm';
import { useEmployee } from '../hooks/useEmployee';
import { useEmployeeForm } from '../hooks/useEmployeeForm';
import { useEmployeeFilters } from '../hooks/useEmployeeFilters';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function EditEmployeeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const { employee, isLoading: isFetching, error } = useEmployee(id);
  const { control, formState: { errors }, submit, isLoading: isUpdating, submitError } = useEmployeeForm(employee);
  const { departments, designations, managers } = useEmployeeFilters();

  const handleSubmit = async () => {
    try {
      await submit();
      navigation.navigate('AdminEmployeeDetails', { id });
    } catch {
      // Handled in store/hook
    }
  };

  if (isFetching && !employee) {
    return (
      <AdminLayout title="Edit Profile">
        <SkeletonDashboard />
      </AdminLayout>
    );
  }

  if (error || !employee) {
    return (
      <AdminLayout title="Edit Profile">
        <ErrorMessage message={error || 'Employee details not found.'} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit ${employee.firstName}`}>
      <View style={styles.container}>
        {submitError ? <ErrorMessage message={submitError} /> : null}
        <EmployeeForm
          control={control}
          errors={errors}
          isEditMode={true}
          departments={departments}
          designations={designations}
          managers={managers}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
        />
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
