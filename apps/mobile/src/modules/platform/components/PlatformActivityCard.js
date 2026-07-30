import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react-native';

const SEVERITY_CONFIG = {
  Warning: { icon: AlertTriangle, color: '#F59E0B', bg: '#FEF3C7', border: '#F59E0B' },
  Error: { icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2', border: '#EF4444' },
  Info: { icon: Info, color: '#0EA5E9', bg: '#E0F2FE', border: '#0EA5E9' },
  Success: { icon: CheckCircle, color: '#10B981', bg: '#D1FAE5', border: '#10B981' },
};

function getRelativeTime(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const PlatformActivityCard = memo(({ activity, isLast }) => {
  const config = SEVERITY_CONFIG[activity.severity] || SEVERITY_CONFIG.Info;
  const SeverityIcon = config.icon;

  const relativeTime = useMemo(() => getRelativeTime(activity.timestamp), [activity.timestamp]);

  return (
    <View style={styles.row}>
      {/* Timeline connector */}
      <View style={styles.timelineCol}>
        <View style={[styles.dot, { backgroundColor: config.bg, borderColor: config.color }]}>
          <SeverityIcon size={14} color={config.color} />
        </View>
        {!isLast && <View style={styles.connector} />}
      </View>

      {/* Content */}
      <View style={[styles.content, { borderLeftColor: config.border }]}>
        <View style={styles.headerRow}>
          <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
            <Text style={[styles.typeText, { color: config.color }]}>{activity.severity}</Text>
          </View>
          <Text style={styles.timestamp}>{relativeTime}</Text>
        </View>
        <Text style={styles.description}>{activity.description}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    minHeight: 72,
  },
  timelineCol: {
    width: 36,
    alignItems: 'center',
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
    marginBottom: 4,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
    lineHeight: 18,
  },
});
