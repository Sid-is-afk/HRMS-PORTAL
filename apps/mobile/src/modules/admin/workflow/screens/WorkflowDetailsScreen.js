import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useWorkflowDetails } from '../hooks/useWorkflowDetails';
import WorkflowStep from '../components/WorkflowStep';
import WorkflowProgress from '../components/WorkflowProgress';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function WorkflowDetailsScreen() {
  const route = useRoute();
  const { id } = route.params || {};
  const { request, isLoading, error } = useWorkflowDetails(id);

  if (isLoading && !request) {
    return (
      <AdminLayout title="Workflow Configuration Details">
        <SkeletonDashboard />
      </AdminLayout>
    );
  }

  if (error || !request) {
    return (
      <AdminLayout title="Workflow Configuration Details">
        <ErrorMessage message={error || 'Workflow details not found.'} />
      </AdminLayout>
    );
  }

  const { workflow } = request;

  return (
    <AdminLayout title="Workflow Details">
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.name}>{workflow.name}</Text>
            <Text style={styles.type}>Type: {workflow.type}</Text>
            <Text style={styles.status}>Status: {workflow.status}</Text>
            <WorkflowProgress steps={workflow.steps} />
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Routing Steps & Approvers</Text>
        {workflow.steps.map((step) => (
          <WorkflowStep key={step.id} step={step} />
        ))}
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
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  type: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 10,
    marginTop: 8,
  },
});
