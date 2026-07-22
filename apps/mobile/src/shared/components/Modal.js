import React from 'react';
import { Modal as RNModal, View, TouchableOpacity, Text } from 'react-native';

export function Modal({ visible, onClose, title, children }) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center p-4">
        <View className="bg-white rounded-3xl p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-textPrimary">{title}</Text>
            <TouchableOpacity onPress={onClose} className="p-2 -mr-2 rounded-full bg-gray-100">
              <Text className="text-textSecondary font-bold text-xs">✕</Text>
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </RNModal>
  );
}
