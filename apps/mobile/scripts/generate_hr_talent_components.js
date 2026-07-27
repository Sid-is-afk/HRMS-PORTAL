const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'talent-development');

const files = {
  'components/GoalCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { Target, Clock, AlertTriangle, CheckCircle } from 'lucide-react-native';

export const GoalCard = ({ goal }) => {
  let Icon = Target;
  let color = '#64748B';
  let bgColor = 'bg-gray-100';

  if (goal.status === 'Completed') {
    Icon = CheckCircle;
    color = '#10B981';
    bgColor = 'bg-success/10';
  } else if (goal.status === 'At Risk') {
    Icon = AlertTriangle;
    color = '#EF4444';
    bgColor = 'bg-error/10';
  } else if (goal.status === 'In Progress') {
    Icon = Clock;
    color = '#0EA5E9';
    bgColor = 'bg-primary/10';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
      <View className="flex-row items-center mb-3">
        <View className={\`w-10 h-10 rounded-full items-center justify-center mr-3 \${bgColor}\`}>
          <Icon size={20} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-textPrimary font-semibold text-base">{goal.title}</Text>
          <Text className="text-textSecondary text-xs">Due: {new Date(goal.due_date).toLocaleDateString()}</Text>
        </View>
        <Text className={\`font-bold \${color === '#64748B' ? 'text-textSecondary' : ''}\`} style={color !== '#64748B' ? { color } : {}}>
          {goal.status}
        </Text>
      </View>
      <View className="w-full h-2 bg-surface rounded-full overflow-hidden">
        <View 
          className="h-full rounded-full" 
          style={{ width: \`\${goal.progress_percentage}%\`, backgroundColor: color === '#64748B' ? '#94A3B8' : color }}
        />
      </View>
      <Text className="text-textSecondary text-xs mt-2 text-right">{goal.progress_percentage}% Completed</Text>
    </View>
  );
};
`,

  'components/LearningCard.js': `import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BookOpen, PlayCircle, CheckCircle } from 'lucide-react-native';

export const LearningCard = ({ course, onPress }) => {
  const isCompleted = course.status === 'Completed';

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <View className="bg-surface px-2 py-1 rounded">
          <Text className="text-textSecondary text-xs">{course.category}</Text>
        </View>
        {course.is_mandatory && (
          <View className="bg-error/10 px-2 py-1 rounded">
            <Text className="text-error text-xs font-bold">Mandatory</Text>
          </View>
        )}
      </View>
      
      <Text className="text-textPrimary font-semibold text-lg mb-1">{course.title}</Text>
      <Text className="text-textSecondary text-xs mb-3">{course.duration_minutes} mins</Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-4">
          <View className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
            <View 
              className="h-full bg-primary rounded-full" 
              style={{ width: \`\${course.completion_percentage}%\` }}
            />
          </View>
        </View>
        <Pressable onPress={onPress} className="flex-row items-center">
          {isCompleted ? (
            <>
              <CheckCircle size={16} color="#10B981" className="mr-1" />
              <Text className="text-success text-sm font-medium">Done</Text>
            </>
          ) : (
            <>
              <PlayCircle size={16} color="#0EA5E9" className="mr-1" />
              <Text className="text-primary text-sm font-medium">
                {course.status === 'Not Started' ? 'Start' : 'Resume'}
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};
`,

  'components/ComplianceBadge.js': `import React from 'react';
import { View, Text } from 'react-native';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react-native';

export const ComplianceBadge = ({ record }) => {
  let Icon = ShieldCheck;
  let color = '#10B981';
  let bgColor = 'bg-success/10';

  if (record.status === 'Non-Compliant') {
    Icon = ShieldX;
    color = '#EF4444';
    bgColor = 'bg-error/10';
  } else if (record.status === 'Expiring Soon') {
    Icon = ShieldAlert;
    color = '#F59E0B';
    bgColor = 'bg-warning/10';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className={\`w-10 h-10 rounded-full items-center justify-center mr-3 \${bgColor}\`}>
        <Icon size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold text-base">{record.requirement_name}</Text>
        <Text className="text-textSecondary text-sm mb-1">
          Expires: {new Date(record.expiry_date).toLocaleDateString()}
        </Text>
      </View>
      <View className={\`px-2 py-1 rounded \${bgColor}\`}>
        <Text style={{ color }} className="text-xs font-bold">{record.status}</Text>
      </View>
    </View>
  );
};
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Talent component files created successfully.');
