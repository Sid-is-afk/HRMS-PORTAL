import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';


export function Button({ 
  onPress, 
  title, 
  loading, 
  disabled, 
  variant = 'primary', 
  styleClass = '',
  textClass = '',
  icon
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    if (isDisabled) return;
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 150 });
  };

  const handlePressOut = () => {
    if (isDisabled) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  // Variant styling
  const baseClasses = "h-12 rounded-lg items-center justify-center flex-row shadow-sm min-w-[120px]";
  let variantClasses = "";
  let textClasses = "font-inter font-semibold text-base";

  if (variant === 'primary') {
    variantClasses = "bg-primary";
    textClasses += " text-white";
  } else if (variant === 'secondary') {
    variantClasses = "bg-surface border border-border";
    textClasses += " text-textPrimary";
  } else if (variant === 'outline') {
    variantClasses = "bg-transparent border border-primary";
    textClasses += " text-primary";
  }

  if (isDisabled) {
    variantClasses += " opacity-50";
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses} ${styleClass}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={title}
    >
      <Animated.View style={[animatedStyle, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }]}>
        {loading ? (
          <ActivityIndicator 
            color={variant === 'primary' ? "#FFFFFF" : "#2563EB"} 
            className="mr-2" 
          />
        ) : icon ? (
          icon
        ) : null}
        <Text className={`${textClasses} ${textClass}`}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}
