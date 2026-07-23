import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Edit2, Archive, Lock } from 'lucide-react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';

export function ReferenceTable({ values, isReadonly, onEdit, onArchive }) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell, { width: 150 }]}>Code</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 180 }]}>Display Name</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 100 }]}>Status</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 220 }]}>Description</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 120 }]}>Actions</Text>
          </View>

          {/* Body */}
          {values.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reference values found matching search criteria.</Text>
            </View>
          ) : (
            values.map((item) => (
              <View key={item.id} style={styles.row}>
                <Text style={[styles.cell, styles.codeText, { width: 150 }]} numberOfLines={1}>
                  {item.code}
                </Text>
                <Text style={[styles.cell, styles.nameText, { width: 180 }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={[styles.cell, { width: 100 }]}>
                  <StatusBadge status={item.status} />
                </View>
                <Text style={[styles.cell, styles.descriptionText, { width: 220 }]} numberOfLines={2}>
                  {item.description || 'No description provided.'}
                </Text>
                
                <View style={[styles.cell, styles.actions, { width: 120 }]}>
                  {isReadonly ? (
                    <View style={styles.readonlyLock}>
                      <Lock size={12} color="#9CA3AF" />
                      <Text style={styles.lockText}>Consumed</Text>
                    </View>
                  ) : item.isSystem ? (
                    <View style={styles.systemBadge}>
                      <Text style={styles.systemText}>System Default</Text>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => onEdit(item)}
                        style={[styles.btn, styles.editBtn]}
                      >
                        <Edit2 size={12} color="#4F46E5" />
                        <Text style={styles.editBtnText}>Edit</Text>
                      </TouchableOpacity>
                      {item.status !== 'ARCHIVED' && (
                        <TouchableOpacity
                          onPress={() => onArchive(item)}
                          style={[styles.btn, styles.archiveBtn]}
                        >
                          <Archive size={12} color="#DC2626" />
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              </View>
            ))
          )}
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
    minWidth: 770,
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
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  nameText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  editBtn: {
    backgroundColor: '#EEF2FF',
  },
  editBtnText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '600',
  },
  archiveBtn: {
    backgroundColor: '#FEF2F2',
    padding: 6,
  },
  readonlyLock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lockText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  systemBadge: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  systemText: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
  },
});
