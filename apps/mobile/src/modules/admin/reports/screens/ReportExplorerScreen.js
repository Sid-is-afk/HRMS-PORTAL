import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { ReportCard } from '../components/ReportCard';
import { useReports } from '../hooks/useReports';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function ReportExplorerScreen() {
  const { reports, isLoading, error } = useReports();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Report Explorer" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
