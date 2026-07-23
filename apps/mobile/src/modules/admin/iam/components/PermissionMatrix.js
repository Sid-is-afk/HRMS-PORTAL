import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';

// Memoized cell component to avoid unnecessary re-renders when other cells toggle
const MatrixCell = React.memo(({ roleId, roleCode, permissionCode, isAssigned, onToggle, disabled }) => {
  return (
    <View style={[styles.cell, { width: 140, justifyContent: 'center', alignItems: 'center' }]}>
      <Checkbox.Android
        status={isAssigned ? 'checked' : 'unchecked'}
        onPress={() => onToggle?.(roleId, permissionCode)}
        disabled={disabled || roleCode === 'ROLE_SUPER_ADMIN'} // Block editing Super Admin permissions
      />
    </View>
  );
});

export function PermissionMatrix({ roles, permissions, matrix, onTogglePermission, disabled }) {
  const tableWidth = useMemo(() => {
    return 240 + roles.length * 140;
  }, [roles]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View style={[styles.table, { width: tableWidth }]}>
          {/* Header Row */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell, { width: 240 }]}>Scope / Permission</Text>
            {roles.map((role) => (
              <View key={role.id} style={[styles.cell, styles.headerCellContainer, { width: 140 }]}>
                <Text style={styles.roleName} numberOfLines={1}>{role.name}</Text>
                <Text style={styles.roleCode} numberOfLines={1}>{role.code}</Text>
              </View>
            ))}
          </View>

          {/* Body Rows */}
          <ScrollView style={styles.bodyScroll}>
            {permissions.map((perm) => (
              <View key={perm.code} style={styles.row}>
                <View style={[styles.cell, styles.descCell, { width: 240 }]}>
                  <Text style={styles.permName}>{perm.name}</Text>
                  <Text style={styles.permCode}>{perm.code}</Text>
                </View>

                {roles.map((role) => {
                  const isAssigned = !!(matrix[role.code]?.[perm.code]);
                  return (
                    <MatrixCell
                      key={`${role.id}-${perm.code}`}
                      roleId={role.id}
                      roleCode={role.code}
                      permissionCode={perm.code}
                      isAssigned={isAssigned}
                      onToggle={onTogglePermission}
                      disabled={disabled}
                    />
                  );
                })}
              </View>
            ))}
          </ScrollView>
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
    flex: 1,
  },
  table: {
    flex: 1,
  },
  bodyScroll: {
    maxHeight: 550,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'stretch',
  },
  headerRow: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  headerCellContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCell: {
    fontWeight: '700',
    color: '#374151',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  roleName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  roleCode: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#4B5563',
    marginTop: 2,
    textAlign: 'center',
  },
  descCell: {
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  permName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  permCode: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#2563EB',
    marginTop: 2,
  },
});
