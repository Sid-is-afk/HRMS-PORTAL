import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, RadioButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useInterviewFeedback } from '../hooks/useInterviewFeedback';
import { interviewFeedbackSchema } from '../validation/pipelineSchema';
import { Star } from 'lucide-react-native';

const RECOMMENDATION_OPTIONS = [
  { label: 'Strong Hire', value: 'STRONG_HIRE' },
  { label: 'Hire', value: 'HIRE' },
  { label: 'Hold', value: 'HOLD' },
  { label: 'No Hire', value: 'NO_HIRE' },
  { label: 'Strong No Hire', value: 'STRONG_NO_HIRE' },
];

export default function FeedbackFormScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { interviewId, candidateId } = route.params || {};

  const { submitFeedback, isLoading } = useInterviewFeedback();

  const [score, setScore] = useState(3);
  const [recommendation, setRecommendation] = useState('HIRE');
  const [comments, setComments] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async () => {
    setFormError('');

    const inputData = {
      score,
      recommendation,
      comments,
    };

    const validation = interviewFeedbackSchema.safeParse(inputData);
    if (!validation.success) {
      setFormError(validation.error.errors[0]?.message || 'Validation failed.');
      return;
    }

    try {
      await submitFeedback(interviewId, {
        ...validation.data,
        interviewerName: 'HR Assessor',
      }, candidateId);
      Alert.alert('Success', 'Feedback submitted successfully. Candidate record updated.');
      navigation.navigate('CandidateProfile', { candidateId });
    } catch (err) {
      setFormError(err.message || 'Failed to submit feedback.');
    }
  };

  return (
    <HRWorkspaceScreen title="Interview Feedback Form">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Submit Evaluation</Text>

          {formError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Overall Assessment Score</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={32}
                fill={s <= score ? '#F59E0B' : 'transparent'}
                color={s <= score ? '#F59E0B' : '#D1D5DB'}
                onPress={() => setScore(s)}
                style={styles.starIcon}
              />
            ))}
            <Text style={styles.scoreDisplay}>{score} / 5</Text>
          </View>

          <Text style={styles.label}>Hiring Recommendation</Text>
          <RadioButton.Group onValueChange={setRecommendation} value={recommendation}>
            {RECOMMENDATION_OPTIONS.map((opt) => (
              <View key={opt.value} style={styles.radioRow}>
                <RadioButton.Android value={opt.value} color="#2563EB" />
                <Text style={styles.radioLabel}>{opt.label}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <Text style={styles.label}>Evaluation Comments & Feedback Notes</Text>
          <TextInput
            mode="outlined"
            placeholder="Document technical performance, strengths, weaknesses, and code challenge reviews..."
            value={comments}
            onChangeText={setComments}
            multiline
            numberOfLines={6}
            style={styles.input}
            activeOutlineColor="#2563EB"
          />

          <Button
            mode="contained"
            buttonColor="#2563EB"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitBtn}
          >
            Submit Feedback
          </Button>
        </View>
      </ScrollView>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  starIcon: {
    marginRight: 4,
  },
  scoreDisplay: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitBtn: {
    borderRadius: 8,
    elevation: 0,
    marginTop: 10,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
});
