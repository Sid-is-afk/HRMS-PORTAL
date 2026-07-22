import React from 'react';
import { View, Text, Image } from 'react-native';
import { getInitials } from '@/shared/utils/stringUtils';

export function Avatar({ source, name, size = 48, className = '' }) {
  const sizeStyle = { width: size, height: size, borderRadius: size / 2 };

  if (source) {
    return (
      <Image 
        source={source} 
        style={sizeStyle} 
        className={`bg-gray-100 ${className}`} 
      />
    );
  }

  return (
    <View 
      style={sizeStyle} 
      className={`bg-primary items-center justify-center ${className}`}
    >
      <Text className="text-white font-bold text-lg">{getInitials(name)}</Text>
    </View>
  );
}
