import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Text, TouchableOpacity } from 'react-native';

export function PasswordInput({ label, error, styleClass = '', ...props }) {
  const [secure, setSecure] = useState(true);

  return (
    <View className={`mb-4 ${styleClass}`}>
      {label ? <Text className="text-textSecondary text-sm mb-1.5 font-inter">{label}</Text> : null}
      <View className={`h-12 border rounded-xl px-4 flex-row items-center bg-surface ${error ? 'border-error' : 'border-border'}`}>
        <RNTextInput
          className="flex-1 text-textPrimary text-base font-inter"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secure}
          {...props}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)} className="p-2">
          <Text className="text-primary text-sm font-inter font-medium">{secure ? 'Show' : 'Hide'}</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text className="text-error text-xs mt-1.5 font-inter">{error}</Text> : null}
    </View>
  );
}
