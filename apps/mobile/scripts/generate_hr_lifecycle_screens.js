const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'employee-lifecycle');

const files = {
  'screens/LifecycleDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { Users, CheckSquare, Shield } from 'lucide-react-native';

export default function LifecycleDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Employee Lifecycle" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Manage employee conversions, onboarding processes, and probation tracking.
        </Text>
        
        <View className="mb-4">
          <Button 
            title="Candidate Conversions" 
            onPress={() => navigation.navigate('EmployeeConversion')} 
            styleClass="bg-primary"
            icon={<Users size={20} color="white" />}
          />
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Button 
              title="Onboarding" 
              onPress={() => navigation.navigate('OnboardingWorkspace')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<CheckSquare size={16} color="#64748B" />}
            />
          </View>
          <View className="flex-1 ml-2">
            <Button 
              title="Probation Tracking" 
              onPress={() => navigation.navigate('ProbationTracker')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<Shield size={16} color="#64748B" />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
`,

  'screens/EmployeeConversionScreen.js': `import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { EmployeeConversionCard } from '../components/EmployeeConversionCard';
import { useEmployeeLifecycle } from '../hooks/useEmployeeLifecycle';

export default function EmployeeConversionScreen() {
  const { conversions, isLoading, error } = useEmployeeLifecycle();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Candidate Conversion" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={conversions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <EmployeeConversionCard 
            conversion={item} 
            onPress={() => console.log('View conversion details')}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No pending conversions.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/OnboardingWorkspaceScreen.js': `import React from 'react';
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
`,

  'screens/ProbationTrackerScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { ProbationCard } from '../components/ProbationCard';
import { useEmployeeLifecycle } from '../hooks/useEmployeeLifecycle';

export default function ProbationTrackerScreen() {
  const { probations } = useEmployeeLifecycle();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Probation Tracking" showBack={true} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Monitor employees currently on probation and prepare for confirmation reviews.
        </Text>
        
        {probations.map(probation => (
          <ProbationCard key={probation.id} probation={probation} />
        ))}
      </ScrollView>
    </View>
  );
}
`,

  'screens/ConfirmationCenterScreen.js': `import React from 'react';
import { View, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function ConfirmationCenterScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Confirmation Center" showBack={true} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-textSecondary text-center">
          Confirmation center placeholder.
        </Text>
      </View>
    </View>
  );
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Lifecycle screen files created successfully.');
