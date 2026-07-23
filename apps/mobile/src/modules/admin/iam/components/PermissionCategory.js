import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function PermissionCategory({ title, description, count }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {count !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count} scope(s)</Text>
          </View>
        )}
      </View>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginBottom: 8,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    flex: 1,
  },
  badge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeText: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
