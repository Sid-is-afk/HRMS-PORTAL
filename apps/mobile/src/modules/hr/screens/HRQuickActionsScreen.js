import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import HRWorkspaceScreen from './HRWorkspaceScreen';
import { useHRQuickActions } from '../hooks/useHRQuickActions';
import HRQuickActionCard from '../components/HRQuickActionCard';

export default function HRQuickActionsScreen() {
  const { quickActions } = useHRQuickActions();
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
          {quickActions.map((action) => (
            <HRQuickActionCard
              key={action.id}
              label={action.label}
              icon={action.icon}
              onPress={() => handleQuickAction(action)}
            />
          ))}
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
});
