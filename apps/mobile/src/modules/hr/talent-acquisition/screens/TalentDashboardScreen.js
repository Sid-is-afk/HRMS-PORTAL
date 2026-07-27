import React from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useTalentDashboard } from '../hooks/useTalentDashboard';
import { useHiringActivities } from '../hooks/useHiringActivities';
import TalentDashboardHeader from '../components/TalentDashboardHeader';
import RecruitmentSummaryCard from '../components/RecruitmentSummaryCard';
import HiringActivityCard from '../components/HiringActivityCard';
import RecruitmentWidget from '../components/RecruitmentWidget';
import HRDashboardGrid from '@/modules/hr/components/HRDashboardGrid';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function TalentDashboardScreen() {
  const navigation = useNavigation();
  const { summary, isLoading, isRefreshing, error, refresh } = useTalentDashboard();
  const { activities } = useHiringActivities();

  if (isLoading && !summary) {
    return (
      <HRWorkspaceScreen title="Talent Acquisition">
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading hiring console...</Text>
        </View>
      </HRWorkspaceScreen>
    );
  }

  const handleRaiseRequisition = () => {
    Alert.alert(
      'Hiring Workflow',
      'Raise Job Requisition dialog will initiate. Standard multi-stage approval routing via Workflow Engine will apply.'
    );
  };

  return (
    <HRWorkspaceScreen title="Talent Acquisition Console">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        <TalentDashboardHeader
          title="Talent Operations Center"
          onRefresh={refresh}
          isRefreshing={isRefreshing}
        />

        <View style={styles.summaryGrid}>
          <RecruitmentSummaryCard
            title="Open Requisitions"
            value={summary?.openRequisitions || 0}
            icon="file-document-multiple-outline"
            iconBg="#EFF6FF"
            iconColor="#2563EB"
            onPress={() => navigation.navigate('JobRequisitions')}
          />
          <RecruitmentSummaryCard
            title="Published Jobs"
            value={summary?.publishedJobs || 0}
            icon="bullhorn-outline"
            iconBg="#F0FDF4"
            iconColor="#16A34A"
            onPress={() => navigation.navigate('JobPostings')}
          />
          <RecruitmentSummaryCard
            title="Pending Approvals"
            value={summary?.pendingApprovals || 0}
            icon="clock-alert-outline"
            iconBg="#FEF3C7"
            iconColor="#D97706"
            onPress={() => navigation.navigate('JobRequisitions')}
          />
          <RecruitmentSummaryCard
            title="Hiring Managers"
            value={summary?.hiringManagersCount || 0}
            icon="account-tie-outline"
            iconBg="#F5F3FF"
            iconColor="#7C3AED"
          />
        </View>

        <HRDashboardGrid>
          <RecruitmentWidget id="activities" title="Recent Recruitment logs" size="medium">
            <View style={styles.list}>
              {activities.length === 0 ? (
                <Text style={styles.emptyText}>No recent activity</Text>
              ) : (
                activities.slice(0, 3).map((act) => (
                  <HiringActivityCard key={act.id} activity={act} />
                ))
              )}
              <Button 
                mode="text" 
                textColor="#2563EB" 
                style={styles.moreBtn}
                onPress={() => navigation.navigate('RecruitmentActivityFeed')}
              >
                View Full Logs
              </Button>
            </View>
          </RecruitmentWidget>

          <RecruitmentWidget id="calendar" title="Hiring Calendar (Sprint 2)" size="medium">
            <Card style={styles.calendarCard}>
              <Card.Content style={styles.calendarContent}>
                <Text style={styles.calendarText}>No interviews scheduled today.</Text>
                <Button 
                  mode="contained" 
                  buttonColor="#2563EB"
                  style={styles.raiseBtn}
                  onPress={handleRaiseRequisition}
                >
                  Raise Requisition
                </Button>
              </Card.Content>
            </Card>
          </RecruitmentWidget>
        </HRDashboardGrid>
      </View>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  list: {
    flexDirection: 'column',
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 12,
  },
  moreBtn: {
    alignSelf: 'center',
    marginTop: 8,
  },
  calendarCard: {
    backgroundColor: '#F9FAFB',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  calendarContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  calendarText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  raiseBtn: {
    borderRadius: 8,
  },
});
