import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAttendanceStore } from '../store/attendanceStore';
import { ClockInOutButton } from '../components/ClockInOutButton';
import { WorkingHoursCard } from '../components/WorkingHoursCard';
import { AttendanceStatusBadge } from '../components/AttendanceStatusBadge';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingOverlay } from '@/components/LoadingOverlay';

export default function AttendanceScreen() {
  const navigation = useNavigation();
  const { 
    currentStatus, 
    todayRecord, 
    isLoading, 
    error, 
    fetchTodayAttendance, 
    performCheckIn, 
    performCheckOut 
  } = useAttendanceStore();

  useEffect(() => {
    fetchTodayAttendance();
  }, [fetchTodayAttendance]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <View className="flex-1 bg-surface">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchTodayAttendance} />
        }
      >
        <LoadingOverlay visible={isLoading && currentStatus === 'NOT_MARKED'} />
        
        <View className="p-6 pb-2">
          <Text className="text-textSecondary font-inter text-sm mb-1">{currentDate}</Text>
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-textPrimary text-3xl font-bold font-inter tracking-tight">Attendance</Text>
            <AttendanceStatusBadge status={currentStatus} />
          </View>

          {error ? <ErrorMessage message={error} /> : null}

          <View className="bg-white p-6 rounded-3xl border border-border shadow-sm mb-6">
            <ClockInOutButton 
              status={currentStatus} 
              onCheckIn={performCheckIn} 
              onCheckOut={performCheckOut} 
              isLoading={isLoading} 
            />
          </View>
          
          {(currentStatus === 'CLOCKED_IN' || currentStatus === 'CLOCKED_OUT') && (
            <WorkingHoursCard 
              checkIn={todayRecord.checkIn} 
              checkOut={todayRecord.checkOut} 
              status={currentStatus} 
            />
          )}

          <TouchableOpacity 
            className="mt-8 bg-white p-4 rounded-xl border border-border flex-row justify-between items-center"
            onPress={() => navigation.navigate('AttendanceHistory')}
          >
            <Text className="text-textPrimary font-bold">View Attendance History</Text>
            <Text className="text-primary font-bold">→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
