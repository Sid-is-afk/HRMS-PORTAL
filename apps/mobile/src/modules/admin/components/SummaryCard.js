import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-paper';

export default function SummaryCard({ title, value, subtitle, icon, iconBg = '#EFF6FF', iconColor = '#2563EB', onPress }) {
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
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
    padding: 16,
    flex: 1,
    minWidth: 140,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
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
