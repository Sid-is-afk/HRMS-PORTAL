import React from 'react';
import { View } from 'react-native';

export function Card({ children, className = '', style }) {
  return (
    <View 
      className={`bg-white rounded-3xl p-6 border border-border shadow-sm mb-4 ${className}`}
      style={style}
    >
      {children}
    </View>
  );
}
