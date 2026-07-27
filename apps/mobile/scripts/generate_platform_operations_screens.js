const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'operations');

const files = {
  'screens/OperationsDashboardScreen.js': `import React, { useEffect } from 'react';
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
            <PlatformSummaryCard title="Platform Uptime" value={\`\${dashboardSummary.uptimePercentage}%\`} icon={Activity} status="Healthy" />
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
`,

  'screens/HealthCenterScreen.js': `import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { HealthStatusCard } from '../components/HealthStatusCard';
import { useOperations } from '../hooks/useOperations';

export default function HealthCenterScreen() {
  const { services, isLoading, error, fetchServices } = useOperations();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Health Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <HealthStatusCard service={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
`,

  'screens/IncidentCenterScreen.js': `import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { IncidentCard } from '../components/IncidentCard';
import { useOperations } from '../hooks/useOperations';

export default function IncidentCenterScreen() {
  const { incidents, isLoading, error, fetchIncidents } = useOperations();

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Incident Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <IncidentCard incident={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
`,

  'screens/LogCenterScreen.js': `import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { LogViewer } from '../components/LogViewer';
import { useOperations } from '../hooks/useOperations';

export default function LogCenterScreen() {
  const { logs, isLoading, error, fetchLogs } = useOperations();

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <View className="flex-1 bg-[#1E293B]">
      <TopHeader title="Log Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <View className="p-3 bg-[#0F172A]">
        <Text className="text-[#94A3B8] text-xs font-mono">Live Tailing Enabled - platform.prod.logs</Text>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => <LogViewer log={item} />}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
      />
    </View>
  );
}
`,

  'screens/ApiStatusScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function ApiStatusScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Status Workspace" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
        <Text className="text-textPrimary text-lg font-bold mb-4 mt-20">Monitoring Placeholder</Text>
        <Text className="text-textSecondary text-center">
          API Availability, Queue Status, Background Jobs, and Audit Events will be orchestrated from this central routing hub.
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
console.log('Operations screen files created successfully.');
