const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'analytics');

const files = {
  'screens/ExecutiveDashboardScreen.js': `import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ExecutiveMetricCard } from '../components/ExecutiveMetricCard';
import { useAnalytics } from '../hooks/useAnalytics';
import { Building2, Users, Activity, HardDrive } from 'lucide-react-native';

export default function ExecutiveDashboardScreen() {
  const navigation = useNavigation();
  const { executiveSummary, isLoading, error, fetchExecutiveSummary } = useAnalytics();

  useEffect(() => {
    fetchExecutiveSummary();
  }, [fetchExecutiveSummary]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Executive Dashboard" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {executiveSummary && (
          <View className="flex-row flex-wrap justify-between mb-6">
            <ExecutiveMetricCard title="Active Orgs" value={executiveSummary.activeOrganizations} icon={Building2} trend="Up" />
            <ExecutiveMetricCard title="Daily Active Users" value={(executiveSummary.dailyActiveUsers / 1000).toFixed(1) + 'k'} icon={Users} trend="Up" />
            <ExecutiveMetricCard title="Monthly Users" value={(executiveSummary.monthlyActiveUsers / 1000).toFixed(1) + 'k'} icon={Users} trend="Up" />
            <ExecutiveMetricCard title="System Uptime" value={executiveSummary.systemAvailability + '%'} icon={Activity} />
          </View>
        )}

        <Text className="text-lg font-bold text-textPrimary mb-3">Insights</Text>
        <Button title="Cross-Tenant Analytics" onPress={() => navigation.navigate('CrossTenantAnalytics')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
        <Button title="Growth Dashboard" onPress={() => navigation.navigate('CrossTenantAnalytics')} styleClass="bg-white border border-border mb-6" textClass="text-textPrimary" />

        <Text className="text-lg font-bold text-textPrimary mb-3">Telemetry</Text>
        <Button title="Usage Analytics" onPress={() => navigation.navigate('UsageAnalytics')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
        <Button title="Capacity Dashboard" onPress={() => navigation.navigate('CapacityDashboard')} styleClass="bg-white border border-border mb-6" textClass="text-textPrimary" />
      </ScrollView>
    </View>
  );
}
`,

  'screens/CrossTenantAnalyticsScreen.js': `import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { TrendCard } from '../components/TrendCard';
import { useAnalytics } from '../hooks/useAnalytics';

export default function CrossTenantAnalyticsScreen() {
  const { trendMetrics, isLoading, error, fetchTrendMetrics } = useAnalytics();

  useEffect(() => {
    fetchTrendMetrics();
  }, [fetchTrendMetrics]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Growth & Analytics" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={trendMetrics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <TrendCard trend={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
`,

  'screens/UsageAnalyticsScreen.js': `import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { UsageHeatmap } from '../components/UsageHeatmap';
import { useAnalytics } from '../hooks/useAnalytics';

export default function UsageAnalyticsScreen() {
  const { usageMetrics, isLoading, error, fetchUsageMetrics } = useAnalytics();

  useEffect(() => {
    fetchUsageMetrics();
  }, [fetchUsageMetrics]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Usage Analytics" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={usageMetrics}
        keyExtractor={(item) => item.feature}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <UsageHeatmap metric={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
`,

  'screens/CapacityDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function CapacityDashboardScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Capacity & Forecasts" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
        <Text className="text-textPrimary text-lg font-bold mb-4 mt-20">Analytics Placeholder</Text>
        <Text className="text-textSecondary text-center">
          Detailed metrics for Storage Utilization, API Quotas, and AI Recommendations will be rendered here.
        </Text>
      </ScrollView>
    </View>
  );
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Analytics screen files created successfully.');
