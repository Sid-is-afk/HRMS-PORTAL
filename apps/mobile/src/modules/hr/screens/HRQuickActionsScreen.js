import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HRWorkspaceScreen from './HRWorkspaceScreen';
import { useHRQuickActions } from '../hooks/useHRQuickActions';
import HRQuickActionCard from '../components/HRQuickActionCard';

export default function HRQuickActionsScreen() {
  const { quickActions, isLoading } = useHRQuickActions();
  const navigation = useNavigation();

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

  return (
    <HRWorkspaceScreen title="HR Quick Actions">
      <View style={styles.container}>
        <Text style={styles.subtitle}>Direct shortcuts for initiating common workflows, candidate creation, and documents uploads.</Text>
        <View style={styles.grid}>
          {isLoading && (!quickActions || quickActions.length === 0) ? (
            <>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <View key={i} style={styles.skeletonCard}>
                  <View style={styles.skeletonIcon} />
                  <View style={styles.skeletonText} />
                </View>
              ))}
            </>
          ) : quickActions && quickActions.length > 0 ? (
            quickActions.map((action) => (
              <HRQuickActionCard
                key={action.id}
                label={action.label}
                icon={action.icon}
                onPress={() => handleQuickAction(action)}
              />
            ))
          ) : (
            <View style={styles.emptyQuickActions}>
              <MaterialCommunityIcons name="lightning-bolt-outline" size={32} color="#9CA3AF" />
              <Text style={styles.emptyQuickActionsText}>No quick actions available.</Text>
            </View>
          )}
        </View>
      </View>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emptyQuickActions: {
    flex: 1,
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyQuickActionsText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  skeletonCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    flex: 1,
    minWidth: 110,
    marginBottom: 8,
  },
  skeletonIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },
  skeletonText: {
    width: 60,
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
});
