import React from 'react';
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
