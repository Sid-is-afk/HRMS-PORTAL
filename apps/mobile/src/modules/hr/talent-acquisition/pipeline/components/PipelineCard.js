import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { Briefcase, ArrowRightLeft } from 'lucide-react-native';

export default function PipelineCard({ candidate, onPress, onMoveStage }) {
  const { firstName, lastName, experienceYears, skills } = candidate;
  const fullName = `${firstName} ${lastName}`;

  return (
    <Card style={styles.card} mode="outlined">
      <Pressable onPress={onPress} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{fullName}</Text>
          {onMoveStage && (
            <IconButton
              icon={() => <ArrowRightLeft size={16} color="#6B7280" />}
              size={20}
              onPress={onMoveStage}
              style={styles.moveBtn}
            />
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.info}>
            <Briefcase size={12} color="#9CA3AF" />
            <Text style={styles.infoText}>{experienceYears} yrs exp</Text>
          </View>
          <Text style={styles.skills} numberOfLines={1}>
            {skills.slice(0, 2).join(', ')}
          </Text>
        </View>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    elevation: 0,
  },
  container: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  moveBtn: {
    margin: 0,
    padding: 0,
  },
  body: {
    gap: 4,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    color: '#6B7280',
  },
  skills: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
