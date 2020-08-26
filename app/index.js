import 'react-native-gesture-handler';
import React from 'react';
import { Image } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LiveSession from './screens/LiveSession';
import Sessions from './screens/Sessions';
import BottomNavigator from './components/BottomNavigator';
import Header from './components/Header';
console.disableYellowBox = true
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
const Tab = createBottomTabNavigator();
export default function App() {

    return (
        <NavigationContainer>
            
            <Tab.Navigator
                screenOptions= {({route}) => ({
                    headerTitle:'hello'
                })}
            >
                <Tab.Screen 
                    name="Live Session" 
                    component={LiveSession} 
                    options={{
                        tabBarIcon: ({ color, size }) => 
                        (<MaterialIcons name="timeline" color={color} size={size} />),
                    }}

                    />
                <Tab.Screen 
                    name="Sessions" 
                    component={Sessions} 
                    options={{
                        tabBarIcon: ({ color, size }) => 
                        (<MaterialIcons name="library-books" color={color} size={size} />),
                    }}
                />
                {/* <Tab.Screen
                    name="Settings" 
                    component={LiveSession} 
                    options={{
                        tabBarIcon: ({ color, size }) => 
                        (<MaterialIcons name="settings" color={color} size={size} />),
                    }}
                    /> */}
            </Tab.Navigator>
        </NavigationContainer>
    );
}
