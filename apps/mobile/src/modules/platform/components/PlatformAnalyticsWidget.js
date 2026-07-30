import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Users, BarChart3 } from 'lucide-react-native';

/* ─── Mock Data ────────────────────────────────────────────── */
const ORG_GROWTH = [
  { month: 'Jan', value: 98 },
  { month: 'Feb', value: 106 },
  { month: 'Mar', value: 112 },
  { month: 'Apr', value: 120 },
  { month: 'May', value: 131 },
  { month: 'Jun', value: 145 },
];

const USER_DISTRIBUTION = [
  { label: 'Admins', count: 12, color: '#2563EB', pct: 25 },
  { label: 'HR Users', count: 18, color: '#16A34A', pct: 38 },
  { label: 'Employees', count: 14, color: '#EA580C', pct: 29 },
  { label: 'Viewers', count: 4, color: '#7C3AED', pct: 8 },
];

const API_USAGE = [
  { label: 'GET', count: 12400, color: '#2563EB', pct: 85 },
  { label: 'POST', count: 3200, color: '#16A34A', pct: 55 },
  { label: 'PUT', count: 1800, color: '#EA580C', pct: 35 },
  { label: 'DELETE', count: 420, color: '#DC2626', pct: 15 },
];

/* ─── Sparkline (simplified bar chart) ─────────────────────── */
function SparkBars({ data, color }) {
  const maxVal = Math.max(...data.map((d) => d.value));
  return (
    <View style={sparkStyles.container}>
      {data.map((d) => (
        <View key={d.month} style={sparkStyles.barCol}>
          <View
            style={[
              sparkStyles.bar,
              {
                height: `${(d.value / maxVal) * 100}%`,
                backgroundColor: color,
              },
            ]}
          />
          <Text style={sparkStyles.barLabel}>{d.month}</Text>
        </View>
      ))}
    </View>
  );
}

const sparkStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 6,
    marginTop: 12,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 4,
  },
});

/* ─── Horizontal Distribution Bar ──────────────────────────── */
function DistributionBar({ items }) {
  return (
    <View style={distStyles.wrapper}>
      <View style={distStyles.barRow}>
        {items.map((item) => (
          <View
            key={item.label}
            style={[distStyles.segment, { flex: item.pct, backgroundColor: item.color }]}
          />
        ))}
      </View>
      <View style={distStyles.legendRow}>
        {items.map((item) => (
          <View key={item.label} style={distStyles.legendItem}>
            <View style={[distStyles.legendDot, { backgroundColor: item.color }]} />
            <Text style={distStyles.legendLabel}>
              {item.label} ({item.count})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const distStyles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  barRow: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    gap: 2,
  },
  segment: {
    borderRadius: 3,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});

/* ─── Horizontal Bar Chart ─────────────────────────────────── */
function HorizontalBars({ items }) {
  return (
    <View style={{ marginTop: 12, gap: 10 }}>
      {items.map((item) => (
        <View key={item.label}>
          <View style={hBarStyles.labelRow}>
            <Text style={hBarStyles.label}>{item.label}</Text>
            <Text style={[hBarStyles.count, { color: item.color }]}>
              {item.count.toLocaleString()}
            </Text>
          </View>
          <View style={hBarStyles.track}>
            <View
              style={[hBarStyles.fill, { width: `${item.pct}%`, backgroundColor: item.color }]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const hBarStyles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  count: {
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

/* ─── Analytics Card Shell ─────────────────────────────────── */
function AnalyticsCard({ title, subtitle, icon: Icon, iconColor, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={[styles.cardIconWrap, { backgroundColor: iconColor + '18' }]}>
            <Icon size={18} color={iconColor} />
          </View>
          <View>
            <Text style={styles.cardTitle}>{title}</Text>
            {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
          </View>
        </View>
      </View>
      {children}
    </View>
  );
}

/* ─── Main Export ───────────────────────────────────────────── */
export const PlatformAnalyticsWidget = memo(() => {
  return (
    <View style={styles.container}>
      <AnalyticsCard
        title="Organization Growth"
        subtitle="Last 6 months"
        icon={TrendingUp}
        iconColor="#2563EB"
      >
        <SparkBars data={ORG_GROWTH} color="#2563EB" />
      </AnalyticsCard>

      <AnalyticsCard
        title="User Distribution"
        subtitle="By role"
        icon={Users}
        iconColor="#16A34A"
      >
        <DistributionBar items={USER_DISTRIBUTION} />
      </AnalyticsCard>

      <AnalyticsCard
        title="API Usage"
        subtitle="Requests today"
        icon={BarChart3}
        iconColor="#EA580C"
      >
        <HorizontalBars items={API_USAGE} />
      </AnalyticsCard>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
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
  cardHeader: {
    marginBottom: 4,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },
});
