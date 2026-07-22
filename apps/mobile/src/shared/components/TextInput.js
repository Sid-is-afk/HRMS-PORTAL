import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Text } from 'react-native';

export function TextInput({ label, error, styleClass = '', icon: Icon, onFocus, onBlur, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  let borderColorClass = 'border-border';
  if (error) {
    borderColorClass = 'border-error';
  } else if (isFocused) {
    borderColorClass = 'border-primary';
  }

  let shadowClass = isFocused && !error ? 'shadow-sm' : '';

  return (
    <View className={`mb-5 ${styleClass}`}>
      {label ? (
        <Text className="text-textSecondary text-sm mb-1.5 font-inter font-medium">{label}</Text>
      ) : null}
      
      <View 
        className={`h-12 border rounded-xl px-4 flex-row items-center bg-white ${borderColorClass} ${shadowClass}`}
        style={{ borderWidth: isFocused || error ? 1.5 : 1 }}
      >
        {Icon && <View className="mr-3"><Icon size={20} color={isFocused ? "#2563EB" : "#9CA3AF"} /></View>}
        <RNTextInput
          className="flex-1 text-textPrimary text-base font-inter"
          placeholderTextColor="#9CA3AF"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>
      
      {error ? (
        <Text className="text-error text-xs mt-1.5 font-inter font-medium pl-1">{error}</Text>
      ) : null}
    </View>
  );
}
