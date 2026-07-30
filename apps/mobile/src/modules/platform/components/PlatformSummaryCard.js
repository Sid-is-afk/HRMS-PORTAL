import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

const ACCENT_MAP = {
  Organizations: { bg: '#EFF6FF', color: '#2563EB', trendValue: '+12%', trendUp: true },
  'Platform Users': { bg: '#F0FDF4', color: '#16A34A', trendValue: '+8%', trendUp: true },
  'Active Sessions': { bg: '#FFF7ED', color: '#EA580C', trendValue: '+23%', trendUp: true },
  'System Health': { bg: '#F0FDF4', color: '#16A34A', trendValue: '99.9%', trendUp: true },
  'API Status': { bg: '#F0FDF4', color: '#16A34A', trendValue: '100%', trendUp: true },
  'API Health': { bg: '#F0FDF4', color: '#16A34A', trendValue: '100%', trendUp: true },
};

export const PlatformSummaryCard = memo(({ title, value, status, icon: Icon, onPress }) => {
  const accent = ACCENT_MAP[title] || { bg: '#F1F5F9', color: '#64748B', trendValue: '—', trendUp: true };

  let statusColor = '#64748B';
  if (status === 'Healthy' || status === 'Operational') statusColor = '#10B981';
  if (status === 'Degraded') statusColor = '#F59E0B';
  if (status === 'Offline') statusColor = '#EF4444';

  const TrendIcon = accent.trendUp ? TrendingUp : TrendingDown;
  const trendColor = accent.trendUp ? '#16A34A' : '#DC2626';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconCircle, { backgroundColor: accent.bg }]}>
          {Icon && <Icon size={22} color={accent.color} />}
        </View>
        <View style={[styles.trendBadge, { backgroundColor: accent.trendUp ? '#F0FDF4' : '#FEF2F2' }]}>
          <TrendIcon size={12} color={trendColor} />
          <Text style={[styles.trendText, { color: trendColor }]}>{accent.trendValue}</Text>
        </View>
      </View>
      <Text style={styles.value}>{value ?? '—'}</Text>
      <Text style={styles.title}>{title}</Text>
      {status && (
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    width: '48%',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 3,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
