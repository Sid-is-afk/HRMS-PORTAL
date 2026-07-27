import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { Mail, Phone, Tag } from 'lucide-react-native';
import CandidateStageBadge from './CandidateStageBadge';

export default function CandidateProfileHeader({ candidate }) {
  const { firstName, lastName, email, phone, currentJobTitle, stage, tags = [] } = candidate;
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topInfo}>
        <Avatar.Text size={56} label={initials} style={styles.avatar} labelStyle={styles.avatarLabel} />
        <View style={styles.titleColumn}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.job}>{currentJobTitle}</Text>
          <View style={styles.badgeRow}>
            <CandidateStageBadge stage={stage} />
          </View>
        </View>
      </View>

      <View style={styles.contactSection}>
        <View style={styles.contactItem}>
          <Mail size={14} color="#6B7280" />
          <Text style={styles.contactText}>{email}</Text>
        </View>
        <View style={styles.contactItem}>
          <Phone size={14} color="#6B7280" />
          <Text style={styles.contactText}>{phone}</Text>
        </View>
      </View>

      {tags.length > 0 && (
        <View style={styles.tagsRow}>
          <Tag size={12} color="#9CA3AF" style={styles.tagIcon} />
          <View style={styles.tagsGrid}>
            {tags.map((t, idx) => (
              <View key={idx} style={styles.tagBadge}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  topInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#EFF6FF',
  },
  avatarLabel: {
    color: '#2563EB',
    fontWeight: '700',
  },
  titleColumn: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  job: {
    fontSize: 14,
    color: '#4B5563',
  },
  badgeRow: {
    marginTop: 4,
  },
  contactSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 12,
    color: '#4B5563',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagIcon: {
    marginTop: 2,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '600',
  },
});
