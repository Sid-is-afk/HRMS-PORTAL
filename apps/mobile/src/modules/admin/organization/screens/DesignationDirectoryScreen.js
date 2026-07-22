import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useDesignations } from '../hooks/useDesignations';
import DesignationCard from '../components/DesignationCard';
import OrganizationSearch from '../components/OrganizationSearch';
import OrganizationFilter from '../components/OrganizationFilter';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { useAuthorization } from '@/core/rbac/hooks/useAuthorization';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function DesignationDirectoryScreen() {
  const navigation = useNavigation();
  const { hasPermission } = useAuthorization();
  const { designations, isLoading, error, filters, setFilters, departments } = useDesignations();

  const handlePressItem = (id) => {
    navigation.navigate('AdminDesignationDetails', { id });
  };

  const handleCreate = () => {
    navigation.navigate('AdminDesignationForm');
  };

  const deptOptions = [
    { id: 'all', label: 'All Departments' },
    ...departments.map((d) => ({ id: d.id, label: d.name })),
  ];

  const canCreate = hasPermission('CREATE_DESIGNATION');

  return (
    <AdminLayout title="Designations">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        <OrganizationSearch
          placeholder="Search designations by title..."
          value={filters.search}
          onChangeText={(search) => setFilters({ search })}
          onClear={() => setFilters({ search: '' })}
        />

        <OrganizationFilter
          label="Filter Department"
          selected={filters.departmentId}
          onChange={(departmentId) => setFilters({ departmentId })}
          options={deptOptions}
        />

        {isLoading && designations.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <FlatList
            data={designations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DesignationCard designation={item} onPress={() => handlePressItem(item.id)} />
            )}
            contentContainerStyle={styles.list}
          />
        )}

        {canCreate ? (
          <FAB icon="plus" label="Add Designation" style={styles.fab} color="#FFFFFF" onPress={handleCreate} />
        ) : null}
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3B82F6',
  },
});
