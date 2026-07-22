import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AttendancePolicyCard } from '../components/AttendancePolicyCard';
import { useAttendancePolicies } from '../hooks/useAttendancePolicies';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { Button } from '@/shared/components/Button';
import { Plus } from 'lucide-react-native';

export default function AttendancePolicyDirectoryScreen() {
  const { attendancePolicies, isLoading, error } = useAttendancePolicies();

  const mockPolicies = attendancePolicies.length > 0 ? attendancePolicies : [
    { id: '1', name: 'Standard Policy', graceIn: 15, graceOut: 0, lateArrivalThreshold: 15 },
    { id: '2', name: 'Strict Policy (Contractors)', graceIn: 5, graceOut: 5, lateArrivalThreshold: 5 },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Attendance Policies" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <View className="p-4 border-b border-border bg-white flex-row justify-between items-center">
        <Text className="text-textSecondary text-sm">Global & Custom Policies</Text>
        <Button title="Create Policy" onPress={() => {}} icon={<Plus size={16} color="white" />} styleClass="py-2 px-3" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error">{error}</Text> : null}
        
        {mockPolicies.map((policy) => (
          <AttendancePolicyCard key={policy.id} policy={policy} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
