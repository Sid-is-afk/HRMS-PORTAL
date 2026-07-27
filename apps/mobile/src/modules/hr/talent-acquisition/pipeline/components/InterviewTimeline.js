import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { CheckCircle, AlertCircle, Clock, Calendar, MessageSquare } from 'lucide-react-native';

export default function InterviewTimeline({ timeline = [] }) {
  if (timeline.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No timeline history available.</Text>
      </View>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'CANDIDATE_CREATED':
        return <Calendar size={14} color="#3B82F6" />;
      case 'CANDIDATE_ADVANCED':
        return <CheckCircle size={14} color="#10B981" />;
      case 'INTERVIEW_SCHEDULED':
        return <Clock size={14} color="#F59E0B" />;
      case 'INTERVIEW_COMPLETED':
        return <CheckCircle size={14} color="#059669" />;
      case 'NOTE_ADDED':
        return <MessageSquare size={14} color="#7C3AED" />;
      default:
        return <AlertCircle size={14} color="#6B7280" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'CANDIDATE_CREATED':
        return '#DBEAFE';
      case 'CANDIDATE_ADVANCED':
        return '#D1FAE5';
      case 'INTERVIEW_SCHEDULED':
        return '#FEF3C7';
      case 'INTERVIEW_COMPLETED':
        return '#D1FAE5';
      case 'NOTE_ADDED':
        return '#F3E8FF';
      default:
        return '#F3F4F6';
    }
  };

  return (
    <View style={styles.timelineContainer}>
      {timeline.map((item, index) => {
        const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        return (
          <View key={item.id} style={styles.timelineItem}>
            {/* Left line segment */}
            <View style={styles.leftColumn}>
              <View style={[styles.iconWrapper, { backgroundColor: getIconBg(item.type) }]}>
                {getIcon(item.type)}
              </View>
              {index < timeline.length - 1 && <View style={styles.line} />}
            </View>

            {/* Right content segment */}
            <View style={styles.rightColumn}>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.actor}>by {item.performedBy}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.time}>{formattedDate}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  timelineContainer: {
    paddingVertical: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 8,
    minHeight: 60,
  },
  leftColumn: {
    alignItems: 'center',
    width: 32,
    marginRight: 12,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  rightColumn: {
    flex: 1,
    paddingBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  actor: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  dot: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  time: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  empty: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
