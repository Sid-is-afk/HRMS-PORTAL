import React from 'react';
import { View, Text } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) return null;

  return (
    <Animated.View 
      entering={FadeInUp} 
      exiting={FadeOutUp}
      className="bg-warning px-4 py-2 flex-row justify-center items-center z-50 w-full"
    >
      <Text className="text-white font-medium text-sm">
        No internet connection. Operating offline.
      </Text>
    </Animated.View>
  );
}
