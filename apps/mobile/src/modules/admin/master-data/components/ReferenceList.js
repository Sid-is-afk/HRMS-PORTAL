import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Edit2, Archive, Lock } from 'lucide-react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';

export function ReferenceList({ values, isReadonly, onEdit, onArchive }) {
  if (values.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No reference values found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {values.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.code}>{item.code}</Text>
            </View>
            <StatusBadge status={item.status} />
          </View>
          
          <Text style={styles.description}>
            {item.description || 'No description provided.'}
          </Text>

          <View style={styles.footer}>
            {isReadonly ? (
              <View style={styles.badgeWrapper}>
                <Lock size={12} color="#6B7280" />
                <Text style={styles.badgeText}>Consumed Reference</Text>
              </View>
            ) : item.isSystem ? (
              <View style={[styles.badgeWrapper, styles.systemBadge]}>
                <Text style={[styles.badgeText, styles.systemText]}>System Default</Text>
              </View>
            ) : (
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => onEdit(item)}
                  style={[styles.btn, styles.editBtn]}
                >
                  <Edit2 size={12} color="#4F46E5" />
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                {item.status !== 'ARCHIVED' && (
                  <TouchableOpacity
                    onPress={() => onArchive(item)}
                    style={[styles.btn, styles.archiveBtn]}
                  >
                    <Archive size={12} color="#DC2626" />
                    <Text style={[styles.btnText, styles.archiveText]}>Archive</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleInfo: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 8,
    lineHeight: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  systemBadge: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  systemText: {
    color: '#D97706',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
  },
  editBtn: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  btnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  archiveBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  archiveText: {
    color: '#DC2626',
  },
  empty: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
