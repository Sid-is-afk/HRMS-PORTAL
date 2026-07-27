import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import JobStatusBadge from './JobStatusBadge';

export default function JobPostingCard({ posting, onArchive, onPress }) {
  const formattedExpiry = posting.expirationDate 
    ? new Date(posting.expirationDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No Expiry';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.title}>{posting.title}</Text>
          <Text style={styles.meta}>{posting.type} Posting • Expiry: {formattedExpiry}</Text>
        </View>
        <JobStatusBadge status={posting.status} />
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {posting.description}
      </Text>

      {posting.status === 'PUBLISHED' && onArchive && (
        <View style={styles.actions}>
          <Button 
            mode="outlined" 
            textColor="#DC2626" 
            style={styles.archiveBtn} 
            labelStyle={styles.btnText}
            onPress={() => onArchive(posting.id)}
          >
            Archive Posting
          </Button>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  titleArea: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  meta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  archiveBtn: {
    borderColor: '#DC2626',
    borderRadius: 6,
    height: 32,
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 11,
    marginVertical: 0,
  },
});
