import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Text, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

export function PasswordInput({ label, error, styleClass = '', icon: Icon, onFocus, onBlur, ...props }) {
  const [secure, setSecure] = useState(true);
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
        className={`h-12 border rounded-xl pl-4 pr-2 flex-row items-center bg-white ${borderColorClass} ${shadowClass}`}
        style={{ borderWidth: isFocused || error ? 1.5 : 1 }}
      >
        {Icon && <View className="mr-3"><Icon size={20} color={isFocused ? "#2563EB" : "#9CA3AF"} /></View>}
        <RNTextInput
          className="flex-1 text-textPrimary text-base font-inter"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secure}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <TouchableOpacity 
          onPress={() => setSecure(!secure)} 
          className="p-2 h-10 justify-center min-w-[40px] items-center"
          activeOpacity={0.6}
        >
          {secure ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#2563EB" />}
        </TouchableOpacity>
      </View>
      
      {error ? (
        <Text className="text-error text-xs mt-1.5 font-inter font-medium pl-1">{error}</Text>
      ) : null}
    </View>
  );
}
