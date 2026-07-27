const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'talent-acquisition', 'offers');

const files = {
  'screens/OfferDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { FileText, UserCheck, Clock } from 'lucide-react-native';

export default function OfferDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Offer Management" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Manage hiring decisions and oversee candidate offers through to onboarding.
        </Text>
        
        <View className="mb-4 flex-row justify-between">
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-border mr-2 items-center">
            <Text className="text-2xl font-bold text-textPrimary">12</Text>
            <Text className="text-textSecondary text-xs">Pending</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-border mx-1 items-center">
            <Text className="text-2xl font-bold text-success">5</Text>
            <Text className="text-textSecondary text-xs">Accepted</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-border ml-2 items-center">
            <Text className="text-2xl font-bold text-error">2</Text>
            <Text className="text-textSecondary text-xs">Declined</Text>
          </View>
        </View>

        <View className="mb-4">
          <Button 
            title="Offer Directory" 
            onPress={() => navigation.navigate('OfferDirectory')} 
            styleClass="bg-primary"
            icon={<FileText size={20} color="white" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Decision Center" 
            onPress={() => navigation.navigate('DecisionCenter')} 
            styleClass="bg-surface border border-border"
            textClass="text-textPrimary"
            icon={<UserCheck size={20} color="#64748B" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
`,

  'screens/OfferDirectoryScreen.js': `import React from 'react';
import { View, FlatList, Text, TextInput } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { OfferCard } from '../components/OfferCard';
import { useOffers } from '../hooks/useOffers';
import { useOfferStore } from '../store/offerStore';
import { useNavigation } from '@react-navigation/native';
import { Search } from 'lucide-react-native';

export default function OfferDirectoryScreen() {
  const { offers, isLoading, error } = useOffers();
  const { searchQuery, setSearchQuery } = useOfferStore();
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Offers" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <View className="p-4 border-b border-border bg-white">
        <View className="flex-row items-center bg-surface px-3 py-2 rounded-lg border border-border">
          <Search size={20} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 font-inter text-base text-textPrimary"
            placeholder="Search candidates or jobs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <OfferCard 
            offer={item} 
            onPress={() => navigation.navigate('OfferDetails', { offerId: item.id })}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No offers found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/OfferDetailsScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { useOffers } from '../hooks/useOffers';
import { Button } from '@/shared/components/Button';
import { Send, CheckCircle, XCircle } from 'lucide-react-native';

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
`,

  'screens/DecisionCenterScreen.js': `import React from 'react';
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
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Offer screen files created successfully.');
