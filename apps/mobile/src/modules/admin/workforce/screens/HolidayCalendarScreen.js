import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { HolidayCard } from '../components/HolidayCard';
import { useHolidayCalendar } from '../hooks/useHolidayCalendar';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { Button } from '@/shared/components/Button';
import { Plus } from 'lucide-react-native';

export default function HolidayCalendarScreen() {
  const { holidayCalendars, isLoading, error } = useHolidayCalendar();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Holiday Calendar" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <View className="p-4 border-b border-border bg-white flex-row justify-between items-center">
        <Text className="text-textSecondary text-sm">2026 Calendar</Text>
        <Button title="Add Holiday" onPress={() => {}} icon={<Plus size={16} color="white" />} styleClass="py-2 px-3" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error">{error}</Text> : null}
        
        {holidayCalendars.map((holiday) => (
          <HolidayCard key={holiday.id} holiday={holiday} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
