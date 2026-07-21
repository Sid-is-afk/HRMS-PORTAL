import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export function WorkingHoursCard({ checkIn, checkOut, status }) {
  const [liveHours, setLiveHours] = useState('0.00');

  useEffect(() => {
    let interval;
    if (status === 'CLOCKED_IN' && checkIn) {
      interval = setInterval(() => {
        const now = new Date();
        const inTime = new Date(checkIn);
        const diff = Math.abs(now - inTime);
        setLiveHours((diff / (1000 * 60 * 60)).toFixed(2));
      }, 60000); // update every minute
      
      // Calculate immediately on mount
      const now = new Date();
      const inTime = new Date(checkIn);
      const diff = Math.abs(now - inTime);
      setLiveHours((diff / (1000 * 60 * 60)).toFixed(2));
    }
    
    return () => clearInterval(interval);
  }, [status, checkIn]);

  const displayHours = status === 'CLOCKED_OUT' ? checkOut && checkIn ? 
    (Math.abs(new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60)).toFixed(2) : '0.00' 
    : liveHours;

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View className="bg-white p-5 rounded-2xl border border-border mt-4">
      <Text className="text-textSecondary font-bold mb-4 uppercase text-xs tracking-wider">Today's Summary</Text>
      
      <View className="flex-row justify-between mb-4">
        <View className="flex-1 items-center border-r border-border">
          <Text className="text-textSecondary text-xs mb-1">Check In</Text>
          <Text className="text-textPrimary font-bold">{formatTime(checkIn)}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-textSecondary text-xs mb-1">Check Out</Text>
          <Text className="text-textPrimary font-bold">{formatTime(checkOut)}</Text>
        </View>
      </View>
      
      <View className="bg-surface rounded-xl p-4 flex-row justify-between items-center border border-border">
        <Text className="text-textPrimary font-bold">Total Working Hours</Text>
        <Text className="text-primary font-bold text-xl">{displayHours}h</Text>
      </View>
    </View>
  );
}
