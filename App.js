import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import SimpleCalculator from './screens/SimpleCalculator';
import ScientificCalculator from './screens/ScientificCalculator';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#4b56a0',
          tabBarInactiveTintColor: '#5f6368',
          tabBarIcon: ({ focused, color, size }) => {
            let label;

            if (route.name === 'Simple') {
              label = focused ? '🧮' : '🔢';
            } else if (route.name === 'Scientific') {
              label = focused ? '🔬' : '⚙️';
            }

            return <Text style={{ fontSize: size, color }}>{label}</Text>;
          },
          tabBarLabel: route.name,
          tabBarLabelStyle: styles.tabBarLabel,
        })}
      >
        <Tab.Screen
          name="Simple"
          component={SimpleCalculator}
          options={{
            title: 'Simple',
          }}
        />
        <Tab.Screen
          name="Scientific"
          component={ScientificCalculator}
          options={{
            title: 'Scientific',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e8eaed',
    borderTopWidth: 1,
    paddingBottom: 5,
    paddingTop: 5,
    height: 65,
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
});

