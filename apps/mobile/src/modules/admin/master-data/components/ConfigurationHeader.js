import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Download, Upload, Info } from 'lucide-react-native';

export function ConfigurationHeader({ category, onImport, onExport }) {
  if (!category) return null;

  return (
    <View style={styles.header}>
      <View style={styles.infoWrapper}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{category.name}</Text>
          {category.isReadonly && (
            <View style={styles.readonlyBadge}>
              <Text style={styles.readonlyText}>Organization Consumed</Text>
            </View>
          )}
        </View>
        <Text style={styles.description}>{category.description}</Text>
        
        {category.isReadonly && (
          <View style={styles.noticeBox}>
            <Info size={14} color="#0284C7" />
            <Text style={styles.noticeText}>
              This reference data is read-only. It is owned by the Organization module and cannot be configured inside Master Data.
            </Text>
          </View>
        )}
      </View>

      {!category.isReadonly && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.secondaryBtn]} onPress={onImport}>
            <Upload size={14} color="#4B5563" />
            <Text style={styles.secondaryBtnText}>Import JSON</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.primaryBtn]} onPress={onExport}>
            <Download size={14} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Export JSON</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  infoWrapper: {
    flex: 1,
    minWidth: 280,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  readonlyBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  readonlyText: {
    fontSize: 10,
    color: '#0369A1',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 16,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#E0F2FE',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  noticeText: {
    fontSize: 11,
    color: '#0369A1',
    flex: 1,
    lineHeight: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    minWidth: 200,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
    borderWidth: 1,
  },
  primaryBtn: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  secondaryBtnText: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '600',
  },
});
