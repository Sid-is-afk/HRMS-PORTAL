import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

export default function HRDashboardGrid({ children }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  gridLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
