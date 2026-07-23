import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AttendanceCard } from '../components/AttendanceCard';
import { useAttendance } from '../hooks/useAttendance';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function AttendanceDirectoryScreen() {
  const { attendanceRecords, isLoading, error } = useAttendance();

  const mockRecords = attendanceRecords.length > 0 ? attendanceRecords : [
    { id: '1', attendance_date: '2026-07-23', clock_in: '09:05', clock_out: '18:10', status: 'PRESENT' },
    { id: '2', attendance_date: '2026-07-22', clock_in: '09:20', clock_out: '18:00', status: 'HALF_DAY' },
    { id: '3', attendance_date: '2026-07-21', clock_in: '--:--', clock_out: '--:--', status: 'ABSENT' },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Daily Attendance" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <View className="p-4 border-b border-border bg-white">
        <Text className="text-textSecondary text-sm">Today's Logs</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error">{error}</Text> : null}
        
        {mockRecords.map((record) => (
          <AttendanceCard key={record.id} record={record} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
