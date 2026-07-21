import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '@/app/Splash';
import Login from '@/modules/auth/Login';
import Dashboard from '@/app/Dashboard';
import Attendance from '@/modules/attendance/Attendance';
import Leave from '@/modules/leave/Leave';
import Profile from '@/modules/profile/Profile';
import Notifications from '@/modules/notifications/Notifications';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Attendance" component={Attendance} />
      <Stack.Screen name="Leave" component={Leave} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
}
