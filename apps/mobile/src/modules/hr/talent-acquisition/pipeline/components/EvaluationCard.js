import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Star } from 'lucide-react-native';

export default function EvaluationCard({ feedback }) {
  const { interviewerName, score, recommendation, comments, submittedAt } = feedback;

  const getRecColor = () => {
    switch (recommendation) {
      case 'STRONG_HIRE':
      case 'HIRE':
        return { bg: '#D1FAE5', text: '#065F46' };
      case 'HOLD':
        return { bg: '#FEF3C7', text: '#92400E' };
      default:
        return { bg: '#FEE2E2', text: '#B91C1C' };
    }
  };

  const recStyle = getRecColor();
  const formattedDate = new Date(submittedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.interviewer}>{interviewerName}</Text>
          <View style={[styles.badge, { backgroundColor: recStyle.bg }]}>
            <Text style={[styles.badgeText, { color: recStyle.text }]}>{recommendation.replace('_', ' ')}</Text>
          </View>
        </View>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={16}
              fill={s <= score ? '#F59E0B' : 'transparent'}
              color={s <= score ? '#F59E0B' : '#D1D5DB'}
            />
          ))}
          <Text style={styles.scoreText}>{score} / 5</Text>
        </View>

        <Text style={styles.comments}>{comments}</Text>

        <Text style={styles.date}>Submitted on {formattedDate}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    elevation: 0,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  interviewer: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
    marginLeft: 6,
  },
  comments: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  date: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
