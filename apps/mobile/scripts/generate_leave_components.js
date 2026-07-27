const fs = require('fs');
const path = require('path');

const componentsDir = path.join('src', 'modules', 'admin', 'leave', 'components');

const components = {
  'LeaveCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { Calendar } from 'lucide-react-native';

export const LeaveCard = ({ request, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3"
    onPress={onPress}
  >
    <View className="flex-row justify-between items-start mb-2">
      <Text className="text-textPrimary font-semibold text-base">{request.leave_type_name}</Text>
      <StatusBadge status={request.status} />
    </View>
    <View className="flex-row items-center mt-1">
      <Calendar size={14} color="#64748B" />
      <Text className="text-textSecondary ml-1 text-sm">{request.start_date} to {request.end_date}</Text>
    </View>
    <Text className="text-textSecondary text-xs mt-2" numberOfLines={1}>{request.reason}</Text>
  </TouchableOpacity>
);
`,

  'LeaveBalanceCard.js': `import React from 'react';
import { View, Text } from 'react-native';

export const LeaveBalanceCard = ({ balance }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
    <Text className="text-textPrimary font-semibold text-base mb-3">{balance.leave_type_name}</Text>
    <View className="flex-row justify-between">
      <View>
        <Text className="text-textSecondary text-xs">Allocated</Text>
        <Text className="text-textPrimary font-medium">{balance.allocated}</Text>
      </View>
      <View>
        <Text className="text-textSecondary text-xs">Consumed</Text>
        <Text className="text-textPrimary font-medium">{balance.consumed}</Text>
      </View>
      <View>
        <Text className="text-textSecondary text-xs">Balance</Text>
        <Text className="text-primary font-bold">{balance.balance}</Text>
      </View>
    </View>
  </View>
);
`,

  'LeaveApprovalCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';

export const LeaveApprovalCard = ({ approval, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-3">
      <User size={20} color="#64748B" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold">{approval.employee_name}</Text>
      <Text className="text-textSecondary text-xs">{approval.leave_type_name} ({approval.days} days)</Text>
    </View>
    <StatusBadge status="PENDING" />
  </TouchableOpacity>
);
`
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join(componentsDir, filename), content);
}
console.log('Components created successfully.');
