const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform');

const files = {
  'screens/PlatformDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformSummaryCard } from '../components/PlatformSummaryCard';
import { PlatformQuickActionCard } from '../components/PlatformQuickActionCard';
import { PlatformActivityCard } from '../components/PlatformActivityCard';
import { usePlatformDashboard } from '../hooks/usePlatformDashboard';
import { Building2, Users, Activity, Bell, Search, Settings } from 'lucide-react-native';

export default function PlatformDashboardScreen() {
  const navigation = useNavigation();
  const { dashboardSummary, activities, isLoading, error } = usePlatformDashboard();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Platform Global Dashboard" showBack={false} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {dashboardSummary && (
          <View className="flex-row flex-wrap justify-between mb-4">
            <PlatformSummaryCard title="Organizations" value={dashboardSummary.totalOrganizations} icon={Building2} />
            <PlatformSummaryCard title="Platform Users" value={dashboardSummary.platformUsers} icon={Users} />
            <PlatformSummaryCard title="System Health" value={dashboardSummary.systemHealth} status={dashboardSummary.systemHealth} icon={Activity} />
            <PlatformSummaryCard title="API Status" value={dashboardSummary.apiHealth} status={dashboardSummary.apiHealth} icon={Activity} />
          </View>
        )}

        <Text className="text-lg font-bold text-textPrimary mb-3">Quick Actions</Text>
        <View className="flex-row justify-between mb-6">
          <PlatformQuickActionCard label="Search" icon={Search} onPress={() => navigation.navigate('GlobalSearch')} />
          <PlatformQuickActionCard label="Notifications" icon={Bell} onPress={() => navigation.navigate('PlatformNotifications')} />
          <PlatformQuickActionCard label="Overview" icon={Activity} onPress={() => navigation.navigate('PlatformOverview')} />
          <PlatformQuickActionCard label="Settings" icon={Settings} onPress={() => console.log('Settings placeholder')} />
        </View>

        <Text className="text-lg font-bold text-textPrimary mb-3">Recent Activity</Text>
        {activities.map(activity => (
          <PlatformActivityCard key={activity.id} activity={activity} />
        ))}
      </ScrollView>
    </View>
  );
}
`,

  'screens/PlatformNotificationsScreen.js': `import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformNotificationCard } from '../components/PlatformNotificationCard';
import { usePlatformDashboard } from '../hooks/usePlatformDashboard';

export default function PlatformNotificationsScreen() {
  const { notifications, isLoading, error } = usePlatformDashboard();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Global Notifications" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <PlatformNotificationCard notification={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No notifications.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/GlobalSearchScreen.js': `import React from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { Search } from 'lucide-react-native';
import { usePlatformStore } from '../store/platformStore';

export default function GlobalSearchScreen() {
  const { searchQuery, setSearchQuery } = usePlatformStore();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Global Search" showBack={true} />
      
      <View className="p-4 border-b border-border bg-white">
        <View className="flex-row items-center bg-surface p-3 rounded-lg border border-border">
          <Search size={20} color="#94A3B8" className="mr-2" />
          <TextInput
            placeholder="Search organizations, users, logs..."
            className="flex-1 text-textPrimary"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
        <Text className="text-textSecondary mt-10">Enter a query to search the global platform.</Text>
      </ScrollView>
    </View>
  );
}
`,

  'screens/PlatformOverviewScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformSummaryCard } from '../components/PlatformSummaryCard';
import { usePlatformDashboard } from '../hooks/usePlatformDashboard';

export default function PlatformOverviewScreen() {
  const { dashboardSummary, isLoading } = usePlatformDashboard();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Platform Overview" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {dashboardSummary && (
          <>
            <PlatformSummaryCard title="Version" value={dashboardSummary.platformVersion} />
            <Text className="text-textSecondary mt-4">More overview analytics will be placed here.</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Platform screen files created successfully.');
