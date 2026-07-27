import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';

const getCategoryDetails = (type) => {
  switch (type) {
    case 'RECRUITMENT':
      return { icon: 'briefcase-outline', color: '#2563EB', bg: '#EFF6FF' };
    case 'ONBOARDING':
      return { icon: 'account-clock-outline', color: '#16A34A', bg: '#DCFCE7' };
    case 'PERFORMANCE':
      return { icon: 'file-check-outline', color: '#D97706', bg: '#FEF3C7' };
    case 'TRAINING':
      return { icon: 'school-outline', color: '#7C3AED', bg: '#F3E8FF' };
    case 'DOCUMENT':
    case 'DOCUMENTS':
      return { icon: 'file-document-outline', color: '#0891B2', bg: '#ECFEFF' };
    default:
      return { icon: 'information-outline', color: '#4B5563', bg: '#F3F4F6' };
  }
};

export default function HRActivityCard({ activity }) {
  const { icon, color, bg } = getCategoryDetails(activity.type);
  const formattedTime = new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <Avatar.Icon size={24} icon={icon} color={color} style={{ backgroundColor: 'transparent' }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>{activity.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.performer}>By {activity.performedBy}</Text>
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
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  description: {
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
  performer: {
    fontSize: 11,
    color: '#6B7280',
  },
  time: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
