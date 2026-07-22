import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminPageContainer from './AdminPageContainer';
import Breadcrumb from './Breadcrumb';
import ContentContainer from './ContentContainer';

export default function AdminLayout({ title, children }) {
  return (
    <View style={styles.layout}>
      <AdminHeader title={title} />
      <View style={styles.body}>
        <AdminSidebar />
        <AdminPageContainer>
          <Breadcrumb title={title} />
          <ContentContainer>{children}</ContentContainer>
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
});
