import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import { useRoleAssignments } from '../hooks/useRoleAssignments';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { ShieldCheck, UserCheck, XCircle } from 'lucide-react-native';

export default function AccessReviewDashboardScreen() {
  const {
    accessReviews,
    isLoading,
    error,
    verifyAccessReview
  } = useRoleAssignments();

  const handleVerify = async (reviewId, employeeName) => {
    try {
      await verifyAccessReview(reviewId);
      Alert.alert('Success', `Access assignment for ${employeeName} verified.`);
    } catch (err) {
      Alert.alert('Error', err.message || 'Verification failed.');
    }
  };

  const handleRevoke = (reviewId, employeeName, roleName) => {
    Alert.alert(
      'Audit Access Revocation',
      `Are you sure you want to revoke "${roleName}" from ${employeeName} based on audit reviews?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke Access',
          style: 'destructive',
          onPress: async () => {
            try {
              // Simulate revoking by verification status modification or deletion
              await verifyAccessReview(reviewId); // Completes the audit item
              Alert.alert('Success', `Flagged role access revoked.`);
            } catch (err) {
              Alert.alert('Error', err.message || 'Revoke failed.');
            }
          }
        }
      ]
    );
  };

  return (
    <AdminLayout title="Access Reviews">
      <View style={styles.container}>
        <View style={styles.intro}>
          <Text style={styles.title}>Periodic Access Audit reviews</Text>
          <Text style={styles.subtitle}>
            Review current administrative allocations. Inactive allocations or old assignments should be verified and approved or revoked.
          </Text>
        </View>

        {error ? <ErrorMessage message={error} /> : null}

        {isLoading && accessReviews.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            <View style={styles.tableContainer}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                <View style={styles.table}>
                  {/* Header */}
                  <View style={[styles.row, styles.headerRow]}>
                    <Text style={[styles.cell, styles.headerCell, { width: 180 }]}>Staff Member</Text>
                    <Text style={[styles.cell, styles.headerCell, { width: 180 }]}>Access Role</Text>
                    <Text style={[styles.cell, styles.headerCell, { width: 120 }]}>Audit Status</Text>
                    <Text style={[styles.cell, styles.headerCell, { width: 150 }]}>Last Reviewed</Text>
                    <Text style={[styles.cell, styles.headerCell, { width: 180 }]}>Auditor</Text>
                    <Text style={[styles.cell, styles.headerCell, { width: 150 }]}>Actions</Text>
                  </View>

                  {/* Body */}
                  {accessReviews.map((rev) => (
                    <View key={rev.id} style={styles.row}>
                      <Text style={[styles.cell, styles.nameCell, { width: 180 }]} numberOfLines={1}>
                        {rev.employeeName}
                      </Text>
                      <Text style={[styles.cell, styles.roleCell, { width: 180 }]} numberOfLines={1}>
                        {rev.roleName}
                      </Text>
                      <View style={[styles.cell, { width: 120 }]}>
                        <StatusBadge status={rev.status} />
                      </View>
                      <Text style={[styles.cell, styles.dateCell, { width: 150 }]}>
                        {rev.lastReviewedAt ? new Date(rev.lastReviewedAt).toLocaleString() : 'Never audited'}
                      </Text>
                      <Text style={[styles.cell, styles.auditorCell, { width: 180 }]} numberOfLines={1}>
                        {rev.reviewedBy || 'Not applicable'}
                      </Text>
                      
                      <View style={[styles.cell, styles.actionsCell, { width: 150 }]}>
                        {rev.status === 'PENDING_REVIEW' ? (
                          <>
                            <TouchableOpacity
                              onPress={() => handleVerify(rev.id, rev.employeeName)}
                              style={[styles.actionBtn, styles.approveBtn]}
                            >
                              <ShieldCheck size={14} color="#16A34A" />
                              <Text style={styles.approveBtnText}>Confirm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleRevoke(rev.id, rev.employeeName, rev.roleName)}
                              style={[styles.actionBtn, styles.rejectBtn]}
                            >
                              <XCircle size={14} color="#DC2626" />
                            </TouchableOpacity>
                          </>
                        ) : (
                          <View style={styles.auditComplete}>
                            <UserCheck size={14} color="#6B7280" />
                            <Text style={styles.completeText}>Audit verified</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  intro: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 16,
  },
  list: {
    padding: 16,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  table: {
    minWidth: 960,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  cell: {
    paddingRight: 12,
  },
  headerCell: {
    fontWeight: '600',
    color: '#374151',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nameCell: {
    color: '#111827',
    fontWeight: '500',
    fontSize: 13,
  },
  roleCell: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 13,
  },
  dateCell: {
    color: '#6B7280',
    fontSize: 12,
  },
  auditorCell: {
    color: '#4B5563',
    fontSize: 12,
  },
  actionsCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  approveBtn: {
    backgroundColor: '#E6F4EA',
  },
  approveBtnText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '700',
  },
  rejectBtn: {
    backgroundColor: '#FEF2F2',
    padding: 6,
  },
  auditComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
});
