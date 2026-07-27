const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'identity');

const files = {
  'screens/IdentityDashboardScreen.js': `import React, { useEffect } from 'react';
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
`,

  'screens/PlatformUsersScreen.js': `import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformUserCard } from '../components/PlatformUserCard';
import { useIdentity } from '../hooks/useIdentity';

export default function PlatformUsersScreen() {
  const { platformUsers, isLoading, error, fetchUsers } = useIdentity();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Platform Users" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={platformUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <PlatformUserCard user={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No platform users found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/GlobalRolesScreen.js': `import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { RoleCard } from '../components/RoleCard';
import { useIdentity } from '../hooks/useIdentity';

export default function GlobalRolesScreen() {
  const { globalRoles, isLoading, error, fetchRoles } = useIdentity();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Global Roles" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={globalRoles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <RoleCard role={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
`,

  'screens/PermissionExplorerScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function PermissionExplorerScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Permission Explorer" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
        <Text className="text-textPrimary text-lg font-bold mb-4">Permission Matrix Placeholder</Text>
        <Text className="text-textSecondary text-center">A comprehensive view of all modular permissions available across HR, Admin, and Platform domains will be rendered here.</Text>
      </ScrollView>
    </View>
  );
}
`,

  'screens/SessionCenterScreen.js': `import React, { useEffect } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { SessionCard } from '../components/SessionCard';
import { useIdentity } from '../hooks/useIdentity';

export default function SessionCenterScreen() {
  const { sessions, isLoading, error, fetchSessions } = useIdentity();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevoke = (id) => {
    Alert.alert("Revoke Session", \`Revoking session \${id} placeholder action.\`);
  };

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Session Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <SessionCard session={item} onRevoke={handleRevoke} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
`,

  'screens/AuthenticationPoliciesScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function AuthenticationPoliciesScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Auth Policies" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
          <Text className="text-textPrimary font-bold mb-2">Password Policy</Text>
          <Text className="text-textSecondary text-sm mb-1">• Minimum Length: 12</Text>
          <Text className="text-textSecondary text-sm mb-1">• Require Special Characters: Yes</Text>
          <Text className="text-textSecondary text-sm mb-1">• Expiration: 90 Days</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
          <Text className="text-textPrimary font-bold mb-2">Session Policy</Text>
          <Text className="text-textSecondary text-sm mb-1">• Idle Timeout: 15 Minutes</Text>
          <Text className="text-textSecondary text-sm mb-1">• Max Duration: 12 Hours</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
          <Text className="text-textPrimary font-bold mb-2">MFA Policy</Text>
          <Text className="text-textSecondary text-sm">Enforced for all Super Admins.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Identity screen files created successfully.');
