import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { useOffers } from '../hooks/useOffers';
import { Button } from '@/shared/components/Button';
import { Send, XCircle } from 'lucide-react-native';

export default function OfferDetailsScreen({ route }) {
  const { offerId } = route?.params || {};
  const { allOffers } = useOffers();
  
  const offer = allOffers.find(o => o.id === offerId);

  if (!offer) {
    return (
      <View className="flex-1 bg-surface">
        <TopHeader title="Offer Details" showBack={true} />
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-textSecondary">Offer not found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Offer Details" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-textPrimary font-bold text-xl">{offer.candidate_name}</Text>
              <Text className="text-textSecondary">{offer.job_title}</Text>
            </View>
            <StatusBadge status={offer.status} />
          </View>
          
          <View className="flex-row mb-2">
            <Text className="text-textSecondary w-32">Requisition:</Text>
            <Text className="text-textPrimary font-medium">{offer.requisition_id}</Text>
          </View>
          <View className="flex-row mb-2">
            <Text className="text-textSecondary w-32">Department:</Text>
            <Text className="text-textPrimary font-medium">{offer.department}</Text>
          </View>
          <View className="flex-row mb-2">
            <Text className="text-textSecondary w-32">Location:</Text>
            <Text className="text-textPrimary font-medium">{offer.location}</Text>
          </View>
          <View className="flex-row mb-2">
            <Text className="text-textSecondary w-32">Type:</Text>
            <Text className="text-textPrimary font-medium">{offer.employment_type}</Text>
          </View>
        </View>

        <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
          <Text className="text-textPrimary font-bold text-lg mb-3">Compensation Summary</Text>
          <View className="flex-row justify-between py-2 border-b border-border/50">
            <Text className="text-textSecondary">Base Salary</Text>
            <Text className="text-textPrimary font-semibold">{offer.compensation?.currency} {offer.compensation?.base_salary.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-border/50">
            <Text className="text-textSecondary">Bonus</Text>
            <Text className="text-textPrimary font-semibold">{offer.compensation?.currency} {offer.compensation?.bonus.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-textSecondary">Equity</Text>
            <Text className="text-textPrimary font-semibold">{offer.compensation?.currency} {offer.compensation?.equity.toLocaleString()}</Text>
          </View>
        </View>

        <Text className="text-textSecondary text-xs mb-4 text-center">
          Offer operations (Approve, Send, Withdraw) are simulated here.
        </Text>
        
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Button 
              title="Send Offer" 
              variant="primary"
              icon={<Send size={16} color="white" />}
              onPress={() => console.log('Send Offer clicked')}
            />
          </View>
          <View className="flex-1 ml-2">
            <Button 
              title="Withdraw" 
              variant="outline"
              icon={<XCircle size={16} color="#0EA5E9" />}
              onPress={() => console.log('Withdraw Offer clicked')}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
