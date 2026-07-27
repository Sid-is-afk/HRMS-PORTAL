import React from 'react';
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
