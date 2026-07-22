import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import EmployeeForm from '../components/EmployeeForm';
import { useEmployeeForm } from '../hooks/useEmployeeForm';
import { useEmployeeFilters } from '../hooks/useEmployeeFilters';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function AddEmployeeScreen() {
  const navigation = useNavigation();
  const { control, formState: { errors }, submit, isLoading, submitError } = useEmployeeForm();
  const { departments, designations, managers } = useEmployeeFilters();

  const handleSubmit = async () => {
    try {
      await submit();
      navigation.navigate('AdminEmployeeDirectory');
    } catch {
      // Handled in store/hook
    }
  };

  return (
    <AdminLayout title="Add Employee">
      <View style={styles.container}>
        {submitError ? <ErrorMessage message={submitError} /> : null}
        <EmployeeForm
          control={control}
          errors={errors}
          isEditMode={false}
          departments={departments}
          designations={designations}
          managers={managers}
          onSubmit={handleSubmit}
          isLoading={isLoading}
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
