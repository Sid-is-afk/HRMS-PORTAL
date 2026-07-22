import React from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminLayout from '../components/AdminLayout';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { useRecentActivities } from '../hooks/useRecentActivities';
import { useDashboardWidgets } from '../hooks/useDashboardWidgets';
import DashboardGrid from '../components/DashboardGrid';
import WidgetCard from '../components/WidgetCard';
import SummaryCard from '../components/SummaryCard';
import QuickActionCard from '../components/QuickActionCard';
import StatisticCard from '../components/StatisticCard';
import RecentActivityList from '../components/RecentActivityList';
import AnnouncementPreview from '../components/AnnouncementPreview';
import SystemStatusIndicator from '../components/SystemStatusIndicator';
import DashboardSection from '../components/DashboardSection';
import DashboardFilterBar from '../components/DashboardFilterBar';
import SkeletonDashboard from '../components/SkeletonDashboard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { isLoading, isRefreshing, error, filters, setFilters, refresh } = useAdminDashboard();
  const { summary, attendanceSummary, leaveSummary, employeeSummary, systemHealth } = useDashboardSummary();
  const { recentActivities } = useRecentActivities();
  const { widgets, toggleWidgetVisibility } = useDashboardWidgets();

  if (isLoading && !summary) {
    return (
      <AdminLayout title="Admin Dashboard">
        <SkeletonDashboard />
      </AdminLayout>
    );
  }

  const handleQuickAction = (route) => {
    try {
      navigation.navigate(route);
    } catch {
      // Catch navigation placeholder error
    }
  };

  const renderWidget = (widget) => {
    if (!widget.visible) return null;

    switch (widget.id) {
      case 'kpi':
        return (
          <WidgetCard key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.kpiContainer}>
              <SummaryCard
                title="Total Employees"
                value={employeeSummary?.total || 0}
                icon="account-group"
                iconBg="#EFF6FF"
                iconColor="#3B82F6"
                onPress={() => handleQuickAction('AdminEmployeeManagement')}
              />
              <SummaryCard
                title="Present Today"
                value={attendanceSummary?.present || 0}
                icon="account-check"
                iconBg="#E6F4EA"
                iconColor="#10B981"
                onPress={() => handleQuickAction('AdminAttendance')}
              />
              <SummaryCard
                title="On Leave Today"
                value={attendanceSummary?.onLeave || 0}
                icon="calendar-blank"
                iconBg="#FEF7E0"
                iconColor="#F59E0B"
                onPress={() => handleQuickAction('AdminLeave')}
              />
            </View>
          </WidgetCard>
        );

      case 'employee':
        return (
          <WidgetCard key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.cardInner}>
              <StatisticCard label="Active staff" value={employeeSummary?.active || 0} color="#10B981" percentage={`${Math.round(((employeeSummary?.active || 0) / (employeeSummary?.total || 1)) * 100)}%`} />
              <StatisticCard label="New Hires (Month)" value={employeeSummary?.newHiresThisMonth || 0} color="#3B82F6" percentage="5%" />
              <StatisticCard label="Turnover Rate" value={employeeSummary?.turnoverRate || '0%'} color="#EF4444" percentage="0.8%" />
            </View>
          </WidgetCard>
        );

      case 'attendance':
        return (
          <WidgetCard key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.cardInner}>
              <StatisticCard label="Present" value={attendanceSummary?.present || 0} color="#10B981" percentage={`${Math.round(((attendanceSummary?.present || 0) / (employeeSummary?.total || 1)) * 100)}%`} />
              <StatisticCard label="Late Arrivals" value={attendanceSummary?.late || 0} color="#F59E0B" percentage={`${Math.round(((attendanceSummary?.late || 0) / (employeeSummary?.total || 1)) * 100)}%`} />
              <StatisticCard label="Absent / Unknown" value={attendanceSummary?.absent || 0} color="#EF4444" percentage={`${Math.round(((attendanceSummary?.absent || 0) / (employeeSummary?.total || 1)) * 100)}%`} />
            </View>
          </WidgetCard>
        );

      case 'leave':
        return (
          <WidgetCard key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.cardInner}>
              <StatisticCard label="Pending Approval" value={leaveSummary?.pendingRequests || 0} color="#F59E0B" percentage="15%" />
              <StatisticCard label="Approved (Month)" value={leaveSummary?.approvedThisMonth || 0} color="#10B981" percentage="80%" />
              <StatisticCard label="Rejected (Month)" value={leaveSummary?.rejectedThisMonth || 0} color="#EF4444" percentage="5%" />
            </View>
          </WidgetCard>
        );

      case 'approvals':
        return (
          <WidgetCard key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <SummaryCard
              title="Leaves Awaiting Review"
              value={leaveSummary?.pendingRequests || 0}
              subtitle="Requires HR Administrator action"
              icon="checkbox-marked-circle-outline"
              iconBg="#FDF2F8"
              iconColor="#DB2777"
              onPress={() => handleQuickAction('AdminLeave')}
            />
          </WidgetCard>
        );

      case 'quickActions':
        return (
          <WidgetCard key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.quickActionsGrid}>
              {(summary?.quickActions || []).map((action) => (
                <QuickActionCard
                  key={action.id}
                  label={action.label}
                  icon={action.icon}
                  onPress={() => handleQuickAction(action.route)}
                />
              ))}
            </View>
          </WidgetCard>
        );

      case 'activities':
        return (
          <WidgetCard key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <RecentActivityList activities={recentActivities} />
          </WidgetCard>
        );

      case 'announcements':
        return (
          <WidgetCard key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <AnnouncementPreview announcements={summary?.announcements} />
          </WidgetCard>
        );

      case 'system':
        return (
          <WidgetCard key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <SystemStatusIndicator status={systemHealth?.status} latency={systemHealth?.apiLatency} />
          </WidgetCard>
        );

      default:
        return null;
    }
  };

  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  return (
    <AdminLayout
      title="Admin Dashboard"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} colors={['#3B82F6']} />
      }
    >
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}
        <DashboardFilterBar filters={filters} onFilterChange={setFilters} />
        <DashboardSection>
          <DashboardGrid>
            {sortedWidgets.map((widget) => renderWidget(widget))}
          </DashboardGrid>
        </DashboardSection>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardInner: {
    paddingVertical: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
});
