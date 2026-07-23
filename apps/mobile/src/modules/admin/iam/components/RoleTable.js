import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { UserRoleBadge } from './UserRoleBadge';
import { ShieldAlert, Edit2, Copy, Trash } from 'lucide-react-native';

export function RoleTable({ roles, onSelect, onEdit, onClone, onArchive }) {
  if (roles.length === 0) {
    return (
      <View style={styles.empty}>
        <ShieldAlert size={40} color="#9CA3AF" />
        <Text style={styles.emptyText}>No roles found match the filters.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell, { width: 180 }]}>Role Name</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 180 }]}>Code</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 100 }]}>Status</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 120 }]}>Scope</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 100 }]}>Permissions</Text>
            <Text style={[styles.cell, styles.headerCell, { width: 120 }]}>Actions</Text>
          </View>

          {/* Body */}
          {roles.map((role) => (
            <TouchableOpacity 
              key={role.id} 
              style={styles.row}
              onPress={() => onSelect?.(role.id)}
            >
              <Text style={[styles.cell, styles.nameCell, { width: 180 }]} numberOfLines={1}>
                {role.name}
              </Text>
              <Text style={[styles.cell, styles.codeCell, { width: 180 }]} numberOfLines={1}>
                {role.code}
              </Text>
              <View style={[styles.cell, { width: 100 }]}>
                <StatusBadge status={role.status} />
              </View>
              <View style={[styles.cell, { width: 120 }]}>
                <UserRoleBadge roleCode={role.code} roleName={role.isCustom ? 'Custom Role' : 'System Role'} />
              </View>
              <Text style={[styles.cell, styles.countCell, { width: 100 }]}>
                {role.permissions?.length || 0} scope(s)
              </Text>
              <View style={[styles.cell, styles.actionsCell, { width: 120 }]}>
                <TouchableOpacity onPress={() => onEdit?.(role.id)} style={styles.actionBtn}>
                  <Edit2 size={14} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onClone?.(role.id)} style={styles.actionBtn}>
                  <Copy size={14} color="#10B981" />
                </TouchableOpacity>
                {role.status !== 'ARCHIVED' && (
                  <TouchableOpacity onPress={() => onArchive?.(role.id)} style={styles.actionBtn}>
                    <Trash size={14} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
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
    minWidth: 800,
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
  nameCell: {
    color: '#111827',
    fontWeight: '500',
    fontSize: 14,
  },
  codeCell: {
    color: '#4B5563',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  countCell: {
    color: '#4B5563',
    fontSize: 13,
  },
  actionsCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
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
