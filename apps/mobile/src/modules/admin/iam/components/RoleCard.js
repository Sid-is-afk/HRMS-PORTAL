import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, IconButton } from 'react-native-paper';
import { UserRoleBadge } from './UserRoleBadge';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { Shield, Copy, Edit, Archive, Eye } from 'lucide-react-native';

export function RoleCard({ role, onPress, onEdit, onClone, onArchive }) {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const permissionCount = role.permissions?.length || 0;

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress?.(role.id)}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 pr-4">
          <Text className="text-textPrimary text-base font-bold mb-1">{role.name}</Text>
          <Text className="text-textSecondary text-xs font-mono">{role.code}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <StatusBadge status={role.status} />
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => setMenuVisible(true)}
                style={{ margin: 0 }}
              />
            }
          >
            <Menu.Item 
              leadingIcon={() => <Eye size={16} color="#4B5563" />} 
              onPress={() => { setMenuVisible(false); onPress?.(role.id); }} 
              title="View Details" 
            />
            {role.status !== 'ARCHIVED' && (
              <>
                <Menu.Item 
                  leadingIcon={() => <Edit size={16} color="#4B5563" />} 
                  onPress={() => { setMenuVisible(false); onEdit?.(role.id); }} 
                  title="Edit Scope" 
                />
                <Menu.Item 
                  leadingIcon={() => <Copy size={16} color="#4B5563" />} 
                  onPress={() => { setMenuVisible(false); onClone?.(role.id); }} 
                  title="Clone Role" 
                />
                <Menu.Item 
                  leadingIcon={() => <Archive size={16} color="#DC2626" />} 
                  onPress={() => { setMenuVisible(false); onArchive?.(role.id); }} 
                  title="Archive Role" 
                  titleStyle={{ color: '#DC2626' }}
                />
              </>
            )}
          </Menu>
        </View>
      </View>

      <Text className="text-textSecondary text-sm mb-4" numberOfLines={2}>
        {role.description || 'No description provided.'}
      </Text>

      <View className="flex-row justify-between items-center border-t border-slate-100 pt-3">
        <View className="flex-row items-center">
          <Shield size={14} color="#6B7280" />
          <Text className="text-textSecondary text-xs ml-1.5 font-medium">
            {permissionCount} {permissionCount === 1 ? 'permission' : 'permissions'}
          </Text>
        </View>
        <UserRoleBadge roleCode={role.code} roleName={role.isCustom ? 'Custom Role' : 'System Role'} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
