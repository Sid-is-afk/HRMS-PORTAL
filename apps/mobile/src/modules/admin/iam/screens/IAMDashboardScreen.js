import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../hooks/usePermissions';
import { useRoleAssignments } from '../hooks/useRoleAssignments';
import { useAccessPolicies } from '../hooks/useAccessPolicies';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { Users, FileLock2, ShieldCheck, ClipboardCheck, ArrowRight } from 'lucide-react-native';

export default function IAMDashboardScreen() {
  const navigation = useNavigation();
  const { roles, isLoading: rolesLoading, error: rolesError } = useRoles();
  const { permissions, isLoading: permsLoading, error: permsError } = usePermissions();
  const { accessReviews, isLoading: asgnsLoading, error: asgnsError } = useRoleAssignments();
  const { accessPolicies, isLoading: policiesLoading, error: policiesError } = useAccessPolicies();

  const isLoading = rolesLoading || permsLoading || asgnsLoading || policiesLoading;
  const error = rolesError || permsError || asgnsError || policiesError;

  const pendingReviewsCount = accessReviews.filter(r => r.status === 'PENDING_REVIEW').length;

  if (isLoading && roles.length === 0) {
    return (
      <AdminLayout title="IAM Console">
        <SkeletonDashboard />
      </AdminLayout>
    );
  }

  const statCards = [
    { title: 'User Roles', count: roles.length, subtitle: 'Configured role profiles', icon: Users, color: '#3B82F6', bg: '#EFF6FF' },
    { title: 'System Permissions', count: permissions.length, subtitle: 'Registered access scopes', icon: ShieldCheck, color: '#10B981', bg: '#E6F4EA' },
    { title: 'Access Policies', count: accessPolicies.length, subtitle: 'Conditional rule-sets', icon: FileLock2, color: '#F59E0B', bg: '#FEF7E0' },
    { title: 'Access Audits', count: pendingReviewsCount, subtitle: 'Pending reviews', icon: ClipboardCheck, color: '#DC2626', bg: '#FEF2F2' },
  ];

  const quickLinks = [
    { title: 'Role Directory', desc: 'Create, update, deactivate or archive employee roles.', route: 'RoleDirectory' },
    { title: 'Permission Matrix', desc: 'Interactive grid mapping permissions to active roles.', route: 'PermissionMatrix' },
    { title: 'Role Assignments', desc: 'Assign and transfer administrative roles for staff.', route: 'RoleAssignment' },
    { title: 'User Permission Viewer', desc: 'Evaluate effective permissions and check sources.', route: 'UserPermissionViewer' },
    { title: 'Conditional Access Policies', desc: 'Configure IP boundaries, time windows and MFA.', route: 'AccessPolicyDirectory' },
    { title: 'Access Audit Console', desc: 'Re-verify employee role assignments and revoke logs.', route: 'AccessReviewDashboard' },
  ];

  return (
    <AdminLayout title="IAM Console">
      <ScrollView contentContainerStyle={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <View key={stat.title} style={styles.statCard}>
                <View style={[styles.iconContainer, { backgroundColor: stat.bg }]}>
                  <Icon size={24} color={stat.color} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statCount}>{stat.count}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <Text style={styles.statSub}>{stat.subtitle}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Links Section */}
        <Text style={styles.sectionTitle}>Identity Operations</Text>
        <View style={styles.linksGrid}>
          {quickLinks.map((link) => (
            <TouchableOpacity
              key={link.title}
              style={styles.linkCard}
              onPress={() => navigation.navigate(link.route)}
              activeOpacity={0.7}
            >
              <View style={styles.linkContent}>
                <Text style={styles.linkTitle}>{link.title}</Text>
                <Text style={styles.linkDesc}>{link.desc}</Text>
              </View>
              <View style={styles.linkArrow}>
                <ArrowRight size={16} color="#3B82F6" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statCount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 2,
  },
  statSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  linkCard: {
    width: '48%',
    minWidth: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkContent: {
    flex: 1,
    paddingRight: 16,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  linkDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  linkArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
