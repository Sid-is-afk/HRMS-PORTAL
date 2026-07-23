import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Network, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react-native';

export function AccessPolicyCard({ policy, onToggleStatus }) {
  const isActive = policy.status === 'ACTIVE';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleInfo}>
          <Text style={styles.name}>{policy.name}</Text>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>Priority {policy.priority}</Text>
          </View>
        </View>
        <Switch
          value={isActive}
          onValueChange={(val) => onToggleStatus?.(policy.id, val ? 'ACTIVE' : 'INACTIVE')}
          trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
          thumbColor={isActive ? '#2563EB' : '#9CA3AF'}
        />
      </View>

      <Text style={styles.desc}>{policy.description}</Text>

      <View style={styles.conditions}>
        <Text style={styles.condTitle}>Enforced Conditions</Text>
        
        {policy.conditions?.ipRange && (
          <View style={styles.condRow}>
            <Network size={14} color="#4B5563" />
            <Text style={styles.condText}>IP Bound: {policy.conditions.ipRange}</Text>
          </View>
        )}

        {(policy.conditions?.timeWindowStart || policy.conditions?.timeWindowEnd) && (
          <View style={styles.condRow}>
            <Clock size={14} color="#4B5563" />
            <Text style={styles.condText}>
              Time Window: {policy.conditions.timeWindowStart || 'Anytime'} to {policy.conditions.timeWindowEnd || 'Anytime'}
            </Text>
          </View>
        )}

        {policy.conditions?.mfaRequired && (
          <View style={styles.condRow}>
            <ShieldCheck size={14} color="#16A34A" />
            <Text style={[styles.condText, styles.successText]}>Multi-Factor Authentication (MFA) Required</Text>
          </View>
        )}

        {!policy.conditions?.ipRange && !policy.conditions?.timeWindowStart && !policy.conditions?.mfaRequired && (
          <View style={styles.condRow}>
            <ArrowUpRight size={14} color="#9CA3AF" />
            <Text style={styles.disabledText}>No conditional rules specified. Policy triggers on scope invocation.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  priorityBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  priorityText: {
    fontSize: 10,
    color: '#1E40AF',
    fontWeight: '600',
  },
  desc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 16,
  },
  conditions: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  condTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  condRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  condText: {
    fontSize: 12,
    color: '#374151',
  },
  successText: {
    color: '#15803D',
    fontWeight: '600',
  },
  disabledText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});
