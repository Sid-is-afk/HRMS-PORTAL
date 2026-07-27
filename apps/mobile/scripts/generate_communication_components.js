const fs = require('fs');
const path = require('path');

const componentsDir = path.join('src', 'modules', 'admin', 'communication', 'components');

const components = {
  'AnnouncementCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { MessageSquare, Calendar } from 'lucide-react-native';

export const AnnouncementCard = ({ announcement, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3"
    onPress={onPress}
  >
    <View className="flex-row justify-between items-start mb-2">
      <Text className="text-textPrimary font-semibold text-base flex-1 mr-2" numberOfLines={1}>
        {announcement.title}
      </Text>
      <StatusBadge status={announcement.status} />
    </View>
    <View className="flex-row items-center mt-2">
      <MessageSquare size={14} color="#64748B" />
      <Text className="text-textSecondary ml-1 text-sm mr-4">{announcement.type_id}</Text>
      <Calendar size={14} color="#64748B" />
      <Text className="text-textSecondary ml-1 text-sm">{announcement.created_at}</Text>
    </View>
  </TouchableOpacity>
);
`,

  'TemplateCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText } from 'lucide-react-native';

export const TemplateCard = ({ template, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-3">
      <FileText size={20} color="#64748B" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold">{template.name}</Text>
      <Text className="text-textSecondary text-xs">{template.type_id}</Text>
    </View>
  </TouchableOpacity>
);
`,

  'AudiencePreview.js': `import React from 'react';
import { View, Text } from 'react-native';
import { Users } from 'lucide-react-native';
import { useAudienceSelector } from '../hooks/useAudienceSelector';

export const AudiencePreview = ({ filter }) => {
  const { audiencePreview, isLoading } = useAudienceSelector(filter);

  return (
    <View className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-3 flex-row items-center">
      <Users size={20} color="#0EA5E9" className="mr-3" />
      <View className="flex-1">
        <Text className="text-textPrimary font-medium">Estimated Audience Size</Text>
        {isLoading ? (
          <Text className="text-textSecondary text-xs">Calculating...</Text>
        ) : (
          <Text className="text-textSecondary text-xs">
            {audiencePreview?.count || 0} employees targeted
          </Text>
        )}
      </View>
    </View>
  );
};
`
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join(componentsDir, filename), content);
}
console.log('Components created successfully.');
