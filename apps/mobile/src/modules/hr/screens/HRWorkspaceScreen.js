import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AdminHeader from '@/modules/admin/components/AdminHeader';
import AdminSidebar from '@/modules/admin/components/AdminSidebar';
import AdminPageContainer from '@/modules/admin/components/AdminPageContainer';
import Breadcrumb from '@/modules/admin/components/Breadcrumb';

export default function HRWorkspaceScreen({ title, children }) {
  return (
    <View style={styles.layout}>
      <AdminHeader title={title} />
      <View style={styles.body}>
        <AdminSidebar />
        <AdminPageContainer>
          <Breadcrumb title={title} />
          <ScrollView style={styles.content}>{children}</ScrollView>
        </AdminPageContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
