import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ExecutiveMetricCard } from '../components/ExecutiveMetricCard';
import { useAnalytics } from '../hooks/useAnalytics';
import { Building2, Users, Activity } from 'lucide-react-native';

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
