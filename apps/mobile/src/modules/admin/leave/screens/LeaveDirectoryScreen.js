import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LeaveCard } from '../components/LeaveCard';
import { useLeave } from '../hooks/useLeave';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function LeaveDirectoryScreen() {
  const { leaveRequests, isLoading, error } = useLeave();

  const mockRequests = leaveRequests.length > 0 ? leaveRequests : [
    { id: '1', leave_type_name: 'Annual Leave', start_date: '2026-08-01', end_date: '2026-08-05', status: 'APPROVED', reason: 'Family vacation' },
    { id: '2', leave_type_name: 'Sick Leave', start_date: '2026-07-20', end_date: '2026-07-21', status: 'PENDING', reason: 'Fever' },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="All Leave Requests" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error">{error}</Text> : null}
        
        {mockRequests.map((request) => (
          <LeaveCard key={request.id} request={request} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
