import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { OnboardingChecklist } from '../components/OnboardingChecklist';
import { useEmployeeLifecycle } from '../hooks/useEmployeeLifecycle';
import { useLifecycleActions } from '../hooks/useLifecycleActions';

export default function OnboardingWorkspaceScreen() {
  const { onboardingTasks } = useEmployeeLifecycle();
  const { toggleOnboardingTask } = useLifecycleActions();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Onboarding Workspace" showBack={true} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Track and manage active onboarding tasks across all departments.
        </Text>
        
        {onboardingTasks.map(task => (
          <OnboardingChecklist 
            key={task.id} 
            task={task} 
            onToggle={toggleOnboardingTask}
          />
        ))}
      </ScrollView>
    </View>
  );
}
