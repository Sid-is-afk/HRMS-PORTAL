import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuthorization } from '@/core/rbac/hooks/useAuthorization';

export default function EmployeeActionMenu({ status, onEdit, onToggleStatus, onArchive }) {
  const { hasPermission } = useAuthorization();

  const canUpdate = hasPermission('UPDATE_EMPLOYEE');
  const canDeactivate = hasPermission('DEACTIVATE_EMPLOYEE');

  if (!canUpdate && !canDeactivate) return null;

  return (
    <View style={styles.container}>
      {canUpdate ? (
        <Button mode="contained" icon="pencil" onPress={onEdit} style={styles.editButton}>
          Edit Profile
        </Button>
      ) : null}
      {canDeactivate ? (
        <Button
          mode="outlined"
          icon={status === 'ACTIVE' ? 'account-off' : 'account-check'}
          onPress={onToggleStatus}
          style={styles.statusButton}
        >
          {status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        </Button>
      ) : null}
      {canUpdate ? (
        <Button mode="outlined" icon="archive" onPress={onArchive} style={styles.archiveButton}>
          Archive
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
    flexWrap: 'wrap',
  },
  editButton: {
    backgroundColor: '#3B82F6',
    flex: 1,
    minWidth: 120,
  },
  statusButton: {
    borderColor: '#D1D5DB',
    flex: 1,
    minWidth: 120,
  },
  archiveButton: {
    borderColor: '#D1D5DB',
    flex: 1,
    minWidth: 100,
  },
});
