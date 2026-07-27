import React, { useEffect } from 'react';
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
