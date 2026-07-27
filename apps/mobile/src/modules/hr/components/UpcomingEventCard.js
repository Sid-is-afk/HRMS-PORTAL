import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';

const getEventStyles = (type) => {
  switch (type) {
    case 'BIRTHDAY':
      return { icon: 'cake-variant-outline', color: '#EC4899', bg: '#FDF2F8' };
    case 'ANNIVERSARY':
      return { icon: 'star-circle-outline', color: '#F59E0B', bg: '#FEF7E0' };
    default:
      return { icon: 'video-account', color: '#3B82F6', bg: '#EFF6FF' };
  }
};

export default function UpcomingEventCard({ event }) {
  const { icon, color, bg } = getEventStyles(event.type);
  const formattedDate = new Date(event.date).toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
        <Avatar.Icon size={24} icon={icon} color={color} style={{ backgroundColor: 'transparent' }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>
      <View style={styles.dateBadge}>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginBottom: 8,
  },
  iconWrapper: {
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
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  dateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  dateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
});
