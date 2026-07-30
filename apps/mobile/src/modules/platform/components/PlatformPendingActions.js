import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Building2,
  CheckSquare,
  ShieldAlert,
  CreditCard,
} from 'lucide-react-native';

const ICON_MAP = {
  Building2,
  CheckSquare,
  ShieldAlert,
  CreditCard,
};

function ActionRow({ action }) {
  const IconComp = ICON_MAP[action.iconName] || CheckSquare;
  return (
    <Pressable style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}>
      <View style={styles.actionLeft}>
        <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
          <IconComp size={18} color={action.color} />
        </View>
        <Text style={styles.actionLabel}>{action.label}</Text>
      </View>
      <View style={[styles.countBadge, { backgroundColor: action.bg }]}>
        <Text style={[styles.countText, { color: action.color }]}>{action.count}</Text>
      </View>
    </Pressable>
  );
}

export const PlatformPendingActions = memo(({ actions = [] }) => {
  const totalPending = actions.reduce((sum, a) => sum + a.count, 0);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Actions</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>{totalPending} total</Text>
        </View>
      </View>

      {actions.map((action, index) => (
        <ActionRow key={action.id || action.key || index} service={action} action={action} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  totalText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  actionRowPressed: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
