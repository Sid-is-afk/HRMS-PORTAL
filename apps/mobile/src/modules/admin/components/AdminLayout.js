import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminPageContainer from './AdminPageContainer';
import Breadcrumb from './Breadcrumb';
import ContentContainer from './ContentContainer';

export default function AdminLayout({ title, refreshControl, children, showBack }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const [isSidebarOpen, setIsSidebarOpen] = useState(isLargeScreen);

  useEffect(() => {
    setIsSidebarOpen(isLargeScreen);
  }, [isLargeScreen]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <View style={styles.layout}>
      <AdminHeader title={title} onToggleSidebar={toggleSidebar} showBack={showBack} />
      <View style={styles.body}>
        <AdminSidebar isOpen={isSidebarOpen} isLargeScreen={isLargeScreen} onClose={() => setIsSidebarOpen(false)} />
        <AdminPageContainer>
          <Breadcrumb title={title} />
          <ContentContainer refreshControl={refreshControl}>{children}</ContentContainer>
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
