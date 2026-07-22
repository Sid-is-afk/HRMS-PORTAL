import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { ShiftCard } from '../components/ShiftCard';
import { useShifts } from '../hooks/useShifts';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { Button } from '@/shared/components/Button';
import { Plus } from 'lucide-react-native';

export default function ShiftDirectoryScreen() {
  const { shifts, isLoading, error } = useShifts();

  // Mock data to ensure screen renders if API is empty
  const mockShifts = shifts.length > 0 ? shifts : [
    { id: '1', name: 'Morning Shift', type: 'Standard', startTime: '09:00', endTime: '18:00', color: '#3B82F6', status: 'ACTIVE' },
    { id: '2', name: 'Evening Shift', type: 'Standard', startTime: '15:00', endTime: '23:30', color: '#8B5CF6', status: 'ACTIVE' },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Shift Directory" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <View className="p-4 border-b border-border bg-white flex-row justify-between items-center">
        <Text className="text-textSecondary text-sm">Manage organization shifts</Text>
        <Button title="Add Shift" onPress={() => {}} icon={<Plus size={16} color="white" />} styleClass="py-2 px-3" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error">{error}</Text> : null}
        
        {mockShifts.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
