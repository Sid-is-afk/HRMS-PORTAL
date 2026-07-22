import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, Avatar } from 'react-native-paper';

export default function RecentActivityList({ activities }) {
  const getIcon = (type) => {
    switch (type) {
      case 'ATTENDANCE':
        return 'clock-outline';
      case 'LEAVE':
        return 'calendar-blank-outline';
      case 'PROFILE':
        return 'account-outline';
      case 'SYSTEM':
      default:
        return 'cog-outline';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'ATTENDANCE':
        return '#F59E0B'; // Amber
      case 'LEAVE':
        return '#10B981'; // Green
      case 'PROFILE':
        return '#3B82F6'; // Blue
      case 'SYSTEM':
      default:
        return '#6B7280'; // Gray
    }
  };

  const formatTime = (timeStr) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (!activities || activities.length === 0) {
    return <Text style={styles.empty}>No recent activities.</Text>;
  }

  return (
    <View style={styles.list}>
      {activities.map((item) => (
        <List.Item
          key={item.id}
          title={item.description}
          titleStyle={styles.title}
          titleNumberOfLines={2}
          description={`${item.performedBy} • ${formatTime(item.timestamp)}`}
          descriptionStyle={styles.description}
          left={(props) => (
            <Avatar.Icon
              {...props}
              size={36}
              icon={getIcon(item.type)}
              color={getIconColor(item.type)}
              style={styles.avatar}
            />
          )}
          style={styles.item}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 4,
  },
  item: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  description: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  avatar: {
    backgroundColor: '#F9FAFB',
    alignSelf: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 16,
  },
});
