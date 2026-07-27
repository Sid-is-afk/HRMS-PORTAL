const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'operations');

const files = {
  'components/ServiceRequestCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react-native';

export const ServiceRequestCard = ({ request }) => {
  let Icon = FileText;
  let color = '#64748B';
  let bgColor = 'bg-gray-100';

  if (request.status === 'Open') {
    Icon = AlertCircle;
    color = '#F59E0B';
    bgColor = 'bg-warning/10';
  } else if (request.status === 'In Progress') {
    Icon = Clock;
    color = '#0EA5E9';
    bgColor = 'bg-primary/10';
  } else if (request.status === 'Resolved' || request.status === 'Closed') {
    Icon = CheckCircle;
    color = '#10B981';
    bgColor = 'bg-success/10';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
      <View className="flex-row items-center mb-2">
        <View className={\`w-10 h-10 rounded-full items-center justify-center mr-3 \${bgColor}\`}>
          <Icon size={20} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-textPrimary font-semibold text-base">{request.id} - {request.category}</Text>
          <Text className="text-textSecondary text-xs">Employee: {request.employee_id}</Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center mt-2 border-t border-border/50 pt-2">
        <Text className="text-textSecondary text-xs">Priority: {request.priority}</Text>
        <Text style={{ color }} className="text-xs font-bold">{request.status}</Text>
      </View>
    </View>
  );
};
`,

  'components/CaseCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { Briefcase, AlertTriangle, UserCheck } from 'lucide-react-native';

export const CaseCard = ({ hrCase }) => {
  const isEscalated = hrCase.status === 'Escalated' || hrCase.priority === 'Urgent';

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center flex-1 pr-2">
          {isEscalated ? (
            <AlertTriangle size={18} color="#EF4444" className="mr-2" />
          ) : (
            <Briefcase size={18} color="#64748B" className="mr-2" />
          )}
          <Text className="text-textPrimary font-semibold text-base flex-1">{hrCase.title}</Text>
        </View>
        <View className={\`px-2 py-1 rounded \${isEscalated ? 'bg-error/10' : 'bg-surface'}\`}>
          <Text className={\`text-xs font-bold \${isEscalated ? 'text-error' : 'text-textSecondary'}\`}>{hrCase.status}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center mt-2">
        <UserCheck size={14} color="#94A3B8" className="mr-1" />
        <Text className="text-textSecondary text-xs">
          {hrCase.assignee_id ? \`Assigned: \${hrCase.assignee_id}\` : 'Unassigned'}
        </Text>
      </View>
    </View>
  );
};
`,

  'components/AutomationRuleCard.js': `import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Zap, ArrowRight } from 'lucide-react-native';

export const AutomationRuleCard = ({ rule }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
    <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
      <Zap size={20} color="#0EA5E9" />
    </View>
    <View className="flex-1 pr-2">
      <Text className="text-textPrimary font-semibold text-base mb-1">{rule.name}</Text>
      <View className="flex-row items-center flex-wrap">
        <Text className="text-textSecondary text-xs">{rule.trigger}</Text>
        <ArrowRight size={12} color="#64748B" className="mx-1" />
        <Text className="text-primary text-xs font-medium">{rule.action}</Text>
      </View>
    </View>
    <Switch 
      value={rule.is_active} 
      onValueChange={() => {}}
      trackColor={{ false: '#CBD5E1', true: '#0EA5E9' }}
    />
  </View>
);
`,

  'components/ReminderCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { Bell, Calendar } from 'lucide-react-native';

export const ReminderCard = ({ reminder }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
    <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-3">
      <Bell size={20} color="#64748B" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold">{reminder.title}</Text>
      <View className="flex-row items-center mt-1">
        <Calendar size={12} color="#94A3B8" className="mr-1" />
        <Text className="text-textSecondary text-xs">Due: {new Date(reminder.due_date).toLocaleDateString()} • {reminder.type}</Text>
      </View>
    </View>
    <Text className="text-textSecondary text-xs font-bold">{reminder.status}</Text>
  </View>
);
`,

  'components/ApprovalQueueCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { CheckSquare, User } from 'lucide-react-native';

export const ApprovalQueueCard = ({ approval }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
    <View className="flex-row items-center mb-2">
      <CheckSquare size={16} color="#10B981" className="mr-2" />
      <Text className="text-textPrimary font-semibold text-base">{approval.summary}</Text>
    </View>
    <View className="flex-row items-center justify-between mt-1">
      <View className="flex-row items-center">
        <User size={12} color="#94A3B8" className="mr-1" />
        <Text className="text-textSecondary text-xs">Req by: {approval.requested_by}</Text>
      </View>
      <Text className="text-textSecondary text-xs bg-surface px-2 py-1 rounded">
        {approval.source_module}
      </Text>
    </View>
  </View>
);
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Operations component files created successfully.');
