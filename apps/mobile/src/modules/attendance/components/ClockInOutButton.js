import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/Button';

export function ClockInOutButton({ status, onCheckIn, onCheckOut, isLoading }) {
  const isClockedIn = status === 'CLOCKED_IN';
  const isClockedOut = status === 'CLOCKED_OUT';
  const isNotMarked = status === 'NOT_MARKED';

  if (isClockedOut) {
    return (
      <View className="bg-gray-100 p-6 rounded-2xl items-center justify-center border border-gray-200">
        <Text className="text-gray-500 font-bold mb-1">Shift Completed</Text>
        <Text className="text-gray-400 text-xs text-center">You have completed your attendance for today.</Text>
      </View>
    );
  }

  return (
    <View className="items-center">
      <Button
        title={isClockedIn ? "Clock Out" : "Clock In"}
        onPress={isClockedIn ? onCheckOut : onCheckIn}
        loading={isLoading}
        styleClass="w-full h-16 rounded-2xl"
        variant={isClockedIn ? "secondary" : "primary"}
      />
      <Text className="text-textSecondary text-xs mt-3 text-center">
        {isClockedIn 
          ? "Don't forget to clock out before you leave." 
          : "Make sure you are at your designated location."}
      </Text>
    </View>
  );
}
