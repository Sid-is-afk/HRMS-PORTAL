import React from 'react';
import { Searchbar } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export default function WorkflowSearch({ value, onChangeText, onClear, placeholder }) {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder || 'Search workflows...'}
        onChangeText={onChangeText}
        value={value}
        onClearIconPress={onClear}
        style={styles.searchbar}
        inputStyle={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  searchbar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
    height: 44,
  },
  input: {
    fontSize: 14,
    alignSelf: 'center',
    minHeight: 0,
  },
});
