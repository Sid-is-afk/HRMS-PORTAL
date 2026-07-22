import React, { useEffect } from 'react';
import { ScrollView, View, RefreshControl, Text, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDashboardStore } from '@/modules/employee/dashboard/store/dashboardStore';
import { useAuthStore } from '@/core/auth/authStore';
import { GreetingHeader } from '../components/GreetingHeader';
import { SummaryCard } from '../components/SummaryCard';
import { QuickActionCard } from '../components/QuickActionCard';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const { 
    summary, 
    announcements, 
    isLoading, 
    isRefreshing, 
    error, 
    fetchDashboardData, 
    refreshDashboardData 
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading && !summary) {
    return (
      <View style={{ flex: 1 }} className="bg-surface">
        <LoadingOverlay visible={true} message="Loading Dashboard..." />
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1 }}
      className="bg-surface"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl 
          refreshing={isRefreshing} 
          onRefresh={refreshDashboardData} 
          colors={["#2563EB"]}
          tintColor="#2563EB"
        />
      }
    >
      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <GreetingHeader user={user} />
      </Animated.View>

      {error ? (
        <Animated.View entering={FadeInDown.duration(300)} className="px-4 mt-2">
          <ErrorMessage message={error} />
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInUp.duration(500).delay(200)} layout={Layout.springify()}>
        <SectionHeader title="Overview" />
        <View className="flex-row px-4 justify-between mb-2">
          <SummaryCard title="Today's Attendance" data={summary?.attendance} type="attendance" />
          <SummaryCard title="Leave Balance" data={summary?.leaveBalance} type="leave" />
        </View>

        <SectionHeader title="Quick Actions" />
        <View className="flex-row px-4 justify-between mb-4">
          <QuickActionCard 
            title="Attendance" 
            iconName="time" 
            onPress={() => navigation.navigate('Attendance')} 
          />
          <QuickActionCard 
            title="Leave" 
            iconName="calendar" 
            onPress={() => navigation.navigate('Leave')} 
          />
          <QuickActionCard 
            title="Profile" 
            iconName="person" 
            onPress={() => navigation.navigate('Profile')} 
          />
        </View>

        <SectionHeader title="Recent Announcements" onAction={() => {}} actionTitle="See All" />
        <View className="px-4 pb-12">
          {announcements && announcements.length > 0 ? (
            announcements.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInUp.duration(400).delay(300 + (index * 100))}>
                <AnnouncementCard announcement={item} />
              </Animated.View>
            ))
          ) : (
            <Animated.View entering={FadeInUp.duration(400).delay(300)} className="items-center justify-center p-10 bg-white rounded-3xl border-2 border-border border-dashed shadow-sm mt-2">
              <View className="w-16 h-16 bg-surface rounded-full items-center justify-center mb-4">
                <Text className="text-textSecondary text-3xl">📭</Text>
              </View>
              <Text className="text-textPrimary text-base font-bold font-inter mb-1">You're all caught up!</Text>
              <Text className="text-textSecondary font-inter text-center text-sm">No new announcements from HR right now.</Text>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
}
