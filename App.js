import 'react-native-gesture-handler';
import React, { useRef, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Animated } from 'react-native';
import Toast from 'react-native-toast-message';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import ZodiacInfoScreen from './ZodiacInfoScreen';
import ZodiacDetailScreen from './ZodiacDetailScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import HelpUsScreen from './HelpUsScreen';
import AboutUsScreen from './AboutUsScreen';
import ContactScreen from './ContactScreen';
import ConsultationScreen from './ConsultationScreen';
import ArticlesScreen from './ArticlesScreen';
import ArticleDetailScreen from './ArticleDetailScreen';
import ToolsScreen from './ToolsScreen';
import NotificationsScreen from './NotificationsScreen';
import Sidebar from './Sidebar';
import BookingDetailsScreen from './BookingDetailsScreen';
import PoseDetailScreen from './PoseDetailScreen';
import PaymentScreen from './PaymentScreen';
import { requestUserPermission } from './NotificationService';

const Stack = createStackNavigator();

function MainStackNavigator({ openSidebar }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home">
        {props => <HomeScreen {...props} openSidebar={openSidebar} />}
      </Stack.Screen>
      <Stack.Screen name="ZodiacInfo" component={ZodiacInfoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ZodiacDetail" component={ZodiacDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Consultation" component={ConsultationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Articles" component={ArticlesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Tools" component={ToolsScreen} options={{ headerShown: false }} />
      <Stack.Screen 
        name="PoseDetail" 
        component={PoseDetailScreen} 
        options={({ route }) => ({ 
          title: `Details of: ${route.params?.pose?.english_name || 'Details'}`,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#007BFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
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

  useEffect(() => {
    requestUserPermission(); // Request permissions on app start
  }, []);

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
        {sidebarOpen && (
          <Animated.View style={{ transform: [{ translateX }] }}>
            <Sidebar isVisible={sidebarOpen} onClose={closeSidebar} />
          </Animated.View>
        )}
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </View>
    </NavigationContainer>
  );
}
