import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export function GreetingHeader({ user }) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const name = user?.name || user?.email?.split('@')[0] || 'Employee';
  const initial = name.charAt(0).toUpperCase();

  return (
    <View className="bg-primary rounded-b-[32px] pt-14 pb-8 px-6 shadow-md mb-6">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-blue-100 text-sm font-inter font-medium tracking-wide uppercase mb-1">
            {currentDate}
          </Text>
          <Text className="text-white text-3xl font-bold font-inter tracking-tight" numberOfLines={1}>
            Hello, {name}
          </Text>
        </View>
        <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center border-2 border-white/40 ml-4">
          <Text className="text-white text-xl font-bold font-inter">{initial}</Text>
        </View>
      </View>
    </View>
  );
}
