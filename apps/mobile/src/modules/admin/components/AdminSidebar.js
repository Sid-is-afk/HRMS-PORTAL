import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, List } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAdminNavigation } from '@/core/rbac/hooks/useAdminNavigation';

export default function AdminSidebar() {
  const { adminRoutes } = useAdminNavigation();
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.sidebar}>
      {(adminRoutes || []).map((item) => {
        const isActive = route.name === item.name;
        return (
          <TouchableOpacity
            key={item.name}
            style={[styles.item, isActive && styles.activeItem]}
            onPress={() => {
              try {
                navigation.navigate(item.name);
              } catch {
                // Catch any navigation resolution issues in placeholder
              }
            }}
          >
            <List.Icon icon={item.icon || 'folder'} color={isActive ? '#2563EB' : '#4B5563'} />
            <Text style={[styles.label, isActive && styles.activeLabel]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  activeItem: {
    backgroundColor: '#EFF6FF',
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  activeLabel: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
});
