import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AdminKPICard({ title, value, icon, color = '#2563EB', trend, trendText }) {
  return (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.iconWrapper, { backgroundColor: `${color}1A` }]}>
          <MaterialCommunityIcons name={icon} size={24} color={color} />
        </View>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
      {(trend || trendText) && (
        <View style={styles.trendContainer}>
          {trend && (
            <MaterialCommunityIcons
              name={trend === 'up' ? 'arrow-up-right' : trend === 'down' ? 'arrow-down-right' : 'minus'}
              size={16}
              color={trend === 'up' ? '#16A34A' : trend === 'down' ? '#DC2626' : '#6B7280'}
            />
          )}
          {trendText && (
            <Text style={[
              styles.trendText,
              { color: trend === 'up' ? '#16A34A' : trend === 'down' ? '#DC2626' : '#6B7280' }
            ]}>
              {trendText}
            </Text>
          )}
        </View>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flex: 1,
    minWidth: 200,
    margin: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
});
