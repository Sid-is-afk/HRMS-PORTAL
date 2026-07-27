import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useInterviewDashboard } from '../hooks/useInterviewDashboard';
import InterviewCard from '../components/InterviewCard';
import HRDashboardGrid from '@/modules/hr/components/HRDashboardGrid';
import RecruitmentWidget from '../../components/RecruitmentWidget';
import RecruitmentSummaryCard from '../../components/RecruitmentSummaryCard';

export default function InterviewDashboardScreen() {
  const navigation = useNavigation();
  const { dashboard, isLoading } = useInterviewDashboard();

  if (isLoading && !dashboard) {
    return (
      <HRWorkspaceScreen title="Interview Dashboard">
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading interview dashboard...</Text>
        </View>
      </HRWorkspaceScreen>
    );
  }

  const handleSelectInterview = (intId, candId) => {
    navigation.navigate('InterviewDetails', { interviewId: intId, candidateId: candId });
  };

  return (
    <HRWorkspaceScreen title="Interview Management Console">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.summaryRow}>
          <RecruitmentSummaryCard
            title="Active Candidates"
            value={dashboard?.activeCandidates || 0}
            icon="account-multiple-outline"
            iconBg="#EFF6FF"
            iconColor="#2563EB"
            onPress={() => navigation.navigate('CandidateDirectory')}
          />
          <RecruitmentSummaryCard
            title="Feedback Pending"
            value={dashboard?.pendingFeedback || 0}
            icon="clipboard-text-play-outline"
            iconBg="#FEF3C7"
            iconColor="#D97706"
          />
          <RecruitmentSummaryCard
            title="Hiring Velocity"
            value={`${dashboard?.hiringVelocity || 0}d`}
            icon="speedometer"
            iconBg="#F0FDF4"
            iconColor="#16A34A"
          />
          <RecruitmentSummaryCard
            title="Offers Pending"
            value={dashboard?.offersPending || 0}
            icon="file-certificate-outline"
            iconBg="#F5F3FF"
            iconColor="#7C3AED"
          />
        </View>

        <View style={styles.calendarTriggerSection}>
          <Button 
            mode="contained" 
            buttonColor="#2563EB" 
            style={styles.calendarBtn} 
            onPress={() => navigation.navigate('InterviewCalendar')}
          >
            Launch Interview Calendar
          </Button>
        </View>

        <View style={styles.stageBreakdownSection}>
          <Text style={styles.sectionTitle}>Candidates by Stage</Text>
          <View style={styles.breakdownGrid}>
            {Object.entries(dashboard?.candidatesByStage || {}).map(([stage, count]) => (
              <View key={stage} style={styles.breakdownCard}>
                <Text style={styles.breakdownCount}>{count}</Text>
                <Text style={styles.breakdownLabel}>{stage}</Text>
              </View>
            ))}
          </View>
        </View>

        <HRDashboardGrid>
          <RecruitmentWidget id="upcoming-interviews" title="Upcoming Panels" size="medium">
            <View style={styles.list}>
              {dashboard?.upcomingInterviews.length === 0 ? (
                <Text style={styles.emptyText}>No interviews scheduled today.</Text>
              ) : (
                dashboard?.upcomingInterviews.map((int) => (
                  <InterviewCard
                    key={int.id}
                    interview={int}
                    onPress={() => handleSelectInterview(int.id, int.candidateId)}
                  />
                ))
              )}
            </View>
          </RecruitmentWidget>

          <RecruitmentWidget id="recent-activities" title="Recent Activity Log" size="medium">
            <View style={styles.timeline}>
              {dashboard?.recentActivities.length === 0 ? (
                <Text style={styles.emptyText}>No recent activity.</Text>
              ) : (
                dashboard?.recentActivities.map((act) => {
                  const formattedTime = new Date(act.timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <View key={act.id} style={styles.activityItem}>
                      <View style={styles.activityDot} />
                      <View style={styles.activityContent}>
                        <Text style={styles.activityDesc}>{act.description}</Text>
                        <Text style={styles.activityMeta}>{act.performedBy} • {formattedTime}</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </RecruitmentWidget>
        </HRDashboardGrid>
      </ScrollView>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarTriggerSection: {
    marginBottom: 20,
  },
  calendarBtn: {
    borderRadius: 8,
    elevation: 0,
  },
  stageBreakdownSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  breakdownCard: {
    backgroundColor: '#F3F4F6',
    flex: 1,
    minWidth: '22%',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  breakdownCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  breakdownLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  list: {
    flexDirection: 'column',
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 16,
  },
  timeline: {
    flexDirection: 'column',
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityDesc: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  activityMeta: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
