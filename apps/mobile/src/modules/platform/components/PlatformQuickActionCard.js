import React, { memo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

const COLOR_MAP = {
  'Create Organization': { bg: '#EFF6FF', color: '#2563EB' },
  'Add Platform Admin': { bg: '#F0FDF4', color: '#16A34A' },
  'Global Search': { bg: '#FFF7ED', color: '#EA580C' },
  Search: { bg: '#FFF7ED', color: '#EA580C' },
  Notifications: { bg: '#FEF3C7', color: '#D97706' },
  Reports: { bg: '#EDE9FE', color: '#7C3AED' },
  Overview: { bg: '#E0F2FE', color: '#0284C7' },
  'Platform Settings': { bg: '#F1F5F9', color: '#475569' },
  Settings: { bg: '#F1F5F9', color: '#475569' },
};

export const PlatformQuickActionCard = memo(({ label, icon: Icon, onPress }) => {
  const palette = COLOR_MAP[label] || { bg: '#F1F5F9', color: '#64748B' };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: palette.bg }]}>
        {Icon && <Icon size={22} color={palette.color} />}
      </View>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
    backgroundColor: '#F8FAFC',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 16,
  },
});
