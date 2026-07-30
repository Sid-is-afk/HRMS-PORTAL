import React, { useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet, RefreshControl, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformDashboardHeader } from '../components/PlatformDashboardHeader';
import { PlatformSummaryCard } from '../components/PlatformSummaryCard';
import { PlatformQuickActionCard } from '../components/PlatformQuickActionCard';
import { PlatformActivityCard } from '../components/PlatformActivityCard';
import { PlatformHealthPanel } from '../components/PlatformHealthPanel';
import { PlatformPendingActions } from '../components/PlatformPendingActions';
import { PlatformAnalyticsWidget } from '../components/PlatformAnalyticsWidget';
import { PlatformSectionHeader } from '../components/PlatformSectionHeader';
import { usePlatformDashboard } from '../hooks/usePlatformDashboard';
import {
  Building2,
  Users,
  Activity,
  Wifi,
  Bell,
  Search,
  Settings,
  BarChart3,
  PlusCircle,
  UserPlus,
} from 'lucide-react-native';

export default function PlatformDashboardScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { dashboardSummary, activities, isLoading, error, refresh } = usePlatformDashboard();

  const isWide = width >= 768;

  const handleRefresh = useCallback(() => {
    if (refresh) refresh();
  }, [refresh]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <PlatformDashboardHeader />
      <LoadingOverlay visible={isLoading} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
      >
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* ─── KPI Cards ──────────────────────────────── */}
        <PlatformSectionHeader title="Overview" subtitle="Key platform metrics" />
        {dashboardSummary && (
          <View style={[styles.kpiGrid, isWide && styles.kpiGridWide]}>
            <PlatformSummaryCard
              title="Organizations"
              value={dashboardSummary.totalOrganizations}
              icon={Building2}
              onPress={() => navigation.navigate('TenantDirectory')}
            />
            <PlatformSummaryCard
              title="Platform Users"
              value={dashboardSummary.platformUsers}
              icon={Users}
              onPress={() => navigation.navigate('PlatformUsers')}
            />
            <PlatformSummaryCard
              title="System Health"
              value={dashboardSummary.systemHealth}
              status={dashboardSummary.systemHealth}
              icon={Activity}
              onPress={() => navigation.navigate('HealthCenter')}
            />
            <PlatformSummaryCard
              title="API Status"
              value={dashboardSummary.apiHealth}
              status={dashboardSummary.apiHealth}
              icon={Wifi}
              onPress={() => navigation.navigate('ApiStatus')}
            />
          </View>
        )}

        {/* ─── Quick Actions ──────────────────────────── */}
        <PlatformSectionHeader title="Quick Actions" subtitle="Frequently used actions" />
        <View style={[styles.quickActionsRow, isWide && styles.quickActionsWide]}>
          <PlatformQuickActionCard
            label="Create Organization"
            icon={PlusCircle}
            onPress={() => navigation.navigate('ProvisioningWizard')}
          />
          <PlatformQuickActionCard
            label="Add Platform Admin"
            icon={UserPlus}
            onPress={() => navigation.navigate('PlatformUsers')}
          />
          <PlatformQuickActionCard
            label="Global Search"
            icon={Search}
            onPress={() => navigation.navigate('GlobalSearch')}
          />
        </View>
        <View style={[styles.quickActionsRow, isWide && styles.quickActionsWide]}>
          <PlatformQuickActionCard
            label="Notifications"
            icon={Bell}
            onPress={() => navigation.navigate('PlatformNotifications')}
          />
          <PlatformQuickActionCard
            label="Reports"
            icon={BarChart3}
            onPress={() => navigation.navigate('ExecutiveDashboard')}
          />
          <PlatformQuickActionCard
            label="Settings"
            icon={Settings}
            onPress={() => navigation.navigate('PlatformConfiguration')}
          />
        </View>

        {/* ─── Two-Column: Health + Pending ────────────── */}
        <View style={[styles.twoColSection, !isWide && styles.singleCol]}>
          <View style={[styles.twoColItem, !isWide && styles.singleColItem]}>
            <PlatformSectionHeader title="Platform Health" subtitle="Service status" />
            <PlatformHealthPanel />
          </View>
          <View style={[styles.twoColItem, !isWide && styles.singleColItem]}>
            <PlatformSectionHeader title="Action Center" subtitle="Items needing attention" />
            <PlatformPendingActions />
          </View>
        </View>

        {/* ─── Analytics ──────────────────────────────── */}
        <PlatformSectionHeader
          title="Platform Analytics"
          subtitle="Growth & usage insights"
          onViewAll={() => navigation.navigate('CrossTenantAnalytics')}
        />
        <PlatformAnalyticsWidget />

        {/* ─── Recent Activity Timeline ───────────────── */}
        <View style={styles.activitySection}>
          <PlatformSectionHeader
            title="Recent Activity"
            subtitle="Latest platform events"
            onViewAll={() => navigation.navigate('PlatformOverview')}
          />
          <View style={styles.activityTimeline}>
            {activities.map((activity, index) => (
              <PlatformActivityCard
                key={activity.id}
                activity={activity}
                isLast={index === activities.length - 1}
              />
            ))}
            {activities.length === 0 && (
              <Text style={styles.emptyText}>No recent activity</Text>
            )}
          </View>
        </View>

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },

  /* KPI Grid */
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  kpiGridWide: {
    gap: 12,
  },

  /* Quick Actions */
  quickActionsRow: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: -5,
  },
  quickActionsWide: {
    maxWidth: 600,
  },

  /* Two Column Layout */
  twoColSection: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  singleCol: {
    flexDirection: 'column',
    gap: 24,
  },
  twoColItem: {
    flex: 1,
  },
  singleColItem: {
    flex: 0,
  },

  /* Activity */
  activitySection: {
    marginTop: 16,
  },
  activityTimeline: {
    paddingLeft: 4,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 24,
  },

  bottomSpacer: {
    height: 40,
  },
});
