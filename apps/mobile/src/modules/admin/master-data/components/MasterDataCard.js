import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as LucideIcons from 'lucide-react-native';

export function MasterDataCard({ category, onPress }) {
  // Map standard category icon strings to Lucide icon components dynamically
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'briefcase': return <LucideIcons.Briefcase size={22} color="#4F46E5" />;
      case 'tag': return <LucideIcons.Tag size={22} color="#10B981" />;
      case 'award': return <LucideIcons.Award size={22} color="#F59E0B" />;
      case 'trending-up': return <LucideIcons.TrendingUp size={22} color="#8B5CF6" />;
      case 'domain': return <LucideIcons.Building size={22} color="#EC4899" />;
      case 'badge-account-outline': return <LucideIcons.UserCheck size={22} color="#06B6D4" />;
      case 'map-marker-radius': return <LucideIcons.MapPin size={22} color="#F43F5E" />;
      case 'calendar-blank': return <LucideIcons.Calendar size={22} color="#3B82F6" />;
      case 'clock-check-outline': return <LucideIcons.Clock size={22} color="#10B981" />;
      case 'calendar-star': return <LucideIcons.CalendarDays size={22} color="#D97706" />;
      case 'clock-time-four': return <LucideIcons.Clock4 size={22} color="#6366F1" />;
      case 'file-document-outline': return <LucideIcons.FileText size={22} color="#374151" />;
      case 'monitor-cellphone': return <LucideIcons.Laptop size={22} color="#1E3A8A" />;
      case 'school-outline': return <LucideIcons.GraduationCap size={22} color="#7C3AED" />;
      case 'flag-outline': return <LucideIcons.Flag size={22} color="#EF4444" />;
      case 'translate': return <LucideIcons.Languages size={22} color="#3B82F6" />;
      case 'account-heart': return <LucideIcons.Heart size={22} color="#EC4899" />;
      case 'water-percent': return <LucideIcons.Droplet size={22} color="#DC2626" />;
      case 'gender-transgender': return <LucideIcons.User size={22} color="#8B5CF6" />;
      case 'comment-question-outline': return <LucideIcons.HelpCircle size={22} color="#6B7280" />;
      default: return <LucideIcons.Database size={22} color="#4B5563" />;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getIcon(category.icon)}
        </View>
        {category.isReadonly && (
          <View style={styles.readonlyBadge}>
            <Text style={styles.readonlyText}>Read-Only</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{category.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{category.description}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.countContainer}>
          <Text style={styles.countNumber}>{category.count}</Text>
          <Text style={styles.countLabel}>items</Text>
        </View>
        <ChevronRight size={16} color="#9CA3AF" />
      </View>
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 160,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readonlyBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  readonlyText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  content: {
    marginTop: 12,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  description: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
    marginTop: 8,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  countNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  countLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
