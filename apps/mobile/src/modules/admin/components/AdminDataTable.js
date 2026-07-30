import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';

export default function AdminDataTable({ 
  columns = [], 
  data = [], 
  keyExtractor,
  onRowPress,
  isLoading,
  emptyMessage = "No data available."
}) {
  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.stateText}>Loading data...</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <MaterialCommunityIcons name="file-search-outline" size={32} color="#9CA3AF" />
        <Text style={styles.stateText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <Surface style={styles.container} elevation={1}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.row, styles.headerRow]}>
            {columns.map((col, index) => (
              <View key={`header-${index}`} style={[styles.cell, col.width ? { width: col.width } : { flex: 1 }]}>
                <Text style={styles.headerText}>{col.label}</Text>
              </View>
            ))}
          </View>
          
          {/* Body */}
          {data.map((item, index) => (
            <TouchableOpacity 
              key={keyExtractor ? keyExtractor(item) : index} 
              style={[styles.row, index === data.length - 1 && styles.lastRow]}
              onPress={onRowPress ? () => onRowPress(item) : undefined}
              disabled={!onRowPress}
            >
              {columns.map((col, colIndex) => (
                <View key={`cell-${index}-${colIndex}`} style={[styles.cell, col.width ? { width: col.width } : { flex: 1 }]}>
                  {col.render ? col.render(item) : <Text style={styles.cellText}>{item[col.key]}</Text>}
                </View>
              ))}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    overflow: 'hidden',
  },
  table: {
    minWidth: 800, // Ensure it scrolls horizontally if needed
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  cellText: {
    fontSize: 13,
    color: '#374151',
  },
  stateContainer: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
  },
  stateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
});
