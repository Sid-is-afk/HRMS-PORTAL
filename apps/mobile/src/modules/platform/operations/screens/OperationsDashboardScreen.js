import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformSummaryCard } from '../../components/PlatformSummaryCard';
import { useOperations } from '../hooks/useOperations';
import { Activity, AlertTriangle, Terminal, GitMerge } from 'lucide-react-native';

export default function OperationsDashboardScreen() {
  const navigation = useNavigation();
  const { dashboardSummary, isLoading, error, fetchDashboard } = useOperations();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Platform Operations" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {dashboardSummary && (
          <View className="flex-row flex-wrap justify-between mb-6">
            <PlatformSummaryCard title="Platform Uptime" value={`${dashboardSummary.uptimePercentage}%`} icon={Activity} status="Healthy" />
            <PlatformSummaryCard title="Open Incidents" value={dashboardSummary.openIncidents} icon={AlertTriangle} status={dashboardSummary.openIncidents > 0 ? 'Degraded' : 'Healthy'} />
            <PlatformSummaryCard title="Pending Jobs" value={dashboardSummary.pendingJobs} icon={GitMerge} />
            <PlatformSummaryCard title="Warning Services" value={dashboardSummary.warningServices} icon={Terminal} />
          </View>
        )}

        <Text className="text-lg font-bold text-textPrimary mb-3">Monitoring</Text>
        <Button title="Health Center" onPress={() => navigation.navigate('HealthCenter')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
        <Button title="Incident Center" onPress={() => navigation.navigate('IncidentCenter')} styleClass="bg-white border border-border mb-6" textClass="text-textPrimary" />

        <Text className="text-lg font-bold text-textPrimary mb-3">Observability</Text>
        <Button title="Log Center" onPress={() => navigation.navigate('LogCenter')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
        <Button title="API Status" onPress={() => navigation.navigate('ApiStatus')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
        <Button title="Queue Status" onPress={() => navigation.navigate('ApiStatus')} styleClass="bg-white border border-border mb-6" textClass="text-textPrimary" />

        <Text className="text-lg font-bold text-textPrimary mb-3">Auditing</Text>
        <Button title="Audit Center" onPress={() => navigation.navigate('ApiStatus')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
      </ScrollView>
    </View>
  );
}
