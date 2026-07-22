import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeSearch } from '../hooks/useEmployeeSearch';
import { useEmployeeFilters } from '../hooks/useEmployeeFilters';
import EmployeeList from '../components/EmployeeList';
import EmployeeSearchBar from '../components/EmployeeSearchBar';
import EmployeeFilterPanel from '../components/EmployeeFilterPanel';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { useAuthorization } from '@/core/rbac/hooks/useAuthorization';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function EmployeeDirectoryScreen() {
  const navigation = useNavigation();
  const { hasPermission } = useAuthorization();
  const [showFilters, setShowFilters] = useState(false);

  const { employees, isLoading, isRefreshing, error, refresh, loadMore, hasMore } = useEmployees();
  const { query, search, clear } = useEmployeeSearch();
  const { filters, setFilters, reset, departments } = useEmployeeFilters();

  const handlePressItem = (id) => {
    navigation.navigate('AdminEmployeeDetails', { id });
  };

  const handleAddEmployee = () => {
    navigation.navigate('AdminAddEmployee');
  };

  const canCreate = hasPermission('CREATE_EMPLOYEE');

  return (
    <AdminLayout title="Employee Directory">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        <EmployeeSearchBar value={query} onChangeText={search} onClear={clear} />

        <Button
          mode="outlined"
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
          icon={showFilters ? 'chevron-up' : 'filter-variant'}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>

        {showFilters ? (
          <EmployeeFilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onReset={reset}
            departments={departments}
          />
        ) : null}

        {isLoading && employees.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <EmployeeList
            employees={employees}
            refreshing={isRefreshing}
            onRefresh={refresh}
            onEndReached={loadMore}
            hasMore={hasMore}
            onPressItem={handlePressItem}
          />
        )}

        {canCreate ? (
          <FAB
            icon="plus"
            label="Add Employee"
            style={styles.fab}
            color="#FFFFFF"
            onPress={handleAddEmployee}
          />
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
  filterButton: {
    marginBottom: 12,
    borderColor: '#D1D5DB',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3B82F6',
  },
});
