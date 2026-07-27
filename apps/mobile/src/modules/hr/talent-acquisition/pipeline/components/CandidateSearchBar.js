import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useDebounce } from '@/shared/hooks/useDebounce';

export default function CandidateSearchBar({ value, onChangeText, placeholder = 'Search candidates...' }) {
  const [localVal, setLocalVal] = useState(value || '');
  const debouncedVal = useDebounce(localVal, 400);

  useEffect(() => {
    if (debouncedVal !== value) {
      onChangeText(debouncedVal);
    }
  }, [debouncedVal]);

  useEffect(() => {
    setLocalVal(value || '');
  }, [value]);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={setLocalVal}
        value={localVal}
        style={styles.searchbar}
        inputStyle={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchbar: {
    backgroundColor: '#F3F4F6',
    elevation: 0,
    borderRadius: 8,
    height: 44,
  },
  input: {
    minHeight: 0,
    fontSize: 14,
  },
});
