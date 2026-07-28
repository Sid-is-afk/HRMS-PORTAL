import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from './HRWorkspaceScreen';
import { useHRDashboard } from '../hooks/useHRDashboard';
import { usePendingTasks } from '../hooks/usePendingTasks';
import { useUpcomingEvents } from '../hooks/useUpcomingEvents';
import { useRecentActivities } from '../hooks/useRecentActivities';
import { useHRQuickActions } from '../hooks/useHRQuickActions';
import HRDashboardHeader from '../components/HRDashboardHeader';
import HRDashboardGrid from '../components/HRDashboardGrid';
import HRWidget from '../components/HRWidget';
import HRSummaryCard from '../components/HRSummaryCard';
import HRQuickActionCard from '../components/HRQuickActionCard';
import HRActivityCard from '../components/HRActivityCard';
import PendingTaskCard from '../components/PendingTaskCard';
import UpcomingEventCard from '../components/UpcomingEventCard';
import HRNotificationPreview from '../components/HRNotificationPreview';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function HRDashboardScreen() {
  const navigation = useNavigation();
  
  const {
    summary,
    widgets,
    isLoading,
    isRefreshing,
    error,
    filters,
    setFilters,
    toggleWidgetVisibility,
    refresh,
  } = useHRDashboard();

  const { tasks } = usePendingTasks();
  const { events } = useUpcomingEvents();
  const { activities } = useRecentActivities();
  const { quickActions } = useHRQuickActions();

  if (isLoading && !summary) {
    return (
      <HRWorkspaceScreen title="HR Dashboard">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading HR insights...</Text>
        </View>
      </HRWorkspaceScreen>
    );
  }

  // Map quick action routes to actual registered navigator screen names
  const quickActionRouteMap = {
    CreateJobOpening: 'JobRequisitions',
    AddCandidate: 'CandidateDirectory',
    StartOnboarding: 'OnboardingWorkspace',
    AssignTraining: 'LearningCatalog',
    CreatePerformanceReview: 'PerformanceReviews',
    UploadDocument: 'OperationsDashboard',
    GenerateHRReport: 'ExecutiveDashboard',
  };

  const handleQuickAction = (action) => {
    const targetRoute = quickActionRouteMap[action.route] || action.route;
    try {
      navigation.navigate(targetRoute);
    } catch (e) {
      console.warn(`Quick Action navigation failed for route "${targetRoute}":`, e.message);
    }
  };

  const handleCompleteTask = (taskId) => {
    console.log('Task Completed', `Marked task ID ${taskId} as completed.`);
  };

  const renderWidget = (widget) => {
    if (!widget.visible) return null;

    // Filter widgets based on selected category filter
    const activeCategory = filters.category;
    if (activeCategory !== 'all') {
      const widgetCategoryMap = {
        kpi: 'recruitment',
        onboarding: 'onboarding',
        performance: 'performance',
        tasks: 'all',
        activities: 'all',
        events: 'all',
        notifications: 'all',
        quickActions: 'all',
      };
      if (widgetCategoryMap[widget.id] && widgetCategoryMap[widget.id] !== activeCategory && widgetCategoryMap[widget.id] !== 'all') {
        return null;
      }
    }

    switch (widget.id) {
      case 'kpi':
        return (
          <HRWidget key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.rowGrid}>
              <HRSummaryCard
                title="Open Positions"
                value={summary?.openPositions || 0}
                icon="briefcase-outline"
                iconBg="#EFF6FF"
                iconColor="#2563EB"
                onPress={() => navigation.navigate('HROverview')}
              />
              <HRSummaryCard
                title="Total Candidates"
                value={summary?.candidates || 0}
                icon="account-multiple-outline"
                iconBg="#E0F2FE"
                iconColor="#0284C7"
                onPress={() => navigation.navigate('HROverview')}
              />
              <HRSummaryCard
                title="Interviews Today"
                value={summary?.upcomingInterviews || 0}
                icon="calendar-account-outline"
                iconBg="#F0FDF4"
                iconColor="#16A34A"
                onPress={() => navigation.navigate('UpcomingEvents')}
              />
            </View>
          </HRWidget>
        );

      case 'quickActions':
        return (
          <HRWidget key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.quickActionsContainer}>
              {(quickActions || []).map((action) => (
                <HRQuickActionCard
                  key={action.id}
                  label={action.label}
                  icon={action.icon}
                  onPress={() => handleQuickAction(action)}
                />
              ))}
            </View>
          </HRWidget>
        );

      case 'onboarding':
        return (
          <HRWidget key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.rowGrid}>
              <HRSummaryCard
                title="Pending Onboarding"
                value={summary?.pendingOnboarding || 0}
                icon="account-clock-outline"
                iconBg="#FEF3C7"
                iconColor="#D97706"
              />
              <HRSummaryCard
                title="Pending Confirmations"
                value={summary?.pendingConfirmations || 0}
                icon="card-bulleted-settings-outline"
                iconBg="#ECFEFF"
                iconColor="#0891B2"
              />
              <HRSummaryCard
                title="On Probation"
                value={summary?.employeesOnProbation || 0}
                icon="account-badge-outline"
                iconBg="#F5F3FF"
                iconColor="#7C3AED"
              />
            </View>
          </HRWidget>
        );

      case 'performance':
        return (
          <HRWidget key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.rowGrid}>
              <HRSummaryCard
                title="Upcoming Reviews"
                value={summary?.upcomingReviews || 0}
                icon="file-document-edit-outline"
                iconBg="#FFF1F2"
                iconColor="#E11D48"
              />
              <HRSummaryCard
                title="Training Progress"
                value={`${summary?.trainingStatus || 0}%`}
                icon="school-outline"
                iconBg="#F0FDFA"
                iconColor="#0D9488"
              />
              <HRSummaryCard
                title="Expiring Docs"
                value={summary?.expiringDocuments || 0}
                icon="alert-decagram-outline"
                iconBg="#FEF2F2"
                iconColor="#DC2626"
              />
            </View>
          </HRWidget>
        );

      case 'tasks':
        return (
          <HRWidget key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.listContainer}>
              {tasks.length === 0 ? (
                <Text style={styles.emptyText}>No pending tasks</Text>
              ) : (
                tasks.map((task) => (
                  <PendingTaskCard key={task.id} task={task} onComplete={handleCompleteTask} />
                ))
              )}
            </View>
          </HRWidget>
        );

      case 'activities':
        return (
          <HRWidget key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.listContainer}>
              {activities.length === 0 ? (
                <Text style={styles.emptyText}>No recent activities</Text>
              ) : (
                activities.map((act) => (
                  <HRActivityCard key={act.id} activity={act} />
                ))
              )}
            </View>
          </HRWidget>
        );

      case 'events':
        return (
          <HRWidget key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.listContainer}>
              {events.length === 0 ? (
                <Text style={styles.emptyText}>No upcoming events</Text>
              ) : (
                events.map((evt) => (
                  <UpcomingEventCard key={evt.id} event={evt} />
                ))
              )}
            </View>
          </HRWidget>
        );

      case 'notifications':
        return (
          <HRWidget key={widget.id} id={widget.id} title={widget.title} size={widget.size} onHide={toggleWidgetVisibility}>
            <View style={styles.listContainer}>
              {summary?.pendingWorkflowApprovals === 0 ? (
                <Text style={styles.emptyText}>No pending approvals</Text>
              ) : (
                <View>
                  <HRNotificationPreview
                    notification={{
                      id: 'notif-wf',
                      title: 'Pending Approvals Alert',
                      body: `You have ${summary?.pendingWorkflowApprovals || 0} workflows waiting for approval.`,
                      isRead: false,
                      type: 'WORKFLOW',
                    }}
                    onPress={() => navigation.navigate('HRNotifications')}
                  />
                  <HRNotificationPreview
                    notification={{
                      id: 'notif-bd',
                      title: 'Milestone Celebrations',
                      body: `${summary?.upcomingBirthdays || 0} birthdays and ${summary?.upcomingWorkAnniversaries || 0} anniversaries this week.`,
                      isRead: true,
                      type: 'SYSTEM',
                    }}
                    onPress={() => navigation.navigate('UpcomingEvents')}
                  />
                </View>
              )}
            </View>
          </HRWidget>
        );

      default:
        return null;
    }
  };

  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  return (
    <HRWorkspaceScreen title="HR Dashboard">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}
        <HRDashboardHeader
          title="HR Platform Overview"
          filters={filters}
          onFilterChange={setFilters}
          onRefresh={refresh}
          isRefreshing={isRefreshing}
        />
        <HRDashboardGrid>
          {sortedWidgets.map((widget) => renderWidget(widget))}
        </HRDashboardGrid>
      </View>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  rowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  listContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
