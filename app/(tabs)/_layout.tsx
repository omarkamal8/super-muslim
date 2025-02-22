import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../../components/Themed';
import { Platform } from 'react-native';

export default function TabLayout() {
  const tintColor = useThemeColor({ light: '#8B4513', dark: '#DEB887' }, 'tint');
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          backgroundColor: '#FFF8DC',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif-medium',
        },
        headerStyle: {
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: '#FFF8DC',
        },
        headerTitleStyle: {
          fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
          fontSize: 20,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Quran',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer-times"
        options={{
          title: 'Prayer Times',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}