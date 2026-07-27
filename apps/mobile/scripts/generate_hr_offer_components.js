const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'talent-acquisition', 'offers');

const files = {
  'components/OfferCard.js': `import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { FileText, MapPin, Building, Briefcase } from 'lucide-react-native';

export const OfferCard = ({ offer, onPress }) => (
  <Pressable onPress={onPress} className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
    <View className="flex-row justify-between items-start mb-2">
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold text-base">{offer.candidate_name}</Text>
        <Text className="text-textSecondary text-sm">{offer.job_title}</Text>
      </View>
      <StatusBadge status={offer.status} />
    </View>
    <View className="flex-row items-center mt-2 flex-wrap">
      <View className="flex-row items-center mr-4 mb-2">
        <Building size={14} color="#64748B" className="mr-1" />
        <Text className="text-textSecondary text-xs">{offer.department}</Text>
      </View>
      <View className="flex-row items-center mr-4 mb-2">
        <MapPin size={14} color="#64748B" className="mr-1" />
        <Text className="text-textSecondary text-xs">{offer.location}</Text>
      </View>
      <View className="flex-row items-center mb-2">
        <Briefcase size={14} color="#64748B" className="mr-1" />
        <Text className="text-textSecondary text-xs">{offer.employment_type}</Text>
      </View>
    </View>
  </Pressable>
);
`,

  'components/HiringDecisionCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { UserCheck, UserX, Clock, AlertTriangle } from 'lucide-react-native';

export const HiringDecisionCard = ({ decision }) => {
  let Icon = Clock;
  let color = '#64748B';
  let bgColor = 'bg-gray-100';

  if (decision.decision === 'Approve') {
    Icon = UserCheck;
    color = '#10B981';
    bgColor = 'bg-success/10';
  } else if (decision.decision === 'Reject') {
    Icon = UserX;
    color = '#EF4444';
    bgColor = 'bg-error/10';
  } else if (decision.decision === 'Escalate') {
    Icon = AlertTriangle;
    color = '#F59E0B';
    bgColor = 'bg-warning/10';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-start">
      <View className={\`w-10 h-10 rounded-full items-center justify-center mr-3 \${bgColor}\`}>
        <Icon size={20} color={color} />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-textPrimary font-semibold">{decision.decision}</Text>
          <Text className="text-textSecondary text-xs">{new Date(decision.decided_at).toLocaleDateString()}</Text>
        </View>
        <Text className="text-textSecondary text-xs mb-2">By {decision.decided_by}</Text>
        {decision.notes ? (
          <View className="bg-surface p-2 rounded border border-border">
            <Text className="text-textSecondary text-sm">{decision.notes}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Offer component files created successfully.');
