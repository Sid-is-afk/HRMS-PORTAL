import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import { useApprovalQueue } from '../hooks/useApprovalQueue';
import ApprovalQueue from '../components/ApprovalQueue';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { useNavigation } from '@react-navigation/native';

export default function PendingRequestsScreen() {
  const navigation = useNavigation();
  const { queue, isLoading, error, refresh } = useApprovalQueue();

  const pendingRequests = queue.filter((r) => r.status === 'PENDING');

  const handlePressItem = (id) => {
    navigation.navigate('AdminApprovalDetails', { id });
  };

  return (
    <AdminLayout title="Pending Requests">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        {isLoading && pendingRequests.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <ApprovalQueue
            queue={pendingRequests}
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
