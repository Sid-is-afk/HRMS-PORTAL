import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Bell, Search, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

function formatDate() {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export const PlatformDashboardHeader = memo(() => {
  const navigation = useNavigation();
  const dateStr = useMemo(() => formatDate(), []);
  const greeting = useMemo(() => getGreeting(), []);

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <Image
              source={{ uri: 'https://ui-avatars.com/api/?name=W+F&background=2563EB&color=fff&size=64' }}
              style={styles.logoImg}
            />
          </View>
          <View>
            <Text style={styles.brandName}>WorkForce</Text>
            <Text style={styles.brandSub}>Platform Admin</Text>
          </View>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('GlobalSearch')}
            activeOpacity={0.7}
          >
            <Search size={20} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Bell size={20} color="#475569" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileHome')}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: 'https://ui-avatars.com/api/?name=SA&background=7C3AED&color=fff&size=64' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome banner */}
      <View style={styles.welcomeBanner}>
        <View style={styles.welcomeContent}>
          <Text style={styles.greeting}>{greeting}, Admin</Text>
          <Text style={styles.dateText}>{dateStr}</Text>
          <View style={styles.statPills}>
            <View style={[styles.pill, { backgroundColor: '#D1FAE5' }]}>
              <View style={[styles.pillDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.pillText, { color: '#059669' }]}>All Systems Normal</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.pillText, { color: '#D97706' }]}>17 Pending</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.overviewBtn}
          onPress={() => navigation.navigate('PlatformOverview')}
          activeOpacity={0.7}
        >
          <Text style={styles.overviewBtnText}>Overview</Text>
          <ChevronRight size={14} color="#2563EB" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    overflow: 'hidden',
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  brandName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: '#FAFBFE',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  welcomeContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  dateText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 12,
  },
  statPills: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  overviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
    marginTop: 4,
  },
  overviewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
});
