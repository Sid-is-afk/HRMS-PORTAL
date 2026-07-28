import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

export default function DashboardGrid({ children }) {
  return (
    <View style={styles.grid}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});
