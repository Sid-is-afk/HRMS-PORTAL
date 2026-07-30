import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Server,
  Database,
  Shield,
  HardDrive,
  Mail,
  Clock,
} from 'lucide-react-native';

const SERVICES = [
  { key: 'api', label: 'API Gateway', icon: Server, status: 'Operational', uptime: '99.98%' },
  { key: 'db', label: 'Database', icon: Database, status: 'Operational', uptime: '99.95%' },
  { key: 'auth', label: 'Authentication', icon: Shield, status: 'Operational', uptime: '100%' },
  { key: 'storage', label: 'Storage', icon: HardDrive, status: 'Operational', uptime: '99.99%' },
  { key: 'email', label: 'Email Service', icon: Mail, status: 'Degraded', uptime: '98.2%' },
  { key: 'uptime', label: 'Overall Uptime', icon: Clock, status: 'Healthy', uptime: '99.94%' },
];

const STATUS_STYLES = {
  Operational: { color: '#10B981', bg: '#D1FAE5', label: 'Operational' },
  Healthy: { color: '#10B981', bg: '#D1FAE5', label: 'Healthy' },
  Degraded: { color: '#F59E0B', bg: '#FEF3C7', label: 'Degraded' },
  Offline: { color: '#EF4444', bg: '#FEE2E2', label: 'Offline' },
};

function ProgressBar({ value, color }) {
  const pct = parseFloat(value) || 0;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

function ServiceRow({ service }) {
  const IconComp = service.icon;
  const st = STATUS_STYLES[service.status] || STATUS_STYLES.Operational;

  return (
    <View style={styles.serviceRow}>
      <View style={styles.serviceLeft}>
        <View style={[styles.serviceIconWrap, { backgroundColor: st.bg }]}>
          <IconComp size={16} color={st.color} />
        </View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceLabel}>{service.label}</Text>
          <ProgressBar value={service.uptime} color={st.color} />
        </View>
      </View>
      <View style={styles.serviceRight}>
        <View style={[styles.statusChip, { backgroundColor: st.bg }]}>
          <View style={[styles.statusChipDot, { backgroundColor: st.color }]} />
          <Text style={[styles.statusChipText, { color: st.color }]}>{st.label}</Text>
        </View>
        <Text style={styles.uptimeText}>{service.uptime}</Text>
      </View>
    </View>
  );
}

export const PlatformHealthPanel = memo(() => {
  const allOperational = SERVICES.every(
    (s) => s.status === 'Operational' || s.status === 'Healthy'
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Platform Health</Text>
        <View
          style={[
            styles.overallBadge,
            { backgroundColor: allOperational ? '#D1FAE5' : '#FEF3C7' },
          ]}
        >
          <View
            style={[
              styles.overallDot,
              { backgroundColor: allOperational ? '#10B981' : '#F59E0B' },
            ]}
          />
          <Text
            style={[
              styles.overallText,
              { color: allOperational ? '#10B981' : '#F59E0B' },
            ]}
          >
            {allOperational ? 'All Systems Operational' : 'Partial Degradation'}
          </Text>
        </View>
      </View>

      {SERVICES.map((service) => (
        <ServiceRow key={service.key} service={service} />
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
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  overallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  overallDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  overallText: {
    fontSize: 11,
    fontWeight: '600',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  serviceIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  serviceRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  statusChipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  uptimeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
