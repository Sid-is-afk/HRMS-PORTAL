import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

export function PermissionTable({ permissions }) {
  if (permissions.length === 0) {
    return (
      <View style={styles.empty}>
        <ShieldCheck size={40} color="#9CA3AF" />
        <Text style={styles.emptyText}>No permissions match your search.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell, { width: 220 }]}>Code / Identifier</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 180 }]}>Display Name</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 150 }]}>Category</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 300 }]}>Description</Text>
          </View>

          {/* Body */}
          {permissions.map((perm) => (
            <View key={perm.code} style={styles.row}>
              <Text style={[styles.cell, styles.codeCell, { width: 220 }]} numberOfLines={1}>
                {perm.code}
              </Text>
              <Text style={[styles.cell, styles.nameCell, { width: 180 }]} numberOfLines={1}>
                {perm.name}
              </Text>
              <Text style={[styles.cell, styles.categoryCell, { width: 150 }]} numberOfLines={1}>
                {perm.category}
              </Text>
              <Text style={[styles.cell, styles.descCell, { width: 300 }]} numberOfLines={2}>
                {perm.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  table: {
    minWidth: 850,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  cell: {
    paddingRight: 12,
  },
  headerCell: {
    fontWeight: '600',
    color: '#374151',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  codeCell: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  nameCell: {
    color: '#111827',
    fontWeight: '500',
    fontSize: 13,
  },
  categoryCell: {
    color: '#4B5563',
    fontSize: 13,
  },
  descCell: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 16,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyText: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 14,
  },
});
