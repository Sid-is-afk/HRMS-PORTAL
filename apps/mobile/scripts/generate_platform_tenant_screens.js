const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'tenant');

const files = {
  'screens/TenantDashboardScreen.js': `import React, { useEffect } from 'react';
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
`,

  'screens/TenantDirectoryScreen.js': `import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { TenantCard } from '../components/TenantCard';
import { useTenants } from '../hooks/useTenants';

export default function TenantDirectoryScreen() {
  const navigation = useNavigation();
  const { tenants, isLoading, error, fetchTenants } = useTenants();

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handlePress = (tenant) => {
    navigation.navigate('TenantDetails', { tenantId: tenant.id });
  };

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Tenant Directory" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <TenantCard tenant={item} onPress={handlePress} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No tenants found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/TenantDetailsScreen.js': `import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { TenantTimeline } from '../components/TenantTimeline';
import { useTenants } from '../hooks/useTenants';
import { useRoute } from '@react-navigation/native';
import { TenantStatusBadge } from '../components/TenantStatusBadge';

export default function TenantDetailsScreen() {
  const route = useRoute();
  const { tenantId } = route.params || {};
  const { selectedTenant, lifecycleEvents, isLoading, error, getTenantDetails } = useTenants();

  useEffect(() => {
    if (tenantId) getTenantDetails(tenantId);
  }, [tenantId]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Tenant Profile" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {selectedTenant && (
          <>
            <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-textPrimary">{selectedTenant.name}</Text>
                <TenantStatusBadge status={selectedTenant.status} />
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-textSecondary text-sm">Org Code:</Text>
                <Text className="text-textPrimary text-sm font-medium">{selectedTenant.orgCode}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-textSecondary text-sm">Industry:</Text>
                <Text className="text-textPrimary text-sm font-medium">{selectedTenant.industry}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-textSecondary text-sm">Contact:</Text>
                <Text className="text-textPrimary text-sm font-medium">{selectedTenant.primaryContact}</Text>
              </View>
            </View>

            <TenantTimeline events={lifecycleEvents} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
`,

  'screens/ProvisioningWizardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { Button } from '@/shared/components/Button';
import { useNavigation } from '@react-navigation/native';

export default function ProvisioningWizardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Provision New Tenant" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textPrimary text-lg font-bold mb-4">Provisioning Setup</Text>
        <Text className="text-textSecondary mb-6">Complete the workflow to initialize a new tenant, assign default modules, and setup the primary admin account.</Text>
        
        <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-6 items-center py-10">
          <Text className="text-textSecondary">[ Wizard Form Placeholder ]</Text>
        </View>

        <Button title="Start Provisioning" onPress={() => navigation.goBack()} styleClass="bg-primary" />
      </ScrollView>
    </View>
  );
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Tenant Lifecycle screen files created successfully.');
