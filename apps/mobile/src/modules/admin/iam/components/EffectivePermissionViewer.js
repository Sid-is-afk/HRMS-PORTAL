import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react-native';

export function EffectivePermissionViewer({ effectivePermissions, employeeName }) {
  if (!effectivePermissions || effectivePermissions.length === 0) {
    return (
      <View style={styles.empty}>
        <HelpCircle size={36} color="#9CA3AF" />
        <Text style={styles.emptyText}>Select an employee to preview effective permission scope.</Text>
      </View>
    );
  }

  // Sort permissions: Granted first, then alphabetically
  const sorted = [...effectivePermissions].sort((a, b) => {
    if (a.granted && !b.granted) return -1;
    if (!a.granted && b.granted) return 1;
    return a.code.localeCompare(b.code);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Effective Scope Preview: {employeeName || 'Selected User'}</Text>
      <Text style={styles.subtitle}>
        This list compiles all access rules resolved by evaluating the user's role memberships and conditional access policies.
      </Text>

      <ScrollView style={styles.list}>
        {sorted.map((perm) => (
          <View key={perm.code} style={styles.row}>
            <View style={styles.statusCol}>
              {perm.granted ? (
                <CheckCircle2 size={18} color="#16A34A" />
              ) : (
                <XCircle size={18} color="#DC2626" />
              )}
            </View>

            <View style={styles.contentCol}>
              <View style={styles.nameHeader}>
                <Text style={styles.permName}>{perm.name}</Text>
                <Text style={styles.permCode}>{perm.code}</Text>
              </View>
              <Text style={styles.permDesc}>{perm.description}</Text>

              {perm.granted ? (
                <View style={styles.sourceContainer}>
                  <Text style={styles.sourceLabel}>Inherited From: </Text>
                  <Text style={styles.sourceText}>
                    {perm.sources?.length > 0 ? perm.sources.join(', ') : 'Direct Assignment'}
                  </Text>
                </View>
              ) : (
                <View style={styles.notGrantedContainer}>
                  <Text style={styles.notGrantedText}>No roles grant this capability.</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 16,
  },
  list: {
    flex: 1,
    maxHeight: 500,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'start',
  },
  statusCol: {
    paddingTop: 2,
    paddingRight: 10,
  },
  contentCol: {
    flex: 1,
  },
  nameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  permName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  permCode: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#4B5563',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  permDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 8,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  sourceText: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '700',
  },
  notGrantedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notGrantedText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '500',
  },
  empty: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 200,
  },
  emptyText: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
});
