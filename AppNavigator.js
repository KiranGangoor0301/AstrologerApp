// AppNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import ContactScreen from './ContactScreen';  // Create these screens
import HelpUsScreen from './HelpUsScreen';    // Create these screens
import AboutUsScreen from './AboutUsScreen';  // Create these screens
import ProfileScreen from './ProfileScreen';  // Create these screens
import SettingsScreen from './SettingsScreen';// Create these screens

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Contact Us" component={ContactScreen} />
        <Drawer.Screen name="Help Us" component={HelpUsScreen} />
        <Drawer.Screen name="About Us" component={AboutUsScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
