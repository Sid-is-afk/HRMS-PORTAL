import React from 'react';
import { Text, View, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { Fingerprint, CalendarDays, User } from 'lucide-react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function QuickActionCard({ title, onPress, iconName }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  let Icon = Fingerprint;
  if (iconName === 'calendar') Icon = CalendarDays;
  if (iconName === 'person') Icon = User;

  return (
    <AnimatedPressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="bg-white rounded-3xl p-5 shadow-sm border border-border items-center justify-center m-1.5 flex-1"
      style={animatedStyle}
      accessibilityRole="button"
      accessibilityLabel={`Navigate to ${title}`}
    >
      <View className="w-12 h-12 bg-surface rounded-full items-center justify-center mb-3">
        <Icon size={24} color="#2563EB" strokeWidth={1.5} />
      </View>
      <Text className="text-textPrimary text-sm font-bold font-inter text-center">{title}</Text>
    </AnimatedPressable>
  );
}
