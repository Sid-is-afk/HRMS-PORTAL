import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Fingerprint, LogOut, CheckCircle2 } from 'lucide-react-native';

export function ClockInOutButton({ status, onCheckIn, onCheckOut, isLoading }) {
  const isClockedIn = status === 'CLOCKED_IN';
  const isClockedOut = status === 'CLOCKED_OUT';

  if (isClockedOut) {
    return (
      <View className="bg-surface py-10 rounded-3xl items-center justify-center border border-border">
        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
          <CheckCircle2 size={40} color="#16A34A" />
        </View>
        <Text className="text-textPrimary text-lg font-bold font-inter mb-1">Shift Completed</Text>
        <Text className="text-textSecondary text-sm font-inter text-center">You have completed your attendance for today.</Text>
      </View>
    );
  }

  const handlePress = isClockedIn ? onCheckOut : onCheckIn;
  const buttonColor = isClockedIn ? 'bg-error' : 'bg-primary';
  const buttonBorder = isClockedIn ? 'border-red-400' : 'border-blue-400';
  const Icon = isClockedIn ? LogOut : Fingerprint;
  const label = isClockedIn ? 'Clock Out' : 'Clock In';
  const subtitle = isClockedIn 
    ? "Ready to leave? Tap to clock out." 
    : "You're within range. Tap to clock in.";

  return (
    <View className="items-center py-6">
      <TouchableOpacity
        onPress={handlePress}
        disabled={isLoading}
        activeOpacity={0.8}
        className={`w-48 h-48 rounded-full ${buttonColor} items-center justify-center shadow-lg border-8 ${buttonBorder} border-opacity-50 mb-6`}
        style={{
          shadowColor: isClockedIn ? '#DC2626' : '#2563EB',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <>
            <Icon size={64} color="#FFFFFF" strokeWidth={1.5} />
            <Text className="text-white font-bold text-xl font-inter tracking-widest mt-2 uppercase">{label}</Text>
          </>
        )}
      </TouchableOpacity>
      
      <View className="bg-surface px-4 py-2 rounded-full">
        <Text className="text-textSecondary text-sm font-inter font-medium">{subtitle}</Text>
      </View>
    </View>
  );
}
