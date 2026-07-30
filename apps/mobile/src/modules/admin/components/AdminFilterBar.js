import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Searchbar, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AdminFilterBar({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  _onFilterChange, 
  onReset,
  onApply,
  filterOptions = [] // [{ id: 'dept', label: 'Department', type: 'dropdown', options: [...] }]
}) {
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Searchbar
          placeholder="Search employee..."
          onChangeText={onSearchChange}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
          iconColor="#6B7280"
        />
        <Button 
          mode="outlined" 
          onPress={onReset} 
          style={styles.actionButton}
          labelStyle={styles.actionButtonLabel}
          textColor="#4B5563"
        >
          Reset
        </Button>
        <Button 
          mode="contained" 
          onPress={onApply} 
          style={styles.actionButton}
          labelStyle={styles.actionButtonLabel}
          buttonColor="#2563EB"
        >
          Apply
        </Button>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {filterOptions.map((opt) => (
          <Chip 
            key={opt.id}
            mode="outlined"
            style={styles.chip}
            textStyle={styles.chipText}
            icon={() => <MaterialCommunityIcons name="chevron-down" size={16} color="#6B7280" />}
            onPress={() => { /* Open simulated dropdown/picker */ }}
          >
            {filters[opt.id] || opt.label}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  searchbar: {
    flex: 1,
    height: 44,
    backgroundColor: '#F3F4F6',
    elevation: 0,
    borderRadius: 8,
  },
  searchInput: {
    minHeight: 44,
    fontSize: 14,
    alignSelf: 'center',
  },
  actionButton: {
    borderRadius: 8,
    borderColor: '#D1D5DB',
  },
  actionButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
  },
});
