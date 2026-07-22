import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

export default function ContentContainer({ children }) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  container: {
    padding: 16,
  },
});
