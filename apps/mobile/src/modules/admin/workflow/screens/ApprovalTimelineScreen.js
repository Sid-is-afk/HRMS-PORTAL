import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import { useRoute } from '@react-navigation/native';
import { useWorkflowDetails } from '../hooks/useWorkflowDetails';
import ApprovalTimeline from '../components/ApprovalTimeline';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function ApprovalTimelineScreen() {
  const route = useRoute();
  const { id } = route.params || {};
  const { request, isLoading, error } = useWorkflowDetails(id);

  if (isLoading && !request) {
    return (
      <AdminLayout title="Approval Timeline">
        <SkeletonDashboard />
      </AdminLayout>
    );
  }

  if (error || !request) {
    return (
      <AdminLayout title="Approval Timeline">
        <ErrorMessage message={error || 'Workflow not found.'} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Lifecycle Timeline">
      <ScrollView contentContainerStyle={styles.container}>
        <ApprovalTimeline history={request.history} />
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
