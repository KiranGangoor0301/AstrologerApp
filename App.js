import 'react-native-gesture-handler';
import React, { useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Animated } from 'react-native';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import ZodiacDetailScreen from './ZodiacDetailScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import HelpUsScreen from './HelpUsScreen';
import AboutUsScreen from './AboutUsScreen';
import ContactScreen from './ContactScreen';
import Sidebar from './Sidebar';

const Stack = createStackNavigator();

function MainStackNavigator({ openSidebar }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home">
        {props => <HomeScreen {...props} openSidebar={openSidebar} />}
      </Stack.Screen>
      <Stack.Screen name="ZodiacDetail" component={ZodiacDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HelpUs" component={HelpUsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-300)).current;

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(translateX, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSidebarOpen(false));
  };

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <MainStackNavigator openSidebar={openSidebar} />
        {sidebarOpen && <Sidebar isVisible={sidebarOpen} onClose={closeSidebar} />}
      </View>
    </NavigationContainer>
  );
}
