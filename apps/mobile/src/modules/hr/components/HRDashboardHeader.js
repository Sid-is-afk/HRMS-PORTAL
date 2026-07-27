import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

export default function HRDashboardHeader({ title = 'HR Workspace Dashboard', filters, onFilterChange, onRefresh, isRefreshing }) {
  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const categories = [
    { id: 'all', label: 'All Domains' },
    { id: 'recruitment', label: 'Recruitment' },
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'performance', label: 'Performance' },
  ];

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.actions}>
          <IconButton 
            icon={isRefreshing ? 'refresh-circle' : 'refresh'} 
            iconColor="#2563EB" 
            size={24} 
            onPress={onRefresh} 
            disabled={isRefreshing} 
          />
        </View>
      </View>
      <View style={styles.filterBar}>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Period:</Text>
          <View style={styles.buttonGroup}>
            {dateRanges.map((r) => {
              const active = filters.dateRange === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.filterBtn, active && styles.activeFilterBtn]}
                  onPress={() => onFilterChange({ dateRange: r.id })}
                >
                  <Text style={[styles.filterBtnText, active && styles.activeFilterBtnText]}>{r.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Category:</Text>
          <View style={styles.buttonGroup}>
            {categories.map((c) => {
              const active = filters.category === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.filterBtn, active && styles.activeFilterBtn]}
                  onPress={() => onFilterChange({ category: c.id })}
                >
                  <Text style={[styles.filterBtnText, active && styles.activeFilterBtnText]}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBar: {
    flexDirection: 'column',
    gap: 10,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 60,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  activeFilterBtn: {
    backgroundColor: '#2563EB',
  },
  filterBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeFilterBtnText: {
    color: '#FFFFFF',
  },
});
