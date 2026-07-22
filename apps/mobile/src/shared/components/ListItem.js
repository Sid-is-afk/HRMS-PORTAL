import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

export function ListItem({ title, subtitle, leftElement, rightElement, onPress, destructive }) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-border bg-white"
    >
      {leftElement && <View className="mr-3">{leftElement}</View>}
      
      <View className="flex-1 justify-center">
        <Text className={`text-base font-medium ${destructive ? 'text-error' : 'text-textPrimary'}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-textSecondary text-sm mt-0.5">{subtitle}</Text>
        )}
      </View>
      
      {rightElement && <View className="ml-3">{rightElement}</View>}
    </Container>
  );
}
