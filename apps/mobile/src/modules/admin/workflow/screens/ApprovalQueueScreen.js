import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import { useApprovalQueue } from '../hooks/useApprovalQueue';
import ApprovalQueue from '../components/ApprovalQueue';
import WorkflowFilters from '../components/WorkflowFilters';
import WorkflowSearch from '../components/WorkflowSearch';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { useNavigation } from '@react-navigation/native';

export default function ApprovalQueueScreen() {
  const navigation = useNavigation();
  const { queue, isLoading, error, filters, setFilters, refresh } = useApprovalQueue();

  const handlePressItem = (id) => {
    navigation.navigate('AdminApprovalDetails', { id });
  };

  const statusOptions = [
    { id: 'all', label: 'All Requests' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'REJECTED', label: 'Rejected' },
    { id: 'RETURNED', label: 'Returned' },
  ];

  return (
    <AdminLayout title="Approval Queue">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        <WorkflowSearch
          value={filters.search}
          onChangeText={(search) => setFilters({ search })}
          onClear={() => setFilters({ search: '' })}
        />

        <WorkflowFilters
          label="Filter Status"
          selected={filters.status}
          onChange={(status) => setFilters({ status })}
          options={statusOptions}
        />

        {isLoading && queue.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <ApprovalQueue
            queue={queue}
            refreshing={isLoading}
            onRefresh={refresh}
            onPressItem={handlePressItem}
          />
        )}
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
