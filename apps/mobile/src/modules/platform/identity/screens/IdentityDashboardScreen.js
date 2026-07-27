import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformSummaryCard } from '../../components/PlatformSummaryCard';
import { useIdentity } from '../hooks/useIdentity';
import { ShieldCheck, Users, MonitorSmartphone, AlertTriangle } from 'lucide-react-native';

export default function IdentityDashboardScreen() {
  const navigation = useNavigation();
  const { dashboardSummary, isLoading, error, fetchDashboard } = useIdentity();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Identity & Trust Dashboard" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {dashboardSummary && (
          <View className="flex-row flex-wrap justify-between mb-6">
            <PlatformSummaryCard title="Platform Users" value={dashboardSummary.activeUsers} icon={Users} />
            <PlatformSummaryCard title="Global Roles" value={dashboardSummary.globalRoles} icon={ShieldCheck} />
            <PlatformSummaryCard title="Active Sessions" value={dashboardSummary.activeSessions} status="Healthy" icon={MonitorSmartphone} />
            <PlatformSummaryCard title="Alerts" value={dashboardSummary.suspiciousLogins} status={dashboardSummary.suspiciousLogins > 0 ? 'Degraded' : 'Healthy'} icon={AlertTriangle} />
          </View>
        )}

        <Text className="text-lg font-bold text-textPrimary mb-3">Governance</Text>
        <Button title="Platform Users" onPress={() => navigation.navigate('PlatformUsers')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
        <Button title="Global Roles" onPress={() => navigation.navigate('GlobalRoles')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
        <Button title="Permission Explorer" onPress={() => navigation.navigate('PermissionExplorer')} styleClass="bg-white border border-border mb-6" textClass="text-textPrimary" />

        <Text className="text-lg font-bold text-textPrimary mb-3">Security</Text>
        <Button title="Session Center" onPress={() => navigation.navigate('SessionCenter')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
        <Button title="Authentication Policies" onPress={() => navigation.navigate('AuthenticationPolicies')} styleClass="bg-white border border-border mb-3" textClass="text-textPrimary" />
      </ScrollView>
    </View>
  );
}
