import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2e6480',
        headerShown: false,

      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown: false,
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="pie-chart" color={color} />,

        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: 'Registrar Refeição',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  )
}