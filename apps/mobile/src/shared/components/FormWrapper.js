import React from 'react';
import { View } from 'react-native';

/**
 * Generic wrapper for managing form layout and spacing.
 * This can be expanded later to integrate tightly with react-hook-form Context if needed.
 */
export function FormWrapper({ children, className = '' }) {
  return (
    <View className={`w-full ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!child) return null;
        const isLast = index === React.Children.count(children) - 1;
        return (
          <View className={isLast ? '' : 'mb-4'}>
            {child}
          </View>
        );
      })}
    </View>
  );
}
