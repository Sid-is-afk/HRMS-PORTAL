import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AdminLayout from '../../components/AdminLayout';
import AdminKPICard from '../../components/AdminKPICard';
import AdminFilterBar from '../../components/AdminFilterBar';
import AdminDataTable from '../../components/AdminDataTable';
import { useAttendanceStore } from '../store/attendanceStore';
import { useNavigation } from '@react-navigation/native';

export default function AttendanceDashboardScreen() {
  const { 
    dashboardSummary, 
    attendanceRecords, 
    isLoading, 
    fetchAttendanceDashboardSummary, 
    fetchAttendance,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters
  } = useAttendanceStore();
  
  const navigation = useNavigation();

  useEffect(() => {
    fetchAttendanceDashboardSummary();
    fetchAttendance(filters);
  }, [filters]);

  const columns = [
    { key: 'employee_name', label: 'Employee', render: (item) => <Text style={styles.cellBold}>{item.employee_name || 'N/A'}</Text>, width: 150 },
    { key: 'employee_id', label: 'ID', width: 80 },
    { key: 'department', label: 'Dept', width: 120 },
    { key: 'shift', label: 'Shift', width: 100 },
    { key: 'clock_in', label: 'Check In', width: 100 },
    { key: 'clock_out', label: 'Check Out', width: 100 },
    { key: 'working_hours', label: 'Hours', width: 80 },
    { key: 'status', label: 'Status', render: (item) => (
      <View style={[styles.badge, 
        { backgroundColor: item.status === 'PRESENT' ? '#DCFCE7' : item.status === 'ABSENT' ? '#FEE2E2' : item.status === 'LATE' ? '#FEF3C7' : '#E0E7FF' }
      ]}>
        <Text style={[styles.badgeText, 
          { color: item.status === 'PRESENT' ? '#16A34A' : item.status === 'ABSENT' ? '#DC2626' : item.status === 'LATE' ? '#D97706' : '#4F46E5' }
        ]}>
          {item.status || 'N/A'}
        </Text>
      </View>
    ), width: 100 },
    { key: 'actions', label: 'Actions', render: (_item) => (
      <Button mode="text" onPress={() => {}} textColor="#2563EB" compact>
        Details
      </Button>
    ), width: 100 }
  ];

  return (
    <AdminLayout title="Attendance Management">
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Attendance Dashboard</Text>
          <Text style={styles.pageSubtitle}>Monitor daily attendance, shifts, and regularization requests</Text>
        </View>
        <View style={styles.headerActions}>
          <Button mode="outlined" onPress={() => fetchAttendanceDashboardSummary()} icon="refresh">
            Refresh
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate('AdminApprovalQueue')} icon="calendar-check" style={{ marginLeft: 8 }} buttonColor="#2563EB">
            Exceptions
          </Button>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.kpiContainer}>
          <AdminKPICard 
            title="Present Today" 
            value={`${dashboardSummary?.presentPercentage || 0}%`} 
            icon="account-check-outline" 
            color="#10B981" 
            trend="up"
            trendText="+2% from yesterday"
          />
          <AdminKPICard 
            title="Absent" 
            value={dashboardSummary?.absentCount || 0} 
            icon="account-remove-outline" 
            color="#DC2626" 
          />
          <AdminKPICard 
            title="Late Arrivals" 
            value={dashboardSummary?.lateCount || 0} 
            icon="clock-alert-outline" 
            color="#F59E0B" 
          />
          <AdminKPICard 
            title="On Leave" 
            value={dashboardSummary?.onLeaveCount || 0} 
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
          onApply={() => fetchAttendance({ ...filters, search: searchQuery })}
          filterOptions={[
            { id: 'department', label: 'Department' },
            { id: 'shift', label: 'Shift' },
            { id: 'status', label: 'Status' },
            { id: 'date', label: 'Date' }
          ]}
        />

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
           <Button mode="outlined" icon="check-all" onPress={() => {}} style={styles.qaButton}>Mark Attendance</Button>
           <Button mode="outlined" icon="file-import" onPress={() => {}} style={styles.qaButton}>Bulk Import</Button>
           <Button mode="outlined" icon="file-export" onPress={() => {}} style={styles.qaButton}>Export Excel</Button>
           <Button mode="outlined" icon="cog" onPress={() => {}} style={styles.qaButton}>Settings</Button>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Attendance Logs</Text>
          <Text style={styles.sectionSubtitle}>Detailed records for the selected date</Text>
        </View>
        
        <AdminDataTable 
          columns={columns}
          data={attendanceRecords}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No attendance records match your criteria."
        />

        {/* Analytics Section Placeholder for Charts */}
        <View style={styles.analyticsSection}>
           <View style={styles.chartPlaceholder}>
             <MaterialCommunityIcons name="chart-line" size={32} color="#9CA3AF" />
             <Text style={styles.chartText}>Weekly Attendance Trend</Text>
           </View>
           <View style={styles.chartPlaceholder}>
             <MaterialCommunityIcons name="chart-donut" size={32} color="#9CA3AF" />
             <Text style={styles.chartText}>Status Distribution</Text>
           </View>
        </View>
      </ScrollView>
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
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  qaButton: {
    backgroundColor: '#FFFFFF',
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
