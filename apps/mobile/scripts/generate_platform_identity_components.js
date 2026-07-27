const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'identity');

const files = {
  'components/PlatformUserCard.js': `import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { User, ChevronRight } from 'lucide-react-native';

export const PlatformUserCard = ({ user, onPress }) => {
  return (
    <Pressable 
      onPress={() => onPress && onPress(user)}
      className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    >
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
        <User size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-textPrimary text-sm font-bold">{user.name}</Text>
          <View className={\`px-2 py-1 rounded-full \${user.status === 'Active' ? 'bg-success/10' : 'bg-error/10'}\`}>
            <Text className={\`text-[10px] font-bold uppercase \${user.status === 'Active' ? 'text-[#10B981]' : 'text-[#EF4444]'}\`}>{user.status}</Text>
          </View>
        </View>
        <Text className="text-textSecondary text-xs">{user.email}</Text>
        <Text className="text-textSecondary text-[10px] mt-1">Role: {user.role}</Text>
      </View>
      {onPress && <ChevronRight size={20} color="#94A3B8" className="ml-2" />}
    </Pressable>
  );
};
`,

  'components/RoleCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { Shield } from 'lucide-react-native';

export const RoleCard = ({ role }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
        <Shield size={20} color="#6366F1" />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-textPrimary text-sm font-bold">{role.name}</Text>
          <Text className="text-textSecondary text-xs">{role.assignedUsers} Users</Text>
        </View>
        <Text className="text-textSecondary text-xs">{role.description}</Text>
      </View>
    </View>
  );
};
`,

  'components/SessionCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { MonitorSmartphone, XCircle } from 'lucide-react-native';
import { Button } from '@/shared/components/Button';

export const SessionCard = ({ session, onRevoke }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
          <MonitorSmartphone size={20} color={session.status === 'Active' ? '#10B981' : '#94A3B8'} />
        </View>
        <View className="flex-1">
          <Text className="text-textPrimary text-sm font-bold">{session.userName}</Text>
          <Text className="text-textSecondary text-xs">{session.device} • {session.ipAddress}</Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center border-t border-border pt-3">
        <Text className="text-textSecondary text-[10px]">Started: {new Date(session.startedAt).toLocaleString()}</Text>
        {session.status === 'Active' ? (
          <Button title="Revoke" onPress={() => onRevoke(session.id)} styleClass="bg-error px-4 py-1 h-8" textClass="text-xs" icon={XCircle} />
        ) : (
          <Text className="text-[#EF4444] text-xs font-bold uppercase">Revoked</Text>
        )}
      </View>
    </View>
  );
};
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Identity component files created successfully.');
