import React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import QuickActionCard from '../../components/QuickActionCard';
import SummaryCard from '../../components/SummaryCard';
import { useApprovalQueue } from '../hooks/useApprovalQueue';

export default function WorkflowDashboardScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { queue } = useApprovalQueue();

  const pendingCount = queue.filter((r) => r.status === 'PENDING').length;
  const approvedCount = queue.filter((r) => r.status === 'APPROVED').length;
  const returnedCount = queue.filter((r) => r.status === 'RETURNED').length;

  const handleNavigate = (route) => {
    navigation.navigate(route);
  };

  return (
    <AdminLayout title="Workflow Engine">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.summaryRow}>
          <SummaryCard title="Pending Approvals" value={String(pendingCount)} icon="clock-outline" iconBg="#EFF6FF" iconColor="#3B82F6" />
          <SummaryCard title="Approved Lifecycle" value={String(approvedCount)} icon="check-circle-outline" iconBg="#E6F4EA" iconColor="#10B981" />
          <SummaryCard title="Returned Requests" value={String(returnedCount)} icon="alert-circle-outline" iconBg="#FEF7E0" iconColor="#F59E0B" />
        </View>

        <Text style={styles.sectionTitle}>Workflow Engine Operations</Text>
        <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>
          <QuickActionCard label="Active Approval Queue" icon="tray-full" onPress={() => handleNavigate('AdminApprovalQueue')} />
          <QuickActionCard label="Workflow Routing Templates" icon="sitemap" onPress={() => handleNavigate('AdminWorkflowTemplates')} />
          <QuickActionCard label="Pending Requests" icon="clock-fast" onPress={() => handleNavigate('AdminPendingRequests')} />
          <QuickActionCard label="Approval History Log" icon="history" onPress={() => handleNavigate('AdminApprovalHistory')} />
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'column',
    gap: 12,
  },
  gridLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
