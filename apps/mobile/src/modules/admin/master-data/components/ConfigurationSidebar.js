import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

export function ConfigurationSidebar({ categories, selectedId, onSelect }) {
  return (
    <View style={styles.sidebar}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {categories.map((cat) => {
          const isActive = cat.id === selectedId;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.item, isActive && styles.activeItem]}
              onPress={() => onSelect(cat.id)}
            >
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, isActive && styles.activeItemName]} numberOfLines={1}>
                  {cat.name}
                </Text>
                <View style={[styles.countBadge, isActive && styles.activeCountBadge]}>
                  <Text style={[styles.countText, isActive && styles.activeCountText]}>
                    {cat.count}
                  </Text>
                </View>
              </View>
              <ChevronRight size={14} color={isActive ? '#4F46E5' : '#9CA3AF'} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: 260,
    height: '100%',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    padding: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  activeItem: {
    backgroundColor: '#EEF2FF',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
    gap: 8,
  },
  itemName: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
    flex: 1,
  },
  activeItemName: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeCountBadge: {
    backgroundColor: '#E0E7FF',
  },
  countText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  activeCountText: {
    color: '#4F46E5',
  },
});
