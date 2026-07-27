import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { HiringDecisionCard } from '../components/HiringDecisionCard';
import { useOfferStore } from '../store/offerStore';

export default function DecisionCenterScreen() {
  const { hiringDecisions } = useOfferStore();

  const mockDecisions = [
    { id: '1', decision: 'Approve', decided_at: new Date().toISOString(), decided_by: 'Jane Doe', notes: 'Excellent technical fit.' },
    { id: '2', decision: 'Hold', decided_at: new Date(Date.now() - 86400000).toISOString(), decided_by: 'John Smith', notes: 'Waiting for background check.' }
  ];

  const decisions = hiringDecisions.length > 0 ? hiringDecisions : mockDecisions;

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Hiring Decisions" showBack={true} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Review recent hiring decisions across all open requisitions.
        </Text>
        
        {decisions.map(decision => (
          <HiringDecisionCard key={decision.id} decision={decision} />
        ))}
      </ScrollView>
    </View>
  );
}
