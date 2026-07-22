import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { ConfigurationSummaryCard } from '../components/ConfigurationSummaryCard';
import { useNavigation } from '@react-navigation/native';
import { Clock, Calendar, ShieldCheck, Briefcase } from 'lucide-react-native';

export default function WorkforceOverviewScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Workforce Configuration" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Manage core workforce policies, shifts, and holiday calendars for the organization.
        </Text>
        
        <ConfigurationSummaryCard
          title="Shift Management"
          description="Configure shift timings, break durations, and shift templates."
          icon={Clock}
          status="3 Active Shifts"
          onPress={() => navigation.navigate('ShiftDirectory')}
        />
        
        <ConfigurationSummaryCard
          title="Holiday Calendar"
          description="Manage national, regional, and company-specific holidays."
          icon={Calendar}
          status="Calendar 2026 Set"
          onPress={() => navigation.navigate('HolidayCalendar')}
        />

        <ConfigurationSummaryCard
          title="Attendance Policies"
          description="Configure grace periods, late arrival rules, and checkout thresholds."
          icon={ShieldCheck}
          status="Standard Policy"
          onPress={() => navigation.navigate('AttendancePolicyDirectory')}
        />

        <ConfigurationSummaryCard
          title="Working Hours & Weekly Off"
          description="Define standard weekly hours and company-wide off days."
          icon={Briefcase}
          onPress={() => {}}
        />
      </ScrollView>
    </View>
  );
}
