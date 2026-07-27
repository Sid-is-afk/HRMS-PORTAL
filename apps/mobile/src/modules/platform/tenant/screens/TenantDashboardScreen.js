import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformSummaryCard } from '../../components/PlatformSummaryCard';
import { useTenants } from '../hooks/useTenants';
import { Building, Building2, ShieldAlert, Archive, RefreshCw } from 'lucide-react-native';

export default function TenantDashboardScreen() {
  const navigation = useNavigation();
  const { dashboardSummary, isLoading, error, fetchDashboard } = useTenants();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Tenant Lifecycle Dashboard" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {dashboardSummary && (
          <View className="flex-row flex-wrap justify-between mb-6">
            <PlatformSummaryCard title="Total Tenants" value={dashboardSummary.totalTenants} icon={Building} />
            <PlatformSummaryCard title="Active" value={dashboardSummary.activeTenants} status="Healthy" icon={Building2} />
            <PlatformSummaryCard title="Provisioning" value={dashboardSummary.provisioning} status="Degraded" icon={RefreshCw} />
            <PlatformSummaryCard title="Suspended" value={dashboardSummary.suspended} status="Offline" icon={ShieldAlert} />
            <PlatformSummaryCard title="Archived" value={dashboardSummary.archived} icon={Archive} />
          </View>
        )}

        <Button 
          title="Tenant Directory" 
          onPress={() => navigation.navigate('TenantDirectory')} 
          styleClass="bg-primary mb-4" 
        />
        <Button 
          title="Provision New Tenant" 
          onPress={() => navigation.navigate('ProvisioningWizard')} 
          styleClass="bg-surface border border-border" 
          textClass="text-textPrimary" 
        />
      </ScrollView>
    </View>
  );
}
