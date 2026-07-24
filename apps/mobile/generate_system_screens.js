const fs = require('fs');
const path = require('path');

const screensDir = path.join('src', 'modules', 'admin', 'system', 'screens');

const screens = {
  'SystemDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { Activity, Settings, Flag, Shield } from 'lucide-react-native';

export default function SystemDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="System Administration" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Govern application settings, monitor health, and review audit logs.
        </Text>
        
        <View className="mb-4">
          <Button 
            title="System Health" 
            onPress={() => navigation.navigate('SystemHealth')} 
            styleClass="bg-primary"
            icon={<Activity size={20} color="white" />}
          />
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Button 
              title="Settings" 
              onPress={() => navigation.navigate('ApplicationSettings')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<Settings size={16} color="#64748B" />}
            />
          </View>
          <View className="flex-1 ml-2">
            <Button 
              title="Feature Flags" 
              onPress={() => navigation.navigate('FeatureFlags')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<Flag size={16} color="#0EA5E9" />}
            />
          </View>
        </View>

        <View className="mb-4">
          <Button 
            title="Audit & Activity Logs" 
            onPress={() => navigation.navigate('AuditLogs')} 
            styleClass="bg-surface border border-border"
            textClass="text-textPrimary"
            icon={<Shield size={20} color="#8B5CF6" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
`,

  'FeatureFlagsScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { FeatureFlagCard } from '../components/FeatureFlagCard';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function FeatureFlagsScreen() {
  const { featureFlags, isLoading, error, toggleFeatureFlag } = useFeatureFlags();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Feature Flags" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        <Text className="text-textSecondary text-sm mb-4">
          Toggle experimental features across the application.
        </Text>
        
        {featureFlags.map((flag) => (
          <FeatureFlagCard 
            key={flag.id} 
            featureFlag={flag} 
            onToggle={toggleFeatureFlag} 
          />
        ))}
      </ScrollView>
    </View>
  );
}
`,

  'SystemHealthScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { HealthStatusCard } from '../components/HealthStatusCard';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function SystemHealthScreen() {
  const { healthMetrics, isLoading, error } = useSystemHealth();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="System Health" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {healthMetrics.map((metric, index) => (
          <HealthStatusCard key={index} metric={metric} />
        ))}
      </ScrollView>
    </View>
  );
}
`,

  'AuditLogsScreen.js': `import React from 'react';
import { View, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function AuditLogsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Audit Logs" showBack={true} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-textSecondary text-center">
          Audit log viewer placeholder. Will contain searchable data table for system events.
        </Text>
      </View>
    </View>
  );
}
`,

  'ApplicationSettingsScreen.js': `import React from 'react';
import { View, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function ApplicationSettingsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Application Settings" showBack={true} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-textSecondary text-center">
          Application settings configuration center placeholder.
        </Text>
      </View>
    </View>
  );
}
`
};

for (const [filename, content] of Object.entries(screens)) {
  fs.writeFileSync(path.join(screensDir, filename), content);
}
console.log('Screens created successfully.');
