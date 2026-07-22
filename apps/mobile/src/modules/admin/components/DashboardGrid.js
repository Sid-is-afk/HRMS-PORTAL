import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

export default function DashboardGrid({ children }) {
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
  },
  gridLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
