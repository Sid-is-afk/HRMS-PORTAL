import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Fingerprint, CalendarDays, User } from 'lucide-react-native';

import DashboardScreen from '@/modules/employee/dashboard/screens/DashboardScreen';
import AttendanceScreen from '@/modules/employee/attendance/screens/AttendanceScreen';
import LeaveScreen from '@/modules/employee/leave/screens/LeaveScreen';
import ProfileHomeScreen from '@/modules/employee/profile/screens/ProfileHomeScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          elevation: 0,
        },
        tabBarActiveTintColor: '#16A34A', // Success Green from Design.md for active state
        tabBarInactiveTintColor: '#6B7280', // Text Secondary
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 10,
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;
          
          if (route.name === 'Home') IconComponent = Home;
          else if (route.name === 'Attendance') IconComponent = Fingerprint;
          else if (route.name === 'Leave') IconComponent = CalendarDays;
          else if (route.name === 'Profile') IconComponent = User;

          return (
            <View className={`items-center justify-center p-1.5 rounded-xl ${focused ? 'bg-green-100' : ''}`}>
              <IconComponent size={20} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Leave" component={LeaveScreen} />
      <Tab.Screen name="Profile" component={ProfileHomeScreen} />
    </Tab.Navigator>
  );
}
