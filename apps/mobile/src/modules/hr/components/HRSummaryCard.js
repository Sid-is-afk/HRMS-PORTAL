import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-paper';

export default function HRSummaryCard({ title, value, subtitle, icon, iconBg = '#EFF6FF', iconColor = '#2563EB', onPress }) {
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        {icon ? (
          <Avatar.Icon
            size={40}
            icon={icon}
            color={iconColor}
            style={[styles.icon, { backgroundColor: iconBg }]}
          />
        ) : null}
      </View>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    flex: 1,
    minWidth: 140,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  icon: {
    borderRadius: 8,
  },
});
