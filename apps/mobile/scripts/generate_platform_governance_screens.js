const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'governance');

const files = {
  'screens/GovernanceDashboardScreen.js': `import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformSummaryCard } from '../../components/PlatformSummaryCard';
import { useGovernance } from '../hooks/useGovernance';
import { Settings, Settings2, Package, CreditCard } from 'lucide-react-native';

export default function GovernanceDashboardScreen() {
  const navigation = useNavigation();
  const { dashboardSummary, isLoading, error, fetchDashboard } = useGovernance();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Platform Governance" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {dashboardSummary && (
          <View className="flex-row flex-wrap justify-between mb-6">
            <PlatformSummaryCard title="Active Features" value={dashboardSummary.activeFeatures} icon={Settings2} />
            <PlatformSummaryCard title="Platform Modules" value={dashboardSummary.totalModules} icon={Package} />
            <PlatformSummaryCard title="Subscriptions" value={dashboardSummary.activeSubscriptions} icon={CreditCard} />
            <PlatformSummaryCard title="Platform Settings" value="Healthy" status="Synced" icon={Settings} />
          </View>
        )}

        <Text className="text-lg font-bold text-textPrimary mb-3">Feature Flags & Modules</Text>
        <Button title="Feature Management" onPress={() => navigation.navigate('FeatureManagement')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
        <Button title="Module Catalog" onPress={() => navigation.navigate('ModuleCatalog')} styleClass="bg-white border border-border mb-6" textClass="text-textPrimary" />

        <Text className="text-lg font-bold text-textPrimary mb-3">Commercials</Text>
        <Button title="Subscription Plans" onPress={() => navigation.navigate('SubscriptionCenter')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
        <Button title="License Center" onPress={() => navigation.navigate('PlatformConfiguration')} styleClass="bg-white border border-border mb-6" textClass="text-textPrimary" />

        <Text className="text-lg font-bold text-textPrimary mb-3">Global Configuration</Text>
        <Button title="Platform Defaults" onPress={() => navigation.navigate('PlatformConfiguration')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
      </ScrollView>
    </View>
  );
}
`,

  'screens/FeatureManagementScreen.js': `import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { FeatureCard } from '../components/FeatureCard';
import { useGovernance } from '../hooks/useGovernance';
import { useGovernanceStore } from '../store/governanceStore';

export default function FeatureManagementScreen() {
  const { features, isLoading, error, fetchFeatures } = useGovernance();
  const setFeatures = useGovernanceStore(state => state.setFeatures);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const handleToggle = (id, val) => {
    const updated = features.map(f => f.id === id ? { ...f, enabled: val } : f);
    setFeatures(updated);
  };

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Feature Management" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <FeatureCard feature={item} onToggle={handleToggle} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
`,

  'screens/ModuleCatalogScreen.js': `import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ModuleCard } from '../components/ModuleCard';
import { useGovernance } from '../hooks/useGovernance';

export default function ModuleCatalogScreen() {
  const { modules, isLoading, error, fetchModules } = useGovernance();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Module Catalog" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={modules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ModuleCard module={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
`,

  'screens/SubscriptionCenterScreen.js': `import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { useGovernance } from '../hooks/useGovernance';

export default function SubscriptionCenterScreen() {
  const { subscriptions, isLoading, error, fetchSubscriptions } = useGovernance();

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Subscription Plans" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {subscriptions.map(sub => (
          <SubscriptionCard key={sub.id} plan={sub} />
        ))}
      </ScrollView>
    </View>
  );
}
`,

  'screens/PlatformConfigurationScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function PlatformConfigurationScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Configuration Workspace" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
        <Text className="text-textPrimary text-lg font-bold mb-4 mt-20">Settings Placeholder</Text>
        <Text className="text-textSecondary text-center">
          Localization, Branding, Compliance, and Maintenance forms will be orchestrated from this central routing hub.
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
console.log('Governance screen files created successfully.');
