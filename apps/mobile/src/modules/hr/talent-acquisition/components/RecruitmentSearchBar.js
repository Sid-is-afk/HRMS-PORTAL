import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function RecruitmentSearchBar({ value, onChangeText, placeholder = 'Search jobs, departments...' }) {
  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        left={<TextInput.Icon icon="magnify" iconColor="#9CA3AF" />}
        activeOutlineColor="#2563EB"
        outlineColor="#E5E7EB"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 44,
  },
});
