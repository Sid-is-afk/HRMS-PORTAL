import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AdminLayout from '../../components/AdminLayout';
import AdminKPICard from '../../components/AdminKPICard';
import AdminFilterBar from '../../components/AdminFilterBar';
import AdminDataTable from '../../components/AdminDataTable';
import LeaveApprovalDrawer from '../components/LeaveApprovalDrawer';
import { useLeaveStore } from '../store/leaveStore';
import { useNavigation } from '@react-navigation/native';

export default function LeaveDashboardScreen() {
  const { 
    dashboardSummary, 
    leaveRequests, 
    isLoading, 
    fetchLeaveDashboardSummary, 
    fetchLeaveRequests,
    approveLeave,
    rejectLeave,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters
  } = useLeaveStore();
  
  const navigation = useNavigation();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchLeaveDashboardSummary();
    fetchLeaveRequests(filters);
  }, [filters]);

  const handleApprove = async (id, comment) => {
    setIsProcessing(true);
    await approveLeave(id, comment);
    setIsProcessing(false);
    setSelectedRequest(null);
    fetchLeaveDashboardSummary();
    fetchLeaveRequests(filters);
  };

  const handleReject = async (id, comment) => {
    setIsProcessing(true);
    await rejectLeave(id, comment);
    setIsProcessing(false);
    setSelectedRequest(null);
    fetchLeaveDashboardSummary();
    fetchLeaveRequests(filters);
  };

  const columns = [
    { key: 'employee_name', label: 'Employee', render: (item) => <Text style={styles.cellBold}>{item.employee_name || 'N/A'}</Text>, width: 150 },
    { key: 'employee_id', label: 'ID', width: 80 },
    { key: 'department', label: 'Dept', width: 120 },
    { key: 'leave_type_name', label: 'Leave Type', width: 120 },
    { key: 'start_date', label: 'From', width: 100 },
    { key: 'end_date', label: 'To', width: 100 },
    { key: 'status', label: 'Status', render: (item) => (
      <View style={[styles.badge, { backgroundColor: item.status === 'APPROVED' ? '#DCFCE7' : item.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7' }]}>
        <Text style={[styles.badgeText, { color: item.status === 'APPROVED' ? '#16A34A' : item.status === 'REJECTED' ? '#DC2626' : '#D97706' }]}>
          {item.status || 'PENDING'}
        </Text>
      </View>
    ), width: 100 },
    { key: 'actions', label: 'Actions', render: (item) => (
      <Button mode="text" onPress={() => setSelectedRequest(item)} textColor="#2563EB" compact>
        Review
      </Button>
    ), width: 100 }
  ];

  return (
    <AdminLayout title="Leave Management">
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Leave Dashboard</Text>
          <Text style={styles.pageSubtitle}>Manage employee leave requests, balances, and approvals</Text>
        </View>
        <View style={styles.headerActions}>
          <Button mode="outlined" onPress={() => fetchLeaveDashboardSummary()} icon="refresh">
            Refresh
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate('LeaveBalanceSummary')} icon="briefcase" style={{ marginLeft: 8 }} buttonColor="#2563EB">
            View Balances
          </Button>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.kpiContainer}>
          <AdminKPICard 
            title="Total Requests" 
            value={dashboardSummary?.totalRequests || 0} 
            icon="file-document-multiple-outline" 
            color="#3B82F6" 
          />
          <AdminKPICard 
            title="Pending Approval" 
            value={dashboardSummary?.pendingApproval || 0} 
            icon="clock-outline" 
            color="#F59E0B" 
          />
          <AdminKPICard 
            title="Approved Today" 
            value={dashboardSummary?.approvedToday || 0} 
            icon="check-circle-outline" 
            color="#10B981" 
          />
          <AdminKPICard 
            title="On Leave Today" 
            value={dashboardSummary?.onLeaveToday || 0} 
            icon="account-off-outline" 
            color="#6366F1" 
          />
        </View>

        <AdminFilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={setFilters}
          onReset={() => { setFilters({}); setSearchQuery(''); }}
          onApply={() => fetchLeaveRequests({ ...filters, search: searchQuery })}
          filterOptions={[
            { id: 'department', label: 'Department' },
            { id: 'leaveType', label: 'Leave Type' },
            { id: 'status', label: 'Status' },
            { id: 'dateRange', label: 'Date Range' }
          ]}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Leave Requests</Text>
          <Text style={styles.sectionSubtitle}>Recent requests pending review</Text>
        </View>
        
        <AdminDataTable 
          columns={columns}
          data={leaveRequests}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No leave requests match your criteria."
        />

        {/* Analytics Section Placeholder for Charts */}
        <View style={styles.analyticsSection}>
           <View style={styles.chartPlaceholder}>
             <MaterialCommunityIcons name="chart-bar" size={32} color="#9CA3AF" />
             <Text style={styles.chartText}>Leave Requests by Month</Text>
           </View>
           <View style={styles.chartPlaceholder}>
             <MaterialCommunityIcons name="chart-arc" size={32} color="#9CA3AF" />
             <Text style={styles.chartText}>Leave Type Distribution</Text>
           </View>
        </View>
      </ScrollView>

      <LeaveApprovalDrawer 
        visible={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
        isProcessing={isProcessing}
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexWrap: 'wrap',
    gap: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  cellBold: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  analyticsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  chartPlaceholder: {
    flex: 1,
    minWidth: 300,
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  }
});
