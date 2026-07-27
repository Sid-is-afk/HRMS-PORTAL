import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-paper';

export default function HRNotificationPreview({ notification, onPress }) {
  const isWorkflow = notification.type === 'WORKFLOW';
  const icon = isWorkflow ? 'file-tree' : 'alert-circle-outline';
  const color = isWorkflow ? '#2563EB' : '#DC2626';
  const bg = isWorkflow ? '#EFF6FF' : '#FEF2F2';

  return (
    <TouchableOpacity style={[styles.container, !notification.isRead && styles.unread]} onPress={onPress}>
      <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
        <Avatar.Icon size={20} icon={icon} color={color} style={{ backgroundColor: 'transparent' }} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !notification.isRead && styles.unreadTitle]}>{notification.title}</Text>
        <Text style={styles.body} numberOfLines={1}>{notification.body}</Text>
      </View>
      {!notification.isRead && <View style={styles.badge} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 8,
  },
  unread: {
    borderColor: '#DBEAFE',
    backgroundColor: '#F8FAFC',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  unreadTitle: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  body: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  badge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginLeft: 6,
  },
});
