import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { SchoolProvider } from '@/components/SchoolContext';

const TabBarIcon = ({ name, color }: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) => (
  <FontAwesome size={28} style={{ marginBottom: -3 }} name={name} color={color} />
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SchoolProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: useClientOnlyValue(false, true),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Input',
            tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'Timer',
            tabBarIcon: ({ color }) => <TabBarIcon name="clock-o" color={color} />,
          }}
        />
      </Tabs>
    </SchoolProvider>
  );
}
