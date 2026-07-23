import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AttendanceSummaryCard } from '../components/AttendanceSummaryCard';
import { useAttendanceSummary } from '../hooks/useAttendanceSummary';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function EmployeeAttendanceSummaryScreen({ route }) {
  const { employeeId } = route?.params || { employeeId: '123' };
  const { attendanceSummary, isLoading, error } = useAttendanceSummary(employeeId, 'MONTHLY');

  const mockSummary = attendanceSummary || {
    totalPresent: 20,
    totalAbsent: 2,
    totalLateArrivals: 3,
    totalEarlyExits: 1
  };

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Employee Summary" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        <Text className="text-textPrimary font-semibold text-base mb-2">Monthly Overview</Text>
        <AttendanceSummaryCard summary={mockSummary} />
      </ScrollView>
    </View>
  );
}
