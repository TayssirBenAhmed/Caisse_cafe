import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PointOfSale from './src/screens/PointOfSale';
import Dashboard from './src/screens/Dashboard';
import TableManagement from './src/screens/TableManagement';
import Settings from './src/screens/Settings';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
        }}
      >
        <Tab.Screen
          name="Caisse"
          component={PointOfSale}
          options={{
            tabBarIcon: () => <Text>💶</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Tableau"
          component={Dashboard}
          options={{
            tabBarIcon: () => <Text>📊</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Tables"
          component={TableManagement}
          options={{
            tabBarIcon: () => <Text>🪑</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Paramètres"
          component={Settings}
          options={{
            tabBarIcon: () => <Text>⚙️</Text>,
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
