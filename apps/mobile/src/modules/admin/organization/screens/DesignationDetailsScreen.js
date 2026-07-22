import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import AdminLayout from '../../components/AdminLayout';
import { useDesignations } from '../hooks/useDesignations';
import EmployeeInfoSection from '../../employee-management/components/EmployeeInfoSection';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { useAuthorization } from '@/core/rbac/hooks/useAuthorization';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function DesignationDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const { designation, isLoading, error, departments } = useDesignations(id);
  const { hasPermission } = useAuthorization();

  if (isLoading && !designation) {
    return (
      <AdminLayout title="Designation Details">
        <SkeletonDashboard />
      </AdminLayout>
    );
  }

  if (error || !designation) {
    return (
      <AdminLayout title="Designation Details">
        <ErrorMessage message={error || 'Designation not found.'} />
      </AdminLayout>
    );
  }

  const dept = departments.find((d) => d.id === designation.departmentId);

  const desigData = [
    { label: 'Designation Title', value: designation.title },
    { label: 'Designation Rank Level', value: String(designation.level) },
    { label: 'Description', value: designation.description },
    { label: 'Associated Department', value: dept ? dept.name : 'None' },
    { label: 'Status', value: designation.status },
  ];

  const handleEdit = () => {
    navigation.navigate('AdminDesignationForm', { id: designation.id });
  };

  const canEdit = hasPermission('MANAGE_ORGANIZATION');

  return (
    <AdminLayout title={designation.title}>
      <ScrollView contentContainerStyle={styles.container}>
        <EmployeeInfoSection title="Designation Master Record" data={desigData} />

        {canEdit ? (
          <Button mode="contained" icon="pencil" onPress={handleEdit} style={styles.button}>
            Edit Designation
          </Button>
        ) : null}
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: '#3B82F6',
    marginTop: 16,
  },
});
