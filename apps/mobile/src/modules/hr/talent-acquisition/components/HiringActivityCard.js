import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';

const getActivityStyle = (type) => {
  switch (type) {
    case 'REQUISITION_CREATED':
      return { icon: 'file-document-outline', color: '#3B82F6', bg: '#EFF6FF' };
    case 'REQUISITION_APPROVED':
      return { icon: 'file-check-outline', color: '#16A34A', bg: '#DCFCE7' };
    case 'JOB_DRAFTED':
      return { icon: 'file-edit-outline', color: '#6B7280', bg: '#F3F4F6' };
    case 'JOB_PUBLISHED':
      return { icon: 'bullhorn-outline', color: '#7C3AED', bg: '#F3E8FF' };
    case 'JOB_CLOSED':
      return { icon: 'archive-outline', color: '#DC2626', bg: '#FEF2F2' };
    default:
      return { icon: 'information-outline', color: '#4B5563', bg: '#F3F4F6' };
  }
};

export default function HiringActivityCard({ activity }) {
  const style = getActivityStyle(activity.type);
  const formattedTime = new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: style.bg }]}>
        <Avatar.Icon size={20} icon={style.icon} color={style.color} style={{ backgroundColor: 'transparent' }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.desc}>{activity.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.user}>By {activity.performedBy}</Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  desc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  user: {
    fontSize: 11,
    color: '#6B7280',
  },
  time: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
