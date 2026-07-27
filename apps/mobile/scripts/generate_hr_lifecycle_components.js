const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'employee-lifecycle');

const files = {
  'components/EmployeeConversionCard.js': `import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { UserPlus, Building, Briefcase } from 'lucide-react-native';

export const EmployeeConversionCard = ({ conversion, onPress }) => (
  <Pressable onPress={onPress} className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
    <View className="flex-row items-center mb-2">
      <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
        <UserPlus size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold text-base">{conversion.candidate_name}</Text>
        <Text className="text-textSecondary text-xs">Offer ID: {conversion.offer_id}</Text>
      </View>
    </View>
    <View className="flex-row items-center mt-2 flex-wrap">
      <View className="flex-row items-center mr-4 mb-2">
        <Building size={14} color="#64748B" className="mr-1" />
        <Text className="text-textSecondary text-xs">{conversion.assigned_department}</Text>
      </View>
      <View className="flex-row items-center mb-2">
        <Briefcase size={14} color="#64748B" className="mr-1" />
        <Text className="text-textSecondary text-xs">Manager: {conversion.assigned_manager}</Text>
      </View>
    </View>
  </Pressable>
);
`,

  'components/OnboardingChecklist.js': `import React from 'react';
import { View, Text, Switch } from 'react-native';
import { CheckCircle, Circle } from 'lucide-react-native';

export const OnboardingChecklist = ({ task, onToggle }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center justify-between">
    <View className="flex-row items-center flex-1 pr-4">
      {task.is_completed ? (
        <CheckCircle size={20} color="#10B981" className="mr-3" />
      ) : (
        <Circle size={20} color="#CBD5E1" className="mr-3" />
      )}
      <View className="flex-1">
        <Text className={\`text-base \${task.is_completed ? 'text-textSecondary line-through' : 'text-textPrimary font-medium'}\`}>
          {task.task_name}
        </Text>
        <Text className="text-textSecondary text-xs mt-1">Due: {new Date(task.due_date).toLocaleDateString()} • {task.category}</Text>
      </View>
    </View>
    <Switch 
      value={task.is_completed} 
      onValueChange={(val) => onToggle(task.id, val)}
      trackColor={{ false: '#CBD5E1', true: '#10B981' }}
    />
  </View>
);
`,

  'components/ProbationCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { ShieldAlert, ShieldCheck } from 'lucide-react-native';

export const ProbationCard = ({ probation }) => {
  const isActive = probation.status === 'Active';
  
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className={\`w-10 h-10 rounded-full items-center justify-center mr-3 \${isActive ? 'bg-warning/10' : 'bg-success/10'}\`}>
        {isActive ? <ShieldAlert size={20} color="#F59E0B" /> : <ShieldCheck size={20} color="#10B981" />}
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold text-base">{probation.employee_id}</Text>
        <Text className="text-textSecondary text-sm mb-1">
          {isActive ? \`Ends: \${new Date(probation.end_date).toLocaleDateString()}\` : 'Completed'}
        </Text>
        {probation.review_notes ? (
          <Text className="text-textSecondary text-xs bg-surface p-2 rounded">
            {probation.review_notes}
          </Text>
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
console.log('HR Lifecycle component files created successfully.');
