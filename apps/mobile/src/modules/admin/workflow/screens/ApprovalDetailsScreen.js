import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useWorkflowDetails } from '../hooks/useWorkflowDetails';
import { useApprovalActions } from '../hooks/useApprovalActions';
import ApprovalTimeline from '../components/ApprovalTimeline';
import ApprovalComment from '../components/ApprovalComment';
import ApprovalActionBar from '../components/ApprovalActionBar';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { useAuthorization } from '@/core/rbac/hooks/useAuthorization';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function ApprovalDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const { request, isLoading: isFetching, error, refresh } = useWorkflowDetails(id);
  const { approve, reject, returnForChanges, addComment, isLoading: isSaving } = useApprovalActions(id);
  const { hasPermission } = useAuthorization();

  if (isFetching && !request) {
    return (
      <AdminLayout title="Approval Request Details">
        <SkeletonDashboard />
      </AdminLayout>
    );
  }

  if (error || !request) {
    return (
      <AdminLayout title="Approval Request Details">
        <ErrorMessage message={error || 'Approval request details not found.'} />
      </AdminLayout>
    );
  }

  const handleApprove = async (comment) => {
    await approve(comment);
    refresh();
  };

  const handleReject = async (comment) => {
    await reject(comment);
    refresh();
  };

  const handleReturn = async (comment) => {
    await returnForChanges(comment);
    refresh();
  };

  const handleAddComment = async (text) => {
    await addComment(text);
    refresh();
  };

  const canApprove = hasPermission('APPROVE_REQUEST');
  const canReject = hasPermission('REJECT_REQUEST');
  const isPending = request.status === 'PENDING';

  return (
    <AdminLayout title="Approval Details">
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.metaHeader}>
              <Text style={styles.requester}>{request.requesterName}</Text>
              <Text style={styles.moduleText}>{request.module} Approval Request</Text>
            </View>
            <Text style={styles.details}>{request.details}</Text>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('AdminWorkflowDetails', { id: request.id })}
              style={styles.viewConfigBtn}
              labelStyle={styles.viewConfigText}
            >
              View Workflow Configuration
            </Button>
            <Button
              mode="text"
              onPress={() => navigation.navigate('AdminApprovalTimeline', { id: request.id })}
              style={styles.timelineLink}
              labelStyle={styles.timelineLinkText}
            >
              View Full Screen Timeline
            </Button>
          </Card.Content>
        </Card>

        <ApprovalTimeline history={request.history} />

        <ApprovalComment
          comments={request.comments}
          onAddComment={handleAddComment}
          isSubmitting={isSaving}
        />

        {isPending && (canApprove || canReject) ? (
          <ApprovalActionBar
            onApprove={handleApprove}
            onReject={handleReject}
            onReturn={handleReturn}
            isSubmitting={isSaving}
          />
        ) : null}
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
    marginBottom: 16,
  },
  metaHeader: {
    marginBottom: 12,
  },
  requester: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  moduleText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 2,
  },
  details: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  viewConfigBtn: {
    borderColor: '#3B82F6',
    borderRadius: 8,
    marginTop: 8,
  },
  viewConfigText: {
    fontSize: 12,
    color: '#3B82F6',
  },
  timelineLink: {
    marginTop: 8,
    alignSelf: 'center',
  },
  timelineLinkText: {
    fontSize: 12,
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
});
